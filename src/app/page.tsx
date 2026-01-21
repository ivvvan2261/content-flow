"use client";

import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ContentInput } from "@/components/content-input";
import Link from "next/link";
import { ContentOutput } from "@/components/content-output";
import { useState } from "react";
import { useCompletion } from "@ai-sdk/react";

export default function Home() {
  const [inputContent, setInputContent] = useState("");
  const [biliUrl, setBiliUrl] = useState("");
  const [inputType, setInputType] = useState("text");
  const [platform, setPlatform] = useState("xiaohongshu");
  
  const { completion, complete, isLoading } = useCompletion({
    api: '/api/generate',
    streamProtocol: 'text',
  });

  const handleGenerate = () => {
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
      <header className="border-b bg-white dark:bg-slate-900 px-6 py-4 sticky top-0 z-10 shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">ContentFlow</h1>
          </div>
          <div className="flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="outline" size="sm">登录 / 注册</Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link href="/history">
                <Button variant="ghost" size="sm" className="mr-2">历史记录</Button>
              </Link>
              <UserButton />
            </SignedIn>
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
