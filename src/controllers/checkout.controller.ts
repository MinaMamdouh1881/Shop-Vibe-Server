import { Request, Response } from 'express';
import { TokenPayload } from '../middlewares/verifyToken';
import crypto from 'crypto';
import Cart from '../modules/cart.schema';
import { error } from 'console';
import Payment from '../modules/payment.schema';

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

// Controller to handle checkout
export async function checkOutHandler(req: Request, res: Response) {
  const user = req.user as TokenPayload;
  const { totalPrice } = req.body;
  try {
    const authToken = await authenticate();
    const orderId = await createOrder(authToken, totalPrice * 100);
    const paymentToken = await createPaymentKey(
      authToken,
      orderId,
      totalPrice * 100
    );

    const cart = await Cart.findOne({ user: user.id });
    await Payment.findOneAndUpdate(
      { orderId: orderId },
      {
        $setOnInsert: {
          orderId: orderId,
          userId: user.id,
          cartId: cart.id,
          amount: totalPrice,
        },
      },
      { new: true, upsert: true }
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
// Controller to handle checkout callback

const HMAC_SECRET = process.env.PAY_MOB_HMAC_KEY || '';
interface CallbackData {
  [key: string]: string | undefined;
  amount_cents?: string;
  created_at?: string;
  currency?: string;
  error_occured?: string;
  has_parent_transaction?: string;
  id?: string;
  integration_id?: string;
  is_3d_secure?: string;
  is_auth?: string;
  is_capture?: string;
  is_refunded?: string;
  is_standalone_payment?: string;
  is_voided?: string;
  'order.id'?: string;
  owner?: string;
  pending?: string;
  'source_data.pan'?: string;
  'source_data.sub_type'?: string;
  'source_data.type'?: string;
  success?: string;
  hmac?: string;
}
const hmacKeys = [
  'amount_cents',
  'created_at',
  'currency',
  'error_occured',
  'has_parent_transaction',
  'id',
  'integration_id',
  'is_3d_secure',
  'is_auth',
  'is_capture',
  'is_refunded',
  'is_standalone_payment',
  'is_voided',
  'order.id',
  'owner',
  'pending',
  'source_data.pan',
  'source_data.sub_type',
  'source_data.type',
  'success',
];

export async function checkOutCallbackHandler(req: Request, res: Response) {
  const user = req.user as TokenPayload;
  try {
    const query = req.query as CallbackData;
    const providedHmac = query.hmac;
    if (!providedHmac) {
      res.status(400).json({ error: 'HMAC is missing' });
      return;
    }

    const data: CallbackData = {
      amount_cents: query.amount_cents,
      created_at: query.created_at,
      currency: query.currency,
      error_occured: query.error_occured,
      has_parent_transaction: query.has_parent_transaction,
      id: query.id,
      integration_id: query.integration_id,
      is_3d_secure: query.is_3d_secure,
      is_auth: query.is_auth,
      is_capture: query.is_capture,
      is_refunded: query.is_refunded,
      is_standalone_payment: query.is_standalone_payment,
      is_voided: query.is_voided,
      'order.id': query.order,
      owner: query.owner,
      pending: query.pending,
      'source_data.pan': query['source_data.pan'],
      'source_data.sub_type': query['source_data.sub_type'],
      'source_data.type': query['source_data.type'],
      success: query.success,
    };
    let concatenatedString = '';
    for (const key of hmacKeys) {
      const value = data[key] !== undefined ? data[key] : '';
      concatenatedString += value;
    }
    const calculatedHmac = crypto
      .createHmac('sha512', HMAC_SECRET)
      .update(concatenatedString)
      .digest('hex');

    if (calculatedHmac === providedHmac && query.success === 'true') {
      const payment = await Payment.findOneAndUpdate(
        { orderId: query.order, userId: user.id },
        { status: 'completed' }
      );

      await Cart.findOneAndUpdate({ user: payment.userId }, { items: [] });
      res.status(200).json({
        message: 'HMAC verification successful',
        cart: [],
      });
    } else if (calculatedHmac === providedHmac && query.success === 'false') {
      await Payment.findOneAndUpdate(
        { orderId: query['order.id'] },
        { status: 'failed' }
      );
      res.status(401).json({
        message: 'HMAC verification successful',
        error: 'Payment failed Please try again',
      });
    } else {
      await Payment.findOneAndUpdate(
        { orderId: query['order.id'] },
        { status: 'failed' }
      );
      res.status(400).json({
        message: 'HMAC verification failed',
        error: 'something went wrong Please try again',
      });
    }
    return;
  } catch (error) {
    console.error('Error processing callback:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
}
