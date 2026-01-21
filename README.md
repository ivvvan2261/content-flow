# ContentFlow 🚀

ContentFlow 是一个面向内容创作者的 AI 辅助工具 (Micro-SaaS MVP)。它能帮助你将一篇长文章或素材，一键重组为适用于 **微博**、**小红书**、**知乎** 和 **公众号** 等中文社区平台的原生风格文案。

![Next.js](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8) ![DeepSeek](https://img.shields.io/badge/DeepSeek-V3-blue)

## ✨ 核心功能

*   **多平台风格适配**：
    *   📕 **小红书笔记**: 生成“种草”风格文案，包含标题、Emoji、正文分段及热门标签。
    *   📝 **知乎文章**: 生成逻辑严密、深度分析的专栏文章风格，适合专业探讨。
    *   📢 **微博博文**: 生成短小精悍、话题感强的微博文案，优化 Hashtag 与传播性。
    *   📰 **微信公众号**: 生成结构完整、排版舒适的公众号文章风格，适合长图文阅读。
*   **AI 流式生成**：基于 Vercel AI SDK，提供极速的打字机流式输出体验。
*   **Markdown 渲染**：完美支持富文本格式预览。
*   **现代化 UI**：基于 Shadcn UI + Tailwind CSS 构建，简洁美观，支持深色模式。

## 🛠️ 技术栈

*   **框架**: [Next.js 16](https://nextjs.org/) (App Router)
*   **语言**: TypeScript
*   **样式**: [Tailwind CSS v4](https://tailwindcss.com/)
*   **UI 组件**: [Shadcn UI](https://ui.shadcn.com/)
*   **AI 集成**: [Vercel AI SDK](https://sdk.vercel.ai/docs) + DeepSeek V3
*   **图标**: Lucide React

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/your-username/content-flow.git
cd content-flow
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制示例环境文件：

```bash
cp .env.local.example .env.local
```

编辑 `.env.local` 文件，填入你的 DeepSeek API Key：

```env
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

> **注意**: 本项目默认使用 DeepSeek V3 模型。你需要确保你的账号有余额且 API Key 有效。

### 4. 启动开发服务器

```bash
npm run dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000) 即可开始使用。

## 🌐 部署到 Vercel

本项目可以一键部署到 Vercel。详细部署指南请查看 [DEPLOY.md](./DEPLOY.md)。

**快速部署步骤**：

1. 将代码推送到 GitHub/GitLab/Bitbucket
2. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
3. 导入你的 Git 仓库
4. 配置环境变量 `DEEPSEEK_API_KEY`
5. 点击部署

部署完成后，每次推送代码都会自动触发新的部署。

## 📂 项目结构

```
content-flow/
├── src/
│   ├── app/
│   │   ├── api/generate/  # AI 生成接口 (Server Route)
│   │   └── page.tsx       # 主页面 (Layout & State)
│   ├── components/
│   │   ├── content-input.tsx  # 输入组件 (Text/URL)
│   │   ├── content-output.tsx # 输出组件 (Markdown Display)
│   │   └── ui/            # Shadcn 通用组件
│   └── lib/               # 工具函数
├── public/
└── ...
```

## 🗺️ Roadmap (开发计划)

- [x] **MVP**: 文本输入 -> 多平台文案生成
- [ ] **B站视频支持**: 输入 B站 视频链接，自动提取字幕并生成文案
- [ ] **图片生成**: 根据文案自动生成小红书封面图 (DALL-E 3)
- [ ] **用户系统**: 保存生成历史，通过 Supabase/Clerk 实现登录
- [ ] **SEO 优化**: 增加着陆页 (Landing Page)
- [ ] **多模型支持**: 已支持 DeepSeek V3，未来计划支持 Claude 3.5 Sonnet

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 License

MIT
