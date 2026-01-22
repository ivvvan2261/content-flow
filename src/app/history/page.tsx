import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import { HistoryItem } from "@/components/history-item";
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
              <HistoryItem key={item.id} item={item} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
