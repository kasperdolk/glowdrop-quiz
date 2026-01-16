import { useEffect, useState, useCallback } from 'react';

// Step mapping for analytics
export const STEP_NAMES = {
  0: 'INTRO',
  1: 'GENDER',
  2: 'AGE',
  3: 'CONCERN',
  4: 'SEVERITY',
  5: 'INTERSTITIAL_1',
  6: 'LIFESTYLE_DIET',
  7: 'SLEEP',
  8: 'STRESS',
  9: 'SENSITIVITY',
  10: 'SOCIAL_PROOF',
  11: 'INTERSTITIAL_2',
  12: 'ANALYSIS_GRAPH',
  13: 'PAST_SOLUTIONS',
  14: 'FAILURE_EXPLAINER',
  15: 'TIME_COMMITMENT',
  16: 'MOTIVATIONAL',
  17: 'EMOTIONAL_CHECK',
  18: 'FUTURE_SELF',
  19: 'URGENCY',
  20: 'COMMITMENT_1',
  21: 'TIMELINE',
  22: 'COMMITMENT_2',
  23: 'OFFER_LOADING',
  24: 'PREDICTION',
  25: 'OFFER_PAGE'
} as const;

export const STEP_QUESTIONS = {
  INTRO: 'What is your gender?',
  AGE: 'How old are you?',
  CONCERN: 'What is your biggest health-related concern?',
  SEVERITY: 'How often do you feel these symptoms?',
  LIFESTYLE_DIET: 'How would you describe your daily diet?',
  SLEEP: 'How much sleep do you usually get?',
  STRESS: 'I feel the pressure of stress...',
  SENSITIVITY: 'Do you have a sensitive stomach?',
  PAST_SOLUTIONS: 'What solutions have you tried before?',
  TIME_COMMITMENT: 'How much time do you have for a health routine?',
  EMOTIONAL_CHECK: 'Has dealing with [concern] ever made you feel older than you really are?',
  FUTURE_SELF: 'Imagine waking up with [benefits]... How would that make you feel?',
  URGENCY: 'Do you have an important event coming up?',
  COMMITMENT_1: 'Are you ready to transform your health naturally?',
  COMMITMENT_2: 'Did you know that parasites are a hidden cause of bloating, fatigue, and weight gain?',
  OFFER_PAGE: 'Which plan do you prefer?'
} as const;

// Generate or retrieve session ID
function getSessionId(): string {
  if (typeof window === 'undefined') return '';

  let sessionId = localStorage.getItem('quiz_session_id');
  if (!sessionId) {
    sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('quiz_session_id', sessionId);
  }
  return sessionId;
}

// Analytics tracking function
async function trackEvent(
  eventType: 'page_view' | 'button_click' | 'answer_select' | 'step_complete',
  stepNumber?: number,
  data?: any,
  answer?: string,
  question?: string
) {
  try {
    const sessionId = getSessionId();
    if (!sessionId) return;

    const stepName = stepNumber !== undefined ? STEP_NAMES[stepNumber as keyof typeof STEP_NAMES] : undefined;

    const payload = {
      sessionId,
      eventType,
      stepName,
      stepNumber,
      data,
      answer,
      question: question || (stepName ? STEP_QUESTIONS[stepName as keyof typeof STEP_QUESTIONS] : undefined)
    };

    // Send tracking request
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

  } catch (error) {
    console.warn('Analytics tracking failed:', error);
  }
}

// Hook for tracking page views
export function usePageTracking(stepNumber: number) {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      trackEvent('page_view', stepNumber);
    }, 100); // Small delay to ensure component is mounted

    return () => clearTimeout(timeoutId);
  }, [stepNumber]);
}

// Hook for tracking user interactions
export function useAnalytics() {
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    setSessionId(getSessionId());
  }, []);

  const trackButtonClick = useCallback((stepNumber: number, buttonText: string, data?: any) => {
    trackEvent('button_click', stepNumber, { buttonText, ...data });
  }, []);

  const trackAnswerSelect = useCallback((stepNumber: number, answer: string, question?: string) => {
    trackEvent('answer_select', stepNumber, { answer }, answer, question);
  }, []);

  const trackStepComplete = useCallback((stepNumber: number, data?: any) => {
    trackEvent('step_complete', stepNumber, data);
  }, []);

  const trackCustomEvent = useCallback((eventType: string, stepNumber?: number, data?: any) => {
    trackEvent(eventType as any, stepNumber, data);
  }, []);

  return {
    sessionId,
    trackButtonClick,
    trackAnswerSelect,
    trackStepComplete,
    trackCustomEvent
  };
}

// Utility function to track answer selection with automatic question detection
export function trackAnswer(stepNumber: number, answer: string, customQuestion?: string) {
  const stepName = STEP_NAMES[stepNumber as keyof typeof STEP_NAMES];
  const question = customQuestion || (stepName ? STEP_QUESTIONS[stepName as keyof typeof STEP_QUESTIONS] : undefined);

  trackEvent('answer_select', stepNumber, { answer }, answer, question);
}

// Utility function for manual tracking (for use in components without hooks)
export const analytics = {
  trackPageView: (stepNumber: number) => trackEvent('page_view', stepNumber),
  trackButtonClick: (stepNumber: number, buttonText: string, data?: any) =>
    trackEvent('button_click', stepNumber, { buttonText, ...data }),
  trackAnswer,
  trackStepComplete: (stepNumber: number, data?: any) => trackEvent('step_complete', stepNumber, data),
  getSessionId
};

export default analytics;