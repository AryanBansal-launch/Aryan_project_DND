import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { findUserByEmail, getUserSkills } from '@/lib/users';

/**
 * GET /api/user/profile
 * 
 * Fetches the current user's profile data.
 * - For Google OAuth users: Returns data from session (email, name)
 * - For Email/Password users: Returns data from session + database
 * 
 * Returns user info including: email, name, skills, and auth provider
 */
export async function GET() {
  try {
    // Get session to identify the user
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const email = session.user.email;
    const sessionName = session.user.name || '';
    
    // Try to find user in database (only email/password users are stored there)
    const dbUser = await findUserByEmail(email);
    
    // Get user skills from database (works for both auth types)
    const skills = await getUserSkills(email);
    
    // Determine auth provider
    const isGoogleUser = !dbUser; // If not in DB, they logged in with Google
    
    // Build response based on auth type
    let firstName = '';
    let lastName = '';
    
    if (dbUser) {
      // Email/Password user - use database name
      // DB stores full name in 'name' field, try to split it
      const nameParts = dbUser.name.trim().split(/\s+/);
      firstName = nameParts[0] || '';
      lastName = nameParts.slice(1).join(' ') || '';
    } else {
      // Google user - parse name from session
      const nameParts = sessionName.trim().split(/\s+/);
      firstName = nameParts[0] || '';
      lastName = nameParts.slice(1).join(' ') || '';
    }

    const profileData = {
      email,
      firstName,
      lastName,
      name: sessionName || (dbUser?.name || ''),
      skills,
      authProvider: isGoogleUser ? 'google' : 'credentials',
      // Include session image for Google users (profile picture)
      image: session.user.image || null,
      // For DB users, include created_at
      createdAt: dbUser?.created_at || null,
    };

    return NextResponse.json({
      success: true,
      profile: profileData,
    });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { message: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

