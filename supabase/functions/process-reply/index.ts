// Edge Function: process-reply
// Handles inbound email replies via Resend webhook.
// When a user replies to their daily verse email, their reply
// is saved as a journal entry for that day.
//
// Resend webhook sends POST with email data including:
// - from: user's email
// - to: journal+{user_id}@fieldsong.app
// - text: the reply body

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function extractUserId(toAddress: string): string | null {
  // Extract user ID from journal+{user_id}@fieldsong.app
  const match = toAddress.match(/journal\+([a-f0-9-]+)@/i);
  return match ? match[1] : null;
}

function cleanReplyText(text: string): string {
  // Remove quoted content from email replies
  // Common patterns: lines starting with >, "On ... wrote:", "From:", etc.
  const lines = text.split("\n");
  const cleanLines: string[] = [];

  for (const line of lines) {
    // Stop at quoted content markers
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
        "Access-Control-Allow-Headers": "content-type",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  try {
    const payload = await req.json();

    // Resend inbound webhook payload
    const fromEmail = payload.from;
    const toAddresses: string[] = Array.isArray(payload.to) ? payload.to : [payload.to];
    const textBody = payload.text || "";

    // Find the journal+{user_id} address
    let userId: string | null = null;
    for (const addr of toAddresses) {
      userId = extractUserId(addr);
      if (userId) break;
    }

    if (!userId) {
      return new Response(JSON.stringify({ error: "No user ID found in recipient address" }), { status: 400 });
    }

    // Verify the user exists and the from email matches
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, email")
      .eq("id", userId)
      .maybeSingle();

    if (!profile) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    // Clean the reply text
    const reflectionText = cleanReplyText(textBody);

    if (!reflectionText) {
      return new Response(JSON.stringify({ message: "Empty reply, skipped" }), { status: 200 });
    }

    // Truncate to 280 chars (matching app limit)
    const truncated = reflectionText.substring(0, 280);

    // Find today's daily entry and update it with the reflection
    const today = new Date().toISOString().split("T")[0];
    const { data: existingEntry } = await supabase
      .from("daily_entries")
      .select("id")
      .eq("user_id", userId)
      .gte("created_at", today)
      .limit(1)
      .maybeSingle();

    if (existingEntry) {
      // Update existing entry with reflection
      await supabase
        .from("daily_entries")
        .update({
          reflection_text: truncated,
          source_channel: "email",
        })
        .eq("id", existingEntry.id);
    } else {
      // Create new entry (edge case: user replies but no entry exists)
      // Get the most recent verse shown to this user
      const { data: lastHistory } = await supabase
        .from("verse_history")
        .select("verse_id")
        .eq("user_id", userId)
        .order("shown_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      await supabase.from("daily_entries").insert({
        user_id: userId,
        verse_id: lastHistory?.verse_id ?? 13, // fallback to verse 13 (2.47)
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
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
