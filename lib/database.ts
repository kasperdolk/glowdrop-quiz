// Universal database interface for both local and Vercel deployment
import { vercel_db_operations } from './db-vercel';
import { db_operations, getDb } from './db';

// Use PostgreSQL on Vercel production, SQLite locally
const isVercelProduction = process.env.POSTGRES_URL || process.env.DATABASE_URL || process.env.VERCEL_ENV;

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

// Universal database operations that work in both environments
export const database = {
  // Initialize database
  init: async () => {
    try {
      if (isVercelProduction) {
        console.log('Using Vercel PostgreSQL');
        await vercel_db_operations.init();
      } else {
        console.log('Using local SQLite');
        getDb(); // Initialize SQLite
      }
    } catch (error) {
      console.error('Database initialization error:', error);
      // Fallback to SQLite if PostgreSQL fails
      if (isVercelProduction) {
        console.log('Falling back to SQLite');
        getDb();
      }
    }
  },

  // Session operations
  createSession: async (session: Omit<Session, 'created_at' | 'completed'>) => {
    if (isVercelProduction) {
      return await vercel_db_operations.createSession(session);
    } else {
      return db_operations.createSession(session);
    }
  },

  getSession: async (sessionId: string) => {
    if (isVercelProduction) {
      return await vercel_db_operations.getSession(sessionId);
    } else {
      return db_operations.getSession(sessionId);
    }
  },

  markSessionCompleted: async (sessionId: string) => {
    if (isVercelProduction) {
      return await vercel_db_operations.markSessionCompleted(sessionId);
    } else {
      return db_operations.markSessionCompleted(sessionId);
    }
  },

  // Event operations
  trackEvent: async (event: Event) => {
    if (isVercelProduction) {
      return await vercel_db_operations.trackEvent(event);
    } else {
      return db_operations.trackEvent(event);
    }
  },

  // Answer operations
  saveAnswer: async (answer: Answer) => {
    if (isVercelProduction) {
      return await vercel_db_operations.saveAnswer(answer);
    } else {
      return db_operations.saveAnswer(answer);
    }
  },

  // Analytics queries
  getFunnelStats: async () => {
    if (isVercelProduction) {
      return await vercel_db_operations.getFunnelStats();
    } else {
      return db_operations.getFunnelStats();
    }
  },

  getAnswerStats: async () => {
    if (isVercelProduction) {
      return await vercel_db_operations.getAnswerStats();
    } else {
      return db_operations.getAnswerStats();
    }
  },

  getTotalSessions: async () => {
    if (isVercelProduction) {
      return await vercel_db_operations.getTotalSessions();
    } else {
      return db_operations.getTotalSessions();
    }
  },

  getCompletionRate: async () => {
    if (isVercelProduction) {
      return await vercel_db_operations.getCompletionRate();
    } else {
      return db_operations.getCompletionRate();
    }
  },

  getSessionsByDate: async (days = 7) => {
    if (isVercelProduction) {
      return await vercel_db_operations.getSessionsByDate(days);
    } else {
      return db_operations.getSessionsByDate(days);
    }
  },

  // Clear all analytics data
  clearAllData: async () => {
    if (isVercelProduction) {
      return await vercel_db_operations.clearAllData();
    } else {
      return db_operations.clearAllData();
    }
  }
};

// Export default
export default database;