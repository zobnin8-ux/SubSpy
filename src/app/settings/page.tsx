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
import { planLabel } from "@/lib/access";
import { requireProfile } from "@/lib/profile";
import { FORWARD_DOMAIN, GMAIL_FILTER } from "@/lib/utils";

export default async function SettingsPage() {
  const profile = await requireProfile();
  const forwardAddress = `${profile.forward_alias}@${FORWARD_DOMAIN}`;

  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-2 text-muted-foreground">
          Set up email forwarding and notification preferences.
        </p>
      </div>

      <div className="space-y-6">
        <Card className="border-border/60 bg-card/50">
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Your beta account details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">Email: </span>
              {profile.email}
            </p>
            <p>
              <span className="text-muted-foreground">Status: </span>
              {planLabel(profile.plan)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/30 bg-card/80">
          <CardHeader>
            <CardTitle>Test receipt (beta)</CardTitle>
            <CardDescription>
              Email forwarding needs a domain later. For now, paste a receipt
              here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ReceiptTester />
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/50">
          <CardHeader>
            <CardTitle>Forwarding alias</CardTitle>
            <CardDescription>
              Works when you connect domain {FORWARD_DOMAIN}. Save this for
              later.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CopyButton value={forwardAddress} label="Copy forwarding address" />
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/50">
          <CardHeader>
            <CardTitle>Gmail setup</CardTitle>
            <CardDescription>
              Available after you connect domain {FORWARD_DOMAIN}.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="mb-2 font-medium">1. Create a filter with this search:</p>
              <CopyButton value={GMAIL_FILTER} label="Copy Gmail filter" />
            </div>
            <div>
              <p className="mb-2 font-medium">2. Forward matching emails to:</p>
              <CopyButton value={forwardAddress} label="Copy forward address" />
            </div>
            <p className="text-muted-foreground">
              3. Confirm the forwarding address in Gmail when prompted.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/50">
          <CardHeader>
            <CardTitle>Telegram alerts</CardTitle>
            <CardDescription>
              Optional renewal alerts via Telegram during beta.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TelegramConnect
              chatId={profile.telegram_chat_id}
              plan={profile.plan}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
