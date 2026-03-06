CREATE TABLE auth (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role VARCHAR(20) CHECK (role IN ('user','recruiter')) DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW()
);