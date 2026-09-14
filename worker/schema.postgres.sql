-- Postgres port of schema.sql, for the Vercel/Neon deployment.
-- Run once against DATABASE_URL:  psql "$DATABASE_URL" -f worker/schema.postgres.sql

CREATE TABLE IF NOT EXISTS leads (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email       text NOT NULL,
  resource    text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  ip_hash     text,
  user_agent  text,
  UNIQUE (email, resource)
);

CREATE TABLE IF NOT EXISTS events (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  kind        text NOT NULL CHECK (kind IN ('read','unlock','download')),
  resource    text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  ip_hash     text
);

CREATE INDEX IF NOT EXISTS idx_events_kind_resource ON events (kind, resource);
CREATE INDEX IF NOT EXISTS idx_events_created       ON events (created_at);
CREATE INDEX IF NOT EXISTS idx_events_ip_created    ON events (ip_hash, created_at);

-- Discovery-call enquiries. Deliberately mirrors the qualification fields a
-- first call would otherwise be spent collecting.
CREATE TABLE IF NOT EXISTS enquiries (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  company     text NOT NULL,
  name        text NOT NULL,
  email       text NOT NULL,
  team_size   text,
  interests   text,          -- JSON array of the checked services
  timeline    text,
  budget      text,
  message     text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  ip_hash     text
);

CREATE INDEX IF NOT EXISTS idx_enquiries_created ON enquiries (created_at);

-- Added with the booking flow: the slot is taken on Cal.com first, and its
-- reference travels with the answers so the two can be matched up.
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS booking_uid   text;
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS booking_start timestamptz;

