import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/database';

// Simple password protection - in production you'd want a more secure solution
const DASHBOARD_PASSWORD = process.env.DASHBOARD_PASSWORD || 'analytics123';

function validateAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return false;

  try {
    const [type, credentials] = authHeader.split(' ');
    if (type !== 'Basic') return false;

    const decoded = Buffer.from(credentials, 'base64').toString();
    const [username, password] = decoded.split(':');

    // Accept both 'admin' username with password, or just password
    return password === DASHBOARD_PASSWORD || (username === 'admin' && password === DASHBOARD_PASSWORD);
  } catch (error) {
    console.error('Auth validation error:', error);
    return false;
  }
}

export async function GET(request: NextRequest) {
  // Skip API authentication for now - dashboard handles its own auth
  // const authHeader = request.headers.get('authorization');

  try {
    // Initialize database
    await database.init();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';
    const days = parseInt(searchParams.get('days') || '7');

    let data: any = {};

    if (type === 'all' || type === 'funnel') {
      // Get funnel statistics
      const funnelStats = await database.getFunnelStats();

      // Calculate drop-off rates
      const funnelWithDropoff = funnelStats.map((step: any, index: number) => {
        const previousStep: any = index > 0 ? funnelStats[index - 1] : null;
        let dropoffRate = 0;

        if (previousStep && previousStep.visitors && step.visitors) {
          dropoffRate = ((previousStep.visitors - step.visitors) / previousStep.visitors) * 100;
        }

        const firstStep: any = funnelStats[0];
        return {
          ...step,
          dropoff_rate: Math.round(dropoffRate * 100) / 100,
          conversion_rate: index === 0 ? 100 : Math.round((step.visitors / (firstStep?.visitors || 1)) * 10000) / 100
        };
      });

      data.funnel = funnelWithDropoff;
    }

    if (type === 'all' || type === 'answers') {
      // Get answer statistics
      const answerStats = await database.getAnswerStats();

      // Group by step for better organization
      const answersByStep: { [key: string]: any[] } = {};
      answerStats.forEach((stat: any) => {
        if (!answersByStep[stat.step_name]) {
          answersByStep[stat.step_name] = [];
        }
        answersByStep[stat.step_name].push(stat);
      });

      data.answers = answersByStep;
    }

    if (type === 'all' || type === 'overview') {
      // Get overview statistics
      const totalSessions = await database.getTotalSessions();
      const completionStats = await database.getCompletionRate();
      const sessionsByDate = await database.getSessionsByDate(days);

      data.overview = {
        total_sessions: totalSessions,
        completion_stats: completionStats,
        sessions_by_date: sessionsByDate
      };
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      data
    });

  } catch (error) {
    console.error('Analytics stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}