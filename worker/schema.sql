-- Vectis AI free-resource gate.
-- leads = who asked for what (one row per email+resource).
-- events = every read / unlock / download, kept raw so counts stay queryable over time.

CREATE TABLE IF NOT EXISTS leads (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  email       TEXT NOT NULL,
  resource    TEXT NOT NULL,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  ip_hash     TEXT,
  user_agent  TEXT,
  UNIQUE(email, resource)
);

CREATE TABLE IF NOT EXISTS events (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  kind        TEXT NOT NULL CHECK (kind IN ('read','unlock','download')),
  resource    TEXT NOT NULL,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  ip_hash     TEXT
);

CREATE INDEX IF NOT EXISTS idx_events_kind_resource ON events(kind, resource);
CREATE INDEX IF NOT EXISTS idx_events_created       ON events(created_at);
CREATE INDEX IF NOT EXISTS idx_events_ip_created    ON events(ip_hash, created_at);

-- Discovery-call enquiries. Deliberately mirrors the qualification fields a
-- first call would otherwise be spent collecting.
CREATE TABLE IF NOT EXISTS enquiries (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  company     TEXT NOT NULL,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  team_size   TEXT,
  interests   TEXT,          -- JSON array of the checked services
  timeline    TEXT,
  budget      TEXT,
  message     TEXT NOT NULL,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  ip_hash     TEXT
);

CREATE INDEX IF NOT EXISTS idx_enquiries_created ON enquiries(created_at);
