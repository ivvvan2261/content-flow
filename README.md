# ContentFlow 🚀

ContentFlow 是一个面向内容创作者的 AI 辅助工具 (Micro-SaaS MVP)。它能帮助你将长文章、视频素材或创意灵感，一键重构为适用于 **微博**、**小红书**、**知乎** 和 **微信公众号** 等主流中文社区平台的原生风格文案。

![Next.js](https://img.shields.io/badge/Next.js-16-black) ![React](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8) ![DeepSeek](https://img.shields.io/badge/DeepSeek-V3-blue) ![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF) ![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)

## ✨ 核心功能

*   **多平台风格适配**：
    *   📕 **小红书笔记**: 生成“种草”风格文案，包含爆款标题、Emoji 装饰、正文分段及热门标签。
    *   📝 **知乎文章**: 生成逻辑严密、深度分析的专栏风格，适合专业探讨。
    *   📢 **微博博文**: 生成短小精悍、话题感强的社交文案，优化 Hashtag 与传播性。
    *   📰 **微信公众号**: 生成结构完整、排版舒适的图文风格，适合长文阅读。
*   **多模态输入支持**：支持直接输入文本或 **B站视频链接**（自动提取字幕内容）。
*   **AI 智能配图**：基于 **CogView-4** 自动生成适配各平台比例（如小红书 3:4、公众号 16:9）的封面图。
*   **AI 流式生成**：基于 Vercel AI SDK，提供极速的打字机流式输出体验。
*   **用户系统与历史记录**：
    *   🔐 **安全登录**: 集成 Clerk 身份验证，支持中文本地化。
    *   📜 **历史回溯**: 自动保存生成记录，随时查看过往创作。
*   **现代化 UI**：基于 Shadcn UI + Tailwind CSS v4 构建，极简美观，支持深色模式。

## 🛠️ 技术栈

*   **框架**: [Next.js 16](https://nextjs.org/) (App Router)
*   **前端库**: [React 19](https://react.dev/)
*   **语言**: TypeScript
*   **样式**: [Tailwind CSS v4](https://tailwindcss.com/)
*   **UI 组件**: [Shadcn UI](https://ui.shadcn.com/)
*   **AI 集成**: [Vercel AI SDK](https://sdk.vercel.ai/docs) + DeepSeek V3 + 智谱 CogView-4
*   **身份验证**: [Clerk](https://clerk.com/)
*   **数据库 & ORM**: [Supabase](https://supabase.com/) (PostgreSQL) + [Prisma](https://www.prisma.io/)

## 🔐 身份验证配置 (Clerk)

本项目使用 Clerk 进行用户认证。为了符合国内用户的使用习惯（如使用邮箱密码、手机号登录，而非 Google），请按以下步骤配置：

1. 登录 [Clerk Dashboard](https://dashboard.clerk.com/)。
2. 选择你的应用。
3. 进入 **User & Authentication** > **Social Connections**。
   - 移除 **Google** 等国外常用社交登录。
   - (可选) 如果有企业版，可添加 **WeChat (微信)**。
4. 进入 **User & Authentication** > **Email, Phone, Username**。
   - 启用 **Email address** (建议开启 Email code 或 Password)。
   - (可选) 启用 **Phone number** (支持 +86 手机号)。
5. 进入 **Customization** > **Localization**。
   - Clerk 会根据我们在 `src/app/layout.tsx` 中的配置（`localization={zhCN}`）自动显示中文界面。

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/your-username/content-flow.git
cd content-flow
```

### 2. 安装依赖

推荐使用 `pnpm`：

```bash
pnpm install
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

# Zhipu AI API Key (用于图片生成 CogView-4)
ZHIPU_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxxxx

# Bilibili Cookie (可选，用于获取视频字幕)
BILIBILI_SESSDATA=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Supabase / Prisma Database
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
```

### 4. 初始化数据库

```bash
npx prisma db push
```

### 5. 启动开发服务器

```bash
pnpm dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000) 即可看到 Landing Page，登录后进入应用。

## 📂 项目结构

```
content-flow/
├── prisma/            # 数据库 Schema 与迁移
├── src/
│   ├── app/
│   │   ├── api/       # API 路由 (生成文案、生成图片、获取 B站数据)
│   │   ├── generate/  # 应用主生成页面
│   │   ├── history/   # 历史记录页面
│   │   └── page.tsx   # 着陆页 (Landing Page)
│   ├── components/    # 可复用 UI 组件
│   ├── lib/           # 工具函数 (数据库、B站接口、通用工具)
│   └── middleware.ts  # 路由保护与权限校验
├── public/            # 静态资源
└── ...
```

## 🗺️ Roadmap (开发计划)

- [x] **MVP**: 文本输入 -> 多平台文案生成
- [x] **B站视频支持**: 输入 B站 视频链接，自动提取字幕并生成文案
- [x] **AI 智能配图**: 根据目标平台自动生成适配比例与风格的封面图 (CogView-4)
- [x] **用户系统**: 保存生成历史，通过 Supabase/Clerk 实现登录
- [x] **SEO 优化**: 增加响应式着陆页 (Landing Page)
- [ ] **多模型支持**: 已支持 DeepSeek V3，计划接入 Claude 3.5 Sonnet / GPT-4o
- [ ] **多格式导出**: 支持导出为 Markdown、PDF 或直接生成长图

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 License

MIT
