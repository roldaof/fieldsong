export default function Privacy() {
  return (
    <div className="legal">
      <a href="/" className="logo" style={{ display: 'block', marginBottom: 40 }}>
        fieldsong
      </a>
      <h1>Privacy Policy</h1>
      <p className="updated">Last updated: April 10, 2026</p>

      <p>
        FieldSong (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;)
        operates the FieldSong mobile application and fieldsong.app website.
        This policy describes how we collect, use, and protect your information.
      </p>

      <h2>Information We Collect</h2>
      <p><strong>Account information:</strong> When you create an account, we collect your email address and password (stored securely via Supabase Auth).</p>
      <p><strong>Practice data:</strong> Your selected intentions, journal reflections, bookmarked verses, and daily practice history.</p>
      <p><strong>Device information:</strong> Push notification tokens (if you enable notifications), timezone, and app version.</p>
      <p><strong>Payment information:</strong> Subscription purchases are processed by Google Play or Apple. We do not store your payment details. We receive subscription status information from RevenueCat.</p>

      <h2>How We Use Your Information</h2>
      <ul>
        <li>To deliver your daily verse based on your chosen intentions</li>
        <li>To send daily verse emails at your preferred time</li>
        <li>To save and display your journal reflections and bookmarks</li>
        <li>To manage your subscription status</li>
        <li>To send push notifications (if enabled)</li>
        <li>To monitor app stability and fix crashes (via Sentry)</li>
      </ul>

      <h2>Data Storage</h2>
      <p>
        Your data is stored on Supabase (hosted on AWS) with row-level security
        enabled. Each user can only access their own data. Data is encrypted in
        transit via TLS.
      </p>

      <h2>Third-Party Services</h2>
      <ul>
        <li><strong>Supabase</strong> — authentication and database hosting</li>
        <li><strong>RevenueCat</strong> — subscription management</li>
        <li><strong>Sentry</strong> — crash reporting and error tracking</li>
        <li><strong>Resend</strong> — daily verse email delivery</li>
        <li><strong>Google Play / Apple</strong> — payment processing</li>
      </ul>

      <h2>Email Communications</h2>
      <p>
        We send daily verse emails to the address associated with your account.
        You can pause emails from the Profile screen in the app or unsubscribe
        at <a href="/unsubscribe">fieldsong.app/unsubscribe</a>.
      </p>

      <h2>Data Retention</h2>
      <p>
        We retain your data for as long as your account is active. When you
        delete your account (available in Profile &gt; Delete account), all
        your data is permanently removed from our servers.
      </p>

      <h2>Your Rights</h2>
      <p>You have the right to:</p>
      <ul>
        <li>Access your personal data</li>
        <li>Correct inaccurate data</li>
        <li>Delete your account and all associated data</li>
        <li>Export your data (contact us at the email below)</li>
        <li>Opt out of email communications</li>
      </ul>

      <h2>Children&rsquo;s Privacy</h2>
      <p>
        FieldSong is not intended for children under 13. We do not knowingly
        collect information from children under 13.
      </p>

      <h2>Changes to This Policy</h2>
      <p>
        We may update this policy from time to time. We will notify you of
        material changes by email or in-app notification.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy? Email us at{' '}
        <a href="mailto:hello@fieldsong.app">hello@fieldsong.app</a>.
      </p>
    </div>
  );
}
