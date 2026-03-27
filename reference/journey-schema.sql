CREATE TABLE public.journeys (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  verse_ids INT[] NOT NULL,
  duration_days INT DEFAULT 7,
  is_premium BOOLEAN DEFAULT TRUE
);

CREATE TABLE public.user_journeys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id),
  journey_id INT REFERENCES public.journeys(id),
  current_day INT DEFAULT 1,
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- RLS
ALTER TABLE public.journeys ENABLE ROW LEVEL SECURITY;
CREATE POLICY 'Journeys readable by all' ON public.journeys FOR SELECT USING (true);

ALTER TABLE public.user_journeys ENABLE ROW LEVEL SECURITY;
CREATE POLICY 'Users manage own journeys' ON public.user_journeys FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
