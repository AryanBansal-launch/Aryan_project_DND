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

-- Create applications table to store job applications
CREATE TABLE IF NOT EXISTS applications (
  id SERIAL PRIMARY KEY,
  application_id VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  job_id VARCHAR(255) NOT NULL,
  job_title VARCHAR(255) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'submitted',
  cover_letter TEXT,
  portfolio VARCHAR(500),
  expected_salary VARCHAR(100),
  availability VARCHAR(255),
  additional_info TEXT,
  resume_file_name VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_applications_email ON applications(email);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);

-- Add comment to table
COMMENT ON TABLE applications IS 'Stores job applications submitted by users';

