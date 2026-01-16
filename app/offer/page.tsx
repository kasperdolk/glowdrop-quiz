"use client";

import React, { useState, useEffect } from 'react';
import { ArrowRight, Check, Star, ShoppingCart, Clock } from 'lucide-react';
import { usePageTracking, useAnalytics } from '@/lib/analytics';

const textStyle = {
  color: '#562935',
  fontFamily: 'Inter',
  lineHeight: '150%'
};

const headingStyle = {
  color: '#562935',
  fontFamily: 'Instrument Serif, serif',
  lineHeight: '120%'
};

// Intensity levels with color gradients
const INTENSITY_LEVELS = [
  {
    id: 'glow-up',
    name: 'Glow Up',
    color: '#C5A572',
    selected: false
  },
  {
    id: 'sun-kissed',
    name: 'Sun Kissed',
    color: '#B8704F',
    selected: true
  },
  {
    id: 'golden-goddess',
    name: 'Golden Goddess',
    color: '#8B4513',
    selected: false
  }
];

// Bundle options matching the image
const BUNDLE_OPTIONS = [
  {
    id: 'buy-1',
    name: 'Buy 1',
    bottles: 1,
    freeBottles: 0,
    totalBottles: 1,
    price: 840,
    originalPrice: 840,
    savings: 0,
    mostPopular: false,
    bestValue: false,
    freeShipping: false
  },
  {
    id: 'buy-2',
    name: 'Buy 2',
    bottles: 2,
    freeBottles: 1,
    totalBottles: 3,
    price: 336,
    originalPrice: 840,
    savings: 504,
    mostPopular: true,
    bestValue: false,
    freeShipping: true
  },
  {
    id: 'buy-3',
    name: 'Buy 3',
    bottles: 3,
    freeBottles: 2,
    totalBottles: 5,
    price: 336,
    originalPrice: 840,
    savings: 504,
    mostPopular: false,
    bestValue: true,
    freeShipping: true
  }
];

const FREE_GIFTS = [
  {
    name: '5x Exclusive Habit Tracker Card',
    image: 'https://assets.replocdn.com/projects/149a24dc-b65a-423d-a51b-0d10fafbd16f/1c76d339-a4cd-4aed-8770-25b0a31851f6?width=96'
  },
  {
    name: '2x Free Extra Bottle',
    image: 'https://glowdrop.co/cdn/shop/files/glowdrop-product-1.webp?v=1760196168&width=96'
  },
  {
    name: 'Free GlowDrop Water Bottle',
    image: 'https://assets.replocdn.com/projects/149a24dc-b65a-423d-a51b-0d10fafbd16f/24d97c7e-5138-418e-8063-60bfa0d29475?width=96'
  }
];

export default function OfferPage() {
  const [selectedIntensity, setSelectedIntensity] = useState('sun-kissed');
  const [selectedBundle, setSelectedBundle] = useState('buy-2');
  const [tanSliderValue, setTanSliderValue] = useState(50);

  // Track offer page view as step 25
  usePageTracking(25);
  const { trackButtonClick, trackAnswerSelect } = useAnalytics();

  const selectedBundleData = BUNDLE_OPTIONS.find(option => option.id === selectedBundle) || BUNDLE_OPTIONS[1];

  const handleAddToCart = () => {
    trackButtonClick(25, 'Add to Cart', {
      intensity: selectedIntensity,
      bundle: selectedBundle,
      price: selectedBundleData.price
    });

    // Redirect to GlowDrop checkout with quiz source
    const checkoutUrl = `https://glowdrop.co/cart/add?quantity=${selectedBundleData.bottles}&properties[Source]=Quiz&properties[Bundle]=${selectedBundleData.name}&return_to=/checkout`;
    window.location.href = checkoutUrl;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9F7F5FF' }}>
      {/* Header */}
      <div className="w-full bg-white shadow-sm flex justify-center items-center sticky top-0 z-50" style={{ height: '80px' }}>
        <img
          src="/glowdrop-black-svg.svg"
          alt="Glowdrop"
          className="h-8 object-contain"
        />
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Title */}
        <h1 className="text-2xl font-bold text-center mb-8" style={headingStyle}>
          Select Your Intensity
        </h1>
        <p className="text-center text-gray-600 mb-8">Choose your desired tan level</p>

        {/* Intensity Selection */}
        <div className="space-y-3 mb-8">
          {INTENSITY_LEVELS.map((level) => (
            <button
              key={level.id}
              onClick={() => {
                setSelectedIntensity(level.id);
                trackAnswerSelect(25, level.name, 'Intensity Selection');
              }}
              className="w-full p-4 rounded-xl border-2 transition-all"
              style={{
                backgroundColor: '#fff',
                borderColor: selectedIntensity === level.id ? '#7A1E3A' : '#E5E7EB',
                boxShadow: selectedIntensity === level.id ? '0 0 0 1px #7A1E3A' : 'none'
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-16 h-6 rounded-full"
                    style={{ backgroundColor: level.color }}
                  ></div>
                  <span className="font-semibold" style={textStyle}>{level.name}</span>
                </div>
                {selectedIntensity === level.id && (
                  <Check size={20} color="#7A1E3A" />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* New Year Sale Section */}
        <div
          className="rounded-t-lg p-4 text-center"
          style={{ backgroundColor: '#562935' }}
        >
          <h2 className="text-white font-bold text-lg tracking-wide">NEW YEAR SALE</h2>
        </div>

        <div className="bg-white p-6 rounded-b-lg shadow-lg mb-6">
          <p className="text-center text-gray-600 mb-4">For a subtle and healthy glow</p>

          {/* Pricing */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-3">
              <span className="text-gray-400 line-through">Dhs. 280</span>
              <span className="text-3xl font-bold" style={textStyle}>Dhs. 112 AED</span>
              <span
                className="bg-pink-500 text-white text-sm font-bold px-2 py-1 rounded"
              >
                60% OFF
              </span>
            </div>
          </div>

          {/* Your Tan Slider */}
          <div className="mb-6">
            <h3 className="text-center font-semibold mb-4" style={textStyle}>Your Tan</h3>
            <div className="relative">
              <div
                className="w-full h-12 rounded-lg flex items-center justify-between px-4"
                style={{
                  background: 'linear-gradient(to right, #E5D4C7, #B8704F)',
                  position: 'relative'
                }}
              >
                <span className="text-sm font-medium text-gray-700">Before</span>
                <span className="text-sm font-medium text-gray-700">After</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={tanSliderValue}
                onChange={(e) => setTanSliderValue(Number(e.target.value))}
                className="absolute top-0 left-0 w-full h-12 opacity-0 cursor-pointer"
              />
              {/* Slider thumb indicator */}
              <div
                className="absolute top-2 w-8 h-8 bg-white border-2 border-gray-300 rounded-full shadow-md"
                style={{
                  left: `calc(${tanSliderValue}% - 16px)`,
                  transition: 'left 0.1s ease'
                }}
              ></div>
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center space-x-2">
              <Check size={16} color="#10B981" />
              <span className="text-sm" style={textStyle}>Light to <strong>medium</strong> tan intensity</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check size={16} color="#10B981" />
              <span className="text-sm" style={textStyle}><strong>Healthy</strong> looking glow</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check size={16} color="#10B981" />
              <span className="text-sm" style={textStyle}>1 Bottle lasts a month</span>
            </div>
          </div>
        </div>

        {/* Urgency Message */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-2 text-pink-600">
            <Clock size={16} />
            <span className="text-sm font-medium">Order before midnight, ships <strong>today</strong></span>
          </div>
        </div>

        {/* Bundle Selection */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {BUNDLE_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                setSelectedBundle(option.id);
                trackAnswerSelect(25, option.name, 'Bundle Selection');
              }}
              className="relative p-3 rounded-lg border-2 transition-all text-center"
              style={{
                backgroundColor: '#fff',
                borderColor: selectedBundle === option.id ? '#7A1E3A' : '#E5E7EB'
              }}
            >
              {option.mostPopular && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <span className="bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded">
                    MOST POPULAR
                  </span>
                </div>
              )}
              {option.bestValue && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <span className="bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded">
                    BEST VALUE
                  </span>
                </div>
              )}

              <div className="mt-2">
                <div className="font-bold text-lg" style={textStyle}>{option.name}</div>
                {option.freeBottles > 0 && (
                  <div className="text-pink-600 text-xs font-semibold">
                    + Get {option.freeBottles} FREE
                  </div>
                )}
                {option.freeShipping && (
                  <div className="text-pink-600 text-xs">FREE SHIPPING</div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Free Gifts Section */}
        <div className="bg-white rounded-lg p-4 mb-6 border-2 border-dashed border-pink-300">
          <div className="text-center mb-4">
            <span className="text-pink-600 font-bold flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 5a2 2 0 012-2h6a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V5zm2 0v10h6V5H7z" clipRule="evenodd" />
              </svg>
              FREE GIFTS INCLUDED
            </span>
          </div>
          <div className="space-y-3">
            {FREE_GIFTS.map((gift, index) => (
              <div key={index} className="flex items-center space-x-3">
                <img
                  src={gift.image}
                  alt={gift.name}
                  className="w-12 h-12 object-contain bg-gray-50 rounded-lg p-1"
                />
                <span className="text-sm font-medium" style={textStyle}>{gift.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Warning Section */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-yellow-600">⚠️</span>
            <span className="font-bold text-yellow-800">WARNING: Low Stock Notice</span>
          </div>
          <p className="text-sm text-yellow-800">
            This product sold out <strong>12 times</strong> last year. We encourage you to take advantage of the{' '}
            <strong>limited sale</strong> and buy now. PS: Only available here, don't buy{' '}
            <strong>fakes on Amazon/eBay</strong>.
          </p>
        </div>

        {/* Final Urgency */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-2 text-pink-600">
            <Clock size={16} />
            <span className="text-sm font-medium">Order before midnight, ships <strong>today</strong></span>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-full py-4 rounded-lg text-white font-bold text-lg transition-all hover:opacity-90"
          style={{ backgroundColor: '#7A1E3A' }}
        >
          <div className="flex items-center justify-center space-x-3">
            <span>Add To Cart</span>
            <span className="line-through text-gray-300">Dhs. 840</span>
            <span>Dhs. 336</span>
          </div>
        </button>

        {/* Social Proof */}
        <div className="text-center mt-4 mb-4">
          <div className="bg-gray-100 rounded-lg py-2 px-4 inline-block">
            <span className="text-sm">🛒 <strong>1150+</strong> Bought Today</span>
          </div>
        </div>

        {/* Money Back Guarantee */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <Check size={16} />
            <span className="text-sm">30-Day Money Back Guarantee</span>
          </div>
        </div>
      </div>
    </div>
  );
}