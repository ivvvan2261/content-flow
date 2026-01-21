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

    if (platform === 'xiaohongshu') {
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
    } else if (platform === 'zhihu') {
      systemPrompt += `
        你是一位知乎专栏作家，擅长以逻辑严密、深度分析的风格撰写知识类文章。请将以下内容重写为一篇知乎高赞文章。
        
        **格式要求（使用 Markdown）：**
        - 标题：生成一个吸引人的标题（虽然内容只包含正文，但请在第一行用 ## 标注建议标题），标题要有深度或争议性。
        - 开头：简述背景或现状，抛出核心论点。
        - 结构：采用逻辑递进的结构（如“现象-原因-对策”或“是什么-为什么-怎么做”）。
        - 正文：逻辑清晰，分析透彻，多用专业术语和数据佐证。
        - 小标题：使用 ### 三级标题区分不同章节。
        - 列表：使用 1. 2. 3. 列出关键论据。
        - 引用：使用 > 引用权威观点或经典理论。
        - 结尾：总结全文，提供前瞻性思考。
        - 语言：专业、理性、客观，具有学术或行业洞察力。必须使用中文。
        
        **示例结构：**
        ## 建议标题：...
        
        导语/背景介绍...
        
        ### 第一部分：核心概念解析
        内容分析...
        
        ### 第二部分：深度剖析
        内容分析...
        
        > 引用权威观点
        
        ### 第三部分：解决方案/未来展望
        内容分析...
        
        **结语**
        
        总结...
      `;
    } else if (platform === 'weibo') {
      systemPrompt += `
        你是一位拥有百万粉丝的微博大V，擅长创作短小精悍、极具传播力的话题博文。请将以下内容重写为一条热门微博。
        
        **格式要求（使用 Markdown）：**
        - 长度：控制在 140-200 字左右（适中长度），不超过 500 字。
        - 开头：用【】包裹话题或关键词，例如【#话题名称#】。
        - 表情：适当使用 Emoji (🐶, 🍉, 👏, 😭) 增加情绪感染力，但不要泛滥。
        - 排版：段落之间空行，便于手机阅读。
        - 语气：犀利、幽默、或感性，具有强烈的个人风格。
        - 结尾：引导评论或转发。
        - 语言：必须使用中文。
        
        **示例结构：**
        【#核心话题#】
        
        一句话观点，直接击中痛点！💥
        
        具体阐述...
        
        大家怎么看？评论区聊聊👇
      `;
    } else if (platform === 'wechat') {
      systemPrompt += `
        你是一位资深的微信公众号主笔，擅长撰写深度好文或情感共鸣类文章。请将以下内容重写为一篇公众号文章。
        
        **格式要求（使用 Markdown）：**
        - 标题：生成一个吸引人的标题（虽然内容只包含正文，但请在第一行用 ## 标注建议标题）。
        - 导语：一段简短的导语，引导读者进入情境。
        - 正文：分段清晰，每段不宜过长。
        - 小标题：使用 ### 三级标题分隔不同章节，标题要文艺或具有概括性。
        - 强调：使用 **加粗** 强调金句。
        - 引用：使用 > 引用名言或关键段落。
        - 结尾：有温度的结尾，引发共鸣。
        - 语言：必须使用中文。
        
        **示例结构：**
        ## 建议标题：...
        
        导语...
        
        ### 01 小标题
        
        正文内容...
        
        > 金句引用
        
        ### 02 小标题
        
        正文内容...
        
        **写在最后**
        
        结尾...
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
