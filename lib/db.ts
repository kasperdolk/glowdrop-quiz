import Database from 'better-sqlite3';
import path from 'path';

let db: Database.Database;

export function getDb() {
  if (!db) {
    const dbPath = path.join(process.cwd(), 'analytics.db');
    db = new Database(dbPath);

    // Initialize tables
    initializeTables();
  }
  return db;
}

function initializeTables() {
  // Sessions table to track unique visitors
  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      user_agent TEXT,
      ip_address TEXT,
      completed BOOLEAN DEFAULT FALSE
    )
  `);

  // Events table to track user interactions
  db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      event_type TEXT NOT NULL,
      step_name TEXT,
      step_number INTEGER,
      data TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (session_id) REFERENCES sessions(id)
    )
  `);

  // Answers table to track quiz answers
  db.exec(`
    CREATE TABLE IF NOT EXISTS answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      step_name TEXT NOT NULL,
      step_number INTEGER NOT NULL,
      question TEXT,
      answer TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (session_id) REFERENCES sessions(id)
    )
  `);

  // Create indexes for better performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_events_session_step ON events(session_id, step_number);
    CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type);
    CREATE INDEX IF NOT EXISTS idx_answers_step ON answers(step_number);
    CREATE INDEX IF NOT EXISTS idx_answers_answer ON answers(answer);
  `);
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

// Database operations
export const db_operations = {
  // Session operations
  createSession: (session: Omit<Session, 'created_at' | 'completed'>) => {
    const stmt = db.prepare(`
      INSERT INTO sessions (id, user_agent, ip_address)
      VALUES (?, ?, ?)
    `);
    return stmt.run(session.id, session.user_agent, session.ip_address);
  },

  getSession: (sessionId: string) => {
    const stmt = db.prepare('SELECT * FROM sessions WHERE id = ?');
    return stmt.get(sessionId) as Session | undefined;
  },

  markSessionCompleted: (sessionId: string) => {
    const stmt = db.prepare('UPDATE sessions SET completed = TRUE WHERE id = ?');
    return stmt.run(sessionId);
  },

  // Event operations
  trackEvent: (event: Event) => {
    const stmt = db.prepare(`
      INSERT INTO events (session_id, event_type, step_name, step_number, data)
      VALUES (?, ?, ?, ?, ?)
    `);
    return stmt.run(
      event.session_id,
      event.event_type,
      event.step_name,
      event.step_number,
      event.data
    );
  },

  // Answer operations
  saveAnswer: (answer: Answer) => {
    const stmt = db.prepare(`
      INSERT INTO answers (session_id, step_name, step_number, question, answer)
      VALUES (?, ?, ?, ?, ?)
    `);
    return stmt.run(
      answer.session_id,
      answer.step_name,
      answer.step_number,
      answer.question,
      answer.answer
    );
  },

  // Analytics queries
  getFunnelStats: () => {
    const stmt = db.prepare(`
      SELECT
        step_number,
        step_name,
        COUNT(DISTINCT session_id) as visitors
      FROM events
      WHERE event_type = 'page_view' AND step_number IS NOT NULL
      GROUP BY step_number, step_name
      ORDER BY step_number
    `);
    return stmt.all();
  },

  getAnswerStats: () => {
    const stmt = db.prepare(`
      SELECT
        step_name,
        question,
        answer,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (PARTITION BY step_name), 2) as percentage
      FROM answers
      GROUP BY step_name, question, answer
      ORDER BY step_name, count DESC
    `);
    return stmt.all();
  },

  getTotalSessions: () => {
    const stmt = db.prepare('SELECT COUNT(*) as total FROM sessions');
    return (stmt.get() as { total: number }).total;
  },

  getCompletionRate: () => {
    const stmt = db.prepare(`
      SELECT
        COUNT(*) as total,
        COUNT(CASE WHEN completed = 1 THEN 1 END) as completed,
        ROUND(COUNT(CASE WHEN completed = 1 THEN 1 END) * 100.0 / COUNT(*), 2) as completion_rate
      FROM sessions
    `);
    return stmt.get();
  },

  getSessionsByDate: (days = 7) => {
    const stmt = db.prepare(`
      SELECT
        DATE(created_at) as date,
        COUNT(*) as sessions,
        COUNT(CASE WHEN completed = 1 THEN 1 END) as completed
      FROM sessions
      WHERE created_at >= datetime('now', '-${days} days')
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `);
    return stmt.all();
  },

  // Clear all analytics data
  clearAllData: () => {
    const answersStmt = db.prepare('DELETE FROM answers');
    const eventsStmt = db.prepare('DELETE FROM events');
    const sessionsStmt = db.prepare('DELETE FROM sessions');

    answersStmt.run();
    eventsStmt.run();
    sessionsStmt.run();

    console.log('All analytics data cleared from SQLite');
  }
};

export default getDb;