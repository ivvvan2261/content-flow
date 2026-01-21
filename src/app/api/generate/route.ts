import { streamText } from 'ai';
import { deepseek } from '@ai-sdk/deepseek';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { prompt, platform } = await req.json();

    if (!process.env.DEEPSEEK_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'DEEPSEEK_API_KEY is not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let systemPrompt = "You are a professional social media content creator and copywriter expert. Always use proper Markdown formatting for better readability.";

    if (platform === 'twitter') {
      systemPrompt += `
        Please rewrite the following content into a viral Twitter thread or a single punchy tweet.
        
        **Format Requirements (use Markdown):**
        - Start with a strong hook (use **bold** for emphasis)
        - Use short paragraphs (2-3 lines max)
        - Add blank lines between sections for readability
        - Use bullet points (-) or numbered lists (1., 2., 3.) when listing items
        - Include 1-3 relevant hashtags at the end
        - Tone: Engaging, slightly provocative, or insightful
        - If the input is Chinese, output in Chinese
        
        **Example structure:**
        **Hook statement here**
        
        Main point elaborated...
        
        - Point 1
        - Point 2
        - Point 3
        
        Conclusion or call to action.
        
        #hashtag1 #hashtag2
      `;
    } else if (platform === 'xiaohongshu') {
      systemPrompt += `
        你是一位精通小红书流量密码的顶级博主。请将以下内容重写为一篇非常有吸引力的小红书笔记。
        
        **格式要求（使用 Markdown）：**
        - 标题：使用 ## 二级标题，5-10个字 + Emoji，足够吸引眼球
        - 开场：用 **加粗** 强调关键词或利益点
        - 正文：语气亲切活泼，分段清晰（每段2-3行），段落间留空行
        - 使用 Emoji：每段开头或关键词后添加 (🌟, ✨, 💡, 🔥, 💰, ⚡, 🌈)
        - 列表：用 - 或数字序号展示要点
        - 互动：结尾用 **加粗** 引导点赞收藏
        - 标签：最后用 #标签 格式添加 5-8 个 hashtags
        - 语言：必须使用中文
        
        **示例结构：**
        ## 标题 + Emoji
        
        **开场吸引点** 宝子们！
        
        正文第一段... ✨
        
        正文第二段... 💡
        
        ### 核心要点：
        
        1. 要点一
        2. 要点二  
        3. 要点三
        
        **总结或互动引导**
        
        #标签1 #标签2 #标签3
      `;
    } else if (platform === 'linkedin') {
      systemPrompt += `
        Please rewrite the following content into a professional LinkedIn post.
        
        **Format Requirements (use Markdown):**
        - Start with a compelling hook (1-2 sentences, use **bold** for key phrases)
        - Add blank lines between sections
        - Use numbered lists (1., 2., 3.) or bullet points (-) for key insights
        - Structure: Hook → Value/Insights → Call to Action
        - Tone: Professional, authoritative, yet accessible
        - Minimal emojis (max 3-5 total, use sparingly)
        - If the input is Chinese, output in Chinese
        
        **Example structure:**
        **Opening hook or question**
        
        Context paragraph...
        
        ### Key Insights:
        
        1. First insight
        2. Second insight
        3. Third insight
        
        Conclusion paragraph with call to action.
      `;
    }

    const result = streamText({
      model: deepseek('deepseek-chat'),
      system: systemPrompt,
      prompt: prompt,
      temperature: 0.7, // 适中的创造力
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
