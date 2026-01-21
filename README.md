# ContentFlow 🚀

ContentFlow 是一个面向内容创作者的 AI 辅助工具 (Micro-SaaS MVP)。它能帮助你将一篇长文章或素材，一键重组为适用于 **微博**、**小红书**、**知乎** 和 **公众号** 等中文社区平台的原生风格文案。

![Next.js](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8) ![DeepSeek](https://img.shields.io/badge/DeepSeek-V3-blue) ![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF) ![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)

## ✨ 核心功能

*   **多平台风格适配**：
    *   📕 **小红书笔记**: 生成“种草”风格文案，包含标题、Emoji、正文分段及热门标签。
    *   📝 **知乎文章**: 生成逻辑严密、深度分析的专栏文章风格，适合专业探讨。
    *   📢 **微博博文**: 生成短小精悍、话题感强的微博文案，优化 Hashtag 与传播性。
    *   📰 **微信公众号**: 生成结构完整、排版舒适的公众号文章风格，适合长图文阅读。
*   **AI 流式生成**：基于 Vercel AI SDK，提供极速的打字机流式输出体验。
*   **用户系统与历史记录**：
    *   🔐 **安全登录**: 集成 Clerk 身份验证。
    *   📜 **历史回溯**: 自动保存生成记录，随时查看过往创作。
*   **Markdown 渲染**：完美支持富文本格式预览。
*   **现代化 UI**：基于 Shadcn UI + Tailwind CSS 构建，简洁美观，支持深色模式。

## 🛠️ 技术栈

*   **框架**: [Next.js 16](https://nextjs.org/) (App Router)
*   **语言**: TypeScript
*   **样式**: [Tailwind CSS v4](https://tailwindcss.com/)
*   **UI 组件**: [Shadcn UI](https://ui.shadcn.com/)
*   **AI 集成**: [Vercel AI SDK](https://sdk.vercel.ai/docs) + DeepSeek V3
*   **身份验证**: [Clerk](https://clerk.com/)
*   **数据库 & ORM**: [Supabase](https://supabase.com/) (PostgreSQL) + [Prisma](https://www.prisma.io/)
*   **图标**: Lucide React

## 🔐 身份验证配置 (Clerk)

本项目使用 Clerk 进行用户认证。为了符合国人使用习惯（如使用邮箱密码、手机号登录，而非 Google），请按以下步骤配置：

1. 登录 [Clerk Dashboard](https://dashboard.clerk.com/)。
2. 选择你的应用。
3. 进入 **User & Authentication** > **Social Connections**。
   - 移除 **Google** 等国外常用社交登录。
   - (可选) 如果有企业版，可添加 **WeChat (微信)**。
4. 进入 **User & Authentication** > **Email, Phone, Username**。
   - 启用 **Email address** (建议开启 Email code 或 Password)。
   - (可选) 启用 **Phone number** (支持 +86)。
5. 进入 **Customization** > **Localization**。
   - Clerk 会根据我们在 `src/app/layout.tsx` 中的配置自动显示中文界面。

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
cp .env.example .env
```

编辑 `.env` 文件，填入你的 API Keys 和数据库配置：

```env
# DeepSeek API Key (用于文案生成)
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Zhipu AI API Key (用于图片生成)
ZHIPU_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxxxx

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Supabase / Prisma Database
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"
```

### 4. 初始化数据库

```bash
npx prisma db push
```

### 5. 启动开发服务器

```bash
npm run dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000) 即可开始使用。

## 🌐 部署到 Vercel

本项目可以一键部署到 Vercel。

**快速部署步骤**：

1. 将代码推送到 GitHub/GitLab/Bitbucket
2. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
3. 导入你的 Git 仓库
4. 配置环境变量（DeepSeek, Zhipu, Clerk, Database URL 等）
5. 点击部署

## 📂 项目结构

```
content-flow/
├── prisma/            # 数据库 Schema
├── src/
│   ├── app/
│   │   ├── api/       # API Routes (Generate, etc.)
│   │   ├── history/   # 历史记录页面
│   │   └── page.tsx   # 主页面
│   ├── components/    # UI 组件
│   ├── lib/           # 工具函数 (DB, Bilibili, Utils)
│   └── proxy.ts       # 路由保护代理 (原 middleware)
├── public/
└── ...
```

## 🗺️ Roadmap (开发计划)

- [x] **MVP**: 文本输入 -> 多平台文案生成
- [x] **B站视频支持**: 输入 B站 视频链接，自动提取字幕并生成文案
- [x] **AI 智能配图**: 根据目标平台自动生成适配比例与风格的封面图（如小红书竖图、公众号横图），支持 CogView-4
- [x] **用户系统**: 保存生成历史，通过 Supabase/Clerk 实现登录
- [ ] **SEO 优化**: 增加着陆页 (Landing Page)
- [ ] **多模型支持**: 已支持 DeepSeek V3，未来计划支持 Claude 3.5 Sonnet

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 License

MIT
