CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE "public"."profiles" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "stripe_customer_id" text,
  PRIMARY KEY ("id"),
  FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON UPDATE RESTRICT ON DELETE CASCADE
);
