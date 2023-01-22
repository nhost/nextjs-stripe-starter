ALTER TABLE
  public.profiles
ADD
  plan_id uuid;

ALTER TABLE
  public.profiles
ADD
  CONSTRAINT profiles_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES public.products (id) ON UPDATE RESTRICT ON DELETE RESTRICT;