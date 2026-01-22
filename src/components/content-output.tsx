"use client";

import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, RefreshCw, Loader2, Check, Image as ImageIcon, Download } from "lucide-react";
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
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  
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

  const handleGenerateImage = async () => {
    if (!content) return;
    
    setIsGeneratingImage(true);
    setGeneratedImage(null);
    
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          platform
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setGeneratedImage(data.url);
    } catch (error) {
      console.error('Failed to generate image:', error);
      // You might want to show a toast here
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <Card className="flex-1 flex flex-col shadow-sm bg-slate-50/50 dark:bg-slate-900/50 border-dashed h-full overflow-hidden">
      <Tabs value={platform} onValueChange={setPlatform} className="flex-1 flex flex-col h-full">
        <div className="px-4 py-4 sm:px-6 sm:pt-6">
          <TabsList className="grid w-full grid-cols-2 h-auto sm:grid-cols-4">
            <TabsTrigger value="xiaohongshu">小红书</TabsTrigger>
            <TabsTrigger value="zhihu">知乎文章</TabsTrigger>
            <TabsTrigger value="weibo">微博</TabsTrigger>
            <TabsTrigger value="wechat">公众号</TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 p-6 overflow-y-auto max-h-[500px]">
          {isLoading && !content ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p>正在思考并撰写文案...</p>
            </div>
          ) : content ? (
            <div className="space-y-6">
              {/* Image Display Area */}
              {(generatedImage || isGeneratingImage) && (
                <div className="rounded-lg overflow-hidden border bg-background relative group">
                  {isGeneratingImage ? (
                    <div className="aspect-video w-full flex flex-col items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <p className="text-sm text-muted-foreground">正在绘制配图 (CogView-4)...</p>
                    </div>
                  ) : generatedImage ? (
                    <div className="relative">
                      <img 
                        src={generatedImage} 
                        alt="Generated content" 
                        className="w-full h-auto object-cover max-h-[400px]"
                      />
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="icon" variant="secondary" asChild>
                          <a href={generatedImage} target="_blank" rel="noopener noreferrer" download>
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}

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
            </div>
          ) : (
            <div className="h-full rounded-md border bg-background p-4 text-sm text-muted-foreground flex items-center justify-center">
              点击左侧“开始转换”生成 {platform === 'xiaohongshu' ? '小红书笔记' : platform === 'zhihu' ? '知乎文章' : platform === 'weibo' ? '微博博文' : '公众号文章'}...
            </div>
          )}
        </div>
        
        <CardFooter className="border-t p-4 flex flex-col sm:flex-row gap-3 justify-between bg-white dark:bg-slate-950 rounded-b-xl shrink-0">
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="ghost" size="sm" className="gap-2 flex-1 sm:flex-none" onClick={onRegenerate} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /> 
              {isLoading ? '生成中...' : '重新生成'}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 flex-1 sm:flex-none" 
              onClick={handleGenerateImage} 
              disabled={isLoading || !content || isGeneratingImage}
            >
              <ImageIcon className="h-4 w-4" />
              {isGeneratingImage ? '绘图中...' : generatedImage ? '重新配图' : '智能配图'}
            </Button>
          </div>
          <Button 
            variant="secondary" 
            size="sm" 
            className="gap-2 w-full sm:w-auto" 
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
