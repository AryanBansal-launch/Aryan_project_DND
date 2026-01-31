import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { 
  getUserCount, 
  getTotalApplicationCount, 
  getApplicationsThisMonth,
  getAllApplications 
} from '@/lib/users';
import { getJobs } from '@/lib/contentstack';
import { getCompanies } from '@/lib/contentstack';

// GET - Get admin dashboard statistics
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

    // Fetch all stats in parallel
    const [
      totalUsers,
      totalApplications,
      applicationsThisMonth,
      jobs,
      companies,
      recentApplications
    ] = await Promise.all([
      getUserCount(),
      getTotalApplicationCount(),
      getApplicationsThisMonth(),
      getJobs(),
      getCompanies(),
      getAllApplications(10, 0) // Get 10 most recent applications
    ]);

    // Format companies for job modal
    const formattedCompanies = (companies || []).map((c: any) => ({
      uid: c.uid,
      title: c.title
    }));

    // Calculate job stats
    const totalJobs = jobs?.length || 0;
    const activeJobs = jobs?.filter((job: any) => job.status === 'active').length || 0;
    
    // Calculate jobs posted this month
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const jobsThisMonth = jobs?.filter((job: any) => {
      if (!job.posted_at) return false;
      const postedDate = new Date(job.posted_at);
      return postedDate.getMonth() === currentMonth && postedDate.getFullYear() === currentYear;
    }).length || 0;

    // Get recent jobs (last 10)
    const recentJobs = jobs
      ?.sort((a: any, b: any) => {
        const dateA = new Date(a.posted_at || a.created_at || 0).getTime();
        const dateB = new Date(b.posted_at || b.created_at || 0).getTime();
        return dateB - dateA;
      })
      .slice(0, 10)
      .map((job: any) => ({
        id: job.uid,
        title: job.title,
        company: Array.isArray(job.company) && job.company[0] 
          ? job.company[0].title 
          : (typeof job.company === 'object' && job.company?.title) || 'Unknown Company',
        status: job.status || 'draft',
        applications: job.applications_count || 0,
        views: job.views_count || 0,
        postedAt: job.posted_at || job.created_at || new Date().toISOString()
      })) || [];

    // Format recent applications
    const formattedRecentApplications = recentApplications.map((app: any) => ({
      id: app.application_id,
      jobTitle: app.job_title,
      company: app.company_name,
      applicantName: app.user_name,
      applicantEmail: app.email,
      status: app.status,
      appliedAt: app.created_at
    }));

    return NextResponse.json({
      stats: {
        totalJobs,
        activeJobs,
        totalCompanies: companies?.length || 0,
        totalUsers,
        applicationsThisMonth,
        jobsPostedThisMonth: jobsThisMonth
      },
      recentJobs,
      recentApplications: formattedRecentApplications,
      allJobs: jobs || [],
      companies: formattedCompanies
    });

  } catch (error: any) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch admin statistics',
        message: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}

