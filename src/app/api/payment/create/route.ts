import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import { yungouos } from "@/lib/yungouos";
import { CREDIT_PACKAGES } from "@/lib/constants";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { packageId } = await req.json();
    const pkg = CREDIT_PACKAGES.find((p) => p.id === packageId);

    if (!pkg) {
      return NextResponse.json({ error: "Invalid package" }, { status: 400 });
    }

    // Generate Order ID
    const outTradeNo = `ORDER_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Create Order in DB
    const order = await prisma.payment.create({
      data: {
        userId,
        outTradeNo,
        amount: pkg.price,
        creditAmount: pkg.credits,
        status: "PENDING",
        provider: "YUNGOUOS",
      },
    });

    // Call YunGouOS
    const notifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/webhook/yungouos`;
    const result = await yungouos.createWxPay(
      outTradeNo,
      pkg.price,
      `ContentFlow Credits - ${pkg.name}`,
      userId, // attach userId
      notifyUrl,
    );

    console.log("YunGouOS Result:", JSON.stringify(result));

    // YunGouOS returns code: 1 (number) or '1' (string) for success.
    if (result.code != 1) {
      // Weak comparison covers both 1 and '1'
      console.error("YunGouOS Error:", result);
      return NextResponse.json(
        { error: result.msg || "Payment initialization failed" },
        { status: 500 },
      );
    }

    if (!result.data) {
      console.error("YunGouOS No QR Code Data:", result);
      return NextResponse.json(
        { error: "Failed to generate QR code" },
        { status: 500 },
      );
    }

    // Update order with QR code if needed, but we just return it to frontend
    if (result.data) {
      await prisma.payment.update({
        where: { id: order.id },
        data: { qrCode: result.data },
      });
    }

    return NextResponse.json({
      qrCode: result.data,
      outTradeNo,
      orderId: order.id,
    });
  } catch (error) {
    console.error("Create payment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
