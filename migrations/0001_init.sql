CREATE TABLE IF NOT EXISTS sessions (
  session_id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS research_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  experiment_id TEXT, session_id TEXT, timestamp TEXT, type TEXT,
  model TEXT, model_version TEXT, prompt_version TEXT,
  case_id TEXT, case_version TEXT, params TEXT, payload TEXT
);
CREATE INDEX IF NOT EXISTS idx_events_session ON research_events(session_id);
