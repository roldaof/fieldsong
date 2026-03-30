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

function buildEmailHtml(verse: Verse, dayCount: number): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #131313;
      color: #E8E2D6;
      font-family: Georgia, 'Times New Roman', serif;
    }
    .container {
      max-width: 560px;
      margin: 0 auto;
      padding: 40px 24px;
    }
    .header {
      text-align: center;
      margin-bottom: 32px;
    }
    .brand {
      font-style: italic;
      color: #D4AF37;
      font-size: 20px;
    }
    .day-label {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 11px;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: #D4AF37;
      margin-bottom: 24px;
    }
    .sanskrit {
      font-style: italic;
      color: #A09A8E;
      font-size: 15px;
      line-height: 1.6;
      margin-bottom: 16px;
    }
    .translation {
      font-size: 20px;
      line-height: 1.5;
      color: #E8E2D6;
      margin-bottom: 8px;
    }
    .reference {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 11px;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: #A09A8E;
      margin-bottom: 32px;
    }
    .section-label {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 11px;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: #D4AF37;
      margin-bottom: 12px;
      margin-top: 32px;
    }
    .interpretation {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 15px;
      line-height: 1.7;
      color: #E8E2D6;
    }
    .stoic-card {
      background-color: #1C1B1B;
      border-radius: 12px;
      padding: 20px;
      margin-top: 12px;
    }
    .stoic-quote {
      font-style: italic;
      font-size: 16px;
      line-height: 1.6;
      color: #E8E2D6;
      margin-bottom: 8px;
    }
    .stoic-source {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 11px;
      letter-spacing: 0.5px;
      color: #A09A8E;
      margin-bottom: 16px;
    }
    .stoic-bridge {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 14px;
      line-height: 1.6;
      color: #A09A8E;
    }
    .action-text {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 16px;
      line-height: 1.6;
      color: #E8E2D6;
      font-weight: 600;
    }
    .reflection-text {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 15px;
      line-height: 1.6;
      color: #E8E2D6;
    }
    .reply-prompt {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 13px;
      color: #A09A8E;
      margin-top: 32px;
      padding-top: 20px;
      border-top: 1px solid #2A2A2A;
      text-align: center;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #2A2A2A;
    }
    .footer-brand {
      font-style: italic;
      color: #A09A8E;
      font-size: 14px;
      margin-bottom: 8px;
    }
    .footer-text {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 11px;
      color: #6B6560;
    }
    a { color: #D4AF37; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span class="brand">fieldsong</span>
    </div>
    
    <div class="day-label">DAY ${dayCount} OF YOUR CLARITY PRACTICE</div>
    
    <div class="sanskrit">${verse.sanskrit_line}</div>
    
    <div class="translation">"${verse.translation}"</div>
    
    <div class="reference">BHAGAVAD GITA ${verse.chapter}.${verse.verse_number}</div>
    
    <div class="section-label">IN PLAIN TERMS</div>
    <div class="interpretation">${verse.modern_interpretation}</div>
    
    <div class="section-label">STOIC PARALLEL</div>
    <div class="stoic-card">
      <div class="stoic-quote">"${verse.stoic_parallel_quote}"</div>
      <div class="stoic-source">${verse.stoic_parallel_source}</div>
      <div class="stoic-bridge">${verse.stoic_bridge}</div>
    </div>
    
    <div class="section-label">TRY THIS TODAY</div>
    <div class="action-text">${verse.action_step}</div>
    
    <div class="section-label">REFLECT</div>
    <div class="reflection-text">${verse.reflection_prompt}</div>
    
    <div class="reply-prompt">
      Reply to this email to save your reflection as today's journal entry.
    </div>
    
    <div class="footer">
      <div class="footer-brand">fieldsong</div>
      <div class="footer-text">
        Ancient clarity for modern decisions.<br>
        <a href="https://fieldsong.app">fieldsong.app</a>
      </div>
    </div>
  </div>
</body>
</html>`;
}

function buildSubject(verse: Verse): string {
  // Short, intriguing subject lines
  const subjects = [
    `Gita ${verse.chapter}.${verse.verse_number}`,
    `Today's clarity`,
    `Your morning verse`,
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
      .select("id, email, preferred_send_time, practice_day_count, onboarding_intents, timezone")
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
          subject: buildSubject(verse),
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
