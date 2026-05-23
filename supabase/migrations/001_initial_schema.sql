-- SubSpy initial schema

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  forward_alias text unique not null,
  plan text not null default 'free' check (plan in ('free', 'pro', 'lifetime')),
  telegram_chat_id text,
  created_at timestamptz not null default now()
);

create table public.email_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  raw text not null,
  parse_status text not null default 'pending',
  parsed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  service text not null,
  amount numeric not null,
  currency text not null default 'USD',
  cycle text not null,
  status text not null default 'active',
  next_renewal date,
  source_email_id uuid references public.email_logs(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.alerts_sent (
  id uuid primary key default gen_random_uuid(),
  subscription_id uuid not null references public.subscriptions(id) on delete cascade,
  channel text not null,
  sent_at timestamptz not null default now()
);

create index subscriptions_user_id_idx on public.subscriptions(user_id);
create index subscriptions_next_renewal_idx on public.subscriptions(next_renewal);
create index email_logs_user_id_idx on public.email_logs(user_id);
create index profiles_forward_alias_idx on public.profiles(forward_alias);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger subscriptions_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();

-- RLS
alter table public.profiles enable row level security;
alter table public.email_logs enable row level security;
alter table public.subscriptions enable row level security;
alter table public.alerts_sent enable row level security;

create policy "Users read own profile"
  on public.profiles for select
  using (id = auth.uid());

create policy "Users update own profile"
  on public.profiles for update
  using (id = auth.uid());

create policy "Users read own email logs"
  on public.email_logs for select
  using (user_id = auth.uid());

create policy "Users read own subscriptions"
  on public.subscriptions for select
  using (user_id = auth.uid());

create policy "Users read own alerts"
  on public.alerts_sent for select
  using (
    subscription_id in (
      select id from public.subscriptions where user_id = auth.uid()
    )
  );

-- Service role handles inserts/updates from workers

-- Auto-create profile on signup
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

  insert into public.profiles (id, email, forward_alias)
  values (new.id, new.email, alias);

  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Cleanup old email logs (30 days)
create or replace function public.cleanup_old_email_logs()
returns void as $$
begin
  delete from public.email_logs
  where created_at < now() - interval '30 days';
end;
$$ language plpgsql security definer set search_path = public;
