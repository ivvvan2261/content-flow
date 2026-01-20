# 🚀 Vercel 部署指南

本指南将帮助你将 ContentFlow 项目部署到 Vercel。

## 📋 前置要求

1. **GitHub/GitLab/Bitbucket 账号**：项目需要推送到 Git 仓库
2. **Vercel 账号**：如果没有，请访问 [vercel.com](https://vercel.com) 注册
3. **OpenAI API Key**：确保你有有效的 OpenAI API Key

## 🎯 部署步骤

### 方法一：通过 Vercel Dashboard（推荐）

#### 1. 推送代码到 Git 仓库

确保你的代码已经推送到 GitHub/GitLab/Bitbucket：

```bash
git add .
git commit -m "准备部署到 Vercel"
git push origin main
```

#### 2. 导入项目到 Vercel

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 **"Add New..."** → **"Project"**
3. 选择你的 Git 提供商（GitHub/GitLab/Bitbucket）
4. 授权 Vercel 访问你的仓库
5. 选择 `content-flow` 项目
6. 点击 **"Import"**

#### 3. 配置项目设置

Vercel 会自动检测到这是一个 Next.js 项目，配置如下：

- **Framework Preset**: Next.js（自动检测）
- **Root Directory**: `./`（默认）
- **Build Command**: `npm run build`（自动检测）
- **Output Directory**: `.next`（自动检测）
- **Install Command**: `npm install`（自动检测）

#### 4. 配置环境变量

在项目设置页面，找到 **"Environment Variables"** 部分：

1. 添加环境变量：
   - **Name**: `OPENAI_API_KEY`
   - **Value**: 你的 OpenAI API Key（格式：`sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`）
   - **Environment**: 选择所有环境（Production、Preview、Development）

2. 点击 **"Save"**

#### 5. 部署

点击 **"Deploy"** 按钮，Vercel 将开始构建和部署你的项目。

部署完成后，你会获得一个类似 `https://content-flow.vercel.app` 的 URL。

---

### 方法二：通过 Vercel CLI

#### 1. 安装 Vercel CLI

```bash
npm i -g vercel
```

#### 2. 登录 Vercel

```bash
vercel login
```

#### 3. 在项目目录中部署

```bash
cd /Users/dengyongming/Code/content-flow
vercel
```

按照提示操作：
- 选择项目范围（Scope）
- 链接到现有项目或创建新项目
- 确认项目设置

#### 4. 设置环境变量

```bash
vercel env add OPENAI_API_KEY
```

输入你的 OpenAI API Key，并选择应用环境（Production、Preview、Development）。

#### 5. 部署到生产环境

```bash
vercel --prod
```

---

## ⚙️ 配置说明

### API 路由超时设置

项目中的 API 路由已经配置了 `maxDuration = 30`（30秒），这对于 AI 生成任务来说是足够的。Vercel 的 Hobby 计划支持最长 10 秒的函数执行时间，Pro 计划支持最长 60 秒。

如果你的 API 调用经常超时，考虑：
1. 升级到 Vercel Pro 计划
2. 优化 prompt 长度
3. 使用更快的模型（如 `gpt-3.5-turbo` 而不是 `gpt-4-turbo`）

### 环境变量

确保在 Vercel Dashboard 中设置了以下环境变量：

- `OPENAI_API_KEY`: 你的 OpenAI API Key

### 构建配置

项目使用 Next.js 16，Vercel 会自动：
- 检测 Next.js 框架
- 运行 `npm run build`
- 优化静态资源
- 配置边缘函数

---

## 🔍 验证部署

部署完成后，访问你的 Vercel URL，测试以下功能：

1. ✅ 页面正常加载
2. ✅ 输入内容并选择平台
3. ✅ 点击生成按钮
4. ✅ AI 流式输出正常工作
5. ✅ 切换平台功能正常

---

## 🐛 常见问题

### 1. 构建失败

**问题**: 构建时出现错误

**解决方案**:
- 检查 `package.json` 中的依赖是否正确
- 确保 Node.js 版本兼容（Next.js 16 需要 Node.js 18+）
- 查看 Vercel 构建日志中的详细错误信息

### 2. API 路由返回 500 错误

**问题**: 生成内容时出现服务器错误

**解决方案**:
- 检查 `OPENAI_API_KEY` 环境变量是否正确设置
- 确认 API Key 有效且有余额
- 查看 Vercel 函数日志（Dashboard → 项目 → Functions → 查看日志）

### 3. 函数超时

**问题**: API 调用超时

**解决方案**:
- 检查是否使用了 `gpt-4-turbo`（较慢），考虑使用 `gpt-3.5-turbo`
- 升级到 Vercel Pro 计划以获得更长的执行时间
- 优化 prompt 长度

### 4. 环境变量未生效

**问题**: 环境变量设置后仍然报错

**解决方案**:
- 确保环境变量名称完全匹配（区分大小写）
- 重新部署项目（环境变量更改后需要重新部署）
- 检查是否在所有环境（Production、Preview、Development）中都设置了

---

## 📚 相关资源

- [Vercel 文档](https://vercel.com/docs)
- [Next.js 部署文档](https://nextjs.org/docs/deployment)
- [Vercel AI SDK 文档](https://sdk.vercel.ai/docs)
- [OpenAI API 文档](https://platform.openai.com/docs)

---

## 🎉 完成！

部署成功后，你的 ContentFlow 应用就可以通过 Vercel 提供的 URL 访问了。每次你推送代码到 Git 仓库，Vercel 会自动触发新的部署。

祝你使用愉快！🚀
