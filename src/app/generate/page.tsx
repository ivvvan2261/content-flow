"use client";

import { Button } from "@/components/ui/button";
import { Sparkles, History, LogOut } from "lucide-react";
import { ContentInput } from "@/components/content-input";
import Link from "next/link";
import { ContentOutput } from "@/components/content-output";
import { useState, useEffect } from "react";
import { useCompletion } from "@ai-sdk/react";
import { toast } from "sonner";
import { CreditDisplay } from "@/components/credit-display";

export default function GeneratePage() {
  const [inputContent, setInputContent] = useState("");
  const [biliUrl, setBiliUrl] = useState("");
  const [inputType, setInputType] = useState("text");
  const [platform, setPlatform] = useState("xiaohongshu");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/user/me')
      .then(res => res.json())
      .then(data => setUserId(data.userId));
  }, []);
  
  const { completion, complete, isLoading } = useCompletion({
    api: '/api/generate',
    streamProtocol: 'text',
    onError: (error) => {
      if (error.message.includes('402') || error.message.includes('积分不足')) {
        toast.error("积分不足，请充值后继续使用");
      } else {
        toast.error("生成失败，请稍后重试");
      }
    }
  });

  const handleGenerate = () => {
    if (!userId) {
      toast.error("请先登录再使用生成功能");
      window.location.href = '/api/logto/sign-in';
      return;
    }

    if (inputType === 'text') {
      if (!inputContent) return;
      complete(inputContent, {
        body: { platform }
      });
    } else {
      if (!biliUrl) return;
      // Send empty prompt for bili, backend uses biliUrl
      complete('', {
        body: { platform, biliUrl }
      });
    }
  };

  const handlePlatformChange = (newPlatform: string) => {
    setPlatform(newPlatform);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      {/* Navbar */}
      <header className="border-b bg-white dark:bg-slate-900 px-4 md:px-6 py-4 sticky top-0 z-10 shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="bg-primary p-1.5 md:p-2 rounded-lg">
              <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-primary-foreground" />
            </div>
            <h1 className="text-lg md:text-xl font-bold tracking-tight">ContentFlow</h1>
          </Link>
          <div className="flex items-center gap-2 md:gap-4">
            {!userId ? (
              <Link href="/api/logto/sign-in">
                <Button variant="outline" size="sm">登录 / 注册</Button>
              </Link>
            ) : (
              <>
                <CreditDisplay />
                <Link href="/history">
                  <Button variant="ghost" size="sm" className="px-2 md:px-3">
                    <History className="h-4 w-4 md:mr-2" />
                    <span className="hidden md:inline">历史记录</span>
                  </Button>
                </Link>
                <Link href="/api/logto/sign-out">
                  <Button variant="ghost" size="icon" title="退出登录">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full min-h-[600px]">
          
          {/* Left Column: Input */}
          <section className="flex flex-col gap-4 h-full">
            <div className="space-y-1 shrink-0">
              <h2 className="text-2xl font-semibold tracking-tight">输入素材</h2>
              <p className="text-muted-foreground">粘贴文章内容或 B站 视频链接。</p>
            </div>
            <ContentInput 
              content={inputContent} 
              setContent={setInputContent}
              biliUrl={biliUrl}
              setBiliUrl={setBiliUrl}
              inputType={inputType}
              setInputType={setInputType}
              onGenerate={handleGenerate}
              isGenerating={isLoading}
            />
          </section>

          {/* Right Column: Output */}
          <section className="flex flex-col gap-4 h-full">
            <div className="space-y-1 shrink-0">
              <h2 className="text-2xl font-semibold tracking-tight">生成结果</h2>
              <p className="text-muted-foreground">AI 已为您重写为不同平台的风格。</p>
            </div>
            <ContentOutput 
              content={completion}
              isLoading={isLoading}
              platform={platform}
              setPlatform={handlePlatformChange}
              onRegenerate={handleGenerate}
            />
          </section>

        </div>
      </main>
    </div>
  );
}
