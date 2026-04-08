// Edge Function: send-daily-verse
// Sends the daily clarity ritual email to users whose preferred_send_time
// falls within the current 15-minute window.
//
// Triggered by: Supabase pg_cron (every 15 minutes) or manual invocation
// Env: RESEND_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const FROM_EMAIL = "FieldSong <verse@fieldsong.app>";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

interface Verse {
  id: number;
  chapter: number;
  verse_number: number;
  sanskrit_line: string;
  translation: string;
  modern_interpretation: string;
  stoic_parallel_quote: string;
  stoic_parallel_source: string;
  stoic_bridge: string;
  action_step: string;
  reflection_prompt: string;
}

function buildPreheader(verse: Verse): string {
  // First ~90 chars visible in inbox preview
  const text = verse.modern_interpretation;
  const truncated = text.length > 90 ? text.slice(0, 87) + "..." : text;
  return truncated;
}

function buildEmailHtml(verse: Verse, dayCount: number): string {
  const preheader = buildPreheader(verse);
  // Shared inline style fragments
  const sans = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";
  const serif = "Georgia, 'Times New Roman', Times, serif";

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  <title>Your daily verse from FieldSong</title>
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
  <style>
    body, table, td { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; }
    body { margin: 0 !important; padding: 0 !important; width: 100% !important; }
    a { color: #D4AF37; text-decoration: none; }
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; }
      .fluid { max-width: 100% !important; height: auto !important; }
    }
    :root { color-scheme: dark; supported-color-schemes: dark; }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#0E0E0E; font-family:${serif};">
  <!-- Preheader (hidden inbox preview text) -->
  <div style="display:none; font-size:1px; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden; mso-hide:all;">
    ${preheader}${"&#847; &zwnj; &nbsp; ".repeat(20)}
  </div>

  <!-- Outer wrapper: full-width dark background -->
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#0E0E0E;" bgcolor="#0E0E0E">
    <tr>
      <td align="center" valign="top" style="padding:0;">

        <!-- Inner container: max 560px -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="560" class="email-container" style="max-width:560px; background-color:#131313;" bgcolor="#131313">

          <!-- Brand header -->
          <tr>
            <td align="center" style="padding:40px 24px 8px;">
              <span style="font-family:${serif}; font-style:italic; font-size:22px; color:#D4AF37;">fieldsong</span>
            </td>
          </tr>

          <!-- Day label -->
          <tr>
            <td style="padding:16px 24px 24px; font-family:${sans}; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#D4AF37;">
              DAY ${dayCount} OF YOUR CLARITY PRACTICE
            </td>
          </tr>

          <!-- Sanskrit -->
          <tr>
            <td style="padding:0 24px 16px; font-family:${serif}; font-style:italic; font-size:15px; line-height:24px; color:#8A847A;">
              ${verse.sanskrit_line}
            </td>
          </tr>

          <!-- Translation -->
          <tr>
            <td style="padding:0 24px 8px; font-family:${serif}; font-size:21px; line-height:32px; color:#E8E2D6;">
              &ldquo;${verse.translation}&rdquo;
            </td>
          </tr>

          <!-- Verse reference -->
          <tr>
            <td style="padding:4px 24px 32px; font-family:${sans}; font-size:11px; letter-spacing:1px; text-transform:uppercase; color:#8A847A;">
              BHAGAVAD GITA ${verse.chapter}.${verse.verse_number}
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 24px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr><td style="border-top:1px solid #2A2A2A; font-size:1px; line-height:1px;">&nbsp;</td></tr>
              </table>
            </td>
          </tr>

          <!-- IN PLAIN TERMS label -->
          <tr>
            <td style="padding:28px 24px 10px; font-family:${sans}; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#D4AF37;">
              IN PLAIN TERMS
            </td>
          </tr>

          <!-- Interpretation -->
          <tr>
            <td style="padding:0 24px 28px; font-family:${sans}; font-size:15px; line-height:26px; color:#D0CABD;">
              ${verse.modern_interpretation}
            </td>
          </tr>

          <!-- STOIC PARALLEL label -->
          <tr>
            <td style="padding:0 24px 12px; font-family:${sans}; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#D4AF37;">
              STOIC PARALLEL
            </td>
          </tr>

          <!-- Stoic card -->
          <tr>
            <td style="padding:0 24px 28px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#1C1B1B; border-radius:12px;" bgcolor="#1C1B1B">
                <tr>
                  <td style="padding:20px 20px 8px; font-family:${serif}; font-style:italic; font-size:17px; line-height:27px; color:#E8E2D6;">
                    &ldquo;${verse.stoic_parallel_quote}&rdquo;
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 20px 14px; font-family:${sans}; font-size:11px; letter-spacing:0.5px; color:#8A847A;">
                    ${verse.stoic_parallel_source}
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 20px 20px; font-family:${sans}; font-size:14px; line-height:22px; color:#8A847A;">
                    ${verse.stoic_bridge}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 24px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr><td style="border-top:1px solid #2A2A2A; font-size:1px; line-height:1px;">&nbsp;</td></tr>
              </table>
            </td>
          </tr>

          <!-- TRY THIS TODAY label -->
          <tr>
            <td style="padding:28px 24px 10px; font-family:${sans}; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#D4AF37;">
              TRY THIS TODAY
            </td>
          </tr>

          <!-- Action step -->
          <tr>
            <td style="padding:0 24px 28px; font-family:${sans}; font-size:16px; line-height:26px; color:#E8E2D6; font-weight:600;">
              ${verse.action_step}
            </td>
          </tr>

          <!-- REFLECT label -->
          <tr>
            <td style="padding:0 24px 10px; font-family:${sans}; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#D4AF37;">
              REFLECT
            </td>
          </tr>

          <!-- Reflection prompt -->
          <tr>
            <td style="padding:0 24px 12px; font-family:${sans}; font-size:15px; line-height:25px; color:#D0CABD;">
              ${verse.reflection_prompt}
            </td>
          </tr>

          <!-- Reply CTA -->
          <tr>
            <td style="padding:24px 24px 0;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr><td style="border-top:1px solid #2A2A2A; font-size:1px; line-height:1px;">&nbsp;</td></tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:20px 24px 32px; font-family:${sans}; font-size:13px; line-height:20px; color:#8A847A;">
              Reply to this email to save your reflection as today&rsquo;s journal entry.
            </td>
          </tr>

          <!-- Footer divider -->
          <tr>
            <td style="padding:0 24px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr><td style="border-top:1px solid #2A2A2A; font-size:1px; line-height:1px;">&nbsp;</td></tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:24px 24px 12px; font-family:${serif}; font-style:italic; font-size:14px; color:#6B6560;">
              fieldsong
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:0 24px 8px; font-family:${sans}; font-size:11px; line-height:18px; color:#4A4540;">
              Ancient clarity for modern decisions.<br>
              <a href="https://fieldsong.app" style="color:#D4AF37; text-decoration:none;">fieldsong.app</a>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:0 24px 40px; font-family:${sans}; font-size:11px; line-height:18px; color:#4A4540;">
              <a href="https://fieldsong.app/unsubscribe" style="color:#4A4540; text-decoration:underline;">Unsubscribe</a>
            </td>
          </tr>

        </table>
        <!-- /Inner container -->

      </td>
    </tr>
  </table>
  <!-- /Outer wrapper -->
</body>
</html>`;
}

function buildSubject(verse: Verse, dayCount: number): string {
  const subjects = [
    `Day ${dayCount}: Your clarity practice`,
    `A verse for today`,
    `Your daily verse is here`,
    `Day ${dayCount} — pause and read this`,
  ];
  return subjects[Math.floor(Math.random() * subjects.length)];
}

Deno.serve(async (req: Request) => {
  try {
    // Find users whose send time is within the current 15-minute window
    const now = new Date();
    const currentHour = now.getUTCHours();
    const currentMinute = now.getUTCMinutes();
    const windowStart = `${currentHour.toString().padStart(2, "0")}:${(Math.floor(currentMinute / 15) * 15).toString().padStart(2, "0")}:00`;
    const windowEnd = `${currentHour.toString().padStart(2, "0")}:${(Math.floor(currentMinute / 15) * 15 + 14).toString().padStart(2, "0")}:59`;

    // For manual trigger, allow sending to a specific user
    let targetUserId: string | null = null;
    if (req.method === "POST") {
      try {
        const body = await req.json();
        targetUserId = body.user_id ?? null;
      } catch { /* no body, that's fine */ }
    }

    let usersQuery = supabase
      .from("profiles")
      .select("id, email, preferred_send_time, practice_day_count, onboarding_intents, timezone, emails_paused")
      .not("email", "is", null);

    if (targetUserId) {
      usersQuery = usersQuery.eq("id", targetUserId);
    } else {
      usersQuery = usersQuery
        .gte("preferred_send_time", windowStart)
        .lte("preferred_send_time", windowEnd);
    }

    // Only send to users who have completed onboarding
    const { data: users, error: usersError } = await usersQuery;

    if (usersError) {
      return new Response(JSON.stringify({ error: usersError.message }), { status: 500 });
    }

    if (!users || users.length === 0) {
      return new Response(JSON.stringify({ message: "No users in current send window", window: { windowStart, windowEnd } }), { status: 200 });
    }

    const results = [];

    for (const user of users) {
      if (!user.email || !user.onboarding_intents?.length) continue;

      // Skip users who have paused emails
      if (user.emails_paused) {
        results.push({ user_id: user.id, status: "paused" });
        continue;
      }

      // Get today's verse for this user
      const intent = user.onboarding_intents[0];
      const today = new Date().toISOString().split("T")[0];

      // Check if already sent today
      const { data: existingEntry } = await supabase
        .from("daily_entries")
        .select("id, verse_id")
        .eq("user_id", user.id)
        .gte("created_at", today)
        .not("source_channel", "is", null)
        .limit(1)
        .maybeSingle();

      if (existingEntry) {
        results.push({ user_id: user.id, status: "already_sent" });
        continue;
      }

      // Get next verse
      const { data: verseData } = await supabase.rpc("get_next_verse", {
        p_user_id: user.id,
        p_intent: intent,
      });

      if (!verseData || verseData.length === 0) {
        results.push({ user_id: user.id, status: "no_verse_available" });
        continue;
      }

      const verse: Verse = verseData[0];
      const dayCount = Math.max(user.practice_day_count ?? 0, 1);

      // Send email via Resend
      const emailRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: user.email,
          subject: buildSubject(verse, dayCount),
          html: buildEmailHtml(verse, dayCount),
          reply_to: `journal+${user.id}@fieldsong.app`,
        }),
      });

      const emailResult = await emailRes.json();

      if (emailRes.ok) {
        // Record the entry
        await supabase.from("daily_entries").insert({
          user_id: user.id,
          verse_id: verse.id,
          intent_selected: intent,
          source_channel: "email",
        });

        // Record in verse history
        await supabase.from("verse_history").upsert(
          { user_id: user.id, verse_id: verse.id },
          { onConflict: "user_id,verse_id" }
        );

        // Increment practice day count
        await supabase
          .from("profiles")
          .update({ practice_day_count: dayCount + 1 })
          .eq("id", user.id);

        results.push({ user_id: user.id, status: "sent", email_id: emailResult.id });
      } else {
        results.push({ user_id: user.id, status: "failed", error: emailResult });
      }
    }

    return new Response(JSON.stringify({ sent: results.length, results }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
