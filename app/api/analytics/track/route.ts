import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, eventType, stepName, stepNumber, data, answer, question } = body;

    // Validate required fields
    if (!sessionId || !eventType) {
      return NextResponse.json(
        { error: 'Session ID and event type are required' },
        { status: 400 }
      );
    }

    // Initialize database
    await database.init();

    // Check if session exists, if not create it
    const existingSession = await database.getSession(sessionId);
    if (!existingSession) {
      const userAgent = request.headers.get('user-agent') || '';
      const forwarded = request.headers.get('x-forwarded-for');
      const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || '127.0.0.1';

      await database.createSession({
        id: sessionId,
        user_agent: userAgent,
        ip_address: ip
      });
    }

    // Track the event
    await database.trackEvent({
      session_id: sessionId,
      event_type: eventType,
      step_name: stepName,
      step_number: stepNumber,
      data: data ? JSON.stringify(data) : undefined
    });

    // If this is an answer selection, also save to answers table
    if (eventType === 'answer_select' && answer && question && stepName && stepNumber !== undefined) {
      await database.saveAnswer({
        session_id: sessionId,
        step_name: stepName,
        step_number: stepNumber,
        question: question,
        answer: answer
      });
    }

    // Mark session as completed if this is the final step
    if (stepName === 'PREDICTION' || stepNumber === 24) {
      await database.markSessionCompleted(sessionId);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}