import { httpsCallable } from 'firebase/functions';

import { getAppFunctions } from '../../../firebase/functions';

interface XenditCallbackPayload {
  id: string;
  status: 'PAID' | 'EXPIRED';
  paid_at: string;
  paid_amount: number;
  external_id: string;
  payer_email: string;
  payment_method: string;
  payment_channel: string;
  credit_card_charge_id?: string;
  bank_code?: string;
  retail_outlet_name?: string;
  ewallet_type?: string;
}

async function handleCallback(payload: XenditCallbackPayload) {
  const functions = getAppFunctions();
  const handlePaymentCallback = httpsCallable(
    functions,
    'handlePaymentCallback'
  );

  await handlePaymentCallback(payload);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(404).end();
    return;
  }

  if (
    !req.headers['x-callback-token'] ||
    req.headers['x-callback-token'] !== process.env.XENDIT_CALLBACK_TOKEN
  ) {
    res.status(401).end();
    return;
  }

  try {
    await handleCallback(req.body);
    res.status(200).end();
  } catch (error) {
    console.log(error);
    res.status(error?.status || 500).end();
  }
}
