'use client';

import { useState } from 'react';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rgbzqnbegozpcgdnfxfy.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export default function Unsubscribe() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles?email=eq.${encodeURIComponent(email)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({ emails_paused: true }),
      });

      if (res.ok) {
        setStatus('success');
        setMessage('Done. Your daily verse emails have been paused. You can re-enable them anytime from the app.');
      } else {
        setStatus('error');
        setMessage('Something went wrong. Please try again or email hello@fieldsong.app.');
      }
    } catch {
      setStatus('error');
      setMessage('Could not connect. Please try again or email hello@fieldsong.app.');
    }
  };

  return (
    <div className="unsub-page">
      <a href="/" className="logo" style={{ display: 'block', marginBottom: 40 }}>
        fieldsong
      </a>
      <h1>Unsubscribe</h1>
      <p>
        Enter your email to pause daily verse emails. You can re-enable them
        anytime from the app.
      </p>

      {status === 'success' ? (
        <p className="unsub-status success">{message}</p>
      ) : (
        <form onSubmit={handleUnsubscribe}>
          <div className="unsub-input">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="unsub-button"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Pausing...' : 'Unsubscribe'}
            </button>
          </div>
          {status === 'error' && (
            <p className="unsub-status error">{message}</p>
          )}
        </form>
      )}
    </div>
  );
}
