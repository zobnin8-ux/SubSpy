export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-6 px-6 py-24 text-muted-foreground">
      <h1 className="text-3xl font-semibold text-foreground">Terms of Service</h1>
      <p className="lead text-muted-foreground">
        By using SubSpy, you agree to these terms.
      </p>

      <h2>Service</h2>
      <p>
        SubSpy detects recurring subscriptions from forwarded email receipts
        and sends renewal alerts. The service is provided as-is during MVP.
      </p>

      <h2>Your responsibilities</h2>
      <ul>
        <li>Forward only emails you have the right to share</li>
        <li>Keep your account credentials secure</li>
        <li>Use the service for personal subscription tracking</li>
      </ul>

      <h2>Beta access</h2>
      <p>
        SubSpy is currently offered as a free private beta. Paid plans may be
        introduced later. No payment is required during the beta phase.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        SubSpy provides alerts based on parsed receipt data. We are not
        responsible for missed renewals, incorrect parsing, or financial
        decisions you make based on alerts.
      </p>

      <h2>Contact</h2>
      <p>Questions: legal@subspy.app</p>
    </article>
  );
}
