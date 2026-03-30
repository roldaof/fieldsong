-- Enable pg_cron extension (run once)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Grant usage to postgres role
GRANT USAGE ON SCHEMA cron TO postgres;

-- Schedule daily verse email every 15 minutes
-- The Edge Function handles timezone logic and send window matching
SELECT cron.schedule(
  'send-daily-verses',
  '*/15 * * * *',  -- every 15 minutes
  $$
  SELECT net.http_post(
    url := 'https://rgbzqnbegozpcgdnfxfy.supabase.co/functions/v1/send-daily-verse',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnYnpxbmJlZ296cGNnZG5meGZ5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDU0ODc2NiwiZXhwIjoyMDkwMTI0NzY2fQ.HXMhlk9VQnkPkwoQw9sSe5Z7WNhGz72NH9D0n5bIGvA'
    ),
    body := '{}'::jsonb
  ) AS request_id;
  $$
);

-- To check scheduled jobs:
-- SELECT * FROM cron.job;

-- To unschedule:
-- SELECT cron.unschedule('send-daily-verses');
