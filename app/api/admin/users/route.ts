import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { neon } from '@neondatabase/serverless';

// Get database connection
const getDb = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  return neon(process.env.DATABASE_URL);
};

// GET - Get all users for admin
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const sql = getDb();
    
    // Get query parameters for pagination
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const search = searchParams.get('search') || '';

    let query;
    let countQuery;

    if (search) {
      // Search by name or email
      query = sql`
        SELECT id, email, name, created_at, updated_at
        FROM users
        WHERE LOWER(name) LIKE LOWER(${'%' + search + '%'})
           OR LOWER(email) LIKE LOWER(${'%' + search + '%'})
        ORDER BY created_at DESC
        LIMIT ${limit}
        OFFSET ${offset}
      `;
      
      countQuery = sql`
        SELECT COUNT(*) as count
        FROM users
        WHERE LOWER(name) LIKE LOWER(${'%' + search + '%'})
           OR LOWER(email) LIKE LOWER(${'%' + search + '%'})
      `;
    } else {
      query = sql`
        SELECT id, email, name, created_at, updated_at
        FROM users
        ORDER BY created_at DESC
        LIMIT ${limit}
        OFFSET ${offset}
      `;
      
      countQuery = sql`
        SELECT COUNT(*) as count FROM users
      `;
    }

    const [users, countResult] = await Promise.all([
      query,
      countQuery
    ]);

    const total = parseInt(countResult[0]?.count || '0', 10);

    // Format users (exclude password)
    const formattedUsers = users.map((user: any) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      created_at: user.created_at,
      updated_at: user.updated_at
    }));

    return NextResponse.json({
      users: formattedUsers,
      total,
      limit,
      offset
    });

  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch users',
        message: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}

