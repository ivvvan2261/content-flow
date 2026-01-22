import { NextResponse } from 'next/server';
import { addCredit } from '@/lib/credits';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // TODO: 添加签名校验逻辑，防止伪造请求
    // const signature = req.headers.get('x-bread-signature');
    // if (!verifySignature(signature, body)) return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });

    const { order_id, custom_parameters } = body;
    
    // 解析 userId
    let userId = '';
    
    if (custom_parameters) {
        if (typeof custom_parameters === 'string') {
            try {
                // 尝试解析 JSON
                const params = JSON.parse(custom_parameters);
                userId = params.userId || params.user_id;
            } catch (e) {
                // 如果不是 JSON，直接作为 userId
                userId = custom_parameters;
            }
        } else if (typeof custom_parameters === 'object') {
            userId = custom_parameters.userId || custom_parameters.user_id;
        }
    }

    if (!userId) {
      console.error('No userId found in webhook:', body);
      return NextResponse.json({ error: 'No userId found' }, { status: 400 });
    }

    // 增加积分
    // 这里简单假设所有订单都增加 50 积分
    // 实际应根据 body.pay_price 或 body.product_id 判断
    const amount = 50;
    
    await addCredit(userId, amount);
    console.log(`[Bread Webhook] Added ${amount} credits to user ${userId}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}
