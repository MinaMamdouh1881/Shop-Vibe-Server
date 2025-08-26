import { Request, Response } from 'express';
import { TokenPayload } from '../middlewares/verifyToken';

export async function checkOutHandler(req: Request, res: Response) {
  const user = req.user as TokenPayload;
  const { data, totalPrice } = req.body;

  try {
    const authToken = await authenticate();
    const orderId = await createOrder(authToken, totalPrice * 100);
    const paymentToken = await createPaymentKey(
      authToken,
      orderId,
      totalPrice * 100
    );

    const iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${process.env.PAY_MOB_IFRAME_ID}?payment_token=${paymentToken}`;

    res.json({ success: true, iframeUrl });
    return;
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Payment initialization failed' });
    return;
  }
}

async function authenticate() {
  const response = await fetch('https://accept.paymob.com/api/auth/tokens', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ api_key: process.env.PAY_MOB_API_KEY }),
  });
  const data = await response.json();
  return data.token;
}

async function createOrder(authToken: string, AMOUNT_CENTS: number) {
  const response = await fetch(
    'https://accept.paymob.com/api/ecommerce/orders',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auth_token: authToken,
        delivery_needed: 'false',
        amount_cents: AMOUNT_CENTS,
        currency: 'EGP',
        items: [],
      }),
    }
  );
  const data = await response.json();
  return data.id;
}

async function createPaymentKey(
  authToken: string,
  orderId: string,
  AMOUNT_CENTS: number
) {
  const response = await fetch(
    'https://accept.paymob.com/api/acceptance/payment_keys',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auth_token: authToken,
        amount_cents: AMOUNT_CENTS,
        expiration: 3600,
        order_id: orderId,
        billing_data: {
          apartment: 'NA',
          email: 'user@example.com',
          floor: 'NA',
          first_name: 'Test',
          street: 'NA',
          building: 'NA',
          phone_number: '+20123456789',
          shipping_method: 'NA',
          postal_code: 'NA',
          city: 'Cairo',
          country: 'EG',
          last_name: 'User',
          state: 'NA',
        },
        currency: 'EGP',
        integration_id: process.env.PAY_MOB_INTEGRATION_ID,
        lock_order_when_paid: 'false',
      }),
    }
  );
  const data = await response.json();
  return data.token;
}
