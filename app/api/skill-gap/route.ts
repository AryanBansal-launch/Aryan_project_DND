import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUserSkills } from '@/lib/users';
import { analyzeSkillGaps, getQuickSkillGapSummary } from '@/lib/skill-gap-analyzer';

/**
 * GET /api/skill-gap
 * 
 * Analyze skill gaps for the current user
 * Query params:
 *   - quick: boolean - Return quick summary instead of full analysis
 *   - skills: string - Comma-separated skills (if not using user profile)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const quickMode = searchParams.get('quick') === 'true';
    const skillsParam = searchParams.get('skills');
    
    let skills: string[] = [];
    
    // If skills provided in query, use those
    if (skillsParam) {
      skills = skillsParam.split(',').map(s => s.trim()).filter(Boolean);
    } else {
      // Otherwise, get user's skills from profile
      const session = await getServerSession(authOptions);
      
      if (!session?.user?.email) {
        return NextResponse.json(
          { error: 'Please log in or provide skills parameter' },
          { status: 401 }
        );
      }
      
      skills = await getUserSkills(session.user.email);
    }
    
    if (skills.length === 0) {
      return NextResponse.json({
        message: 'No skills found. Please add skills to your profile.',
        analysis: null,
      });
    }
    
    // Perform analysis
    if (quickMode) {
      const summary = await getQuickSkillGapSummary(skills);
      return NextResponse.json({
        success: true,
        summary,
      });
    } else {
      const analysis = await analyzeSkillGaps(skills);
      return NextResponse.json({
        success: true,
        analysis,
      });
    }
    
  } catch (error) {
    console.error('Skill gap analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze skill gaps' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/skill-gap
 * 
 * Analyze skill gaps for provided skills (no auth required)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { skills, quick = false } = body;
    
    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return NextResponse.json(
        { error: 'Please provide an array of skills' },
        { status: 400 }
      );
    }
    
    // Perform analysis
    if (quick) {
      const summary = await getQuickSkillGapSummary(skills);
      return NextResponse.json({
        success: true,
        summary,
      });
    } else {
      const analysis = await analyzeSkillGaps(skills);
      return NextResponse.json({
        success: true,
        analysis,
      });
    }
    
  } catch (error) {
    console.error('Skill gap analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze skill gaps' },
      { status: 500 }
    );
  }
}

