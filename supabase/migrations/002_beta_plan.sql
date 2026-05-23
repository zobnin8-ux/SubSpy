-- Beta MVP: default plan and allow beta value

alter table public.profiles
  drop constraint if exists profiles_plan_check;

alter table public.profiles
  add constraint profiles_plan_check
  check (plan in ('free', 'beta', 'pro', 'lifetime'));

alter table public.profiles
  alter column plan set default 'beta';

-- New signups get beta plan
create or replace function public.handle_new_user()
returns trigger as $$
declare
  alias text;
  alias_exists boolean;
begin
  loop
    alias := lower(substr(md5(random()::text || clock_timestamp()::text), 1, 5));
    select exists(select 1 from public.profiles where forward_alias = alias) into alias_exists;
    exit when not alias_exists;
  end loop;

  insert into public.profiles (id, email, forward_alias, plan)
  values (new.id, new.email, alias, 'beta');

  return new;
end;
$$ language plpgsql security definer set search_path = public;
