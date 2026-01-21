"use client";

import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Type, Video, Loader2, Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner"; // Assuming you have sonner or similar toast, if not we'll use simple alert or add it

interface ContentInputProps {
  content: string;
  setContent: (v: string) => void;
  biliUrl: string;
  setBiliUrl: (v: string) => void;
  inputType: string;
  setInputType: (v: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export function ContentInput({ 
  content, 
  setContent, 
  biliUrl, 
  setBiliUrl, 
  inputType, 
  setInputType, 
  onGenerate, 
  isGenerating 
}: ContentInputProps) {
  const [isFetching, setIsFetching] = useState(false);

  const handleFetchBilibili = async () => {
    if (!biliUrl) return;

    setIsFetching(true);
    try {
      const res = await fetch('/api/fetch-bilibili', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: biliUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '获取失败');
      }

      // Success: Switch to text tab and fill content
      setContent(data.content);
      setInputType('text');
      
    } catch (error) {
      console.error(error);
      alert('获取 B 站内容失败，请检查链接或稍后重试。'); // Simple fallback
    } finally {
      setIsFetching(false);
    }
  };

  const isButtonDisabled = () => {
    if (isGenerating) return true;
    if (inputType === "text" && !content.trim()) return true;
    if (inputType === "bilibili" && !biliUrl.trim()) return true;
    return false;
  };

  return (
    <Card className="flex-1 flex flex-col shadow-sm h-full">
      <CardHeader className="pb-4 flex-1">
        <Tabs value={inputType} onValueChange={setInputType} className="w-full h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text" className="gap-2">
              <Type className="h-4 w-4" /> 文本 / 文章
            </TabsTrigger>
            <TabsTrigger value="bilibili" className="gap-2">
              <Video className="h-4 w-4" /> B站 视频
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-4 flex-1">
            <TabsContent value="text" className="mt-0 h-full flex flex-col gap-2">
              <Label htmlFor="content" className="sr-only">Content</Label>
              <Textarea 
                id="content" 
                placeholder="在这里粘贴您的文章、博客或草稿..." 
                className="flex-1 resize-none border-0 focus-visible:ring-0 p-0 text-base"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </TabsContent>
            <TabsContent value="bilibili" className="mt-0">
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="url">B站 链接</Label>
                  <Input 
                    id="url" 
                    placeholder="https://www.bilibili.com/video/BV..." 
                    value={biliUrl}
                    onChange={(e) => setBiliUrl(e.target.value)}
                  />
                </div>
                <div className="rounded-lg border bg-slate-50 p-8 text-center text-muted-foreground border-dashed h-[200px] flex flex-col items-center justify-center gap-4">
                  {isFetching ? (
                    <>
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <p>正在解析视频字幕...</p>
                    </>
                  ) : (
                    <>
                      <p>{biliUrl ? "点击下方按钮获取内容" : "请输入有效的 B站 视频链接"}</p>
                      {biliUrl && (
                        <Button variant="secondary" onClick={handleFetchBilibili} disabled={isFetching}>
                          <Download className="mr-2 h-4 w-4" />
                          解析并导入内容
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </CardHeader>
      <CardFooter className="mt-auto border-t p-4 bg-slate-50/50">
        <Button 
          className="w-full gap-2" 
          size="lg"
          onClick={inputType === 'bilibili' ? handleFetchBilibili : onGenerate}
          disabled={isButtonDisabled() || isFetching}
        >
          {isGenerating || isFetching ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> {isFetching ? '正在解析...' : '正在转换...'}
            </>
          ) : (
            <>
              {inputType === 'bilibili' ? <Download className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
              {inputType === 'bilibili' ? '获取内容' : '开始转换'}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
