import { CalendarClock, DollarSign, TrendingUp } from "lucide-react";

const MOCK_SUBS = [
  {
    name: "Netflix",
    amount: "$15.49",
    cycle: "monthly",
    renews: "Jun 23",
    accent: "bg-red-500/80",
  },
  {
    name: "Supabase",
    amount: "$25",
    cycle: "monthly",
    renews: "Jun 23",
    accent: "bg-emerald-500/80",
  },
  {
    name: "Notion",
    amount: "$10",
    cycle: "monthly",
    renews: "Jul 2",
    accent: "bg-zinc-400/80",
  },
];

export function DashboardMockup() {
  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
      <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-primary/20 blur-2xl" />
      <div className="glass-card glow-teal relative overflow-hidden rounded-2xl p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between border-b border-border/60 pb-3">
          <span className="text-sm font-medium text-foreground">Dashboard</span>
          <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-medium text-primary">
            Live preview
          </span>
        </div>

        <div className="mb-4 grid grid-cols-3 gap-2">
          <MiniStat
            icon={DollarSign}
            label="Monthly"
            value="$50.49"
            highlight
          />
          <MiniStat icon={TrendingUp} label="Yearly" value="$606" />
          <MiniStat icon={CalendarClock} label="Active" value="3" />
        </div>

        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Subscriptions
        </p>
        <ul className="space-y-2">
          {MOCK_SUBS.map((sub) => (
            <li
              key={sub.name}
              className="flex items-center gap-3 rounded-lg border border-border/50 bg-background/40 px-3 py-2.5"
            >
              <span
                className={`h-8 w-1 shrink-0 rounded-full ${sub.accent}`}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{sub.name}</p>
                <p className="text-xs text-muted-foreground">
                  {sub.amount} / {sub.cycle}
                </p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">
                {sub.renews}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-center gap-2 rounded-lg border border-amber-500/25 bg-amber-500/10 px-3 py-2">
          <span className="h-2 w-2 shrink-0 rounded-full bg-amber-400" />
          <p className="text-xs text-amber-100/90">
            Netflix renews in 3 days — $15.49
          </p>
        </div>
      </div>
    </div>
  );
}

function MiniStat({
  icon: Icon,
  label,
  value,
  highlight = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border px-2 py-2 ${
        highlight
          ? "border-primary/30 bg-primary/10"
          : "border-border/50 bg-background/30"
      }`}
    >
      <Icon
        className={`mb-1 h-3.5 w-3.5 ${
          highlight ? "text-primary" : "text-muted-foreground"
        }`}
      />
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p
        className={`text-sm font-semibold ${
          highlight ? "text-primary" : "text-foreground"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
