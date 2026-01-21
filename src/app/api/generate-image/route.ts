import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { content, platform } = await req.json();

    if (!process.env.ZHIPU_API_KEY) {
      return NextResponse.json(
        { error: 'ZHIPU_API_KEY is not configured' },
        { status: 500 }
      );
    }

    if (!process.env.DEEPSEEK_API_KEY) {
      return NextResponse.json(
        { error: 'DEEPSEEK_API_KEY is not configured' },
        { status: 500 }
      );
    }

    // 1. Generate Image Prompt using DeepSeek
    const summaryResponse = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { 
            role: 'system', 
            content: 'You are a professional art director. Extract key visual elements from the text to create a prompt for an AI image generator (CogView-4). Output ONLY the prompt in English. Keep it concise, descriptive, high quality, and suitable for the platform style.' 
          },
          { 
            role: 'user', 
            content: `Platform: ${platform}\nText: ${content.substring(0, 2000)}` 
          }
        ],
        temperature: 0.7
      })
    });

    if (!summaryResponse.ok) {
      throw new Error('Failed to generate image prompt');
    }
    
    const summaryData = await summaryResponse.json();
    const imagePrompt = summaryData.choices?.[0]?.message?.content || content.substring(0, 100);

    // 2. Determine size based on platform
    let size = "1024x1024";
    if (platform === 'xiaohongshu') {
      size = "768x1344"; // Vertical for XHS
    } else if (platform === 'wechat' || platform === 'zhihu') {
      size = "1344x768"; // Horizontal for Articles
    } else {
      size = "1024x1024"; // Square for Weibo
    }

    // 3. Call CogView-4
    const imageResponse = await fetch('https://open.bigmodel.cn/api/paas/v4/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ZHIPU_API_KEY}`
      },
      body: JSON.stringify({
        model: "cogview-4",
        prompt: imagePrompt,
        size: size
      })
    });

    const imageData = await imageResponse.json();
    
    if (imageData.error) {
      console.error('CogView error:', imageData.error);
      return NextResponse.json({ error: imageData.error.message }, { status: 500 });
    }

    return NextResponse.json({ url: imageData.data[0].url, prompt: imagePrompt });
  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
}
