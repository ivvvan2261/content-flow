import crypto from 'crypto';

interface NativePayParams {
  out_trade_no: string;
  total_fee: string;
  mch_id: string;
  body: string;
  type?: '1' | '2'; // 1: WeChat, 2: Alipay. Default is 2 (Alipay) in some docs, but let's be explicit.
                    // YunGouOS Native Pay often defaults to WeChat if using WxPay endpoint.
                    // Let's check documentation specifics. 
                    // Actually, YunGouOS has separate endpoints or a unified one.
                    // Let's use the unified native pay if available, or separate.
                    // Unified: https://api.pay.yungouos.com/api/pay/wxpay/nativePay
}

export class YunGouOS {
  private mchId: string;
  private key: string;

  constructor(mchId: string, key: string) {
    this.mchId = mchId;
    this.key = key;
  }

  /**
   * Calculate signature
   */
  private sign(params: Record<string, any>): string {
    const keys = Object.keys(params).filter(k => k !== 'sign' && params[k] !== undefined && params[k] !== '');
    keys.sort();

    const stringA = keys.map(k => `${k}=${params[k]}`).join('&');
    const stringSignTemp = `${stringA}&key=${this.key}`;
    
    return crypto.createHash('md5').update(stringSignTemp).digest('hex').toUpperCase();
  }

  /**
   * Create WeChat Native Pay Order
   */
  async createWxPay(outTradeNo: string, totalFee: string, body: string, attach?: string, notifyUrl?: string) {
    const endpoint = 'https://api.pay.yungouos.com/api/pay/wxpay/nativePay';
    
    const params: any = {
      out_trade_no: outTradeNo,
      total_fee: totalFee,
      mch_id: this.mchId,
      body: body,
      // attach: attach, // Optional
      notify_url: notifyUrl,
    };

    if (attach) params.attach = attach;

    params.sign = this.sign(params);

    try {
      // POST form-urlencoded is typical for these old-school APIs, but checking docs/examples, 
      // they often accept POST parameters.
      const searchParams = new URLSearchParams();
      for (const k in params) {
        searchParams.append(k, params[k]);
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: searchParams
      });

      const data = await res.json();
      return data;
    } catch (error) {
      console.error('YunGouOS Create WxPay Error:', error);
      throw error;
    }
  }

  /**
   * Verify Sign for Webhook
   */
  verifySign(params: Record<string, any>): boolean {
    const { sign: receivedSign, ...rest } = params;
    if (!receivedSign) return false;
    
    const calculatedSign = this.sign(rest);
    return calculatedSign === receivedSign;
  }
}

export const yungouos = new YunGouOS(
  process.env.YUNGOUOS_MCH_ID || '',
  process.env.YUNGOUOS_KEY || ''
);
