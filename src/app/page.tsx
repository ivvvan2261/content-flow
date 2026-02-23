import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, PenTool, Share2, Zap, Layout } from "lucide-react";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "墨流 (ContentFlow) - AI 驱动的内容多平台分发工具",
  description: "一键将您的内容重组为小红书、知乎、微博和公众号风格，提升内容创作效率。",
};

import { HeroTitle } from "@/components/hero-title";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
           <div className="bg-primary p-2 rounded-lg">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
          <span className="font-bold text-xl tracking-tight">墨流</span>
        </div>
        <nav className="flex items-center gap-4">
          <SignedIn>
            <Link href="/generate">
              <Button>进入应用</Button>
            </Link>
          </SignedIn>
          <SignedOut>
             <SignInButton mode="modal" forceRedirectUrl="/generate">
                <Button variant="ghost">登录 / 注册</Button>
             </SignInButton>
          </SignedOut>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-6 text-center space-y-8 max-w-5xl mx-auto">
           <div className="space-y-4">
         <HeroTitle />
         <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
           墨流 (ContentFlow) 帮助你将一篇文章智能重组为小红书、知乎、微博和公众号的原生风格。一次创作，多处传播。
         </p>
       </div>
           
           <div className="flex justify-center gap-4 pt-4">
             <SignedOut>
                <SignInButton mode="modal" forceRedirectUrl="/generate">
                  <Button size="lg" className="h-12 px-8 text-lg font-semibold shadow-lg hover:shadow-xl transition-all">立即体验 AI 创作</Button>
                </SignInButton>
             </SignedOut>
             <SignedIn>
                <Link href="/generate">
                  <Button size="lg" className="h-12 px-8 text-lg font-semibold shadow-lg hover:shadow-xl transition-all">立即体验 AI 创作</Button>
                </Link>
             </SignedIn>
           </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 px-6 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
           <div className="max-w-6xl mx-auto">
             <h2 className="text-3xl font-bold text-center mb-16 tracking-tight">专为中文内容创作者打造</h2>
             <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
               <FeatureCard 
                 icon={<PenTool className="w-6 h-6" />}
                 title="多平台风格"
                 description="精准把握小红书种草感、知乎专业风、微博话题性及公众号的深度排版。"
               />
               <FeatureCard 
                 icon={<Zap className="w-6 h-6" />}
                 title="AI 极速生成"
                 description="基于 DeepSeek V3 大模型，流式输出，让灵感无需等待。"
               />
               <FeatureCard 
                 icon={<Layout className="w-6 h-6" />}
                 title="B站 视频转文案"
                 description="直接粘贴视频链接，自动提取字幕并转化为高质量图文内容。"
               />
               <FeatureCard 
                 icon={<Share2 className="w-6 h-6" />}
                 title="历史回溯"
                 description="自动保存每一次生成记录，方便随时回顾与二次编辑。"
               />
             </div>
           </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-slate-500 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 墨流 (ContentFlow). All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            <Link href="#" className="hover:text-slate-900 dark:hover:text-slate-300 transition-colors">隐私政策</Link>
            <Link href="#" className="hover:text-slate-900 dark:hover:text-slate-300 transition-colors">服务条款</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-shadow duration-300">
      <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">{description}</p>
    </div>
  )
}
