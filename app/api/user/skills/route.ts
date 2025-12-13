// API Route: User Skills - Save and retrieve user skills from database
// Skills are linked by email, works for both email/password and Google OAuth users

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUserSkills, saveUserSkills } from '@/lib/users';

// GET - Retrieve user's skills
export async function GET(_request: NextRequest) {
  try {
    // Get the current session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Please log in to view your skills' },
        { status: 401 }
      );
    }

    const email = session.user.email;
    
    // Get skills from database
    const skills = await getUserSkills(email);

    return NextResponse.json({
      success: true,
      email: email,
      skills: skills,
    });

  } catch (error) {
    console.error('Error getting user skills:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to retrieve skills' },
      { status: 500 }
    );
  }
}

// POST - Save user's skills (replaces existing)
export async function POST(request: NextRequest) {
  try {
    // Get the current session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Please log in to save your skills' },
        { status: 401 }
      );
    }

    const email = session.user.email;
    
    // Parse request body
    const body = await request.json();
    const { skills } = body;

    // Validate skills
    if (!Array.isArray(skills)) {
      return NextResponse.json(
        { error: 'Invalid request', message: 'Skills must be an array' },
        { status: 400 }
      );
    }

    // Save skills to database
    const success = await saveUserSkills(email, skills);

    if (!success) {
      return NextResponse.json(
        { error: 'Database error', message: 'Failed to save skills' },
        { status: 500 }
      );
    }

    // Fetch the saved skills to confirm
    const savedSkills = await getUserSkills(email);

    return NextResponse.json({
      success: true,
      message: `Successfully saved ${savedSkills.length} skills`,
      email: email,
      skills: savedSkills,
    });

  } catch (error) {
    console.error('Error saving user skills:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to save skills' },
      { status: 500 }
    );
  }
}

// PUT - Add a single skill
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Please log in' },
        { status: 401 }
      );
    }

    const email = session.user.email;
    const body = await request.json();
    const { skill } = body;

    if (!skill || typeof skill !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request', message: 'Skill must be a non-empty string' },
        { status: 400 }
      );
    }

    // Get current skills and add new one
    const currentSkills = await getUserSkills(email);
    if (!currentSkills.includes(skill)) {
      currentSkills.push(skill);
      await saveUserSkills(email, currentSkills);
    }

    const updatedSkills = await getUserSkills(email);

    return NextResponse.json({
      success: true,
      message: `Added skill: ${skill}`,
      skills: updatedSkills,
    });

  } catch (error) {
    console.error('Error adding skill:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to add skill' },
      { status: 500 }
    );
  }
}

// DELETE - Remove a skill
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Please log in' },
        { status: 401 }
      );
    }

    const email = session.user.email;
    const { searchParams } = new URL(request.url);
    const skill = searchParams.get('skill');

    if (!skill) {
      return NextResponse.json(
        { error: 'Invalid request', message: 'Skill parameter is required' },
        { status: 400 }
      );
    }

    // Get current skills and remove the specified one
    const currentSkills = await getUserSkills(email);
    const filteredSkills = currentSkills.filter(
      s => s.toLowerCase() !== skill.toLowerCase()
    );
    await saveUserSkills(email, filteredSkills);

    const updatedSkills = await getUserSkills(email);

    return NextResponse.json({
      success: true,
      message: `Removed skill: ${skill}`,
      skills: updatedSkills,
    });

  } catch (error) {
    console.error('Error removing skill:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to remove skill' },
      { status: 500 }
    );
  }
}

