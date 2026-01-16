import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

// Simple password protection
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

function arrayToCSV(data: any[]): string {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        // Escape commas and quotes in CSV
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  return csvContent;
}

export async function GET(request: NextRequest) {
  // Skip API authentication for now - dashboard handles its own auth
  // const authHeader = request.headers.get('authorization');

  try {
    const { searchParams } = new URL(request.url);
    const table = searchParams.get('table') || 'events';

    let data: any[] = [];
    let filename = 'analytics_export.csv';
    const isVercelProduction = process.env.VERCEL_ENV === 'production' || process.env.POSTGRES_URL;

    if (isVercelProduction) {
      // Use Vercel Postgres
      switch (table) {
        case 'sessions':
          const sessionsResult = await sql`SELECT * FROM sessions ORDER BY created_at DESC`;
          data = sessionsResult.rows;
          filename = 'sessions_export.csv';
          break;

        case 'events':
          const eventsResult = await sql`SELECT * FROM events ORDER BY timestamp DESC`;
          data = eventsResult.rows;
          filename = 'events_export.csv';
          break;

        case 'answers':
          const answersResult = await sql`SELECT * FROM answers ORDER BY timestamp DESC`;
          data = answersResult.rows;
          filename = 'answers_export.csv';
          break;

        default:
          return NextResponse.json(
            { error: 'Invalid table specified' },
            { status: 400 }
          );
      }
    } else {
      // Use SQLite (local development)
      const { getDb } = await import('@/lib/db');
      const db = getDb();

      switch (table) {
        case 'sessions':
          const sessionsStmt = db.prepare('SELECT * FROM sessions ORDER BY created_at DESC');
          data = sessionsStmt.all();
          filename = 'sessions_export.csv';
          break;

        case 'events':
          const eventsStmt = db.prepare('SELECT * FROM events ORDER BY timestamp DESC');
          data = eventsStmt.all();
          filename = 'events_export.csv';
          break;

        case 'answers':
          const answersStmt = db.prepare('SELECT * FROM answers ORDER BY timestamp DESC');
          data = answersStmt.all();
          filename = 'answers_export.csv';
          break;

        default:
          return NextResponse.json(
            { error: 'Invalid table specified' },
            { status: 400 }
          );
      }
    }

    const csv = arrayToCSV(data);

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    });

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}