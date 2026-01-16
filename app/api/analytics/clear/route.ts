import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    // Initialize database
    await database.init();

    // Clear all analytics data
    await database.clearAllData();

    return NextResponse.json({
      success: true,
      message: 'All analytics data cleared successfully'
    });

  } catch (error) {
    console.error('Clear analytics error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}