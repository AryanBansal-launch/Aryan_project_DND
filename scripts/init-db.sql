-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Add comment to table
COMMENT ON TABLE users IS 'Stores user authentication data for email/password login';

-- Create user_skills table to store skills for all users (including Google OAuth)
-- Skills are linked by email, so it works for both auth methods
CREATE TABLE IF NOT EXISTS user_skills (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  skill VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  -- Unique constraint to prevent duplicate skills per user
  UNIQUE(email, skill)
);

-- Create index on email for faster skill lookups
CREATE INDEX IF NOT EXISTS idx_user_skills_email ON user_skills(email);

-- Add comment to table
COMMENT ON TABLE user_skills IS 'Stores user skills linked by email. Works for both email/password and Google OAuth users.';

-- Note: Notifications are now stored in Contentstack CMS, not in the database

