import { sql } from '@vercel/postgres';

// Vercel Postgres implementation
export async function initializeVercelTables() {
  try {
    // Sessions table
    await sql`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        user_agent TEXT,
        ip_address TEXT,
        completed BOOLEAN DEFAULT FALSE
      )
    `;

    // Events table
    await sql`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        session_id TEXT NOT NULL,
        event_type TEXT NOT NULL,
        step_name TEXT,
        step_number INTEGER,
        data TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Answers table
    await sql`
      CREATE TABLE IF NOT EXISTS answers (
        id SERIAL PRIMARY KEY,
        session_id TEXT NOT NULL,
        step_name TEXT NOT NULL,
        step_number INTEGER NOT NULL,
        question TEXT,
        answer TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_events_session_step ON events(session_id, step_number)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_answers_step ON answers(step_number)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_answers_answer ON answers(answer)`;

    console.log('Vercel database tables initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Vercel tables:', error);
  }
}

export interface Session {
  id: string;
  created_at: string;
  user_agent?: string;
  ip_address?: string;
  completed: boolean;
}

export interface Event {
  id?: number;
  session_id: string;
  event_type: 'page_view' | 'button_click' | 'answer_select' | 'step_complete';
  step_name?: string;
  step_number?: number;
  data?: string;
  timestamp?: string;
}

export interface Answer {
  id?: number;
  session_id: string;
  step_name: string;
  step_number: number;
  question: string;
  answer: string;
  timestamp?: string;
}

// Vercel database operations
export const vercel_db_operations = {
  // Initialize database
  init: initializeVercelTables,

  // Session operations
  createSession: async (session: Omit<Session, 'created_at' | 'completed'>) => {
    return await sql`
      INSERT INTO sessions (id, user_agent, ip_address)
      VALUES (${session.id}, ${session.user_agent}, ${session.ip_address})
    `;
  },

  getSession: async (sessionId: string) => {
    const result = await sql`SELECT * FROM sessions WHERE id = ${sessionId}`;
    return result.rows[0] as Session | undefined;
  },

  markSessionCompleted: async (sessionId: string) => {
    return await sql`UPDATE sessions SET completed = TRUE WHERE id = ${sessionId}`;
  },

  // Event operations
  trackEvent: async (event: Event) => {
    return await sql`
      INSERT INTO events (session_id, event_type, step_name, step_number, data)
      VALUES (${event.session_id}, ${event.event_type}, ${event.step_name}, ${event.step_number}, ${event.data})
    `;
  },

  // Answer operations
  saveAnswer: async (answer: Answer) => {
    return await sql`
      INSERT INTO answers (session_id, step_name, step_number, question, answer)
      VALUES (${answer.session_id}, ${answer.step_name}, ${answer.step_number}, ${answer.question}, ${answer.answer})
    `;
  },

  // Analytics queries
  getFunnelStats: async () => {
    const result = await sql`
      SELECT
        step_number,
        step_name,
        COUNT(DISTINCT session_id) as visitors
      FROM events
      WHERE event_type = 'page_view' AND step_number IS NOT NULL
      GROUP BY step_number, step_name
      ORDER BY step_number
    `;
    return result.rows;
  },

  getAnswerStats: async () => {
    const result = await sql`
      SELECT
        step_name,
        question,
        answer,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (PARTITION BY step_name), 2) as percentage
      FROM answers
      GROUP BY step_name, question, answer
      ORDER BY step_name, count DESC
    `;
    return result.rows;
  },

  getTotalSessions: async () => {
    const result = await sql`SELECT COUNT(*) as total FROM sessions`;
    return result.rows[0].total;
  },

  getCompletionRate: async () => {
    const result = await sql`
      SELECT
        COUNT(*) as total,
        COUNT(CASE WHEN completed = true THEN 1 END) as completed,
        ROUND(COUNT(CASE WHEN completed = true THEN 1 END) * 100.0 / COUNT(*), 2) as completion_rate
      FROM sessions
    `;
    return result.rows[0];
  },

  getSessionsByDate: async (days = 7) => {
    const result = await sql`
      SELECT
        DATE(created_at) as date,
        COUNT(*) as sessions,
        COUNT(CASE WHEN completed = true THEN 1 END) as completed
      FROM sessions
      WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `;
    return result.rows;
  },

  // Clear all analytics data
  clearAllData: async () => {
    await sql`DELETE FROM answers`;
    await sql`DELETE FROM events`;
    await sql`DELETE FROM sessions`;
    console.log('All analytics data cleared');
  }
};

export default vercel_db_operations;