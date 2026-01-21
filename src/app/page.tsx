"use client";

import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { ContentInput } from "@/components/content-input";
import { ContentOutput } from "@/components/content-output";
import { useState } from "react";
import { useCompletion } from "@ai-sdk/react";

export default function Home() {
  const [inputContent, setInputContent] = useState("");
  const [platform, setPlatform] = useState("twitter");
  
  const { completion, complete, isLoading } = useCompletion({
    api: '/api/generate',
    streamProtocol: 'text',
  });

  const handleGenerate = () => {
    if (!inputContent) return;
    complete(inputContent, {
      body: { platform }
    });
  };

  // 当切换平台时，如果我们想自动重新生成（可选），或者保留当前状态
  // 这里暂时只更新 platform 状态，用户需要手动点生成，或者我们可以在这里自动触发
  const handlePlatformChange = (newPlatform: string) => {
    setPlatform(newPlatform);
    // 如果有内容，自动为新平台重新生成？
    // 为了节省 token，暂时让用户手动点击，或者我们判断如果 input 没变，就不自动生成？
    // MVP: 用户手动点击生成，体验更可控
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      {/* Navbar */}
      <header className="border-b bg-white dark:bg-slate-900 px-6 py-4 sticky top-0 z-10 shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">ContentFlow</h1>
          </div>
          <Button variant="outline" size="sm">登录 / 注册</Button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full min-h-[600px]">
          
          {/* Left Column: Input */}
          <section className="flex flex-col gap-4 h-full">
            <div className="space-y-1 shrink-0">
              <h2 className="text-2xl font-semibold tracking-tight">输入素材</h2>
              <p className="text-muted-foreground">粘贴文章内容或 YouTube 视频链接。</p>
            </div>
            <ContentInput 
              content={inputContent} 
              setContent={setInputContent}
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
