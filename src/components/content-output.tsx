"use client";

import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, RefreshCw, Loader2, Check } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { useState } from "react";

interface ContentOutputProps {
  content: string;
  isLoading: boolean;
  platform: string;
  setPlatform: (v: string) => void;
  onRegenerate: () => void;
}

export function ContentOutput({ content, isLoading, platform, setPlatform, onRegenerate }: ContentOutputProps) {
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = async () => {
    if (!content) return;
    
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Card className="flex-1 flex flex-col shadow-sm bg-slate-50/50 dark:bg-slate-900/50 border-dashed h-full overflow-hidden">
      <Tabs value={platform} onValueChange={setPlatform} className="flex-1 flex flex-col h-full">
        <div className="px-6 pt-6">
          <TabsList>
            <TabsTrigger value="twitter">Twitter / 微博</TabsTrigger>
            <TabsTrigger value="xiaohongshu">小红书</TabsTrigger>
            <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          {isLoading && !content ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p>正在思考并撰写文案...</p>
            </div>
          ) : content ? (
            <div className="prose prose-sm dark:prose-invert max-w-none 
                          prose-p:my-3 prose-p:leading-relaxed
                          prose-headings:font-bold prose-headings:mt-6 prose-headings:mb-4
                          prose-h2:text-2xl prose-h3:text-xl
                          prose-ul:my-4 prose-ul:space-y-2
                          prose-ol:my-4 prose-ol:space-y-2
                          prose-li:my-1
                          prose-strong:text-primary prose-strong:font-semibold
                          prose-code:bg-slate-100 dark:prose-code:bg-slate-800 
                          prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                          prose-blockquote:border-l-primary prose-blockquote:bg-slate-50 
                          dark:prose-blockquote:bg-slate-900 prose-blockquote:py-1">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          ) : (
            <div className="h-full rounded-md border bg-background p-4 text-sm text-muted-foreground flex items-center justify-center">
              点击左侧“开始转换”生成 {platform === 'twitter' ? '推文' : platform === 'xiaohongshu' ? '小红书笔记' : '领英动态'}...
            </div>
          )}
        </div>
        
        <CardFooter className="border-t p-4 flex justify-between bg-white dark:bg-slate-950 rounded-b-xl shrink-0">
          <Button variant="ghost" size="sm" className="gap-2" onClick={onRegenerate} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /> 
            {isLoading ? '生成中...' : '重新生成'}
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            className="gap-2" 
            onClick={copyToClipboard} 
            disabled={!content || isLoading}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" /> 已复制
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" /> 复制内容
              </>
            )}
          </Button>
        </CardFooter>
      </Tabs>
    </Card>
  );
}
