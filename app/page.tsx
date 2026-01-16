
"use client";

import React, { useState, useEffect } from 'react';
import {
  ArrowRight, ArrowDown, CheckCircle,
  AlertCircle, Battery, Heart, ChevronRight, Star
} from 'lucide-react';
import { usePageTracking, useAnalytics, STEP_NAMES } from '@/lib/analytics';

// --- CONFIGURATION & DATA ---

const buttonStyle = {
  background: '#7A1E3A',
  border: 'none',
  borderRadius: '9999px',
  padding: '16px 32px',
  height: '48px',
  fontFamily: 'Inter',
  fontWeight: 700,
  fontSize: '14px',
  lineHeight: '150%',
  letterSpacing: '1px',
  textTransform: 'uppercase' as const,
  color: '#FFFFFF',
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
  border: '1.5px solid #E0D1D5',
  borderRadius: '8px',
  padding: '16px',
  fontFamily: 'Inter',
  fontWeight: 600,
  fontSize: '16px',
  lineHeight: '150%',
  color: '#562935',
  width: '100%',
  cursor: 'pointer',
  position: 'relative' as const,
  overflow: 'hidden' as const
};

const textStyle = {
  color: '#562935',
  fontFamily: 'Inter',
  lineHeight: '150%'
};

const headingStyle = {
  color: '#562935',
  fontFamily: 'Instrument Serif, serif',
  lineHeight: '150%'
};

// Glow data for personalization
const GLOW_INSIGHTS = {
  skinTypes: {
    burns_first: {
      label: 'Fair, Burns Easily',
      glowPotential: 'HIGH',
      timeline: '2-3 weeks for visible results'
    },
    slow_tan: {
      label: 'Medium, Slow to Tan',
      glowPotential: 'HIGH',
      timeline: '3-4 weeks for full glow'
    },
    easy_tan: {
      label: 'Medium-Dark, Tans Easily',
      glowPotential: 'EXCELLENT',
      timeline: '1-2 weeks for enhanced glow'
    },
    cant_tan: {
      label: 'Very Fair, Cannot Tan',
      glowPotential: 'PERFECT',
      timeline: '2-4 weeks for safe, natural color'
    }
  },
  frustrations: {
    streaks: 'Get even, natural-looking color without streaks or patches',
    time: 'Achieve your glow in just 5 seconds daily',
    uv_damage: 'Build color safely with zero UV exposure',
    expensive: 'Maintain year-round glow for less than $2/day',
    nothing_works: 'Finally find a solution that actually delivers results'
  }
};

const STEPS = {
  INTRO: 0,
  GENDER: 1,
  SKIN_TYPE: 2,
  CURRENT_APPROACH: 3,
  BIGGEST_FRUSTRATION: 4,
  INTERSTITIAL_1: 5, // "The Problem" - Sun vs Self-Tanners
  TIME_REALITY: 6,
  PAST_DISAPPOINTMENTS: 7,
  INTERSTITIAL_2: 8, // "Social Proof" - 86,000+ Women
  DREAM_SCENARIO: 9,
  CONFIDENCE_IMPACT: 10,
  WHAT_MATTERS_MOST: 11,
  INTERSTITIAL_3: 12, // "The Solution Tease" - Drink Your Tan
  UPCOMING_MOTIVATION: 13,
  COMMITMENT_CHECK: 14,
  INTERSTITIAL_4: 15, // "How It Works" - Comparison table
  RESULTS: 16, // "Your Personalized Glow Assessment"
  FINAL_COMMITMENT: 17, // Final commitment modal
  OFFER_LOADING: 18, // Loading screen before offer
  PREDICTION: 19 // Redirects to /offer
};

const Header = () => (
  <div className="w-full bg-white shadow-sm flex justify-center items-center sticky top-0 z-50 mb-8" style={{ height: '80px' }}>
    <img
      src="/glowdrop-black-svg.svg"
      alt="Glowdrop"
      className="h-8 object-contain"
    />
  </div>
);

const ProgressBar = ({ progress }: { progress: number }) => (
  <div className="w-full max-w-lg px-4">
    <div style={{ 
      borderRadius: '16px',
      border: '2px solid #E0D1D5',
      background: '#FFFFFF',
      height: '8px',
      overflow: 'hidden',
    }}>
      <div 
        className="h-full transition-all duration-500 ease-out" 
        style={{ 
          width: `${progress}%`,
          background: '#7A1E3A',
          borderRadius: '16px'
        }}
      ></div>
    </div>
  </div>
);

export default function GlowDropQuizApp() {
  const [step, setStep] = useState(STEPS.INTRO);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<Record<string, any>>({});
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

  // Enhanced loading for glow assessment analysis
  const handleGlowAssessment = (nextStep: number) => {
    setLoading(true);
    
    const messages = [
      'Analyzing your tanning preferences...',
      'Evaluating your skin type and concerns...',
      'Matching you with your perfect glow protocol...',
      'Calculating your personalized results...',
      'Building your custom glow plan...'
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
    }, 8000);
  };

  const selectAnswer = (key: string, value: any, autoAdvance: boolean = true) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
    // Auto-advance logic is handled in handleOptionClick
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

  // Get quiz answers for personalization
  const getQuizAnswers = () => {
    return {
      gender: (answers as any)['gender'] || '',
      skinType: (answers as any)['skinType'] || '',
      currentApproach: (answers as any)['currentApproach'] || '',
      frustration: (answers as any)['frustration'] || '',
      timeReality: (answers as any)['timeReality'] || '',
      pastDisappointments: (answers as any)['pastDisappointments'] || '',
      dreamScenario: (answers as any)['dreamScenario'] || '',
      confidenceImpact: (answers as any)['confidenceImpact'] || '',
      whatMattersMost: (answers as any)['whatMattersMost'] || '',
      upcomingMotivation: (answers as any)['upcomingMotivation'] || '',
      commitmentCheck: (answers as any)['commitmentCheck'] || ''
    };
  };

  // --- RENDER STEPS ---

  // 0. Intro / Landing Screen
  if (step === STEPS.INTRO) {
    return (
      <div className="min-h-screen flex flex-col items-center" style={{ backgroundColor: '#F9F7F5FF' }}>
        <Header />
        <div className="w-full max-w-xl px-4 mt-4 md:mt-8 text-center relative">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-4" style={headingStyle}>
            Wish You Could Wake Up With a Natural, Sun-Kissed Glow (even when it's winter)?
          </h2>
          <p className="text-lg mb-8" style={textStyle}>
            Take this 60-second quiz to discover why your current tanning routine isn't working—and what 86,000+ women are doing instead.
          </p>

          {/* Gender question */}
          <div className="bg-white rounded-xl p-6 mb-6" style={{ border: '1px solid #E0D1D5' }}>
            <h3 className="text-xl font-bold mb-4" style={headingStyle}>First, tell us about yourself:</h3>
            <div className="space-y-3">
              {['👩 I\'m a Woman', '👨 I\'m a Man'].map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    selectAnswer('gender', option, false);
                    setSelectedItems(prev => {
                      const updated = new Set<string>();
                      updated.add(option);
                      return { ...prev, [STEPS.INTRO]: updated };
                    });
                    trackAnswerSelect(step, option);
                    setTimeout(() => {
                      setStep(STEPS.SKIN_TYPE);
                    }, 400);
                  }}
                  className={`w-full transition-all flex items-center justify-between quiz-option ${selectedItems[STEPS.INTRO]?.has(option) ? 'selected' : ''}`}
                  style={multipleChoiceButtonStyle}
                >
                  <span>{option}</span>
                  {selectedItems[STEPS.INTRO]?.has(option) && (
                    <CheckCircle
                      size={20}
                      color="#562935"
                      className="checkmark-animate"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs" style={{ color: '#562935', fontFamily: 'Inter', lineHeight: '150%' }}>
            By continuing, you agree to our Privacy Policy and Terms of Service.
          </p>
        </div>
      </div>
    );
  }

  // 1. Gender Question - Redirect to SKIN_TYPE
  if (step === STEPS.GENDER) {
    setStep(STEPS.SKIN_TYPE);
    return null;
  }

  // 2. Question 1: Skin Type
  if (step === STEPS.SKIN_TYPE) {
    return (
      <QuizLayout progress={10}>
        <h2 className="text-2xl font-bold text-center mb-6" style={headingStyle}>How easily do you tan?</h2>
        <div className="space-y-3">
          {[
            '☀️ I burn first, then maybe get a little color',
            '🌤️ I can tan, but it takes forever and fades fast',
            '🔥 I tan easily but hate the sun damage',
            '🧊 I can\'t tan—I just stay pale or burn'
          ].map((option) => (
            <button
              key={option}
              onClick={() => {
                selectAnswer('skinType', option, false);
                handleOptionClick(option, STEPS.CURRENT_APPROACH, false);
              }}
              className={`w-full transition-all flex items-center justify-between quiz-option ${isSelected(option) ? 'selected' : ''}`}
              style={multipleChoiceButtonStyle}
            >
              <span>{option}</span>
              {isSelected(option) && (
                <CheckCircle
                  size={20}
                  color="#562935"
                  className="checkmark-animate"
                />
              )}
            </button>
          ))}
        </div>
      </QuizLayout>
    );
  }

  // 3. Question 2: Current Approach
  if (step === STEPS.CURRENT_APPROACH) {
    return (
      <QuizLayout progress={20}>
        <h2 className="text-2xl font-bold text-center mb-6" style={headingStyle}>How do you currently try to get a tan?</h2>
        <div className="space-y-3">
          {[
            '☀️ Sunbathing or tanning beds',
            '🧴 Self-tanners (lotions, mousses, sprays)',
            '✨ Professional spray tans',
            '💄 Just bronzer and makeup',
            '🤷 I\'ve basically given up'
          ].map((option) => (
            <button
              key={option}
              onClick={() => {
                selectAnswer('currentApproach', option, false);
                handleOptionClick(option, STEPS.BIGGEST_FRUSTRATION, false);
              }}
              className={`w-full transition-all flex items-center justify-between quiz-option ${isSelected(option) ? 'selected' : ''}`}
              style={multipleChoiceButtonStyle}
            >
              <span>{option}</span>
              {isSelected(option) && (
                <CheckCircle
                  size={20}
                  color="#562935"
                  className="checkmark-animate"
                />
              )}
            </button>
          ))}
        </div>
      </QuizLayout>
    );
  }

  // 4. Question 3: Biggest Frustration
  if (step === STEPS.BIGGEST_FRUSTRATION) {
    return (
      <QuizLayout progress={30}>
        <h2 className="text-2xl font-bold text-center mb-6" style={headingStyle}>What's your #1 frustration with tanning?</h2>
        <div className="space-y-3">
          {[
            '🦓 Streaks, patches, or looking orange',
            '⏰ Takes too long (and stains everything)',
            '☀️ I don\'t want UV damage to my skin',
            '💸 Too expensive and fades too fast',
            '😩 Nothing actually works for me'
          ].map((option) => (
            <button
              key={option}
              onClick={() => {
                selectAnswer('frustration', option, false);
                handleOptionClick(option, STEPS.INTERSTITIAL_1, false);
              }}
              className={`w-full transition-all flex items-center justify-between quiz-option ${isSelected(option) ? 'selected' : ''}`}
              style={multipleChoiceButtonStyle}
            >
              <span>{option}</span>
              {isSelected(option) && (
                <CheckCircle
                  size={20}
                  color="#562935"
                  className="checkmark-animate"
                />
              )}
            </button>
          ))}
        </div>
      </QuizLayout>
    );
  }

  // 5. Interstitial 1: The Problem
  if (step === STEPS.INTERSTITIAL_1) {
    const continueButton = (
      <button onClick={() => setStep(STEPS.TIME_REALITY)} className="w-full flex items-center justify-center gap-3 cta-button" style={buttonStyle}>
        Continue <ArrowRight size={24} color="#FFFFFF" />
      </button>
    );

    return (
      <QuizLayout progress={35} fixedButton={continueButton}>
        <div className="text-center py-4 md:py-8 animate-fade-in">
          <h2 className="text-2xl font-bold mb-6" style={headingStyle}>You're Not Alone. Here's The Harsh Truth...</h2>
          
          <div className="space-y-4 mb-6">
            <div className="bg-white rounded-xl p-4" style={{ border: '1px solid #E0D1D5' }}>
              <h3 className="font-bold mb-2" style={headingStyle}>Option A: Sun Tanning</h3>
              <ul className="text-left text-sm space-y-1" style={textStyle}>
                <li>• Burns and damages your skin</li>
                <li>• Causes premature aging & wrinkles</li>
                <li>• Not available year-round</li>
                <li>• Fades within weeks</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl p-4" style={{ border: '1px solid #E0D1D5' }}>
              <h3 className="font-bold mb-2" style={headingStyle}>Option B: Self-Tanners</h3>
              <ul className="text-left text-sm space-y-1" style={textStyle}>
                <li>• 30+ minutes to apply properly</li>
                <li>• Streaks, smell, stains everything</li>
                <li>• Fades patchy within days</li>
                <li>• Endless maintenance cycle</li>
              </ul>
            </div>
          </div>

          <p className="text-lg font-bold mb-4" style={headingStyle}>What if there was a third option?</p>
        </div>
      </QuizLayout>
    );
  }

  // 6. Question 4: Time Reality
  if (step === STEPS.TIME_REALITY) {
    return (
      <QuizLayout progress={45}>
        <h2 className="text-2xl font-bold text-center mb-6" style={headingStyle}>How much time do you have for a tanning routine?</h2>
        <div className="space-y-3">
          {[
            '⏱️ 5 minutes max',
            '😅 I barely have time to shower',
            '🙄 I have time but hate wasting it on this'
          ].map((option) => (
            <button
              key={option}
              onClick={() => {
                selectAnswer('timeReality', option, false);
                handleOptionClick(option, STEPS.PAST_DISAPPOINTMENTS, false);
              }}
              className={`w-full transition-all flex items-center justify-between quiz-option ${isSelected(option) ? 'selected' : ''}`}
              style={multipleChoiceButtonStyle}
            >
              <span>{option}</span>
              {isSelected(option) && (
                <CheckCircle
                  size={20}
                  color="#562935"
                  className="checkmark-animate"
                />
              )}
            </button>
          ))}
        </div>
      </QuizLayout>
    );
  }

  // 7. Question 5: Past Disappointments
  if (step === STEPS.PAST_DISAPPOINTMENTS) {
    return (
      <QuizLayout progress={50}>
        <h2 className="text-2xl font-bold text-center mb-6" style={headingStyle}>Have you been disappointed by tanning products before?</h2>
        <div className="space-y-3">
          {[
            '😤 Yes, multiple times (graveyard of half-used bottles)',
            '😔 Yes, once was enough to make me skeptical',
            '🆕 I haven\'t found anything that works yet'
          ].map((option) => (
            <button
              key={option}
              onClick={() => {
                selectAnswer('pastDisappointments', option, false);
                handleOptionClick(option, STEPS.INTERSTITIAL_2, false);
              }}
              className={`w-full transition-all flex items-center justify-between quiz-option ${isSelected(option) ? 'selected' : ''}`}
              style={multipleChoiceButtonStyle}
            >
              <span>{option}</span>
              {isSelected(option) && (
                <CheckCircle
                  size={20}
                  color="#562935"
                  className="checkmark-animate"
                />
              )}
            </button>
          ))}
        </div>
      </QuizLayout>
    );
  }

  // 8. Interstitial 2: Social Proof
  if (step === STEPS.INTERSTITIAL_2) {
    const continueButton = (
      <button onClick={() => setStep(STEPS.DREAM_SCENARIO)} className="w-full flex items-center justify-center gap-3 cta-button" style={buttonStyle}>
        Continue <ArrowRight size={24} color="#FFFFFF" />
      </button>
    );

    return (
      <QuizLayout progress={55} fixedButton={continueButton}>
        <div className="text-center py-4 md:py-8 animate-fade-in">
          <h2 className="text-2xl font-bold mb-6" style={headingStyle}>86,000+ Women Have Already Made The Switch</h2>
          <p className="text-lg mb-6" style={textStyle}>From streaky self-tanners to effortless, year-round glow</p>

          {/* Real testimonial */}
          <div className="mb-6 p-6 rounded-xl" style={{ backgroundColor: '#FFF4FD', border: '1px solid #E0D1D5' }}>
            <div className="flex justify-center mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={16} fill="#FFD700" stroke="#FFD700" />
              ))}
            </div>
            <blockquote className="italic mb-4 text-sm" style={textStyle}>
              "I was SO skeptical—I've tried every self-tanner and they all made me look like a streaky orange mess. But this? After about 2 weeks my coworkers started asking if I'd been somewhere sunny. I literally just add drops to my morning coffee. No smell, no stains, just... a glow. I'm obsessed."
            </blockquote>
            <p className="font-bold text-sm" style={textStyle}>— Rachel M., verified buyer</p>
          </div>

          <div className="flex justify-center items-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} size={20} fill="#FFD700" stroke="#FFD700" />
            ))}
            <span className="ml-2 font-semibold" style={textStyle}>4.8/5 Average Rating</span>
          </div>

          <p className="text-xs text-gray-500">*Results may vary. Best results seen with consistent daily use over 4-6 weeks.</p>
        </div>
      </QuizLayout>
    );
  }

  // 9. Question 6: Dream Scenario
  if (step === STEPS.DREAM_SCENARIO) {
    return (
      <QuizLayout progress={60}>
        <h2 className="text-2xl font-bold text-center mb-6" style={headingStyle}>Imagine waking up with a natural, golden glow. No streaks. No smell. No effort. How would that feel?</h2>
        <div className="space-y-3">
          {[
            '🔥 Like a weight off my shoulders',
            '😍 Confident enough to wear whatever I want',
            '✨ Like I\'ve been waiting my whole life for this'
          ].map((option) => (
            <button
              key={option}
              onClick={() => {
                selectAnswer('dreamScenario', option, false);
                handleOptionClick(option, STEPS.CONFIDENCE_IMPACT, false);
              }}
              className={`w-full transition-all flex items-center justify-between quiz-option ${isSelected(option) ? 'selected' : ''}`}
              style={multipleChoiceButtonStyle}
            >
              <span>{option}</span>
              {isSelected(option) && (
                <CheckCircle
                  size={20}
                  color="#562935"
                  className="checkmark-animate"
                />
              )}
            </button>
          ))}
        </div>
      </QuizLayout>
    );
  }

  // 10. Question 7: Confidence Impact
  if (step === STEPS.CONFIDENCE_IMPACT) {
    return (
      <QuizLayout progress={65}>
        <h2 className="text-2xl font-bold text-center mb-6" style={headingStyle}>Has not having a tan ever stopped you from...</h2>
        <div className="space-y-3">
          {[
            '👗 Wearing certain clothes (shorts, dresses, swimsuits)',
            '📸 Feeling confident in photos',
            '🏖️ Enjoying beach days or pool parties',
            '😔 Feeling as attractive as I want to feel',
            '🙅 None of these'
          ].map((option) => (
            <button
              key={option}
              onClick={() => {
                selectAnswer('confidenceImpact', option, false);
                handleOptionClick(option, STEPS.WHAT_MATTERS_MOST, false);
              }}
              className={`w-full transition-all flex items-center justify-between quiz-option ${isSelected(option) ? 'selected' : ''}`}
              style={multipleChoiceButtonStyle}
            >
              <span>{option}</span>
              {isSelected(option) && (
                <CheckCircle
                  size={20}
                  color="#562935"
                  className="checkmark-animate"
                />
              )}
            </button>
          ))}
        </div>
      </QuizLayout>
    );
  }

  // 11. Question 8: What Matters Most
  if (step === STEPS.WHAT_MATTERS_MOST) {
    return (
      <QuizLayout progress={70}>
        <h2 className="text-2xl font-bold text-center mb-6" style={headingStyle}>In a tanning solution, what matters most to you?</h2>
        <div className="space-y-3">
          {[
            '🌿 Safe ingredients (no UV, no harsh chemicals)',
            '⚡ Speed and convenience',
            '✨ Natural-looking results (not orange)',
            '🧴 Skincare benefits too',
            '💰 Actually worth the money'
          ].map((option) => (
            <button
              key={option}
              onClick={() => {
                selectAnswer('whatMattersMost', option, false);
                handleOptionClick(option, STEPS.INTERSTITIAL_3, false);
              }}
              className={`w-full transition-all flex items-center justify-between quiz-option ${isSelected(option) ? 'selected' : ''}`}
              style={multipleChoiceButtonStyle}
            >
              <span>{option}</span>
              {isSelected(option) && (
                <CheckCircle
                  size={20}
                  color="#562935"
                  className="checkmark-animate"
                />
              )}
            </button>
          ))}
        </div>
      </QuizLayout>
    );
  }

  // 12. Interstitial 3: The Solution Tease
  if (step === STEPS.INTERSTITIAL_3) {
    const continueButton = (
      <button onClick={() => setStep(STEPS.UPCOMING_MOTIVATION)} className="w-full flex items-center justify-center gap-3 cta-button" style={buttonStyle}>
        Show Me How <ArrowRight size={24} color="#FFFFFF" />
      </button>
    );

    return (
      <QuizLayout progress={75} fixedButton={continueButton}>
        <div className="text-center py-4 md:py-8 animate-fade-in">
          <h2 className="text-2xl font-bold mb-6" style={headingStyle}>What If You Could Just... Drink Your Tan?</h2>

          <p className="text-lg mb-6" style={textStyle}>Sounds crazy, right? But here's the science:</p>

          <div className="text-left mb-6 p-4 rounded-xl" style={{ backgroundColor: '#FFF4FD', border: '1px solid #E0D1D5' }}>
            <p className="mb-4" style={textStyle}>
              Your skin's golden color comes from <strong>melanin</strong>—a pigment your body makes naturally.
            </p>
            <p className="mb-4" style={textStyle}>
              Certain vitamins and amino acids (like <strong>Beta-Carotene</strong> and <strong>L-Tyrosine</strong>) support your body's melanin production from within.
            </p>
            <p className="mb-4" style={textStyle}>
              The result? A gradual, natural-looking tan that:
            </p>
            <ul className="space-y-2 text-sm mb-4" style={textStyle}>
              <li>• Doesn't streak or stain</li>
              <li>• Doesn't smell weird</li>
              <li>• Requires ZERO UV exposure</li>
              <li>• Takes 5 seconds a day</li>
            </ul>
            <p className="font-bold text-center" style={textStyle}>
              This is exactly what GlowDrop does.
            </p>
          </div>
        </div>
      </QuizLayout>
    );
  }

  // 13. Question 9: Upcoming Motivation
  if (step === STEPS.UPCOMING_MOTIVATION) {
    return (
      <QuizLayout progress={80}>
        <h2 className="text-2xl font-bold text-center mb-6" style={headingStyle}>Do you have anything coming up where you'd love to look your best?</h2>
        <div className="space-y-3">
          {[
            '👰 Wedding or special event',
            '🏖️ Vacation or beach trip',
            '🌸 Summer is coming',
            '🔄 I just want to look good year-round'
          ].map((option) => (
            <button
              key={option}
              onClick={() => {
                selectAnswer('upcomingMotivation', option, false);
                handleOptionClick(option, STEPS.COMMITMENT_CHECK, false);
              }}
              className={`w-full transition-all flex items-center justify-between quiz-option ${isSelected(option) ? 'selected' : ''}`}
              style={multipleChoiceButtonStyle}
            >
              <span>{option}</span>
              {isSelected(option) && (
                <CheckCircle
                  size={20}
                  color="#562935"
                  className="checkmark-animate"
                />
              )}
            </button>
          ))}
        </div>
      </QuizLayout>
    );
  }

  // 14. Question 10: Commitment Check
  if (step === STEPS.COMMITMENT_CHECK) {
    return (
      <QuizLayout progress={85}>
        <h2 className="text-2xl font-bold text-center mb-6" style={headingStyle}>If there was a 5-second daily routine that gave you a natural glow without UV damage or messy self-tanners... would you try it?</h2>
        <div className="space-y-3">
          {[
            '✅ Yes, I\'ve been waiting for this',
            '🤔 Maybe, if it actually works',
            '💸 Depends on the price'
          ].map((option) => (
            <button
              key={option}
              onClick={() => {
                selectAnswer('commitmentCheck', option, false);
                handleOptionClick(option, STEPS.INTERSTITIAL_4, false);
              }}
              className={`w-full transition-all flex items-center justify-between quiz-option ${isSelected(option) ? 'selected' : ''}`}
              style={multipleChoiceButtonStyle}
            >
              <span>{option}</span>
              {isSelected(option) && (
                <CheckCircle
                  size={20}
                  color="#562935"
                  className="checkmark-animate"
                />
              )}
            </button>
          ))}
        </div>
      </QuizLayout>
    );
  }

  // 15. Interstitial 4: How It Works
  if (step === STEPS.INTERSTITIAL_4) {
    const continueButton = (
      <button onClick={() => handleGlowAssessment(STEPS.RESULTS)} className="w-full flex items-center justify-center gap-3 cta-button" style={buttonStyle}>
        See My Results <ArrowRight size={24} color="#FFFFFF" />
      </button>
    );

    return (
      <QuizLayout progress={90} fixedButton={continueButton}>
        <div className="text-center py-4 md:py-8 animate-fade-in">
          <h2 className="text-2xl font-bold mb-6" style={headingStyle}>Why GlowDrop Works When Everything Else Failed</h2>

          {/* Comparison Table */}
          <div className="mb-6">
            <div className="grid grid-cols-1 gap-4 mb-4">
              <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444' }}>
                <h3 className="font-bold mb-2 text-red-600">☀️ Sun Tanning</h3>
                <p className="text-sm" style={textStyle}>Burns, ages skin, cancer risk</p>
              </div>
              <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444' }}>
                <h3 className="font-bold mb-2 text-red-600">🧴 Self-Tanners</h3>
                <p className="text-sm" style={textStyle}>Streaks, smells, stains, 30+ min</p>
              </div>
              <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444' }}>
                <h3 className="font-bold mb-2 text-red-600">💨 Spray Tans</h3>
                <p className="text-sm" style={textStyle}>$50+/week, fades in days</p>
              </div>
            </div>

            <div className="p-6 rounded-xl" style={{ backgroundColor: '#FFF4FD', border: '2px solid #7A1E3A' }}>
              <h3 className="font-bold mb-4 text-center" style={headingStyle}>Why GlowDrop Is Different:</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} color="#7A1E3A" className="shrink-0 mt-1" />
                  <span className="text-sm" style={textStyle}><strong>Works from within</strong> — Natural melanin, not painted-on color</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} color="#7A1E3A" className="shrink-0 mt-1" />
                  <span className="text-sm" style={textStyle}><strong>5 seconds daily</strong> — Add drops to any drink</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} color="#7A1E3A" className="shrink-0 mt-1" />
                  <span className="text-sm" style={textStyle}><strong>No mess</strong> — Nothing touches your skin</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} color="#7A1E3A" className="shrink-0 mt-1" />
                  <span className="text-sm" style={textStyle}><strong>Skincare benefits</strong> — Hyaluronic Acid & Collagen</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} color="#7A1E3A" className="shrink-0 mt-1" />
                  <span className="text-sm" style={textStyle}><strong>Safe</strong> — Dermatologist-tested ingredients</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </QuizLayout>
    );
  }

  // 16. Results Screen
  if (step === STEPS.RESULTS) {
    if (loading) return <InterstitialLoading text={loadingMessage || "Creating your personalized glow assessment..."} />;

    const continueButton = (
      <button onClick={() => setStep(STEPS.FINAL_COMMITMENT)} className="w-full flex items-center justify-center gap-3 cta-button cta-button-pulse" style={buttonStyle}>
        GET MY PERSONALIZED GLOW PLAN <ArrowRight size={24} color="#FFFFFF" />
      </button>
    );

    return (
      <QuizLayout progress={95} fixedButton={continueButton}>
        <div className="text-center mb-4">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3"
            style={{
              backgroundColor: '#FFF4FD',
              border: '1px solid #E0D1D5',
              color: '#562935'
            }}
          >
            ✨ YOUR PERSONALIZED GLOW ASSESSMENT
          </span>
          <h2 className="text-xl font-bold" style={headingStyle}>
            Your Glow Potential: HIGH ✨
          </h2>
          <p className="text-sm mt-2" style={textStyle}>Here's what to expect with GlowDrop:</p>
        </div>

        {/* Timeline */}
        <div className="space-y-3 mb-6">
          <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFF4FD', border: '1px solid #E0D1D5' }}>
            <h4 className="font-bold mb-1" style={textStyle}>Week 1-2:</h4>
            <p className="text-sm" style={textStyle}>Subtle healthy undertone develops</p>
          </div>
          <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFF4FD', border: '1px solid #E0D1D5' }}>
            <h4 className="font-bold mb-1" style={textStyle}>Week 2-3:</h4>
            <p className="text-sm" style={textStyle}>Friends start asking "Did you go somewhere?"</p>
          </div>
          <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFF4FD', border: '1px solid #E0D1D5' }}>
            <h4 className="font-bold mb-1" style={textStyle}>Week 4-6:</h4>
            <p className="text-sm" style={textStyle}>Full sun-kissed glow achieved</p>
          </div>
          <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFF4FD', border: '1px solid #E0D1D5' }}>
            <h4 className="font-bold mb-1" style={textStyle}>Ongoing:</h4>
            <p className="text-sm" style={textStyle}>Maintain year-round. Never touch a self-tanner again.</p>
          </div>
        </div>

        {/* Recommendation */}
        <div className="p-6 rounded-xl mb-4" style={{ backgroundColor: '#fff', border: '2px solid #7A1E3A' }}>
          <h3 className="font-bold mb-2 text-center" style={headingStyle}>Recommended For You:</h3>
          <p className="text-center font-semibold" style={textStyle}>GlowDrop Tanning Drops — 3 Month Supply</p>
        </div>
      </QuizLayout>
    );
  }

  // 17. Final Commitment Modal
  if (step === STEPS.FINAL_COMMITMENT) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: '#F9F7F5FF' }}>
        <div className="w-full max-w-md px-4">
          <div className="p-8 rounded-xl animate-fade-in" style={{ backgroundColor: '#fff', border: '2px solid #E0D1D5' }}>
            <h2 className="text-xl font-bold text-center mb-6" style={headingStyle}>
              Are you ready to ditch streaky self-tanners, skip the UV damage, and wake up glowing every day?
            </h2>
            <p className="text-center mb-6 text-sm italic" style={textStyle}>
              86,000+ women already have.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => setStep(STEPS.OFFER_LOADING)}
                className="w-full py-4 rounded-lg font-bold transition-all"
                style={{
                  backgroundColor: '#7A1E3A',
                  border: 'none',
                  borderRadius: '9999px',
                  color: '#FFFFFF',
                  fontFamily: 'Inter',
                  cursor: 'pointer'
                }}
              >
                Yes, Show Me GlowDrop →
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="w-full py-3 rounded-lg font-medium transition-all text-sm"
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid #E0D1D5',
                  color: '#562935',
                  fontFamily: 'Inter',
                  cursor: 'pointer'
                }}
              >
                No, I'll stick with what I'm doing
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 18. Offer Loading Screen
  if (step === STEPS.OFFER_LOADING) {
    return <OfferLoadingScreen />;
  }

  // 19. Prediction - Redirects to offer
  if (step === STEPS.PREDICTION) {
    window.location.href = '/offer';
    return null;
  }

  return <div>Unknown Step</div>;
}

// Helper Components

function QuizLayout({ children, progress, fixedButton }: { children: React.ReactNode; progress: number; fixedButton?: React.ReactNode }) {
  return (
    <div className={`min-h-screen flex flex-col items-center ${fixedButton ? 'pb-24 md:pb-0' : ''}`} style={{ backgroundColor: '#F9F7F5FF' }}>
      <Header />
      <ProgressBar progress={progress} />
      <div className="w-full max-w-lg px-4 mt-8 mb-8 animate-fade-in-up">
        <div className="p-6 md:p-8 rounded-xl shadow-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 1)', border: '1px solid #E0D1D5' }}>
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
            borderTop: '2px solid #E0D1D5',
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
        <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: '#F9F7F5FF' }}>
             <div className="w-16 h-16 border-4 rounded-full animate-spin mb-6" style={{ borderColor: '#E0D1D5', borderTopColor: '#562935' }}></div>
             {icon && <CheckCircle className="w-12 h-12 mb-4 animate-bounce" color="#562935" />}
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: '#F9F7F5FF' }}>
      <div className="text-center max-w-md">
        <div className="w-20 h-20 border-4 rounded-full animate-spin mb-6 mx-auto" style={{ borderColor: '#E0D1D5', borderTopColor: '#562935' }}></div>
        
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
            <span className="text-[10px] px-2 py-0.5 rounded mt-2 inline-block" style={{ backgroundColor: '#7A1E3A', color: '#fff' }}>
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
                  backgroundColor: i === currentTestimonial ? '#562935' : '#d1d5db'
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