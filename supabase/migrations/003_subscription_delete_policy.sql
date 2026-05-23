create policy "Users delete own subscriptions"
  on public.subscriptions for delete
  using (user_id = auth.uid());
