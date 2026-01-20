"use client";

import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Type, Youtube, Loader2 } from "lucide-react";
import { useState } from "react";

interface ContentInputProps {
  content: string;
  setContent: (v: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export function ContentInput({ content, setContent, onGenerate, isGenerating }: ContentInputProps) {
  const [inputType, setInputType] = useState("text");
  const [youtubeUrl, setYoutubeUrl] = useState("");

  return (
    <Card className="flex-1 flex flex-col shadow-sm h-full">
      <CardHeader className="pb-4 flex-1">
        <Tabs value={inputType} onValueChange={setInputType} className="w-full h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text" className="gap-2">
              <Type className="h-4 w-4" /> 文本 / 文章
            </TabsTrigger>
            <TabsTrigger value="youtube" className="gap-2">
              <Youtube className="h-4 w-4" /> YouTube 视频
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
            <TabsContent value="youtube" className="mt-0">
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="url">YouTube 链接</Label>
                  <Input 
                    id="url" 
                    placeholder="https://www.youtube.com/watch?v=..." 
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                  />
                </div>
                <div className="rounded-lg border bg-slate-50 p-8 text-center text-muted-foreground border-dashed h-[200px] flex items-center justify-center">
                  {youtubeUrl ? "视频功能开发中 (暂仅支持文本)" : "等待输入链接..."}
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
          onClick={onGenerate}
          disabled={!content || isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> 正在转换...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" /> 开始转换
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
