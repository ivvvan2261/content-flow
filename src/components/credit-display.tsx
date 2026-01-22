"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Coins, Plus } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

export function CreditDisplay() {
  const [credits, setCredits] = useState<number | null>(null);
  const { userId } = useAuth();

  const fetchCredits = () => {
    if (!userId) return;
    fetch('/api/user/credits')
      .then(res => {
        if (res.ok) return res.json();
        return null;
      })
      .then(data => {
        if (data && data.balance !== undefined) {
          setCredits(data.balance);
        }
      });
  };

  useEffect(() => {
    fetchCredits();
    // 简单的轮询，或者可以配合 SWR 使用
    const interval = setInterval(fetchCredits, 10000); 
    return () => clearInterval(interval);
  }, [userId]);

  if (credits === null) return null;

  return (
    <div className="flex items-center gap-3 mr-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-200">
        <Coins className="h-4 w-4 text-yellow-500" />
        <span>{credits}</span>
      </div>
      <Link href="https://mbd.pub/o/bread/mbd-link" target="_blank" title="充值积分">
        <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
          <Plus className="h-3 w-3" />
        </Button>
      </Link>
    </div>
  );
}
