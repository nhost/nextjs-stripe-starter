-- update the price_id with the price id from stripe
-- amount is in cents
INSERT INTO
  public.plans (name, stripe_price_id, amount, currency, description)
VALUES
  (
    'Hobby',
    'price_1M82BOCCF9wuB4fX3BplVWB9',
    1200,
    'USD',
    'Hobby Description'
  ),
  (
    'Startup',
    'price_1M82BuCCF9wuB4fXhdtUU6Pk',
    2400,
    'USD',
    'Startup Description'
  ),
  (
    'Pro',
    'price_1M82CACCF9wuB4fXZ019vYFb',
    3200,
    'USD',
    'Pro Description'
  ),
  (
    'Enterprise',
    'price_1M82CTCCF9wuB4fXA9Sg5jyT',
    4800,
    'USD',
    'Enterprise Description'
  );