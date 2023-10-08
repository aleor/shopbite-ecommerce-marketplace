import Xendit from 'xendit-node';

import { getAdminAuth } from '../../../firebase/adminAuth';
import { Price } from '../../../models';

async function createInvoice({ type, email, shopId }) {
  const xendit = new Xendit({
    secretKey: process.env.XENDIT_SECRET_KEY,
  });

  const { Invoice } = xendit;
  const payment = new Invoice({});

  const response = await payment.createInvoice({
    externalID: `${shopId}_shopbite_${type}_payment_${email}_${new Date().toISOString()}`,
    amount: type === 'monthly' ? Price.Monthly : Price.Annually,
    description: `Shopbite.co - ${type} payment for ${email}.`,
    customer: {
      email,
    },
    payerEmail: email,
    successRedirectURL: `${process.env.NEXT_PUBLIC_BASE_URL}/admin?tab=upgrade&payment=success`,
    failureRedirectURL: `${process.env.NEXT_PUBLIC_BASE_URL}/admin?tab=upgrade&payment=failure`,
  });

  return response;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(404).end();
    return;
  }

  const idToken = req.headers.auth;
  if (!idToken) {
    res.status(401).send('Unauthorized');
    return;
  }

  let shopId: string;
  let email: string;

  try {
    const user = await getAdminAuth().verifyIdToken(idToken);
    shopId = user.uid;
    email = user.email;
  } catch (e) {
    return res.status(401).send('Unauthorized');
  }

  const allowedPeriods = ['monthly', 'annually'];

  if (!req.body.type || !allowedPeriods.includes(req.body.type)) {
    res.status(400).end();
    return;
  }

  try {
    const invoiceResponse = await createInvoice({
      type: req.body.type,
      email,
      shopId,
    });
    res.json(invoiceResponse);
  } catch (error) {
    console.log(error);
    res.status(error?.status || 500).end();
  }
}
