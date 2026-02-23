"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CREDIT_PACKAGES } from "@/lib/constants";
import { Loader2, CheckCircle2, ShoppingCart } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";

interface PaymentDialogProps {
  children: React.ReactNode;
  onSuccess?: () => void;
}

export function PaymentDialog({ children, onSuccess }: PaymentDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<typeof CREDIT_PACKAGES[0] | null>(null);
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [orderNo, setOrderNo] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'PENDING' | 'COMPLETED' | 'FAILED'>('PENDING');

  const handleCreateOrder = async (pkgId: string) => {
    try {
      setLoading(true);
      setQrCode(null);
      setOrderNo(null);
      
      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId: pkgId }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create order');
      }
      
      setQrCode(data.qrCode);
      setOrderNo(data.outTradeNo);
      setPaymentStatus('PENDING');
      
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Poll for status
  useEffect(() => {
    if (!orderNo || paymentStatus !== 'PENDING' || !isOpen) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/payment/check/${orderNo}`);
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'COMPLETED') {
            setPaymentStatus('COMPLETED');
            toast.success('充值成功！');
            onSuccess?.();
            clearInterval(interval);
            setTimeout(() => setIsOpen(false), 2000);
          }
        }
      } catch (e) {
        console.error('Polling error', e);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [orderNo, paymentStatus, isOpen, onSuccess]);

  const resetState = () => {
    setSelectedPkg(null);
    setQrCode(null);
    setOrderNo(null);
    setPaymentStatus('PENDING');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetState();
    }}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>充值积分</DialogTitle>
          <DialogDescription>
            选择套餐并使用微信扫码支付
          </DialogDescription>
        </DialogHeader>
        
        {!qrCode ? (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-3">
              {CREDIT_PACKAGES.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedPkg?.id === pkg.id
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-slate-200 dark:border-slate-700 hover:border-blue-200"
                  }`}
                  onClick={() => setSelectedPkg(pkg)}
                >
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">
                      {pkg.name}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {pkg.credits} 积分
                    </div>
                  </div>
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    ¥{pkg.price}
                  </div>
                </div>
              ))}
            </div>
            
            <Button 
              onClick={() => selectedPkg && handleCreateOrder(selectedPkg.id)}
              disabled={!selectedPkg || loading}
              className="w-full mt-2"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "正在创建订单..." : "立即支付"}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            {paymentStatus === 'COMPLETED' ? (
              <div className="flex flex-col items-center text-green-600 space-y-2">
                <CheckCircle2 className="h-16 w-16" />
                <span className="text-lg font-medium">支付成功</span>
              </div>
            ) : (
              <>
                <div className="p-4 bg-white rounded-xl shadow-sm border">
                  <QRCodeSVG value={qrCode} size={200} />
                </div>
                <div className="text-center text-sm text-slate-500">
                  <p>请使用微信扫一扫支付</p>
                  <p className="mt-1 font-mono text-xs text-slate-400">订单号: {orderNo}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 animate-pulse">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>等待支付结果...</span>
                </div>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
