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

