import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = 'FieldSong <noreply@fieldsong.app>';
const TO_EMAIL = 'hello@fieldsong.app';

export async function POST(req: Request) {
  if (!RESEND_API_KEY) {
    return NextResponse.json(
      { error: 'Server not configured' },
      { status: 500 },
    );
  }

  let body: { email?: string; reason?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const email = (body.email || '').trim();
  const reason = (body.reason || '').trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: 'Valid email required' },
      { status: 400 },
    );
  }
  if (email.length > 254 || reason.length > 2000) {
    return NextResponse.json({ error: 'Input too long' }, { status: 400 });
  }

  const escape = (s: string) =>
    s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  const html = `
    <h2>Account deletion request</h2>
    <p><strong>Email:</strong> ${escape(email)}</p>
    <p><strong>Reason:</strong></p>
    <pre style="white-space:pre-wrap;font-family:inherit">${
      reason ? escape(reason) : '(not provided)'
    }</pre>
    <p>Submitted at ${new Date().toISOString()} via fieldsong.app/delete-account</p>
  `;

  const confirmationHtml = `
    <p>Hi,</p>
    <p>We&rsquo;ve received your request to delete your FieldSong account. We&rsquo;ll process it within 30 days and send you a confirmation when complete.</p>
    <p>If you didn&rsquo;t make this request, reply to this email and we&rsquo;ll cancel it.</p>
    <p>&mdash; FieldSong</p>
  `;

  try {
    // Notify ops
    const opsRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: TO_EMAIL,
        subject: `Account deletion request: ${email}`,
        html,
        reply_to: email,
      }),
    });
    if (!opsRes.ok) {
      const err = await opsRes.text();
      console.error('Resend ops email failed', opsRes.status, err);
      return NextResponse.json(
        { error: 'Could not send request' },
        { status: 502 },
      );
    }

    // Confirm to user (best-effort; don't fail request if this errors)
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: email,
        subject: 'FieldSong: deletion request received',
        html: confirmationHtml,
      }),
    }).catch((e) => console.warn('Confirmation email failed', e));

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('delete-account route error', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
