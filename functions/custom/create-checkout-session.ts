import { getURL } from 'utils/helpers';
import { Request, Response } from 'express';
import { sdk } from 'functions/_utils/graphql-client';
import { getUser } from '../_utils/helpers';
import { stripe } from 'functions/_utils/stripe';

export default async (req: Request, res: Response) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).send('Method Not Allowed');
  }

  const authenticatedUser = getUser(req);

  if (!authenticatedUser) {
    return res.status(401).json({ error: 'Unauthorized 1' });
  }

  const { priceId } = req.body as any;

  try {
    const { user } = await sdk.getUser({ id: authenticatedUser.id });

    // make sure that users can only have one subscription at a time.
    if (user?.profile?.stripeCustomer.subscriptions.data.length) {
      return res
        .status(400)
        .json({ error: 'User already have a subscription' });
    }

    if (!user?.profile?.stripeCustomerId) {
      return res
        .status(400)
        .json({ error: 'User does not have a customer id' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      customer: user.profile.stripeCustomerId,
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      subscription_data: {
        trial_from_plan: true
      },
      success_url: `${getURL()}/account`,
      cancel_url: `${getURL()}/`
    });

    return res
      .status(200)
      .json({ sessionId: session.id, sessionUrl: session.url });
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ error: { statusCode: 500, message: err.message } });
  }
};
