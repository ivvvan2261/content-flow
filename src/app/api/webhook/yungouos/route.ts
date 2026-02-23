import { NextResponse } from "next/server";
import { yungouos } from "@/lib/yungouos";
import prisma from "@/lib/db";
import { addCredit } from "@/lib/credits";

export async function POST(req: Request) {
  try {
    // YunGouOS sends data as application/x-www-form-urlencoded
    const text = await req.text();
    const params = new URLSearchParams(text);
    const data: Record<string, string> = {};

    params.forEach((value, key) => {
      data[key] = value;
    });

    console.log("[YunGouOS Webhook] Received:", data);

    // Verify Signature
    if (!yungouos.verifySign(data)) {
      console.error("[YunGouOS Webhook] Invalid signature");
      return new NextResponse("FAIL", { status: 400 });
    }

    const { out_trade_no, code, payNo } = data;

    // code: 1 means success
    if (code !== "1") {
      console.log("[YunGouOS Webhook] Payment not successful, code:", code);
      return new NextResponse("SUCCESS"); // Acknowledge receipt even if failed status
    }

    // Find Order
    const order = await prisma.payment.findUnique({
      where: { outTradeNo: out_trade_no },
    });

    if (!order) {
      console.error("[YunGouOS Webhook] Order not found:", out_trade_no);
      return new NextResponse("SUCCESS"); // Don't retry if order missing
    }

    if (order.status === "COMPLETED") {
      console.log("[YunGouOS Webhook] Order already completed:", out_trade_no);
      return new NextResponse("SUCCESS");
    }

    // Update Order Status
    await prisma.payment.update({
      where: { id: order.id },
      data: {
        status: "COMPLETED",
        updatedAt: new Date(),
      },
    });

    // Add Credits
    await addCredit(order.userId, order.creditAmount);
    console.log(
      `[YunGouOS Webhook] Added ${order.creditAmount} credits to user ${order.userId}`,
    );

    return new NextResponse("SUCCESS");
  } catch (error) {
    console.error("[YunGouOS Webhook] Error:", error);
    return new NextResponse("FAIL", { status: 500 });
  }
}
