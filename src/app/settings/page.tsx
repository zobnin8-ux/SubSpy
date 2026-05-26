import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CopyButton } from "@/components/copy-button";
import { ReceiptTester } from "@/components/receipt-tester";
import { TelegramConnect } from "@/components/telegram-connect";
import { fmt, planLabel } from "@/lib/i18n";
import { getServerT } from "@/lib/i18n/server";
import { requireProfile } from "@/lib/profile";
import { FORWARD_DOMAIN, GMAIL_FILTER } from "@/lib/utils";
import type { UserPlan } from "@/lib/types";

export default async function SettingsPage() {
  const { t } = await getServerT();
  const s = t.settings;
  const profile = await requireProfile();
  const forwardAddress = `${profile.forward_alias}@${FORWARD_DOMAIN}`;

  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">{s.title}</h1>
        <p className="mt-2 text-muted-foreground">{s.subtitle}</p>
      </div>

      <div className="space-y-6">
        <Card className="glass-card border-border/60">
          <CardHeader>
            <CardTitle>{s.account}</CardTitle>
            <CardDescription>{s.accountSub}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">{s.emailLabel} </span>
              {profile.email}
            </p>
            <p>
              <span className="text-muted-foreground">{s.statusLabel} </span>
              {planLabel(profile.plan as keyof typeof t.plan, t)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/30 bg-card/80">
          <CardHeader>
            <CardTitle>{s.testReceipt}</CardTitle>
            <CardDescription>{s.testReceiptSub}</CardDescription>
          </CardHeader>
          <CardContent>
            <ReceiptTester />
          </CardContent>
        </Card>

        <Card className="glass-card border-border/60">
          <CardHeader>
            <CardTitle>{s.forwardingAlias}</CardTitle>
            <CardDescription>
              {fmt(s.forwardingAliasSub, { domain: FORWARD_DOMAIN })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CopyButton value={forwardAddress} label={s.copyForwarding} />
          </CardContent>
        </Card>

        <Card className="glass-card border-border/60">
          <CardHeader>
            <CardTitle>{s.gmailSetup}</CardTitle>
            <CardDescription>
              {fmt(s.gmailSetupSub, { domain: FORWARD_DOMAIN })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="mb-2 font-medium">{s.gmailStep1}</p>
              <CopyButton value={GMAIL_FILTER} label={s.copyGmailFilter} />
            </div>
            <div>
              <p className="mb-2 font-medium">{s.gmailStep2}</p>
              <CopyButton value={forwardAddress} label={s.copyForward} />
            </div>
            <p className="text-muted-foreground">{s.gmailStep3}</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/60">
          <CardHeader>
            <CardTitle>{s.telegram}</CardTitle>
            <CardDescription>{s.telegramSub}</CardDescription>
          </CardHeader>
          <CardContent>
            <TelegramConnect
              chatId={profile.telegram_chat_id}
              plan={profile.plan as UserPlan}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
