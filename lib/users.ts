import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

export interface User {
  id: number;
  email: string;
  name: string;
  password: string; // hashed
  created_at: Date;
  updated_at: Date;
}

// Simplified user info for notifications
export interface UserBasicInfo {
  email: string;
  name: string;
}

// Get database connection
const getDb = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  return neon(process.env.DATABASE_URL);
};

// Find user by email
export const findUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const sql = getDb();
    const result = await sql`
      SELECT id, email, name, password, created_at, updated_at
      FROM users
      WHERE LOWER(email) = LOWER(${email})
      LIMIT 1
    `;
    
    return result.length > 0 ? result[0] as User : null;
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw new Error('Database query failed');
  }
};

// Find user by ID
export const findUserById = async (id: string | number): Promise<User | null> => {
  try {
    const sql = getDb();
    const userId = typeof id === 'string' ? parseInt(id, 10) : id;
    
    const result = await sql`
      SELECT id, email, name, password, created_at, updated_at
      FROM users
      WHERE id = ${userId}
      LIMIT 1
    `;
    
    return result.length > 0 ? result[0] as User : null;
  } catch (error) {
    console.error('Error finding user by ID:', error);
    throw new Error('Database query failed');
  }
};

// Create new user
export const createUser = async (email: string, password: string, name: string): Promise<User> => {
  try {
    const sql = getDb();
    
    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const result = await sql`
      INSERT INTO users (email, name, password)
      VALUES (${email.toLowerCase()}, ${name}, ${hashedPassword})
      RETURNING id, email, name, password, created_at, updated_at
    `;

    if (result.length === 0) {
      throw new Error('Failed to create user');
    }

    return result[0] as User;
  } catch (error: any) {
    console.error('Error creating user:', error);
    if (error.message === 'User with this email already exists') {
      throw error;
    }
    throw new Error('Failed to create user');
  }
};

// Verify password
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

// ============================================
// OAUTH USER MANAGEMENT
// ============================================

// Find or create OAuth user (for Google, etc.)
// This creates a user record for OAuth users who don't have a password
export const findOrCreateOAuthUser = async (
  email: string,
  name: string,
  provider: string
): Promise<User> => {
  try {
    const sql = getDb();
    
    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      // User exists, return them (they might have registered via email or previous OAuth)
      console.log(`[OAuth] Existing user found: ${email}`);
      return existingUser;
    }

    // Create new user with a placeholder password (OAuth users don't need one)
    // We use a secure random string that can't be used to login via credentials
    const placeholderPassword = `oauth_${provider}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const hashedPassword = await bcrypt.hash(placeholderPassword, 10);

    // Create new user
    const result = await sql`
      INSERT INTO users (email, name, password)
      VALUES (${email.toLowerCase()}, ${name}, ${hashedPassword})
      RETURNING id, email, name, password, created_at, updated_at
    `;

    if (result.length === 0) {
      throw new Error('Failed to create OAuth user');
    }

    console.log(`[OAuth] New user created: ${email} via ${provider}`);
    return result[0] as User;
  } catch (error: any) {
    console.error('Error in findOrCreateOAuthUser:', error);
    throw new Error('Failed to find or create OAuth user');
  }
};

// ============================================
// GET ALL USERS (for notifications)
// ============================================

// Get all registered users (for sending notifications)
export const getAllUsers = async (): Promise<UserBasicInfo[]> => {
  try {
    const sql = getDb();
    const result = await sql`
      SELECT email, name
      FROM users
      ORDER BY created_at DESC
    `;
    
    return result.map((row: any) => ({
      email: row.email,
      name: row.name,
    }));
  } catch (error) {
    console.error('Error getting all users:', error);
    return [];
  }
};

// Get user count
export const getUserCount = async (): Promise<number> => {
  try {
    const sql = getDb();
    const result = await sql`
      SELECT COUNT(*) as count FROM users
    `;
    
    return parseInt(result[0]?.count || '0', 10);
  } catch (error) {
    console.error('Error getting user count:', error);
    return 0;
  }
};

// ============================================
// USER SKILLS FUNCTIONS
// ============================================

// Get user skills by email
export const getUserSkills = async (email: string): Promise<string[]> => {
  try {
    const sql = getDb();
    const result = await sql`
      SELECT skill
      FROM user_skills
      WHERE LOWER(email) = LOWER(${email})
      ORDER BY created_at ASC
    `;
    
    return result.map((row: any) => row.skill);
  } catch (error) {
    console.error('Error getting user skills:', error);
    return [];
  }
};

// Save user skills (replaces existing skills)
export const saveUserSkills = async (email: string, skills: string[]): Promise<boolean> => {
  try {
    const sql = getDb();
    
    // Delete existing skills for this user
    await sql`
      DELETE FROM user_skills
      WHERE LOWER(email) = LOWER(${email})
    `;
    
    // Insert new skills (if any)
    if (skills.length > 0) {
      // Filter out empty skills and duplicates
      const uniqueSkills = [...new Set(skills.filter(s => s && s.trim()))];
      
      for (const skill of uniqueSkills) {
        await sql`
          INSERT INTO user_skills (email, skill)
          VALUES (${email.toLowerCase()}, ${skill.trim()})
          ON CONFLICT (email, skill) DO NOTHING
        `;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error saving user skills:', error);
    return false;
  }
};

// Add a single skill for user
export const addUserSkill = async (email: string, skill: string): Promise<boolean> => {
  try {
    const sql = getDb();
    
    await sql`
      INSERT INTO user_skills (email, skill)
      VALUES (${email.toLowerCase()}, ${skill.trim()})
      ON CONFLICT (email, skill) DO NOTHING
    `;
    
    return true;
  } catch (error) {
    console.error('Error adding user skill:', error);
    return false;
  }
};

// Remove a single skill for user
export const removeUserSkill = async (email: string, skill: string): Promise<boolean> => {
  try {
    const sql = getDb();
    
    await sql`
      DELETE FROM user_skills
      WHERE LOWER(email) = LOWER(${email})
      AND LOWER(skill) = LOWER(${skill})
    `;
    
    return true;
  } catch (error) {
    console.error('Error removing user skill:', error);
    return false;
  }
};

// ============================================
// JOB APPLICATIONS FUNCTIONS
// ============================================

export interface ApplicationData {
  id?: number;
  application_id: string;
  email: string;
  user_name: string;
  job_id: string;
  job_title: string;
  company_name: string;
  status: 'submitted' | 'reviewed' | 'shortlisted' | 'interview' | 'rejected' | 'hired';
  cover_letter?: string;
  portfolio?: string;
  expected_salary?: string;
  availability?: string;
  additional_info?: string;
  resume_file_name?: string;
  notes?: string;
  created_at?: Date;
  updated_at?: Date;
}

// Create a new application
export const createApplication = async (data: Omit<ApplicationData, 'id' | 'created_at' | 'updated_at'>): Promise<ApplicationData | null> => {
  try {
    const sql = getDb();
    
    const result = await sql`
      INSERT INTO applications (
        application_id, email, user_name, job_id, job_title, company_name,
        status, cover_letter, portfolio, expected_salary, availability,
        additional_info, resume_file_name, notes
      )
      VALUES (
        ${data.application_id},
        ${data.email.toLowerCase()},
        ${data.user_name},
        ${data.job_id},
        ${data.job_title},
        ${data.company_name},
        ${data.status || 'submitted'},
        ${data.cover_letter || null},
        ${data.portfolio || null},
        ${data.expected_salary || null},
        ${data.availability || null},
        ${data.additional_info || null},
        ${data.resume_file_name || null},
        ${data.notes || null}
      )
      RETURNING *
    `;
    
    return result.length > 0 ? result[0] as ApplicationData : null;
  } catch (error) {
    console.error('Error creating application:', error);
    return null;
  }
};

// Get all applications for a user
export const getUserApplications = async (email: string): Promise<ApplicationData[]> => {
  try {
    const sql = getDb();
    
    const result = await sql`
      SELECT *
      FROM applications
      WHERE LOWER(email) = LOWER(${email})
      ORDER BY created_at DESC
    `;
    
    return result as ApplicationData[];
  } catch (error) {
    console.error('Error getting user applications:', error);
    return [];
  }
};

// Get a specific application by ID
export const getApplicationById = async (applicationId: string): Promise<ApplicationData | null> => {
  try {
    const sql = getDb();
    
    const result = await sql`
      SELECT *
      FROM applications
      WHERE application_id = ${applicationId}
      LIMIT 1
    `;
    
    return result.length > 0 ? result[0] as ApplicationData : null;
  } catch (error) {
    console.error('Error getting application by ID:', error);
    return null;
  }
};

// Update application status
export const updateApplicationStatus = async (
  applicationId: string, 
  status: ApplicationData['status'],
  notes?: string
): Promise<boolean> => {
  try {
    const sql = getDb();
    
    await sql`
      UPDATE applications
      SET status = ${status}, 
          notes = COALESCE(${notes || null}, notes),
          updated_at = CURRENT_TIMESTAMP
      WHERE application_id = ${applicationId}
    `;
    
    return true;
  } catch (error) {
    console.error('Error updating application status:', error);
    return false;
  }
};

// Check if user has already applied to a job
export const hasUserApplied = async (email: string, jobId: string): Promise<boolean> => {
  try {
    const sql = getDb();
    
    const result = await sql`
      SELECT 1
      FROM applications
      WHERE LOWER(email) = LOWER(${email})
      AND job_id = ${jobId}
      LIMIT 1
    `;
    
    return result.length > 0;
  } catch (error) {
    console.error('Error checking if user applied:', error);
    return false;
  }
};

// Get application count for a user
export const getUserApplicationCount = async (email: string): Promise<number> => {
  try {
    const sql = getDb();
    
    const result = await sql`
      SELECT COUNT(*) as count
      FROM applications
      WHERE LOWER(email) = LOWER(${email})
    `;
    
    return parseInt(result[0]?.count || '0', 10);
  } catch (error) {
    console.error('Error getting application count:', error);
    return 0;
  }
};

// Delete an application
export const deleteApplication = async (applicationId: string, email: string): Promise<boolean> => {
  try {
    const sql = getDb();
    
    await sql`
      DELETE FROM applications
      WHERE application_id = ${applicationId}
      AND LOWER(email) = LOWER(${email})
    `;
    
    return true;
  } catch (error) {
    console.error('Error deleting application:', error);
    return false;
  }
};

// ============================================
// ADMIN FUNCTIONS
// ============================================

// Get all applications (for admin)
export const getAllApplications = async (limit?: number, offset?: number): Promise<ApplicationData[]> => {
  try {
    const sql = getDb();
    
    let query = sql`
      SELECT *
      FROM applications
      ORDER BY created_at DESC
    `;
    
    if (limit !== undefined) {
      query = sql`
        SELECT *
        FROM applications
        ORDER BY created_at DESC
        LIMIT ${limit}
        ${offset !== undefined ? sql`OFFSET ${offset}` : sql``}
      `;
    }
    
    const result = await query;
    return result as ApplicationData[];
  } catch (error) {
    console.error('Error getting all applications:', error);
    return [];
  }
};

// Get total application count
export const getTotalApplicationCount = async (): Promise<number> => {
  try {
    const sql = getDb();
    const result = await sql`
      SELECT COUNT(*) as count FROM applications
    `;
    
    return parseInt(result[0]?.count || '0', 10);
  } catch (error) {
    console.error('Error getting total application count:', error);
    return 0;
  }
};

// Get applications count for this month
export const getApplicationsThisMonth = async (): Promise<number> => {
  try {
    const sql = getDb();
    const result = await sql`
      SELECT COUNT(*) as count 
      FROM applications
      WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)
    `;
    
    return parseInt(result[0]?.count || '0', 10);
  } catch (error) {
    console.error('Error getting applications this month:', error);
    return 0;
  }
};

