import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { prompt, platform } = await req.json();

    let systemPrompt = "You are a professional social media content creator.";

    if (platform === 'twitter') {
      systemPrompt += `
        Please rewrite the following content into a viral Twitter thread or a single punchy tweet.
        - Use short sentences.
        - Use spacing for readability.
        - Include 1-3 relevant hashtags.
        - Tone: Engaging, slightly provocative, or insightful.
        - No more than 280 characters per tweet if it's a thread.
        - If the input is Chinese, output in Chinese.
      `;
    } else if (platform === 'xiaohongshu') {
      systemPrompt += `
        请将以下内容重写为一篇非常有吸引力的"小红书"笔记。
        - 标题要吸引眼球（使用 Emoji）。
        - 正文多使用 Emoji (🌟, ✨, 💡, 🏷️)。
        - 语气亲切、活泼，像在和闺蜜分享。
        - 结尾包含相关标签（Hashtags）。
        - 重点突出，分段清晰。
        - 使用中文。
      `;
    } else if (platform === 'linkedin') {
      systemPrompt += `
        Please rewrite the following content into a professional LinkedIn post.
        - Tone: Professional, authoritative, yet accessible.
        - Focus on industry insights, career growth, or business value.
        - Use bullet points for readability.
        - End with a call to action or a thought-provoking question.
        - Minimal use of emojis (keep it professional).
        - If the input is Chinese, output in Chinese.
      `;
    }

    const result = streamText({
      model: openai('gpt-4-turbo'),
      system: systemPrompt,
      prompt: prompt,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('API Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
