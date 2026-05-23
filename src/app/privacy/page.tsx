export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-6 px-6 py-24 text-muted-foreground">
      <h1 className="text-3xl font-semibold text-foreground">Privacy Policy</h1>
      <p className="lead text-muted-foreground">
        SubSpy is built on transparency. We process only what we need to detect
        subscription renewals and send alerts.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>Your email address (for authentication and alerts)</li>
        <li>Forwarded receipt emails (parsed for subscription data)</li>
        <li>Subscription metadata: service name, amount, cycle, renewal date</li>
      </ul>

      <h2>What we do not collect</h2>
      <ul>
        <li>Bank or credit card access</li>
        <li>Full financial account data</li>
        <li>Location tracking beyond standard server logs</li>
      </ul>

      <h2>Email retention</h2>
      <p>
        Raw forwarded emails are automatically deleted after 30 days. Parsed
        subscription data is retained while your account is active.
      </p>

      <h2>Third parties</h2>
      <p>
        We use Supabase (database/auth), OpenAI (receipt parsing), Resend
        (alert emails), Polar (billing), and Cloudflare (email intake). Each
        provider processes data according to their own policies.
      </p>

      <h2>Contact</h2>
      <p>Questions: privacy@subspy.app</p>
    </article>
  );
}
