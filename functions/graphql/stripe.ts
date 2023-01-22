import { Context, createStripeGraphQLServer } from '@nhost/stripe-graphql-js';

const isAllowed = async (stripeCustomerId: string, context: Context) => {
  const { isAdmin, userClaims } = context;

  if (isAdmin) {
    return true;
  }

  //TODO: Make sure the user can only access their own stripe customer id

  return true;
};

process.env.NODE_ENVIRONMENT = 'development';
const server = createStripeGraphQLServer({ isAllowed });

export default server;
