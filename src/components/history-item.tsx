"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { format } from "date-fns";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Copy, Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface HistoryItemProps {
  item: {
    id: string;
    platform: string;
    createdAt: Date;
    originalContent: string;
    generatedContent: string;
  };
}

export function HistoryItem({ item }: HistoryItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    if (!item.generatedContent) return;

    try {
      await navigator.clipboard.writeText(item.generatedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const platformLabels: Record<string, string> = {
    xiaohongshu: "小红书",
    zhihu: "知乎",
    weibo: "微博",
    wechat: "公众号",
  };

  const platformColors: Record<string, string> = {
    xiaohongshu: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    zhihu: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    weibo: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    wechat: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  };

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-3 bg-slate-50/50 dark:bg-slate-900/50 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "px-2.5 py-0.5 rounded-full text-xs font-medium",
                platformColors[item.platform] ||
                  "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
              )}
            >
              {platformLabels[item.platform] || item.platform}
            </div>
            <span className="text-xs text-muted-foreground">
              {format(new Date(item.createdAt), "yyyy-MM-dd HH:mm")}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle expand</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {/* Input Section */}
        <div>
          <div className="text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">
            输入内容
          </div>
          <div className="bg-muted/50 p-3 rounded-md text-sm text-muted-foreground break-all">
            <div className={cn(!isExpanded && "line-clamp-2")}>
              {item.originalContent}
            </div>
          </div>
        </div>

        {/* Output Section */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              生成结果
            </div>
            {isExpanded && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 gap-1 text-xs"
                onClick={copyToClipboard}
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3" /> 已复制
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" /> 复制
                  </>
                )}
              </Button>
            )}
          </div>
          <div
            className={cn(
              "text-sm relative",
              !isExpanded && "line-clamp-3 max-h-[4.5em] overflow-hidden"
            )}
          >
            <div
              className={cn(
                "prose prose-sm dark:prose-invert max-w-none prose-p:my-1.5 prose-headings:my-2 prose-ul:my-2 prose-li:my-0.5",
                !isExpanded && "pointer-events-none"
              )}
            >
              <ReactMarkdown>{item.generatedContent}</ReactMarkdown>
            </div>
            {!isExpanded && (
              <div className="absolute inset-x-0 bottom-0 h-8 bg-linear-to-t from-background to-transparent" />
            )}
          </div>
        </div>
        
        {!isExpanded && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full h-8 text-xs text-muted-foreground hover:text-foreground mt-2"
            onClick={() => setIsExpanded(true)}
          >
            展开全部
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
