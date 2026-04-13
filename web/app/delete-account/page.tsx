'use client';

import { useState } from 'react';

export default function DeleteAccount() {
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus('sending');
    setErrorMsg('');
    try {
      const res = await fetch('/api/delete-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, reason }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Request failed');
      }
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  return (
    <div className="legal">
      <a href="/" className="logo" style={{ display: 'block', marginBottom: 40 }}>
        fieldsong
      </a>
      <h1>Delete your account</h1>
      <p className="updated">FieldSong account &amp; data deletion</p>

      <p>
        The fastest way to delete your account is from inside the app:{' '}
        <strong>Profile &gt; Delete account</strong>. That removes your account
        and all associated data immediately.
      </p>

      <p>
        If you can&rsquo;t access the app, submit the form below and we&rsquo;ll
        process your request within 30 days. You&rsquo;ll receive a
        confirmation email once deletion is complete.
      </p>

      <h2>What gets deleted</h2>
      <ul>
        <li>Your account and login credentials</li>
        <li>Your profile (name, intentions, timezone, email preferences)</li>
        <li>All journal reflections and daily entries</li>
        <li>All bookmarked verses</li>
        <li>Your verse history and practice streak</li>
        <li>Push notification tokens</li>
      </ul>

      <h2>What we retain</h2>
      <ul>
        <li>
          Anonymized, aggregated usage statistics that cannot be linked back
          to you
        </li>
        <li>
          Records required for legal, tax, or fraud-prevention purposes (if
          any apply to your account)
        </li>
      </ul>

      <h2>Request deletion</h2>

      {status === 'success' ? (
        <p style={{ color: '#81c784' }}>
          Thanks. We&rsquo;ve received your request and will process it within
          30 days. Check your inbox for a confirmation.
        </p>
      ) : (
        <form onSubmit={onSubmit} style={{ marginTop: 16 }}>
          <div style={{ marginBottom: 16 }}>
            <label
              htmlFor="email"
              style={{
                display: 'block',
                fontSize: 13,
                color: 'var(--text-secondary)',
                marginBottom: 6,
              }}
            >
              Account email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                width: '100%',
                maxWidth: 400,
                background: 'var(--surface-low)',
                border: '1px solid var(--outline)',
                borderRadius: 12,
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-sans)',
                fontSize: 15,
                padding: '12px 16px',
                outline: 'none',
              }}
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label
              htmlFor="reason"
              style={{
                display: 'block',
                fontSize: 13,
                color: 'var(--text-secondary)',
                marginBottom: 6,
              }}
            >
              Reason (optional)
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              style={{
                width: '100%',
                maxWidth: 400,
                background: 'var(--surface-low)',
                border: '1px solid var(--outline)',
                borderRadius: 12,
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-sans)',
                fontSize: 15,
                padding: '12px 16px',
                outline: 'none',
                resize: 'vertical',
              }}
            />
          </div>
          <button
            type="submit"
            disabled={status === 'sending'}
            style={{
              background: 'var(--surface-high)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-sans)',
              fontWeight: 600,
              fontSize: 14,
              padding: '12px 24px',
              borderRadius: 12,
              border: 'none',
              cursor: status === 'sending' ? 'not-allowed' : 'pointer',
              opacity: status === 'sending' ? 0.6 : 1,
            }}
          >
            {status === 'sending' ? 'Sending...' : 'Request deletion'}
          </button>
          {status === 'error' && (
            <p style={{ color: '#cf6679', fontSize: 14, marginTop: 12 }}>
              {errorMsg}
            </p>
          )}
        </form>
      )}

      <h2 style={{ marginTop: 48 }}>Questions?</h2>
      <p>
        Email us at{' '}
        <a href="mailto:hello@fieldsong.app">hello@fieldsong.app</a>.
      </p>
    </div>
  );
}
