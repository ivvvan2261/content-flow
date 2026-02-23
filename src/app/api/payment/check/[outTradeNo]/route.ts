import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ outTradeNo: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { outTradeNo } = await params;

    const order = await prisma.payment.findUnique({
      where: { outTradeNo },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ status: order.status });
  } catch (error) {
    console.error("Check payment status error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
