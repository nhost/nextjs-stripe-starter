import Link from 'next/link';
import { ReactNode } from 'react';

import LoadingDots from 'components/ui/LoadingDots';
import Button from 'components/ui/Button';
import {
  useCreateCustomerPortalSessionMutation,
  useGetUserQuery
} from '@/utils/__generated__/graphql';
import { useUserData } from '@nhost/nextjs';
import { format, fromUnixTime } from 'date-fns';

interface Props {
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
}

function Card({ title, description, footer, children }: Props) {
  return (
    <div className="border border-zinc-700	max-w-3xl w-full p rounded-md m-auto my-8">
      <div className="px-5 py-4">
        <h3 className="text-2xl mb-1 font-medium">{title}</h3>
        <p className="text-zinc-300">{description}</p>
        {children}
      </div>
      <div className="border-t border-zinc-700 bg-zinc-900 p-4 text-zinc-500 rounded-b-md">
        {footer}
      </div>
    </div>
  );
}

export default function Account() {
  const userData = useUserData();

  const { data, isLoading } = useGetUserQuery({
    id: userData?.id
  });

  const {
    mutateAsync: createCustomerPortalSession,
    isLoading: createCustomerPortalSessionIsLoading
  } = useCreateCustomerPortalSessionMutation();

  const redirectToCustomerPortal = async () => {
    const stripeCustomerId = data?.user?.profile?.stripeCustomerId;

    if (!stripeCustomerId) {
      return alert('No stripe customer ID found');
    }

    const customerPortalSessionResponse = await createCustomerPortalSession({
      customerId: stripeCustomerId,
      returnUrl: window.location.href
    });

    window.location.href =
      customerPortalSessionResponse.stripe.createBillingPortalSession.url;
  };

  if (isLoading) {
    return (
      <div className="mx-auto w-12 my-32">
        <LoadingDots />
      </div>
    );
  }

  if (!data) {
    return <div>No data..</div>;
  }

  const { user } = data;

  // find first subscription by user
  const productSubscription =
    user?.profile?.stripeCustomer.subscriptions?.data[0]?.items.data[0];

  console.log(productSubscription);

  const subscriptionPrice =
    productSubscription &&
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: productSubscription.price.currency
    }).format(productSubscription.price.unitAmount! / 100);

  return (
    <section className="bg-black mb-32">
      <div className="max-w-6xl mx-auto pt-8 sm:pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Account
          </h1>
          <p className="mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl max-w-2xl m-auto">
            We partnered with Stripe for a simplified billing.
          </p>
        </div>
      </div>
      <div className="p-4">
        <Card
          title="Your Plan"
          description={
            productSubscription
              ? `You are currently on the ${productSubscription.price.product.name} plan.`
              : ''
          }
          footer={
            <div className="flex items-start justify-between flex-col sm:flex-row sm:items-center">
              <p className="pb-4 sm:pb-0">
                Manage your subscription on Stripe.
              </p>
              <Button
                variant="slim"
                loading={createCustomerPortalSessionIsLoading}
                disabled={
                  createCustomerPortalSessionIsLoading || !productSubscription
                }
                onClick={() => redirectToCustomerPortal()}
              >
                Open customer portal
              </Button>
            </div>
          }
        >
          <div className="text-xl mt-8 mb-4 font-semibold">
            {isLoading ? (
              <div className="h-12 mb-6">
                <LoadingDots />
              </div>
            ) : productSubscription ? (
              `${subscriptionPrice}/mo`
            ) : (
              <Link href="/">
                <a>Choose your plan</a>
              </Link>
            )}
          </div>
        </Card>
        <Card
          title="Invoices"
          description=""
          footer={
            <p>
              Invoices are generated automatically and sent to your email
              address.
            </p>
          }
        >
          {data.user?.profile?.stripeCustomer.invoices?.data.map((invoice) => {
            if (!invoice.hostedInvoiceUrl) {
              return;
            }

            return (
              <div>
                <a href={invoice.hostedInvoiceUrl}>
                  Invoice{' '}
                  {format(fromUnixTime(invoice.created), 'yyyy-MM-dd HH:mm')}
                </a>
              </div>
            );
          })}
        </Card>
        <Card
          title="Your Name"
          description="Please enter your full name, or a display name you are comfortable with."
          footer={<p>Please use 64 characters at maximum.</p>}
        >
          <div className="text-xl mt-8 mb-4 font-semibold">
            {userData?.displayName}
          </div>
        </Card>
        <Card
          title="Your Email"
          description="Please enter the email address you want to use to login."
          footer={<p>We will email you to verify the change.</p>}
        >
          <p className="text-xl mt-8 mb-4 font-semibold">{userData?.email}</p>
        </Card>
      </div>
    </section>
  );
}
