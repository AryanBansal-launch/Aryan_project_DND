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

