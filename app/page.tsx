
"use client";

import React, { useState, useEffect } from 'react';
import {
  ArrowRight, ArrowDown, CheckCircle,
  AlertCircle, Battery, Heart, ChevronRight, Star
} from 'lucide-react';
import { usePageTracking, useAnalytics, STEP_NAMES } from '@/lib/analytics';

// --- CONFIGURATION & DATA ---

const buttonStyle = {
  background: 'linear-gradient(0deg, #BCF263 0%, #D7FD41 100%)',
  border: '1.5px solid #121212',
  borderRadius: '8px',
  padding: '16px 32px',
  height: '48px',
  fontFamily: 'Inter',
  fontWeight: 700,
  fontSize: '14px',
  lineHeight: '150%',
  letterSpacing: '1px',
  textTransform: 'uppercase' as const,
  color: '#121212',
  display: 'flex',
  flexDirection: 'row' as const,
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
  gap: '12px',
  width: '100%',
  cursor: 'pointer'
};

const multipleChoiceButtonStyle = {
  backgroundColor: '#FFFFFF',
  border: '1.5px solid #121212',
  borderRadius: '8px',
  padding: '16px',
  fontFamily: 'Inter',
  fontWeight: 600,
  fontSize: '16px',
  lineHeight: '150%',
  color: '#121212',
  width: '100%',
  cursor: 'pointer',
  position: 'relative' as const,
  overflow: 'hidden' as const
};

const textStyle = {
  color: '#121212',
  fontFamily: 'Inter',
  lineHeight: '150%'
};

const headingStyle = {
  color: '#121212',
  fontFamily: '"Cooper Lt BT Bold", serif',
  lineHeight: '150%'
};

// Health concern data for personalization
const CONCERN_DATA: Record<string, {
  shortName: string;
  emoji: string;
  symptom: string;
  healthMarker: string;
  markerStatus: string;
  benefit: string;
  futureState: string;
  reviewMatch: string;
  rootCause: string;
  statPercent: number;
}> = {
  '🎈 Constant Bloating': {
    shortName: 'Bloating',
    emoji: '🎈',
    symptom: 'uncomfortable bloating after meals',
    healthMarker: 'Gut Inflammation',
    markerStatus: 'High',
    benefit: 'Eliminates bloating within 7 days',
    futureState: 'Flat, comfortable stomach',
    reviewMatch: 'bloating',
    rootCause: 'parasites releasing toxins in your gut lining',
    statPercent: 94
  },
  '😴 Low Energy / Fatigue': {
    shortName: 'Fatigue',
    emoji: '😴',
    symptom: 'constant tiredness and brain fog',
    healthMarker: 'Energy Production',
    markerStatus: 'Depleted',
    benefit: 'Restores natural energy levels',
    futureState: 'Boundless daily energy',
    reviewMatch: 'energy',
    rootCause: 'parasites stealing nutrients and draining your energy',
    statPercent: 91
  },
  '💓 High Blood Pressure': {
    shortName: 'Blood Pressure',
    emoji: '💓',
    symptom: 'elevated blood pressure readings',
    healthMarker: 'Cardiovascular Stress',
    markerStatus: 'Elevated',
    benefit: 'Supports healthy blood pressure naturally',
    futureState: 'Balanced, healthy circulation',
    reviewMatch: 'blood pressure',
    rootCause: 'parasitic infection causing systemic inflammation',
    statPercent: 89
  },
  '🛡️ Weak Immune System': {
    shortName: 'Immunity',
    emoji: '🛡️',
    symptom: 'frequent colds and slow recovery',
    healthMarker: 'Immune Efficiency',
    markerStatus: 'Low',
    benefit: 'Strengthens immune defense',
    futureState: 'Robust immune protection',
    reviewMatch: 'immune',
    rootCause: 'parasites compromising your gut barrier and immune function',
    statPercent: 92
  },
  '🦴 Joint Inflammation': {
    shortName: 'Joint Pain',
    emoji: '🦴',
    symptom: 'stiff, achy joints',
    healthMarker: 'Inflammation Markers',
    markerStatus: 'Elevated',
    benefit: 'Reduces joint inflammation',
    futureState: 'Flexible, pain-free movement',
    reviewMatch: 'joint',
    rootCause: 'parasitic toxins triggering inflammatory response',
    statPercent: 88
  },
  '🍽️ Poor Digestion': {
    shortName: 'Digestion',
    emoji: '🍽️',
    symptom: 'irregular digestion and discomfort',
    healthMarker: 'Digestive Function',
    markerStatus: 'Impaired',
    benefit: 'Optimizes digestive health',
    futureState: 'Perfect digestive balance',
    reviewMatch: 'digestion',
    rootCause: 'parasites disrupting your gut microbiome balance',
    statPercent: 93
  }
};

const STEPS = {
  INTRO: 0,
  GENDER: 1, // NEW: Gender question as first question
  AGE: 2,
  CONCERN: 3,
  SEVERITY: 4,
  INTERSTITIAL_1: 5, // "You are in the right place"
  LIFESTYLE_DIET: 6,
  SLEEP: 7,
  STRESS: 8,
  SENSITIVITY: 9,
  SOCIAL_PROOF: 10, // NEW: "5,245+ People thriving" - like Spartan's 1.4M
  INTERSTITIAL_2: 11, // "Creating Profile" with modals
  ANALYSIS_GRAPH: 12, // The "Collagen Loss" equivalent
  PAST_SOLUTIONS: 13,
  FAILURE_EXPLAINER: 14, // "Why most solutions fail"
  TIME_COMMITMENT: 15,
  MOTIVATIONAL: 16, // NEW: "Your Health Shouldn't Be Complicated" - like Spartan's busy schedule
  EMOTIONAL_CHECK: 17, // "Feel older than you are?"
  FUTURE_SELF: 18,
  URGENCY: 19, // "Event coming up?"
  COMMITMENT_1: 20, // NEW: First commitment modal
  TIMELINE: 21, // NEW: Week-by-week expectation setter
  COMMITMENT_2: 22, // NEW: Second commitment modal
  OFFER_LOADING: 23, // NEW: Loading screen before offer with discount urgency
  PREDICTION: 24 // "3 Months away" - redirects to /offer
};

const Header = () => (
  <div className="w-full bg-white shadow-sm flex justify-center items-center sticky top-0 z-50 mb-8" style={{ height: '80px' }}>
    <img 
      src="/logo_serene.png" 
      alt="Serene Herbs" 
      className="h-16 object-contain"
    />
  </div>
);

const ProgressBar = ({ progress }: { progress: number }) => (
  <div className="w-full max-w-lg px-4">
    <div style={{ 
      borderRadius: '16px',
      border: '2px solid #121212',
      background: '#FFFFFF',
      height: '8px',
      overflow: 'hidden',
    }}>
      <div 
        className="h-full transition-all duration-500 ease-out" 
        style={{ 
          width: `${progress}%`,
          background: 'linear-gradient(45deg, #FB82AD 20%, #F9C570 50%, #D7F186 100%)',
          borderRadius: '16px'
        }}
      ></div>
    </div>
  </div>
);

export default function SoursopQuizApp() {
  const [step, setStep] = useState(STEPS.INTRO);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState({});
  const [selectedItems, setSelectedItems] = useState<Record<number, Set<string>>>({});
  const [loadingMessage, setLoadingMessage] = useState('');

  // Analytics tracking
  usePageTracking(step);
  const { trackButtonClick, trackAnswerSelect, trackStepComplete } = useAnalytics();

  // Simulating the loading delays from the video
  const handleNextWithDelay = (nextStep: number, delay: number = 2000) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(nextStep);
    }, delay);
  };

  // Enhanced loading for health profile analysis - PERSONALIZED
  const handleHealthProfileAnalysis = (nextStep: number) => {
    setLoading(true);
    
    // Get personalized loading messages based on their concerns
    const concerns = selectedItems[STEPS.CONCERN];
    const concernsList = concerns ? Array.from(concerns) : [];
    const primaryConcern = concernsList[0] ? CONCERN_DATA[concernsList[0]]?.shortName?.toLowerCase() : 'health';
    
    const messages = [
      'Analyzing your responses...',
      `Evaluating your ${primaryConcern} indicators...`,
      'Cross-referencing with our health database...',
      'Identifying your key health markers...',
      'Calculating personalized risk factors...',
      'Building your custom wellness profile...'
    ];
    
    let messageIndex = 0;
    setLoadingMessage(messages[0]);
    
    const messageInterval = setInterval(() => {
      messageIndex++;
      if (messageIndex < messages.length) {
        setLoadingMessage(messages[messageIndex]);
      } else {
        clearInterval(messageInterval);
      }
    }, 1600);
    
    setTimeout(() => {
      clearInterval(messageInterval);
      setLoading(false);
      setStep(nextStep);
    }, 10000);
  };

  const selectAnswer = (key: string, value: any, autoAdvance: boolean = true) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
    if (autoAdvance) {
      if (step === STEPS.INTRO) setStep(STEPS.AGE);
      else if (step === STEPS.AGE) setStep(STEPS.CONCERN);
      else if (step === STEPS.CONCERN) setStep(STEPS.SEVERITY);
      else if (step === STEPS.SEVERITY) setStep(STEPS.INTERSTITIAL_1);
      // ... continued logic in render
    }
  };

  // Handle button click with checkmark animation
  const handleOptionClick = (option: string, nextStep: number, isMultipleChoice: boolean = false) => {
    // Track the answer selection
    trackAnswerSelect(step, option);

    // Add to selected items
    setSelectedItems(prev => {
      const current = prev[step] || new Set();
      const updated = new Set(current);
      if (isMultipleChoice) {
        // Toggle for multiple choice
        if (updated.has(option)) {
          updated.delete(option);
        } else {
          updated.add(option);
        }
      } else {
        // Single choice - replace
        updated.clear();
        updated.add(option);
      }
      return { ...prev, [step]: updated };
    });

    // Auto-advance after showing checkmark (delay for animation)
    if (!isMultipleChoice) {
      setTimeout(() => {
        trackStepComplete(step);
        setStep(nextStep);
      }, 500);
    }
  };

  const isSelected = (option: string) => {
    return selectedItems[step]?.has(option) || false;
  };

  // Get selected health concerns for personalization
  const getSelectedConcerns = () => {
    const concernStep = STEPS.CONCERN;
    const concerns = selectedItems[concernStep];
    if (!concerns || concerns.size === 0) {
      // Default fallback if somehow no concerns selected
      return ['🎈 Constant Bloating', '😴 Low Energy / Fatigue'];
    }
    return Array.from(concerns);
  };

  // Get personalized data based on selected concerns
  const getPersonalizedData = () => {
    const concerns = getSelectedConcerns();
    const concernDataList = concerns.map(c => CONCERN_DATA[c]).filter(Boolean);
    
    // Primary concern is the first one selected
    const primary = concernDataList[0] || CONCERN_DATA['🎈 Constant Bloating'];
    const secondary = concernDataList[1] || concernDataList[0] || primary;
    
    return {
      concerns: concernDataList,
      primary,
      secondary,
      allSymptoms: concernDataList.map(c => c.symptom),
      allBenefits: concernDataList.map(c => c.benefit),
      allFutureStates: concernDataList.map(c => c.futureState),
      healthMarkers: concernDataList.slice(0, 2).map(c => ({ name: c.healthMarker, status: c.markerStatus })),
      shortNames: concernDataList.map(c => c.shortName)
    };
  };

  // --- RENDER STEPS ---

  // 0. Intro / Landing - Now includes Gender question
  if (step === STEPS.INTRO) {
    return (
      <div className="min-h-screen flex flex-col items-center" style={{ backgroundColor: '#F9F4EA' }}>
        <Header />
        <div className="w-full max-w-xl px-4 mt-4 md:mt-8 text-center relative">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-6" style={headingStyle}>
            Bloating, Brain Fog and Stubborn fat? <span className="underline decoration-4" style={{ textDecorationColor: '#D6FD41' }}>You might have a parasite!</span> Take this doctor approved quiz to find out.
          </h2>

          {/* Gender question directly in intro */}
          <div className="bg-white rounded-xl p-6 mb-6" style={{ border: '1px solid #121212' }}>
            <h3 className="text-xl font-bold mb-4" style={headingStyle}>What is your gender?</h3>
            <div className="space-y-3">
              {['👩 Female', '👨 Male', '🧑 Other / Prefer not to say'].map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    selectAnswer('gender', option, false);
                    setSelectedItems(prev => {
                      const updated = new Set<string>();
                      updated.add(option);
                      return { ...prev, [STEPS.INTRO]: updated };
                    });
                    // Auto-advance after selection
                    setTimeout(() => {
                      setStep(STEPS.AGE);
                    }, 400);
                  }}
                  className={`w-full transition-all flex items-center justify-between quiz-option ${selectedItems[STEPS.INTRO]?.has(option) ? 'selected' : ''}`}
                  style={multipleChoiceButtonStyle}
                >
                  <span>{option}</span>
                  {selectedItems[STEPS.INTRO]?.has(option) && (
                    <CheckCircle
                      size={20}
                      color="#121212"
                      className="checkmark-animate"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs" style={{ color: '#121212', fontFamily: 'Inter', lineHeight: '150%' }}>
            By continuing, you agree to our Privacy Policy and Terms of Service.
          </p>
        </div>
      </div>
    );
  }

  // 1. Gender Question - Now skipped as it's part of intro, kept for backwards compatibility
  if (step === STEPS.GENDER) {
    // Redirect to AGE if somehow landed here
    setStep(STEPS.AGE);
    return null;
  }

  // 2. Age Question
  if (step === STEPS.AGE) {
    return (
      <QuizLayout progress={8}>
        <h2 className="text-2xl font-bold text-center mb-6" style={headingStyle}>How old are you?</h2>
        <div className="space-y-3">
          {['🌱 Under 30', '💪 30-39', '✨ 40-49', '🌟 50-59', '👑 Over 60'].map((age) => (
            <button
              key={age}
              onClick={() => {
                selectAnswer('age', age, false);
                handleOptionClick(age, STEPS.CONCERN, false);
              }}
              className={`w-full transition-all flex items-center justify-between quiz-option ${isSelected(age) ? 'selected' : ''}`}
              style={multipleChoiceButtonStyle}
            >
              <span>{age}</span>
              {isSelected(age) && (
                <CheckCircle
                  size={20}
                  color="#121212"
                  className="checkmark-animate"
                />
              )}
            </button>
          ))}
        </div>
      </QuizLayout>
    );
  }

  // 2. Main Concern
  if (step === STEPS.CONCERN) {
    const continueButton = (
      <button
        onClick={() => {
          trackButtonClick(step, 'Continue');
          trackStepComplete(step);
          setStep(STEPS.SEVERITY);
        }}
        className="w-full flex items-center justify-center gap-3 cta-button"
        style={buttonStyle}
      >
        Continue <ArrowRight size={24} color="#121212" />
      </button>
    );

    return (
      <QuizLayout progress={10} fixedButton={continueButton}>
        <h2 className="text-2xl font-bold text-center mb-6" style={headingStyle}>What is your biggest health-related concern?</h2>
        <p className="text-center mb-6 text-sm" style={{ color: '#121212', fontFamily: 'Inter', lineHeight: '150%' }}>(Choose as many as you like)</p>
        <div className="space-y-3">
          {[
            '🎈 Constant Bloating',
            '😴 Low Energy / Fatigue',
            '💓 High Blood Pressure',
            '🛡️ Weak Immune System',
            '🦴 Joint Inflammation',
            '🍽️ Poor Digestion'
          ].map((item) => (
            <button
              key={item}
              onClick={() => handleOptionClick(item, STEPS.SEVERITY, true)}
              className={`w-full text-left px-6 py-4 rounded-lg transition-all font-medium flex items-center justify-between quiz-option ${isSelected(item) ? 'selected' : ''}`}
              style={multipleChoiceButtonStyle}
            >
              <span>{item}</span>
              {isSelected(item) && (
                <CheckCircle
                  size={20}
                  color="#121212"
                  className="checkmark-animate"
                />
              )}
            </button>
          ))}
        </div>
      </QuizLayout>
    );
  }

  // 3. Severity (Adaptation of "How deep are wrinkles")
  if (step === STEPS.SEVERITY) {
    return (
      <QuizLayout progress={20}>
        <h2 className="text-2xl font-bold text-center mb-8" style={headingStyle}>How often do you feel these symptoms?</h2>
        <div className="space-y-3">
          {['😊 Almost never', '😐 A few times a week', '😩 Every single day'].map((opt) => (
            <button 
              key={opt}
              onClick={() => handleOptionClick(opt, STEPS.INTERSTITIAL_1, false)}
              className={`w-full py-4 rounded-lg font-medium flex items-center justify-between quiz-option ${isSelected(opt) ? 'selected' : ''}`}
              style={multipleChoiceButtonStyle}
            >
              <span>{opt}</span>
              {isSelected(opt) && (
                <CheckCircle 
                  size={20} 
                  color="#121212" 
                  className="checkmark-animate"
                />
              )}
            </button>
          ))}
        </div>
      </QuizLayout>
    );
  }

  // 4. Interstitial 1 (Social Proof) - PERSONALIZED
  if (step === STEPS.INTERSTITIAL_1) {
    const personalized = getPersonalizedData();
    const concernsList = personalized.shortNames.slice(0, 3).join(', ').toLowerCase();

    const continueButton = (
      <button onClick={() => setStep(STEPS.LIFESTYLE_DIET)} className="w-full flex items-center justify-center gap-3 cta-button" style={buttonStyle}>
        Continue <ArrowRight size={24} color="#121212" />
      </button>
    );

    return (
      <QuizLayout progress={25} fixedButton={continueButton}>
        <div className="text-center py-4 md:py-8 animate-fade-in">
          <div className="text-4xl mb-4">🦠</div>
          <h2 className="text-2xl font-bold mb-4" style={headingStyle}>These could be signs of parasites!</h2>
          <p className="mb-4" style={textStyle}>
            <span className="font-bold">Over 3.5 billion people worldwide</span> are affected by parasites. Your symptoms of <span className="font-bold" style={{ color: '#121212' }}>{concernsList}</span> are common indicators of <span className="font-bold" style={{ color: '#ef4444' }}>parasitic infection.</span>
          </p>
          <p className="mb-4 text-sm" style={textStyle}>
            The good news? We've helped thousands eliminate parasites naturally with the <span className="font-bold" style={{ color: '#121212' }}>Serene Herbs Parasite Cleanse Protocol.</span>
          </p>

          {/* Personalized concern badges */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {personalized.concerns.slice(0, 3).map((c, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{
                  background: 'linear-gradient(90deg, rgba(189, 243, 97, 0.3) 0%, rgba(214, 253, 65, 0.3) 100%)',
                  border: '1px solid #121212',
                  color: '#121212'
                }}
              >
                {c.emoji} {c.shortName}
              </span>
            ))}
          </div>

          {/* Before/After visuals */}
          <div className="flex justify-center items-center gap-2 mb-6">
             <div className="text-center">
               <div className="w-28 h-28 md:w-36 md:h-36 rounded-lg overflow-hidden" style={{ border: '2px solid #121212' }}>
                 <img src="/image-before.png" alt="Before" className="w-full h-full object-cover" />
               </div>
               <span className="text-xs font-semibold mt-1 block" style={textStyle}>Before</span>
             </div>
             <div className="flex items-center">
               <ArrowRight size={20} color="#121212" />
             </div>
             <div className="text-center">
               <div className="w-28 h-28 md:w-36 md:h-36 rounded-lg overflow-hidden" style={{ border: '2px solid #BDF361' }}>
                 <img src="/image-after.png" alt="After" className="w-full h-full object-cover" />
               </div>
               <span className="text-xs font-semibold mt-1 block" style={textStyle}>After</span>
             </div>
          </div>
        </div>
      </QuizLayout>
    );
  }

  // 5. Lifestyle (Adaptation of "Sun Exposure")
  if (step === STEPS.LIFESTYLE_DIET) {
    return (
      <QuizLayout progress={35}>
        {/* Question Image */}
        <div className="mb-6 rounded-xl overflow-hidden" style={{ border: '2px solid #121212' }}>
          <img 
            src="/real-diet-img.jpg" 
            alt="Healthy eating" 
            className="w-full h-48 object-cover"
            onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=400&fit=crop'; }}
          />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6" style={headingStyle}>How would you describe your daily diet?</h2>
        <div className="space-y-3">
          {[
            '🍔 Mostly processed / Fast food',
            '🍩 Balanced but I love sugar',
            '🥗 Strictly healthy / Organic',
            '🤷 I am not sure'
          ].map((opt) => (
            <button 
              key={opt} 
              onClick={() => handleOptionClick(opt, STEPS.SLEEP, false)} 
              className={`w-full py-4 rounded-lg font-medium flex items-center justify-between quiz-option ${isSelected(opt) ? 'selected' : ''}`}
              style={multipleChoiceButtonStyle}
            >
              <span>{opt}</span>
              {isSelected(opt) && (
                <CheckCircle 
                  size={20} 
                  color="#121212" 
                  className="checkmark-animate"
                />
              )}
            </button>
          ))}
        </div>
        
        {/* Why we ask box */}
        <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: 'rgba(189, 243, 97, 0.15)', border: '1px solid #BDF361' }}>
          <h4 className="font-bold text-sm mb-2" style={textStyle}>💡 Why we ask</h4>
          <p className="text-xs" style={textStyle}>
            Your diet directly impacts gut health and inflammation levels. Understanding your eating habits helps us tailor recommendations that work with your lifestyle, not against it.
          </p>
        </div>
      </QuizLayout>
    );
  }

  // 6. Sleep
  if (step === STEPS.SLEEP) {
    return (
      <QuizLayout progress={45}>
        {/* Question Image */}
        <div className="mb-6 rounded-xl overflow-hidden" style={{ border: '2px solid #121212' }}>
          <img 
            src="/real-sleep-img.jpg" 
            alt="Quality sleep" 
            className="w-full h-48 object-cover"
            onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&h=400&fit=crop'; }}
          />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6" style={headingStyle}>How much sleep do you usually get?</h2>
        <div className="space-y-3">
          {['😴 More than 8 hours', '🛏️ 7-8 hours', '⏰ Less than 6 hours', '🌙 My sleep is unpredictable'].map((opt) => (
            <button 
              key={opt} 
              onClick={() => handleOptionClick(opt, STEPS.STRESS, false)} 
              className={`w-full py-4 rounded-lg font-medium flex items-center justify-between quiz-option ${isSelected(opt) ? 'selected' : ''}`}
              style={multipleChoiceButtonStyle}
            >
              <span>{opt}</span>
              {isSelected(opt) && (
                <CheckCircle 
                  size={20} 
                  color="#121212" 
                  className="checkmark-animate"
                />
              )}
            </button>
          ))}
        </div>
        
        {/* Why we ask box */}
        <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: 'rgba(189, 243, 97, 0.15)', border: '1px solid #BDF361' }}>
          <h4 className="font-bold text-sm mb-2" style={textStyle}>💡 Why we ask</h4>
          <p className="text-xs" style={textStyle}>
            Quality sleep is essential for your body's natural detoxification and healing processes. Poor sleep weakens immunity and can intensify digestive issues and inflammation.
          </p>
        </div>
      </QuizLayout>
    );
  }

  // 7. Stress
  if (step === STEPS.STRESS) {
    return (
      <QuizLayout progress={55}>
        {/* Question Image */}
        <div className="mb-6 rounded-xl overflow-hidden" style={{ border: '2px solid #121212' }}>
          <img 
            src="/real-stress-img.jpg" 
            alt="Managing stress" 
            className="w-full h-48 object-cover"
            onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=400&fit=crop'; }}
          />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6" style={headingStyle}>I feel the pressure of stress...</h2>
        <div className="space-y-3">
          {['🔥 Every day, constantly', '💼 Most days, especially at work', '📅 Mainly during busy periods', '😌 I rarely feel stressed'].map((opt) => (
            <button 
              key={opt} 
              onClick={() => handleOptionClick(opt, STEPS.SENSITIVITY, false)} 
              className={`w-full py-4 rounded-lg font-medium flex items-center justify-between quiz-option ${isSelected(opt) ? 'selected' : ''}`}
              style={multipleChoiceButtonStyle}
            >
              <span>{opt}</span>
              {isSelected(opt) && (
                <CheckCircle 
                  size={20} 
                  color="#121212" 
                  className="checkmark-animate"
                />
              )}
            </button>
          ))}
        </div>
        
        {/* Why we ask box */}
        <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: 'rgba(189, 243, 97, 0.15)', border: '1px solid #BDF361' }}>
          <h4 className="font-bold text-sm mb-2" style={textStyle}>💡 Why we ask</h4>
          <p className="text-xs" style={textStyle}>
            Chronic stress elevates cortisol levels, which disrupts gut health, weakens immunity, and increases inflammation throughout your body. Managing stress is key to overall wellness.
          </p>
        </div>
      </QuizLayout>
    );
  }

  // 8. Sensitivity (Adaptation)
  if (step === STEPS.SENSITIVITY) {
    return (
      <QuizLayout progress={65}>
        <h2 className="text-2xl font-bold text-center mb-6" style={headingStyle}>Do you have a sensitive stomach?</h2>
        <div className="space-y-3">
          {['✅ Yes', '❌ No', '🤔 I am not sure'].map((opt) => (
            <button 
              key={opt} 
              onClick={() => {
                handleOptionClick(opt, STEPS.SOCIAL_PROOF, false);
              }} 
              className={`w-full py-4 rounded-lg font-medium flex items-center justify-between quiz-option ${isSelected(opt) ? 'selected' : ''}`}
              style={multipleChoiceButtonStyle}
            >
              <span>{opt}</span>
              {isSelected(opt) && (
                <CheckCircle 
                  size={20} 
                  color="#121212" 
                  className="checkmark-animate"
                />
              )}
            </button>
          ))}
        </div>
      </QuizLayout>
    );
  }

  // 9. NEW Social Proof Interstitial (like Spartan's "1.4M people")
  if (step === STEPS.SOCIAL_PROOF) {
    const personalized = getPersonalizedData();

    const continueButton = (
      <button onClick={() => {
        handleNextWithDelay(STEPS.ANALYSIS_GRAPH, 800);
      }} className="w-full flex items-center justify-center gap-3 cta-button" style={buttonStyle}>
        Continue <ArrowRight size={24} color="#121212" />
      </button>
    );

    return (
      <QuizLayout progress={70} fixedButton={continueButton}>
        <div className="text-center py-4 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-2" style={{...headingStyle, background: 'linear-gradient(90deg, #C8A46C 0%, #D4B883 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
            5,245+ People
          </h2>
          <p className="text-xl mb-6" style={textStyle}>
            Have Already Transformed Their Health With Soursop
          </p>

          {/* Real Before & After Photos Grid */}
          <div className="mb-6">
            <h3 className="text-sm font-bold mb-4 uppercase tracking-wide" style={textStyle}>Real Customer Results</h3>
            <div className="grid grid-cols-2 gap-2 md:gap-4">
              {/* Before/After 1 */}
              <div className="relative rounded-lg overflow-hidden" style={{ border: '2px solid #ef4444' }}>
                <img 
                  src="/image_before_1.png" 
                  alt="Customer before" 
                  className="w-full h-24 md:h-32 object-cover"
                />
                <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold" style={{ backgroundColor: '#ef4444', color: '#fff' }}>BEFORE</span>
              </div>
              <div className="relative rounded-lg overflow-hidden" style={{ border: '2px solid #22c55e' }}>
                <img 
                  src="/image_after_1.png" 
                  alt="Customer after" 
                  className="w-full h-24 md:h-32 object-cover"
                />
                <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold" style={{ backgroundColor: '#22c55e', color: '#fff' }}>AFTER</span>
              </div>

              {/* Before/After 2 */}
              <div className="relative rounded-lg overflow-hidden" style={{ border: '2px solid #ef4444' }}>
                <img 
                  src="/image_before_2.png" 
                  alt="Customer before" 
                  className="w-full h-24 md:h-32 object-cover"
                />
                <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold" style={{ backgroundColor: '#ef4444', color: '#fff' }}>BEFORE</span>
              </div>
              <div className="relative rounded-lg overflow-hidden" style={{ border: '2px solid #22c55e' }}>
                <img 
                  src="/image_after_2.png" 
                  alt="Customer after" 
                  className="w-full h-24 md:h-32 object-cover"
                />
                <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold" style={{ backgroundColor: '#22c55e', color: '#fff' }}>AFTER</span>
              </div>
            </div>
            <p className="text-[10px] mt-2 text-gray-500">*Results may vary. Individual results depend on many factors.</p>
          </div>

          <div className="mb-2 md:mb-6">
            <p className="text-sm mb-4" style={textStyle}>
              Just like you, they were struggling with <strong>{personalized.primary.shortName.toLowerCase()}</strong> and wanted a natural solution.
            </p>
            <div className="flex justify-center items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={20} fill="#FFD700" stroke="#FFD700" />
              ))}
              <span className="ml-2 font-semibold" style={textStyle}>4.7/5 Average Rating</span>
            </div>
          </div>
        </div>
      </QuizLayout>
    );
  }

  // 10/11. Analysis Graph (Replicating "Natural Collagen Loss" screen) - PERSONALIZED
  if (step === STEPS.ANALYSIS_GRAPH) {
    if (loading) return <InterstitialLoading text={loadingMessage || "Analyzing your body profile..."} />;

    const personalized = getPersonalizedData();
    const symptomsText = personalized.allSymptoms.slice(0, 2).join(' and ');

    const continueButton = (
      <button onClick={() => setStep(STEPS.PAST_SOLUTIONS)} className="w-full flex items-center justify-center gap-3 cta-button" style={buttonStyle}>
        Continue <ArrowRight size={24} color="#121212" />
      </button>
    );

    return (
      <QuizLayout progress={75} fixedButton={continueButton}>
        <h2 className="text-xl font-bold text-center mb-2" style={headingStyle}>Your Personal Health Analysis</h2>
        <p className="text-center text-sm mb-4" style={textStyle}>Based on your concerns: <strong>{personalized.shortNames.join(', ')}</strong></p>
        
        {/* Graph Visual */}
        <div className="relative h-48 w-full mb-4" style={{ backgroundColor: '#F9F4EA', borderBottom: '1px solid #121212', borderLeft: '1px solid #121212' }}>
          {/* Curve */}
          <svg viewBox="0 0 100 60" className="w-full h-full" preserveAspectRatio="none">
            <path d="M0,55 C20,50 35,35 50,25 C65,15 80,10 100,5" fill="none" stroke="rgba(239, 68, 68, 0.5)" strokeWidth="3" />
            {/* User Dot positioned on the curve */}
            <circle cx="75" cy="12" r="4" fill="#dc2626" stroke="white" strokeWidth="2" />
          </svg>
          {/* User Label */}
          <div className="absolute" style={{ top: '15%', right: '22%' }}>
            <span className="text-[10px] px-2 py-1 rounded" style={{ backgroundColor: '#121212', color: '#F9F4EA' }}>You</span>
          </div>
          {/* Y-axis label */}
          <div className="absolute left-2 top-2 text-[10px]" style={textStyle}>Severity</div>
        </div>

        <div className="p-4 rounded-lg border mb-4" style={{ backgroundColor: 'rgba(239, 68, 68, 0.08)', borderColor: '#ef4444' }}>
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="text-red-600 w-5 h-5" />
            <h4 className="font-bold text-red-600">PARASITE RISK: HIGH</h4>
          </div>
          <p className="text-sm" style={textStyle}>
            Your symptoms of <strong>{symptomsText}</strong> are classic signs of parasitic infection. These unwanted invaders can live in your gut for years, causing ongoing health issues.
          </p>
        </div>

        {/* Personalized Health Markers */}
        <div className="grid grid-cols-2 gap-3 text-sm mb-6">
          {personalized.healthMarkers.map((marker, i) => (
            <div key={i} className="p-3 rounded-lg" style={{ backgroundColor: '#F9F4EA', border: '1px solid #121212' }}>
              <span className="block text-xs mb-1" style={textStyle}>{marker.name}</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-red-500">{marker.status}</span>
                {/* Step Progress Bar - 3 steps, first one blinking */}
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-sm bg-red-500 step-blink"></div>
                  <div className="w-3 h-3 rounded-sm bg-gray-200"></div>
                  <div className="w-3 h-3 rounded-sm bg-gray-200"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Good news callout */}
        <div className="p-3 rounded-lg mb-2 md:mb-6" style={{ backgroundColor: 'rgba(189, 243, 97, 0.15)', border: '1px solid #BDF361' }}>
          <p className="text-sm text-center" style={textStyle}>
            <strong>Good news:</strong> Our 16-herb Parasite Cleanse Formula eliminates parasites naturally while relieving {personalized.shortNames.slice(0, 2).join(' & ').toLowerCase()}
          </p>
        </div>
      </QuizLayout>
    );
  }

  // 12. Past Solutions
  if (step === STEPS.PAST_SOLUTIONS) {
    const continueButton = (
      <button
        onClick={() => setStep(STEPS.FAILURE_EXPLAINER)}
        className="w-full flex items-center justify-center gap-3 cta-button"
        style={buttonStyle}
      >
        Continue <ArrowRight size={24} color="#121212" />
      </button>
    );

    return (
      <QuizLayout progress={80} fixedButton={continueButton}>
        <h2 className="text-2xl font-bold text-center mb-6" style={headingStyle}>What solutions have you tried before?</h2>
        <p className="text-center mb-4" style={textStyle}>(Choose all that apply)</p>
        <div className="space-y-3">
          {['💊 Probiotics / Fiber Supplements', '🍵 Detox Teas', '💉 Prescription Meds', '🥬 Strict Diets', '🆕 Nothing yet'].map((opt) => (
             <button
               key={opt}
               onClick={() => handleOptionClick(opt, STEPS.FAILURE_EXPLAINER, true)}
               className={`w-full py-4 text-left px-6 rounded-lg font-medium flex items-center justify-between quiz-option ${isSelected(opt) ? 'selected' : ''}`}
               style={multipleChoiceButtonStyle}
             >
               <span>{opt}</span>
               {isSelected(opt) && (
                 <CheckCircle
                   size={20}
                   color="#121212"
                   className="checkmark-animate"
                 />
               )}
             </button>
          ))}
        </div>
      </QuizLayout>
    );
  }

  // 13. Why Most Fail (Educational) - PERSONALIZED
  if (step === STEPS.FAILURE_EXPLAINER) {
    const personalized = getPersonalizedData();

    const continueButton = (
      <button onClick={() => setStep(STEPS.TIME_COMMITMENT)} className="w-full flex items-center justify-center gap-3 cta-button" style={buttonStyle}>
        Continue <ArrowRight size={24} color="#121212" />
      </button>
    );

    return (
      <QuizLayout progress={85} fixedButton={continueButton}>
        <h2 className="text-2xl font-bold text-center mb-4" style={headingStyle}>Why Parasites Are So Hard to Eliminate</h2>
        <p className="text-center mb-6 text-sm" style={textStyle}>
          Most cleanses fail because they don't target all parasite life stages. Here's the difference:
        </p>
        
        <div className="flex gap-3 mb-6">
            {/* Other Solutions Card */}
            <div className="flex-1 p-4 rounded-lg border-2" style={{ backgroundColor: 'rgba(239, 68, 68, 0.06)', borderColor: '#fca5a5' }}>
                <div className="text-red-500 font-bold text-sm mb-3 text-center">❌ OTHER CLEANSES</div>
                <ul className="text-sm space-y-2" style={textStyle}>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">•</span>
                    <span>Only kill adult parasites</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">•</span>
                    <span>Eggs & larvae survive</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">•</span>
                    <span>Reinfection happens fast</span>
                  </li>
                </ul>
            </div>
            {/* Serene Herbs Card */}
            <div className="flex-1 p-4 rounded-lg border-2" style={{ backgroundColor: 'rgba(189, 243, 97, 0.12)', borderColor: '#BDF361' }}>
                <div className="flex justify-center mb-2">
                  <img src="/logo_serene.png" alt="Serene Herbs" className="h-8 object-contain" />
                </div>
                <div className="text-green-700 font-bold text-sm mb-3 text-center">✓ OUR PROTOCOL</div>
                <ul className="text-sm space-y-2" style={textStyle}>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">•</span>
                    <span>Eliminates all life stages</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">•</span>
                    <span>16-herb anti-parasitic blend</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">•</span>
                    <span>Prevents reinfection</span>
                  </li>
                </ul>
            </div>
        </div>

        {/* Personalized benefits with stats */}
        <div className="p-4 rounded-lg mb-6" style={{ backgroundColor: '#F9F4EA', border: '1px solid #121212' }}>
          <p className="text-sm font-bold mb-4 text-center" style={textStyle}>Specifically for your concerns, Serene Herbs:</p>
          <ul className="space-y-4">
            {personalized.concerns.slice(0, 3).map((concern, i) => (
              <li key={i} className="flex items-start gap-3" style={textStyle}>
                <CheckCircle size={20} className="shrink-0 mt-0.5" color="#22c55e" />
                <div>
                  <span className="text-sm font-medium">{concern.benefit}</span>
                  <div className="text-xs text-green-600 font-semibold mt-1">
                    {concern.statPercent}% of users report improved {concern.shortName.toLowerCase()}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-center mb-2 md:mb-6" style={textStyle}>
            Our <strong>Soursop + 15 Herb Blend</strong> delivers results in just 2 minutes a day.
        </p>
      </QuizLayout>
    );
  }

  // 14. Time Commitment
  if (step === STEPS.TIME_COMMITMENT) {
    return (
      <QuizLayout progress={82}>
        <h2 className="text-2xl font-bold text-center mb-6" style={headingStyle}>How much time do you have for a health routine?</h2>
        <div className="space-y-3">
          {['⏳ I don\'t have time every day', '⚡ 5 minutes', '☕ 10 minutes', '🧘 30 minutes'].map((opt) => (
             <button 
               key={opt} 
               onClick={() => handleOptionClick(opt, STEPS.MOTIVATIONAL, false)} 
               className={`w-full py-4 rounded-lg font-medium flex items-center justify-between quiz-option ${isSelected(opt) ? 'selected' : ''}`}
               style={multipleChoiceButtonStyle}
             >
               <span>{opt}</span>
               {isSelected(opt) && (
                 <CheckCircle 
                  size={20} 
                  color="#121212" 
                  className="checkmark-animate"
                />
              )}
            </button>
          ))}
        </div>
      </QuizLayout>
    );
  }

  // 15. NEW Motivational Interstitial (like Spartan's "busy schedule doesn't have to stop you")
  if (step === STEPS.MOTIVATIONAL) {
    const personalized = getPersonalizedData();

    const continueButton = (
      <button onClick={() => setStep(STEPS.EMOTIONAL_CHECK)} className="w-full flex items-center justify-center gap-3 cta-button" style={buttonStyle}>
        Continue <ArrowRight size={24} color="#121212" />
      </button>
    );

    return (
      <QuizLayout progress={85} fixedButton={continueButton}>
        <div className="py-8 animate-fade-in">
          <h2 className="text-2xl font-bold text-center mb-4" style={headingStyle}>
            Your Health Shouldn't Be Complicated
          </h2>
          <p className="text-center mb-8" style={textStyle}>
            Even with a busy lifestyle, taking care of your health can be simple and effective with just 2 minutes a day.
          </p>
          
          {/* Before/After visual - Bloated vs Flat Stomach */}
          <div className="flex justify-center items-center gap-2 mb-8">
             <div className="text-center flex-1">
               <div className="w-full max-w-[140px] md:max-w-[180px] mx-auto rounded-lg overflow-hidden mb-2" style={{ border: '2px solid #ef4444' }}>
                 <img 
                   src="/image_before_1.png" 
                   alt="Before - Bloated stomach" 
                   className="w-full h-32 md:h-40 object-cover"
                 />
               </div>
               <div className="flex items-center justify-center gap-2 mb-2">
                 <span className="text-2xl">😔</span>
                 <span className="text-xs font-bold uppercase" style={{ color: '#ef4444' }}>Before</span>
               </div>
               <div className="text-[11px] font-semibold" style={{ color: '#ef4444' }}>
                 Bloated & Uncomfortable
               </div>
             </div>
             
             <div className="flex items-center px-2">
               <ArrowRight size={28} color="#121212" strokeWidth={3} />
             </div>
             
             <div className="text-center flex-1">
               <div className="w-full max-w-[140px] md:max-w-[180px] mx-auto rounded-lg overflow-hidden mb-2" style={{ border: '2px solid #22c55e' }}>
                 <img 
                   src="/image_after_1.png" 
                   alt="After - Flat stomach" 
                   className="w-full h-32 md:h-40 object-cover"
                 />
               </div>
               <div className="flex items-center justify-center gap-2 mb-2">
                 <span className="text-2xl">✨</span>
                 <span className="text-xs font-bold uppercase" style={{ color: '#22c55e' }}>After</span>
               </div>
               <div className="text-[11px] font-semibold" style={{ color: '#22c55e' }}>
                 Flat & Comfortable Stomach
               </div>
             </div>
          </div>

          {/* Key benefits for busy people */}
          <div className="space-y-3 mb-2 md:mb-8">
            <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: '#F9F4EA' }}>
              <CheckCircle size={20} color="#22c55e" className="shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-sm mb-1" style={textStyle}>Just 2 Minutes, Twice Daily</h4>
                <p className="text-xs" style={textStyle}>No complicated routines. Simply take 1 tablespoon after meals.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: '#F9F4EA' }}>
              <CheckCircle size={20} color="#22c55e" className="shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-sm mb-1" style={textStyle}>Works While You Live Your Life</h4>
                <p className="text-xs" style={textStyle}>No special diets, no gym required. Just natural, sustained wellness support.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: '#F9F4EA' }}>
              <CheckCircle size={20} color="#22c55e" className="shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-sm mb-1" style={textStyle}>Real Results in Days, Not Months</h4>
                <p className="text-xs" style={textStyle}>Many people feel improvements within the first week.</p>
              </div>
            </div>
          </div>
        </div>
      </QuizLayout>
    );
  }

  // 16. Emotional Check - PERSONALIZED
  if (step === STEPS.EMOTIONAL_CHECK) {
    const personalized = getPersonalizedData();
    
    return (
      <QuizLayout progress={92}>
        <h2 className="text-2xl font-bold text-center mb-4" style={headingStyle}>
          Has dealing with {personalized.primary.shortName.toLowerCase()} ever made you feel older than you really are?
        </h2>
        <p className="text-center text-sm mb-6" style={textStyle}>Be honest - there's no wrong answer.</p>
        <div className="space-y-3">
          {['😔 Yes, definitely', '😊 Not really', '🤷 Sometimes'].map((opt) => (
             <button 
               key={opt} 
               onClick={() => handleOptionClick(opt, STEPS.FUTURE_SELF, false)} 
               className={`w-full py-4 rounded-lg font-medium flex items-center justify-between quiz-option ${isSelected(opt) ? 'selected' : ''}`}
               style={multipleChoiceButtonStyle}
             >
               <span>{opt}</span>
               {isSelected(opt) && (
                 <CheckCircle 
                   size={20} 
                   color="#121212" 
                   className="checkmark-animate"
                 />
               )}
             </button>
          ))}
        </div>
      </QuizLayout>
    );
  }

  // 17. Future Self (Visualization) - PERSONALIZED
  if (step === STEPS.FUTURE_SELF) {
    const personalized = getPersonalizedData();
    const futureVision = personalized.allFutureStates.slice(0, 2).join(' and ').toLowerCase();
    
    return (
      <QuizLayout progress={95}>
        <h2 className="text-xl font-bold text-center mb-4" style={headingStyle}>
          Imagine waking up with {futureVision}...
        </h2>
        <p className="text-center text-sm mb-6" style={textStyle}>How would that make you feel?</p>
        <div className="space-y-3">
          {[
            { t: '🔥 I\'d feel a surge of confidence', sub: '' },
            { t: '🙌 I\'d finally feel like myself again', sub: '' },
            { t: '🚀 All of the above!', sub: '' },
          ].map((opt) => (
             <button 
               key={opt.t} 
               onClick={() => handleOptionClick(opt.t, STEPS.URGENCY, false)} 
               className={`w-full py-4 rounded-lg font-bold text-left px-6 flex items-center justify-between quiz-option ${isSelected(opt.t) ? 'selected' : ''}`}
               style={multipleChoiceButtonStyle}
             >
               <span>{opt.t}</span>
               {isSelected(opt.t) && (
                 <CheckCircle 
                   size={20} 
                   color="#121212" 
                   className="checkmark-animate"
                 />
               )}
             </button>
          ))}
        </div>
      </QuizLayout>
    );
  }

  // 18. Urgency (Event)
  if (step === STEPS.URGENCY) {
    return (
      <QuizLayout progress={92}>
        <h2 className="text-2xl font-bold text-center mb-2" style={headingStyle}>Do you have an important event coming up?</h2>
        <p className="text-center mb-6 text-sm" style={textStyle}>Having something to look forward to can be great motivation.</p>
        <div className="space-y-3">
          {['🎂 Birthday', '🏖️ Vacation', '🏃 Sporting Event', '❌ No events any time soon'].map((opt) => (
             <button 
               key={opt} 
               onClick={() => {
                 handleOptionClick(opt, STEPS.COMMITMENT_1, false);
               }} 
               className={`w-full py-4 rounded-lg font-medium text-left px-6 flex items-center justify-between quiz-option ${isSelected(opt) ? 'selected' : ''}`}
               style={multipleChoiceButtonStyle}
             >
               <span>{opt}</span>
               {isSelected(opt) && (
                 <CheckCircle 
                   size={20} 
                   color="#121212" 
                   className="checkmark-animate"
                 />
               )}
             </button>
          ))}
        </div>
      </QuizLayout>
    );
  }

  // 19. NEW Commitment Modal 1 (like Spartan's commitment questions during loading)
  if (step === STEPS.COMMITMENT_1) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: '#F9F4EA' }}>
        <div className="w-full max-w-md px-4">
          <div className="p-8 rounded-xl animate-fade-in" style={{ backgroundColor: '#fff', border: '2px solid #121212' }}>
            <p className="text-center text-sm mb-4 text-gray-600" style={{ fontFamily: 'Inter' }}>To move forward, please specify</p>
            <h2 className="text-xl font-bold text-center mb-8" style={headingStyle}>
              Are you ready to transform your health naturally?
            </h2>
            <div className="flex gap-4">
              <button
                onClick={() => setStep(STEPS.TIMELINE)}
                className="flex-1 py-4 rounded-lg font-bold transition-all"
                style={{
                  backgroundColor: '#BDF361',
                  border: '1.5px solid #121212',
                  color: '#121212',
                  fontFamily: 'Inter',
                  cursor: 'pointer'
                }}
              >
                No
              </button>
              <button
                onClick={() => setStep(STEPS.TIMELINE)}
                className="flex-1 py-4 rounded-lg font-bold transition-all"
                style={{
                  backgroundColor: '#BDF361',
                  border: '1.5px solid #121212',
                  color: '#121212',
                  fontFamily: 'Inter',
                  cursor: 'pointer'
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 20. NEW Timeline / Expectation Setter (like Spartan's 6-month goal chart)
  if (step === STEPS.TIMELINE) {
    const personalized = getPersonalizedData();
    const months = ['Week 1', 'Week 2', 'Week 4', 'Week 8', 'Week 12'];
    const goalIndex = 4;

    const continueButton = (
      <button onClick={() => setStep(STEPS.COMMITMENT_2)} className="w-full flex items-center justify-center gap-3 cta-button" style={buttonStyle}>
        Continue <ArrowRight size={24} color="#121212" />
      </button>
    );

    return (
      <QuizLayout progress={95} fixedButton={continueButton}>
        <div className="animate-fade-in">
          <h2 className="text-2xl font-bold text-center mb-3" style={headingStyle}>
            The Last Plan You'll Ever Need
          </h2>
          <p className="text-center mb-8" style={textStyle}>
            Based on your answers, here's what to expect with consistent use of Soursop Bitters
          </p>
          
          {/* Timeline Chart */}
          <div className="mb-8">
            <div className="flex items-end justify-between gap-2 h-64 mb-4">
              {months.map((month, i) => {
                const height = ((i + 1) / months.length) * 100;
                const isGoal = i === goalIndex;
                const colors = ['#60a5fa', '#34d399', '#fbbf24', '#fb923c', '#fb7185'];
                
                return (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div className="relative w-full">
                      {isGoal && (
                        <div 
                          className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap"
                          style={{ backgroundColor: '#22c55e', color: '#fff' }}
                        >
                          ✓ Goal
                        </div>
                      )}
                      <div 
                        className="w-full rounded-t-lg transition-all duration-500"
                        style={{ 
                          height: `${height * 2}px`,
                          backgroundColor: colors[i],
                          border: '1.5px solid #121212'
                        }}
                      ></div>
                    </div>
                    <span className="text-[10px] font-semibold mt-2 text-center" style={textStyle}>{month}</span>
                  </div>
                );
              })}
            </div>
            
            {/* Timeline Benefits */}
            <div className="space-y-3">
              {[
                { week: 'Week 1-2', benefit: personalized.concerns[0]?.benefit || 'Initial detox begins', emoji: '🌱' },
                { week: 'Week 2-4', benefit: personalized.concerns[1]?.benefit || 'Energy levels improve', emoji: '⚡' },
                { week: 'Week 4-8', benefit: personalized.concerns[2]?.benefit || 'Sustained wellness support', emoji: '✨' },
                { week: 'Week 8-12', benefit: 'Full transformation and lasting results', emoji: '🎯' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: '#F9F4EA', border: '1px solid #121212' }}>
                  <span className="text-2xl">{item.emoji}</span>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm" style={textStyle}>{item.week}</h4>
                    <p className="text-xs" style={textStyle}>{item.benefit}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </QuizLayout>
    );
  }

  // 21. NEW Commitment Modal 2
  if (step === STEPS.COMMITMENT_2) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: '#F9F4EA' }}>
        <div className="w-full max-w-md px-4">
          <div className="p-8 rounded-xl animate-fade-in" style={{ backgroundColor: '#fff', border: '2px solid #121212' }}>
            <p className="text-center text-sm mb-4 text-gray-600" style={{ fontFamily: 'Inter' }}>To move forward, please specify</p>
            <h2 className="text-xl font-bold text-center mb-8" style={headingStyle}>
              Did you know that parasites are a hidden cause of bloating, fatigue, and weight gain?
            </h2>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  handleNextWithDelay(STEPS.OFFER_LOADING, 800);
                }}
                className="flex-1 py-4 rounded-lg font-bold transition-all"
                style={{
                  backgroundColor: '#BDF361',
                  border: '1.5px solid #121212',
                  color: '#121212',
                  fontFamily: 'Inter',
                  cursor: 'pointer'
                }}
              >
                No
              </button>
              <button
                onClick={() => {
                  handleNextWithDelay(STEPS.OFFER_LOADING, 800);
                }}
                className="flex-1 py-4 rounded-lg font-bold transition-all"
                style={{
                  backgroundColor: '#BDF361',
                  border: '1.5px solid #121212',
                  color: '#121212',
                  fontFamily: 'Inter',
                  cursor: 'pointer'
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 22. NEW Offer Loading - Urgency message before offer page
  if (step === STEPS.OFFER_LOADING) {
    return <OfferLoadingScreen />;
  }

  // 23. Prediction (Alternative result page - currently redirects to offer)
  if (step === STEPS.PREDICTION) {
    if (loading) return <InterstitialLoading text="Creating your personalized transformation plan..." />;

    const personalized = getPersonalizedData();
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 3);
    const futureDateStr = futureDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const continueButton = (
      <button
        onClick={() => { window.location.href = '/offer'; }}
        className="w-full flex items-center justify-center gap-3 cta-button cta-button-pulse"
        style={buttonStyle}
      >
        CLAIM YOUR DISCOUNT <ArrowRight size={24} color="#121212" />
      </button>
    );

    return (
      <QuizLayout progress={100} fixedButton={continueButton}>
        <div className="text-center mb-4">
          <span 
            className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3" 
            style={{ 
              background: 'linear-gradient(90deg, rgba(189, 243, 97, 0.3) 0%, rgba(214, 253, 65, 0.3) 100%)',
              border: '1px solid #121212',
              color: '#121212'
            }}
          >
            🦠 YOUR PARASITE CLEANSE PROTOCOL IS READY
          </span>
          <h2 className="text-xl font-bold" style={headingStyle}>
            Eliminate Parasites & Say Goodbye to {personalized.shortNames.slice(0, 2).join(' & ')}
          </h2>
          <p className="text-sm mt-2" style={textStyle}>Based on your symptoms, here's your parasite elimination timeline:</p>
        </div>

        {/* Transformation Timeline */}
        <div className="space-y-3 mb-6">
          {personalized.concerns.slice(0, 3).map((concern, i) => (
            <div 
              key={i} 
              className="flex items-center gap-3 p-4 rounded-lg"
              style={{ 
                backgroundColor: '#F9F4EA', 
                border: '1px solid #121212' 
              }}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl" style={{ backgroundColor: '#fff', border: '1px solid #121212' }}>
                {concern.emoji}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold" style={textStyle}>{concern.shortName}</span>
                  <ArrowDown size={14} color="#121212" />
                </div>
                <span className="font-bold text-green-600">{concern.futureState}</span>
                <div className="text-[12px] mt-1" style={textStyle}>
                  Week {i === 0 ? '1-2' : i === 1 ? '2-4' : '4-8'}: {concern.benefit}
                </div>
              </div>
              <CheckCircle size={24} color="#22c55e" />
            </div>
          ))}
        </div>

        {/* Before/After Visualization */}
        <div className="flex justify-between items-center mb-2 md:mb-6 px-2">
            <div className="text-center flex-1">
                <div className="w-20 h-20 rounded-full mb-2 mx-auto flex flex-col items-center justify-center" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px dashed rgba(255, 184, 184, 1)', fontSize: '32px' }}>
                  <span className="text-[32px]">😔</span>
                </div>
                <span className="text-xs font-bold uppercase" style={textStyle}>Today</span>
                <div className="text-[12px] mt-1 text-red-500 font-medium">{personalized.primary.symptom.split(' ').slice(0, 2).join(' ')}</div>
            </div>
            <div className="flex flex-col items-center px-2">
              <ArrowRight className="w-6 h-6" color="#121212" />
              <span className="text-[10px] font-bold mt-1" style={textStyle}>90 DAYS</span>
            </div>
            <div className="text-center flex-1">
                <div className="w-20 h-20 rounded-full mb-2 mx-auto flex flex-col items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(189, 243, 97, 0.3) 0%, rgba(214, 253, 65, 0.3) 100%)', border: '2px solid #BDF361' }}>
                  <span className="text-2xl">✨</span>
                </div>
                <span className="text-xs font-bold uppercase" style={textStyle}>{futureDateStr}</span>
                <div className="text-[12px] mt-1 text-green-600 font-medium">{personalized.primary.futureState}</div>
            </div>
        </div>
      </QuizLayout>
    );
  }

  return <div>Unknown Step</div>;
}

// Helper Components

function QuizLayout({ children, progress, fixedButton }: { children: React.ReactNode; progress: number; fixedButton?: React.ReactNode }) {
  return (
    <div className={`min-h-screen flex flex-col items-center ${fixedButton ? 'pb-24 md:pb-0' : ''}`} style={{ backgroundColor: '#F9F4EA' }}>
      <Header />
      <ProgressBar progress={progress} />
      <div className="w-full max-w-lg px-4 mt-8 mb-8 animate-fade-in-up">
        <div className="p-6 md:p-8 rounded-xl shadow-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 1)', border: '1px solid #121212' }}>
           {children}
           {/* Desktop button (inline) */}
           {fixedButton && (
             <div className="hidden md:block mt-6">
               {fixedButton}
             </div>
           )}
        </div>
      </div>
      {/* Fixed bottom button on mobile */}
      {fixedButton && (
        <div
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
          style={{
            backgroundColor: '#fff',
            borderTop: '2px solid #121212',
            borderRadius: '16px 16px 0 0',
            padding: '12px 16px',
            boxShadow: '0 -4px 20px rgba(0,0,0,0.1)'
          }}
        >
          {fixedButton}
        </div>
      )}
    </div>
  );
}

function InterstitialLoading({ text, icon = false }: { text: string; icon?: boolean }) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: '#F9F4EA' }}>
             <div className="w-16 h-16 border-4 rounded-full animate-spin mb-6" style={{ borderColor: '#F9F4EA', borderTopColor: '#121212' }}></div>
             {icon && <CheckCircle className="w-12 h-12 mb-4 animate-bounce" color="#121212" />}
             <h2 
               key={text}
               className="text-xl font-bold text-center loading-text-fade" 
               style={textStyle}
             >
               {text}
             </h2>
        </div>
    )
}

function OfferLoadingScreen() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  
  const testimonials = [
    {
      name: 'Sarah M.',
      text: '"I\'ve struggled with bloating for years. After just 2 weeks, my stomach is finally flat!"',
      rating: 5
    },
    {
      name: 'Michael R.',
      text: '"My energy levels have completely transformed. I feel like a new person!"',
      rating: 5
    },
    {
      name: 'Jennifer L.',
      text: '"I was skeptical at first, but the results speak for themselves. Best decision ever!"',
      rating: 5
    },
    {
      name: 'David K.',
      text: '"No more brain fog! I can finally think clearly and stay focused all day."',
      rating: 5
    }
  ];
  
  // Auto-redirect to offer page after 8 seconds (longer to show testimonials)
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = '/offer';
    }, 8000);
    return () => clearTimeout(timer);
  }, []);
  
  // Rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [testimonials.length]);
  
  // Get today's date formatted
  const today = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };
  const todayFormatted = today.toLocaleDateString('en-US', dateOptions);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: '#F9F4EA' }}>
      <div className="text-center max-w-md">
        <div className="w-20 h-20 border-4 rounded-full animate-spin mb-6 mx-auto" style={{ borderColor: '#F9F4EA', borderTopColor: '#121212' }}></div>
        
        <h2 className="text-2xl font-bold mb-4 animate-fade-in" style={headingStyle}>
          Getting your personalized parasite cleanse protocol + exclusive discount
        </h2> 
        
        {/* Testimonial Carousel */}
        <div 
          className="p-5 rounded-xl mb-6 animate-fade-in relative overflow-hidden"  
          style={{  
            backgroundColor: '#fff', 
            border: '1.5px solid #121212',
            minHeight: '140px'
          }}
        >
          <div 
            key={currentTestimonial}
            className="testimonial-fade-in"
          >
            <div className="flex justify-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={16} fill="#FFD700" stroke="#FFD700" />
              ))}
            </div>
            <p className="text-sm mb-3 italic" style={textStyle}>
              {testimonials[currentTestimonial].text}
            </p>
            <p className="text-xs font-bold" style={textStyle}>
              — {testimonials[currentTestimonial].name}
            </p>
            <span className="text-[10px] px-2 py-0.5 rounded mt-2 inline-block" style={{ backgroundColor: '#22c55e', color: '#fff' }}>
              ✓ Verified Buyer
            </span>
          </div>
          
          {/* Testimonial dots indicator */}
          <div className="flex justify-center gap-1.5 mt-3">
            {testimonials.map((_, i) => (
              <div 
                key={i} 
                className="w-2 h-2 rounded-full transition-all"
                style={{ 
                  backgroundColor: i === currentTestimonial ? '#121212' : '#d1d5db'
                }}
              />
            ))}
          </div>
        </div>
        
        <div 
          className="p-4 rounded-lg mb-4 animate-fade-in"  
          style={{  
            backgroundColor: 'rgba(239, 68, 68, 0.1)', 
            border: '1.5px solid #ef4444',
            animationDelay: '0.3s' 
          }}
        >
          <p className="text-base font-bold" style={{ ...textStyle, color: '#ef4444' }}>
            🔥 Discount ends on <span className="underline">{todayFormatted}</span> at midnight
          </p>
        </div>
        
        <p className="text-sm animate-fade-in" style={{ ...textStyle, color: '#6b7280', animationDelay: '0.5s' }}>
          Analyzing your symptoms for parasitic infection...
        </p>
      </div>
    </div>
  );
}