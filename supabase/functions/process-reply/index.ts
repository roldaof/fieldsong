// Edge Function: process-reply
// Handles inbound email replies via Resend webhook.
// When a user replies to their daily verse email, their reply
// is saved as a journal entry for that day.
//
// IMPORTANT: Resend webhooks only send metadata, not the email body.
// We must call the Received Emails API to get the actual text.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function extractUserId(toAddress: string): string | null {
  const match = toAddress.match(/journal\+([a-f0-9-]+)@/i);
  return match ? match[1] : null;
}

function cleanReplyText(text: string): string {
  const lines = text.split("\n");
  const cleanLines: string[] = [];

  for (const line of lines) {
    if (line.startsWith(">")) break;
    if (line.match(/^On .+ wrote:$/)) break;
    if (line.match(/^From:/)) break;
    if (line.match(/^-{3,}/) || line.match(/^_{3,}/)) break;
    if (line.includes("Original Message")) break;
    cleanLines.push(line);
  }

  return cleanLines.join("\n").trim();
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "content-type, svix-id, svix-timestamp, svix-signature",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  try {
    const payload = await req.json();
    console.log("Webhook received:", JSON.stringify(payload).substring(0, 500));

    // Resend webhook format: { type: "email.received", created_at: "...", data: { ... } }
    const eventType = payload.type;
    if (eventType !== "email.received") {
      return new Response(JSON.stringify({ message: `Ignored event: ${eventType}` }), { status: 200 });
    }

    const data = payload.data;
    if (!data) {
      return new Response(JSON.stringify({ error: "No data in webhook payload" }), { status: 400 });
    }

    const emailId = data.email_id;
    const toAddresses: string[] = Array.isArray(data.to) ? data.to : [data.to];

    // Find the journal+{user_id} address
    let userId: string | null = null;
    for (const addr of toAddresses) {
      userId = extractUserId(addr);
      if (userId) break;
    }

    if (!userId) {
      console.log("No user ID found in recipients:", toAddresses);
      return new Response(JSON.stringify({ error: "No user ID found in recipient address" }), { status: 400 });
    }

    // Verify the user exists
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, email")
      .eq("id", userId)
      .maybeSingle();

    if (!profile) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    // Fetch the actual email body from Resend API
    const emailRes = await fetch(`https://api.resend.com/emails/${emailId}`, {
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
    });

    if (!emailRes.ok) {
      console.error("Failed to fetch email body:", emailRes.status);
      return new Response(JSON.stringify({ error: "Failed to fetch email body" }), { status: 500 });
    }

    const emailData = await emailRes.json();
    const textBody = emailData.text || emailData.html?.replace(/<[^>]*>/g, '') || "";

    // Clean the reply text
    const reflectionText = cleanReplyText(textBody);

    if (!reflectionText) {
      return new Response(JSON.stringify({ message: "Empty reply, skipped" }), { status: 200 });
    }

    // Truncate to 280 chars
    const truncated = reflectionText.substring(0, 280);

    // Find today's daily entry and update it
    const today = new Date().toISOString().split("T")[0];
    const { data: existingEntry } = await supabase
      .from("daily_entries")
      .select("id")
      .eq("user_id", userId)
      .gte("created_at", today)
      .limit(1)
      .maybeSingle();

    if (existingEntry) {
      await supabase
        .from("daily_entries")
        .update({
          reflection_text: truncated,
          source_channel: "email",
        })
        .eq("id", existingEntry.id);
    } else {
      const { data: lastHistory } = await supabase
        .from("verse_history")
        .select("verse_id")
        .eq("user_id", userId)
        .order("shown_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      await supabase.from("daily_entries").insert({
        user_id: userId,
        verse_id: lastHistory?.verse_id ?? 13,
        reflection_text: truncated,
        source_channel: "email",
        intent_selected: "clarity",
      });
    }

    return new Response(
      JSON.stringify({ message: "Reflection saved", user_id: userId, length: truncated.length }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("process-reply error:", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
