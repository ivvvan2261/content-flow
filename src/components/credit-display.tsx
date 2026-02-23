"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Coins, Plus } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { PaymentDialog } from "@/components/payment-dialog";

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
    <div className="flex items-center gap-1.5 md:gap-3 bg-slate-100 dark:bg-slate-800 px-2 md:px-3 py-1 md:py-1.5 rounded-full border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-1 md:gap-1.5 text-xs md:text-sm font-medium text-slate-700 dark:text-slate-200">
        <Coins className="h-3.5 w-3.5 md:h-4 md:w-4 text-yellow-500" />
        <span>{credits}</span>
      </div>
      <PaymentDialog onSuccess={fetchCredits}>
        <Button variant="ghost" size="icon" className="h-4 w-4 md:h-5 md:w-5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
          <Plus className="h-2.5 w-2.5 md:h-3 md:w-3" />
        </Button>
      </PaymentDialog>
    </div>
  );
}
