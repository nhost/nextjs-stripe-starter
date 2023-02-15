import cn from 'classnames';
import { useRouter } from 'next/router';
import { useState } from 'react';

import Button from 'components/ui/Button';
import {
  PlanFragment,
  UserWithSubscriptionFragment
} from '@/utils/__generated__/graphql';
import { nhost } from '@/utils/nhost';

type PricingProps = {
  plans: PlanFragment[];
  userWithSubscription: UserWithSubscriptionFragment | null | undefined;
};

export default function Pricing({ plans, userWithSubscription }: PricingProps) {
  const router = useRouter();
  const [priceIdLoading, setPriceIdLoading] = useState<string>();

  const handleCheckout = async (priceId: string, isSubscribed: boolean) => {
    setPriceIdLoading(priceId);

    const hasActiveSubscription =
      userWithSubscription?.profile?.stripeCustomer.subscriptions.data.length;

    if (isSubscribed) {
      return router.push('/account');
    }

    if (hasActiveSubscription) {
      setPriceIdLoading(undefined);
      return alert('You already have an active subscription.');
    }

    try {
      const { res, error } = await nhost.functions.call(
        'custom/create-checkout-session',
        {
          priceId
        }
      );

      if (error) {
        console.log(res);
        console.log(error);
        throw Error(error.message);
      }

      window.location.href = (res as any).data.sessionUrl;
    } catch (error) {
      return alert((error as Error)?.message);
    } finally {
      setPriceIdLoading(undefined);
    }
  };

  if (!plans.length) {
    return (
      <section className="bg-black">
        <div className="max-w-6xl mx-auto py-8 sm:py-24 px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:flex-col sm:align-center"></div>
          <p className="text-6xl font-extrabold text-white sm:text-center sm:text-6xl">
            No subscription pricing plans found.
          </p>
        </div>
      </section>
    );
  }

  if (!userWithSubscription) {
    return <div>no user with subscription</div>;
  }

  return (
    <section className="bg-black">
      <div className="max-w-6xl mx-auto py-8 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Pricing Plans
          </h1>
          <p className="mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl max-w-2xl m-auto">
            Start building for free, then add a site plan to go live. Account
            plans unlock additional features.
          </p>
        </div>
        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-4">
          {plans.map((plan) => {
            // check if the user is subscribed to this product
            const isSubscribed =
              userWithSubscription.profile?.stripeCustomer.subscriptions.data.some(
                (subscription) => {
                  return subscription.items.data.some((item) => {
                    return item.price.id === plan.stripePriceId;
                  });
                }
              ) || false;

            const priceString = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: plan.currency,
              minimumFractionDigits: 0
            }).format(plan.amount / 100);
            return (
              <div
                key={plan.id}
                className={cn(
                  'rounded-lg shadow-sm divide-y divide-zinc-600 bg-zinc-900',
                  {
                    'border border-pink-500': isSubscribed
                  }
                )}
              >
                <div className="p-6">
                  <h2 className="text-2xl leading-6 font-semibold text-white">
                    {plan.name}
                  </h2>
                  <p className="mt-4 text-zinc-300">{plan.description}</p>
                  <p className="mt-8">
                    <span className="text-5xl font-extrabold white">
                      {priceString}
                    </span>
                    <span className="text-base font-medium text-zinc-100">
                      /mo
                    </span>
                  </p>
                  <Button
                    variant="slim"
                    type="button"
                    disabled={priceIdLoading !== undefined}
                    loading={plan.stripePriceId === priceIdLoading}
                    onClick={() =>
                      handleCheckout(plan.stripePriceId, isSubscribed)
                    }
                    className="mt-8 block w-full rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-zinc-900"
                  >
                    {isSubscribed ? 'Manage' : 'Subscribe'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        <div>
          <p className="mt-24 text-xs uppercase text-zinc-400 text-center font-bold tracking-[0.3em]">
            Brought to you by
          </p>
          <div className="items-center my-12 space-y-4 sm:mt-8 sm:space-y-0 md:mx-auto md:max-w-2xl grid gap-6 grid-cols-5">
            <a
              href="https://nextjs.org"
              aria-label="Next.js Link"
              className="col-start-2"
            >
              <img
                src="/nextjs.svg"
                alt="Next.js Logo"
                className="h-12 text-white"
              />
            </a>
            <a href="https://stripe.com" aria-label="stripe.com Link">
              <img
                src="/stripe.svg"
                alt="stripe.com Logo"
                className="h-12 text-white"
              />
            </a>
            <a href="https://nhost.io" aria-label="nhost.io Link">
              <img
                src="/nhost.svg"
                alt="nhost.io Logo"
                className="h-10 text-white"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
