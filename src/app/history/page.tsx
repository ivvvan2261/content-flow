import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import { format } from "date-fns";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function HistoryPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const history = await db.generationHistory.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/generate">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">生成历史</h1>
        </div>

        <div className="grid gap-4">
          {history.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              暂无生成记录
            </div>
          ) : (
            history.map((item) => (
              <Card key={item.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium capitalize bg-primary/10 text-primary px-2 py-0.5 rounded text-sm inline-block">
                      {item.platform}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(item.createdAt, "yyyy-MM-dd HH:mm")}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      输入内容
                    </div>
                    <div className="text-sm line-clamp-2 bg-muted p-2 rounded-md break-all">
                      {item.originalContent}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      生成结果
                    </div>
                    <div className="text-sm line-clamp-3 whitespace-pre-wrap break-all">
                      {item.generatedContent}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
