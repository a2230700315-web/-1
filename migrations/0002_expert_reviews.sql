CREATE TABLE IF NOT EXISTS expert_reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  review_id TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL,
  reviewer_code TEXT NOT NULL,
  reviewer_background TEXT,
  target_type TEXT NOT NULL,
  case_id TEXT NOT NULL,
  case_version TEXT NOT NULL,
  target_ref TEXT NOT NULL,
  ratings TEXT NOT NULL,
  comment TEXT,
  UNIQUE (reviewer_code, target_type, case_id, target_ref)
);
CREATE INDEX IF NOT EXISTS idx_reviews_case ON expert_reviews(case_id);
