import LoadingDots from '@/components/ui/LoadingDots';
import { nhost } from '@/utils/nhost';
import { useGetPlansAndSubscriptionQuery } from '@/utils/__generated__/graphql';
import Pricing from 'components/Pricing';

export default function PricingPage() {
  const user = nhost.auth.getUser();

  const { data, isLoading } = useGetPlansAndSubscriptionQuery({
    userId: user?.id
  });

  if (isLoading) {
    return (
      <div className="mx-auto w-12 my-32">
        <LoadingDots />
      </div>
    );
  }

  if (!data) {
    return <div>Failed to load data</div>;
  }

  const { plans, user: userWithSubscription } = data;

  return <Pricing plans={plans} userWithSubscription={userWithSubscription} />;
}
