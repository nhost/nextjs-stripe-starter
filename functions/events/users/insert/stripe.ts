import { Request, Response } from 'express';
import { sdk } from '../../../_utils/graphql-client';
import { stripe } from '../../../_utils/stripe';

const handler = async (req: Request, res: Response) => {
  const { body } = req;

  const { user } = await sdk.getUser({
    id: body.event.data.new.id
  });

  // check if the user exists
  if (!user) {
    return res.status(400).send('User not found');
  }

  // check if the user already has a stripe customer attached
  if (user.profile?.stripeCustomerId) {
    return res.status(200).send('User already has a stripe customer attached');
  }

  // create stripe customer
  const stripeCustomer = await stripe.customers.create({
    name: user.displayName,
    email: user.email,
    metadata: {
      userId: user.id
    }
  });

  // insert profile into database
  await sdk.InsertProfile({
    profile: {
      id: user.id,
      stripeCustomerId: stripeCustomer.id
    }
  });

  res.sendStatus(204);
};

export default handler;
