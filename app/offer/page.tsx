"use client";

import React, { useState, useEffect } from 'react';
import { ArrowRight, Check, Star, ShoppingCart } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { usePageTracking, useAnalytics } from '@/lib/analytics';

// Note: For metadata, this would need to be in a separate layout.tsx file in the offer folder
// since this is a client component. For now, the title will inherit from root layout.

const textStyle = {
  color: '#121212',
  fontFamily: 'Inter',
  lineHeight: '150%'
};

const headingStyle = {
  color: '#121212',
  fontFamily: '"Cooper Lt BT Bold", serif',
  lineHeight: '120%'
};

const buttonStyle = {
  background: 'linear-gradient(0deg, #BCF263 0%, #D7FD41 100%)',
  border: '1.5px solid #121212',
  borderRadius: '8px',
  padding: '16px 32px',
  height: '56px',
  fontFamily: 'Inter',
  fontWeight: 700,
  fontSize: '16px',
  lineHeight: '150%',
  letterSpacing: '0.5px',
  textTransform: 'uppercase' as const,
  color: '#121212',
  display: 'flex',
  flexDirection: 'row' as const,
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
  gap: '12px',
  width: '100%',
  cursor: 'pointer',
  transition: 'all 0.25s',
  boxShadow: '0 4px 14px rgba(188, 242, 99, 0.4)'
};

const PRICING_OPTIONS = [
  {
    id: '6-bottles',
    name: '6 Bottles',
    supplyLabel: '3 Month Supply',
    bottles: 6,
    regularPrice: 239.99,
    salePrice: 109.99,        // Subscribe & Save price
    oneTimePrice: 186.99,     // One-time purchase price from Shopify
    savings: 130.00,
    perBottle: 18.33,
    perDay: 0.61,
    popular: false,
    customers: '47%',
    label: 'BEST VALUE',
    variantId: '42178792751175',
    sellingPlanId: '2026471495',
    image: 'https://sereneherbs.com/cdn/shop/files/Frame_16.png?v=1762628941&width=400'
  },
  {
    id: '4-bottles',
    name: '4 Bottles',
    supplyLabel: '2 Month Supply',
    bottles: 4,
    regularPrice: 249.99,
    salePrice: 89.99,         // Subscribe & Save price
    oneTimePrice: 124.99,     // One-time purchase price from Shopify
    savings: 160.00,
    perBottle: 22.50,
    perDay: 0.75,
    popular: true,
    customers: '32%',
    label: null,
    variantId: '42178732785735',
    sellingPlanId: '2025619527',
    image: 'https://sereneherbs.com/cdn/shop/files/sour4.png?v=1755244981&width=400'
  },
  {
    id: '2-bottles',
    name: '2 Bottles',
    supplyLabel: '1 Month Supply',
    bottles: 2,
    regularPrice: 139.99,
    salePrice: 59.99,         // Subscribe & Save price
    oneTimePrice: 74.99,      // One-time purchase price from Shopify
    savings: 80.00,
    perBottle: 30.00,
    perDay: 1.00,
    popular: false,
    customers: '21%',
    label: null,
    variantId: '42178732818503',
    sellingPlanId: '2025652295',
    image: 'https://sereneherbs.com/cdn/shop/files/sour2.png?v=1755244981&width=400'
  }
];

const PRODUCT_IMAGES = [
  'https://cdn.shopify.com/s/files/1/0563/1216/8519/files/SoursopBitter_4.png?v=1760024700',
  'https://cdn.shopify.com/s/files/1/0563/1216/8519/files/healingtrio2_6e15ad84-456f-4d95-a010-bebbd65e0cc4.png?v=1764935682',
  'https://cdn.shopify.com/s/files/1/0563/1216/8519/files/healingtrio3_70c905ce-e169-4dfd-a800-5e1801dc1a0e.png?v=1764935682',
  'https://cdn.shopify.com/s/files/1/0563/1216/8519/files/IMAGE4.png?v=1764935682',
  'https://cdn.shopify.com/s/files/1/0563/1216/8519/files/IMAGE5_5de403dd-5281-415d-a4db-d7059d998a92.png?v=1764935682',
  'https://cdn.shopify.com/s/files/1/0563/1216/8519/files/Soursop_Original.png?v=1764935682'
];

const INGREDIENTS = [
  {
    name: 'Soursop Leaves',
    description: 'Packed with antioxidants, supports immune health, and may help reduce inflammation. Rich in bioactive compounds that promote cellular health and natural detoxification.'
  },
  {
    name: 'Turmeric Extract',
    description: 'Contains curcumin, known for its powerful anti-inflammatory and antioxidant properties. Supports joint health, reduces oxidative stress, and promotes overall wellness.'
  },
  {
    name: 'Moringa',
    description: 'A superfood rich in vitamins, minerals, and amino acids. Enhances energy, boosts immunity, and supports overall vitality with over 90 nutrients.'
  },
  {
    name: 'Ashwagandha',
    description: 'An adaptogenic herb that helps reduce stress, improve cognitive function, and enhance physical endurance. Balances cortisol levels and promotes mental clarity.'
  },
  {
    name: 'Black Seed',
    description: 'Known for its anti-inflammatory and antioxidant properties. Supports immune function, cardiovascular health, and general well-being.'
  }
];

const REVIEWS = [
  {
    name: 'Kristin M.',
    rating: 5,
    title: '10/10 would recommend to anyone!',
    text: 'My skin is clearer, my gut issues have improved, I have more energy during the day and sleep better at night. 10/10 would recommend to anyone!',
    verified: true
  },
  {
    name: 'Johnathan M.',
    rating: 5,
    title: 'Best purchase I\'ve made',
    text: 'Disgusting taste, but effective with improving your health. Quality of the product is amazing. I\'ve been using this product for a week now and noticed my skin cleared up and I\'ve stopped getting stomach aches.',
    verified: true
  },
  {
    name: 'Jessica F.',
    rating: 5,
    title: 'This stuff works!',
    text: 'I was feeling slow, I kept getting sick and I felt I needed a cleanse. I can really feel the difference after just 5 days, I feel lighter and way more energetic!',
    verified: true
  },
  {
    name: 'Olivia R.',
    rating: 5,
    title: 'My holy grail now',
    text: 'After some research I decided to try this to cleanse my body and it\'s my holy grail now!!! It has had a noticeable brightening effect on me. I feel happier, more energetic, and I can even see that I\'m starting to lose stubborn fat!!',
    verified: true
  }
];

const FAQS = [
  {
    question: 'How long until I see results?',
    answer: 'Some customers start noticing improvements in as little as 7 days. However, everyone is different, so we recommend trying it daily for at least 1-2 months for best results.'
  },
  {
    question: 'What is Soursop Bitters?',
    answer: 'Soursop bitters is a natural health supplement made from the leaves of the soursop fruit tree combined with 15 other powerful herbs. It\'s a potent blend of over 85 bioactive compounds that work together to support overall health and wellness.'
  },
  {
    question: 'How do I take Soursop Bitters?',
    answer: 'Take one tablespoon of Soursop Bitters twice daily, preferably after meals. We recommend mixing it directly with your favorite beverage for smoother digestion and a nutritional boost. Consistent use is key for the best results.'
  },
  {
    question: 'What does Soursop Bitters help with?',
    answer: 'Each bottle contains a potent blend of 16 herbs that may help you strengthen your immunity, heal gut issues, boost energy, support healthy blood pressure, relieve stress, and so much more. Instead of taking multiple supplements, you only need Soursop Bitters for powerful daily health support.'
  },
  {
    question: 'When will my order ship?',
    answer: 'All products are readily available in our facilities and will be shipped out within 1-2 business days of ordering. Most orders arrive in 6-8 days with free shipping on all subscriptions.'
  },
  {
    question: 'What if it doesn\'t work for me?',
    answer: 'We believe in our product so much that we offer a 60-day, no-questions-asked guarantee. If it doesn\'t work for you and you don\'t experience any improvements, we will issue you an immediate refund. You\'re only paying if it turns out to be a lifesaver.'
  },
  {
    question: 'Is it suitable for sensitive stomachs?',
    answer: 'While our formula is natural and gentle, we always recommend consulting with your healthcare provider if you have specific concerns about sensitive stomach or any health conditions.'
  }
];

export default function OfferPage() {
  const [selectedPlan, setSelectedPlan] = useState('6-bottles');
  const [activeTab, setActiveTab] = useState<'details' | 'benefits' | 'ingredients'>('benefits');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Track offer page view as step 25 (after prediction)
  usePageTracking(25);
  const { trackButtonClick, trackAnswerSelect } = useAnalytics();

  const selectedOption = PRICING_OPTIONS.find(opt => opt.id === selectedPlan) || PRICING_OPTIONS[0];

  // Subscribe & Save - uses selling plan, goes directly to checkout
  const handleAddToCart = () => {
    setIsAddingToCart(true);

    // Track purchase attempt
    trackButtonClick(25, 'Add to Cart - Subscribe', {
      plan: selectedOption.id,
      price: selectedOption.salePrice,
      type: 'subscription'
    });

    // Subscription checkout with selling plan - redirect to checkout after adding
    const checkoutUrl = `https://sereneherbs.com/cart/add?id=${selectedOption.variantId}&quantity=1&selling_plan=${selectedOption.sellingPlanId}&properties[Source]=Maison%20Quiz&return_to=/checkout`;

    window.location.href = checkoutUrl;
  };

  // One-time purchase - no selling plan, goes directly to checkout
  const handleOneTimePurchase = () => {
    // Track one-time purchase
    trackButtonClick(25, 'Add to Cart - One Time', {
      plan: selectedOption.id,
      price: selectedOption.oneTimePrice,
      type: 'one-time'
    });

    const checkoutUrl = `https://sereneherbs.com/cart/add?id=${selectedOption.variantId}&quantity=1&properties[Source]=Maison%20Quiz&return_to=/checkout`;
    window.location.href = checkoutUrl;
  };

  // Scroll to offer selection
  const scrollToOffer = () => {
    const element = document.getElementById('offer-selection');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9F4EA' }}>
      {/* Header */}
      <div className="w-full bg-white shadow-sm flex justify-between items-center sticky top-0 z-50 px-4 md:px-8" style={{ height: '80px' }}>
        <img 
          src="/logo_serene.png" 
          alt="Serene Herbs" 
          className="h-16 object-contain"
        />
        <a
          href="https://sereneherbs.com/products/soursop-bitters-copy1?variant=42178732818503"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-lg font-semibold text-xs transition-all"
          style={{
            backgroundColor: '#F9F4EA',
            border: '1.5px solid #121212',
            color: '#121212',
            fontFamily: 'Inter'
          }}
        >
          See our solution
        </a>
      </div>

      {/* Email Section */}
      <div className="text-center py-3 px-4" style={{ backgroundColor: '#121212' }}>
        <p className="text-xs mb-1" style={{ color: '#F9F4EA', fontFamily: 'Inter' }}>
          Need help? We're here!
        </p>
        <a href="mailto:support@sereneherbs.com" className="text-sm font-semibold" style={{ color: '#F9F4EA', fontFamily: 'Inter' }}>
          support@sereneherbs.com
        </a>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 pb-20">
        {/* Profile Matched Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3" style={headingStyle}>
            Parasite Risk Detected: Here is Your Cleanse Protocol
          </h1>
        </div>

        {/* Product Image Carousel */}
        <div className="mb-8 flex justify-center">
          <div className="w-full max-w-md">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={0}
              slidesPerView={1}
              navigation={{
                nextEl: '.swiper-button-next-custom',
                prevEl: '.swiper-button-prev-custom',
              }}
              pagination={{ 
                clickable: true,
                dynamicBullets: true
              }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              loop={true}
              className="rounded-xl"
              style={{ 
                border: '2px solid #121212',
                borderRadius: '12px',
                overflow: 'hidden'
              }}
            >
              {PRODUCT_IMAGES.map((image, index) => (
                <SwiperSlide key={index}>
                  <div style={{ backgroundColor: '#fff' }}>
                    <img 
                      src={image} 
                      alt={`Soursop Bitters ${index + 1}`}
                      className="w-full h-auto"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        {/* Perfect Solution For */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold mb-4" style={headingStyle}>
            Targets Parasites At Every Life Stage
          </h2>
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            {['🦠 Adult Parasites', '🥚 Eggs & Larvae', '🛡️ Prevents Reinfection', '✨ Restores Gut Health'].map((benefit) => (
              <span 
                key={benefit}
                className="px-4 py-2 rounded-full text-sm font-semibold"
                style={{ 
                  background: 'linear-gradient(90deg, rgba(189, 243, 97, 0.3) 0%, rgba(214, 253, 65, 0.3) 100%)',
                  border: '1.5px solid #121212',
                  color: 'rgba(8, 8, 8, 1)'
                }}
              >
                {benefit}
              </span>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div className="flex justify-center items-center gap-2 mb-6">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} size={20} fill="#FFD700" stroke="#FFD700" />
            ))}
          </div>
          <span className="text-sm font-semibold" style={textStyle}>
            Rated 4.7/5 by 5,245+ customers
          </span>
        </div>

        {/* Product Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2" style={headingStyle}>
            Serene Herbs Parasite Cleanse Formula
          </h2>
          <div className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: '#BDF361', color: '#121212' }}>
            Doctor-Approved • 16 Anti-Parasitic Herbs
          </div>
        </div>

        {/* Main CTA Section */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-center mb-4" style={headingStyle}>
            Join Thousands Using This Doctor-Approved Parasite Cleanse to Eliminate Bloating, Brain Fog & Stubborn Fat in Just 2 Minutes Daily
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-start gap-3 p-4 rounded-lg" style={{ backgroundColor: '#fff', border: '1.5px solid #121212' }}>
              <Check size={24} color="#22c55e" className="shrink-0 mt-1" />
              <div>
                <h4 className="font-bold mb-1" style={textStyle}>See Visible Results Fast!</h4>
                <p className="text-sm" style={textStyle}>Experience improvements in energy, digestion, and overall wellness in as little as one week</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg" style={{ backgroundColor: '#fff', border: '1.5px solid #121212' }}>
              <Check size={24} color="#22c55e" className="shrink-0 mt-1" />
              <div>
                <h4 className="font-bold mb-1" style={textStyle}>Combat Root Causes</h4>
                <p className="text-sm" style={textStyle}>Target inflammation, toxin buildup, and immune weakness at the cellular level</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg" style={{ backgroundColor: '#fff', border: '1.5px solid #121212' }}>
              <Check size={24} color="#22c55e" className="shrink-0 mt-1" />
              <div>
                <h4 className="font-bold mb-1" style={textStyle}>Quick and Easy to Use</h4>
                <p className="text-sm" style={textStyle}>Just 2 minutes a day - take 1 tablespoon twice daily after meals</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg" style={{ backgroundColor: '#fff', border: '1.5px solid #121212' }}>
              <Check size={24} color="#22c55e" className="shrink-0 mt-1" />
              <div>
                <h4 className="font-bold mb-1" style={textStyle}>16 Powerful Herbs</h4>
                <p className="text-sm" style={textStyle}>Rich in proprietary blend featuring Soursop, Turmeric, Moringa, Ashwagandha & more</p>
              </div>
            </div>
          </div>
        </div>

        {/* Best Results Callout */}
        <div className="mb-4 p-3 rounded-lg flex items-center gap-3" style={{ backgroundColor: '#F9F4EA', border: '1.5px solid #121212' }}>
          <span className="text-2xl">📅</span>
          <p className="text-sm" style={textStyle}>
            Best results seen after <strong>a few months</strong> of consistent use
          </p>
        </div>

        {/* Pricing Section */}
        <div id="offer-selection" className="mb-8 rounded-xl" style={{ backgroundColor: '#fff', border: '2px solid #121212', padding: '24px' }}>
          <h3 className="text-lg font-bold mb-4" style={headingStyle}>
            Size
          </h3>

          {/* Pricing Options - New Design with Images */}
          <div className="space-y-3 mb-6">
            {PRICING_OPTIONS.map((option) => (
              <div
                key={option.id}
                onClick={() => {
                  trackAnswerSelect(25, option.name, 'Which plan do you prefer?');
                  setSelectedPlan(option.id);
                }}
                className="relative rounded-lg cursor-pointer transition-all"
                style={{
                  backgroundColor: '#fff',
                  border: selectedPlan === option.id ? '2px solid #2d5016' : '1.5px solid #e5e7eb',
                  padding: '16px'
                }}
              >
                {option.label && (
                  <div 
                    className="absolute -top-2.5 left-16 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase"
                    style={{ backgroundColor: '#121212', color: '#fff' }}
                  >
                    {option.label}
                  </div>
                )}
                <div className="flex items-center gap-4">
                  {/* Product Image */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0" style={{ backgroundColor: '#f5f5f5' }}>
                    <img 
                      src={option.image || PRODUCT_IMAGES[0]} 
                      alt={option.name}
                      className="w-full h-full object-contain"
                      onError={(e) => { e.currentTarget.src = PRODUCT_IMAGES[0]; }}
                    />
                  </div>
                  
                  {/* Details */}
                  <div className="flex-1">
                    <h4 className="font-bold text-base mb-0.5" style={textStyle}>{option.name}</h4>
                    <p className="text-xs text-gray-600">{option.supplyLabel}</p>
                  </div>
                  
                  {/* Price */}
                  <div className="text-right">
                    <span className="text-xl font-bold" style={textStyle}>
                      ${option.salePrice.toFixed(2)}
                    </span>
                    <br />
                    <span className="text-sm line-through text-gray-400">
                      ${option.regularPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add to Cart Button - Subscribe & Save */}
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="cta-button mb-4"
            style={buttonStyle}
          >
            {isAddingToCart ? 'ADDING...' : `GET ${selectedOption.supplyLabel.toUpperCase()}`} <ArrowRight size={24} color="#121212" />
          </button>

          {/* One-Time Purchase Link */}
          <div className="text-center mb-4">
            <button 
              onClick={handleOneTimePurchase}
              className="text-sm underline hover:no-underline cursor-pointer transition-all"
              style={{ ...textStyle, background: 'none', border: 'none' }}
            >
              One-Time Purchase <span className="font-bold">${selectedOption.oneTimePrice.toFixed(2)}</span>{' '}
              <span className="line-through text-gray-400">${selectedOption.regularPrice.toFixed(2)}</span>
              <ArrowRight size={14} className="inline ml-1" color="#121212" />
            </button>
          </div>

          {/* Trust Badges */}
          <div className="p-4 rounded-lg" style={{ backgroundColor: '#F9F4EA' }}>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Check size={18} color="#22c55e" />
                <span className="text-xs font-medium" style={textStyle}>60 Day Money Back Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={18} color="#22c55e" />
                <span className="text-xs font-medium" style={textStyle}>6 Bottles Shipped Every 3 Months</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={18} color="#22c55e" />
                <span className="text-xs font-medium" style={textStyle}>Change or Cancel Easily</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={18} color="#22c55e" />
                <span className="text-xs font-medium" style={textStyle}>Free Shipping on All Orders</span>
              </div>
            </div>
          </div>
        </div>

        {/* Finally - Something That Works */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8" style={headingStyle}>
            Finally – Ancient Wisdom for Modern Wellness
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Benefit 1 */}
            <div className="p-6 rounded-xl" style={{ backgroundColor: '#fff', border: '1.5px solid #121212' }}>
              <div className="text-4xl mb-4 text-center">🛡️</div>
              <h3 className="text-xl font-bold mb-3 text-center" style={headingStyle}>
                1 - Strengthen Your Immune System
              </h3>
              <ul className="space-y-2 text-sm" style={textStyle}>
                <li className="flex items-start gap-2">
                  <Check size={16} color="#22c55e" className="shrink-0 mt-1" />
                  <span>Boost natural defenses against illness and infection</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} color="#22c55e" className="shrink-0 mt-1" />
                  <span>Feel stronger and more resilient with consistent use</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} color="#22c55e" className="shrink-0 mt-1" />
                  <span>Support your body's natural healing processes</span>
                </li>
              </ul>
            </div>

            {/* Benefit 2 */}
            <div className="p-6 rounded-xl" style={{ backgroundColor: '#fff', border: '1.5px solid #121212' }}>
              <div className="text-4xl mb-4 text-center">✨</div>
              <h3 className="text-xl font-bold mb-3 text-center" style={headingStyle}>
                2 - Deep Cellular Detox & Cleanse
              </h3>
              <ul className="space-y-2 text-sm" style={textStyle}>
                <li className="flex items-start gap-2">
                  <Check size={16} color="#22c55e" className="shrink-0 mt-1" />
                  <span>Eliminate toxins and reduce inflammation naturally</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} color="#22c55e" className="shrink-0 mt-1" />
                  <span>Visibly improves skin clarity and reduces bloating</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} color="#22c55e" className="shrink-0 mt-1" />
                  <span>Feel lighter and more energized within days</span>
                </li>
              </ul>
            </div>

            {/* Benefit 3 */}
            <div className="p-6 rounded-xl" style={{ backgroundColor: '#fff', border: '1.5px solid #121212' }}>
              <div className="text-4xl mb-4 text-center">💪</div>
              <h3 className="text-xl font-bold mb-3 text-center" style={headingStyle}>
                3 - Boost Energy & Vitality
              </h3>
              <ul className="space-y-2 text-sm" style={textStyle}>
                <li className="flex items-start gap-2">
                  <Check size={16} color="#22c55e" className="shrink-0 mt-1" />
                  <span>Enhance natural energy without caffeine crashes</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} color="#22c55e" className="shrink-0 mt-1" />
                  <span>Support healthy metabolism and weight management</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} color="#22c55e" className="shrink-0 mt-1" />
                  <span>Promotes long-term vitality and overall wellness</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mb-12 p-6 rounded-xl" style={{ backgroundColor: '#fff', border: '2px solid #121212' }}>
          <h2 className="text-2xl font-bold text-center mb-6" style={headingStyle}>
            Discover Serene Herbs Soursop Bitters
          </h2>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 flex-wrap justify-center">
            {[
              { id: 'benefits', label: 'Benefits' },
              { id: 'ingredients', label: 'Ingredients' },
              { id: 'details', label: 'Product Details' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className="px-6 py-2 rounded-lg font-semibold transition-all"
                style={{
                  backgroundColor: activeTab === tab.id ? '#BDF361' : '#F9F4EA',
                  border: '1.5px solid #121212',
                  color: '#121212'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="animate-fade-in">
            {activeTab === 'benefits' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { icon: '🛡️', title: 'Immune Support', desc: 'Strengthens natural defenses with powerful antioxidants and compounds' },
                    { icon: '🌿', title: 'Digestive Health', desc: 'Promotes gut balance, reduces bloating, and supports regularity' },
                    { icon: '⚡', title: 'Energy Boost', desc: 'Enhances vitality naturally without stimulants or crashes' },
                    { icon: '💓', title: 'Heart Health', desc: 'May support healthy blood pressure and cardiovascular function' },
                    { icon: '🧠', title: 'Mental Clarity', desc: 'Reduces stress and supports cognitive function with adaptogens' },
                    { icon: '✨', title: 'Detoxification', desc: 'Cleanses body of toxins naturally for radiant skin and wellness' }
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-lg" style={{ backgroundColor: '#F9F4EA' }}>
                      <span className="text-2xl">{benefit.icon}</span>
                      <div>
                        <h4 className="font-bold mb-1" style={textStyle}>{benefit.title}</h4>
                        <p className="text-sm" style={textStyle}>{benefit.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div className="space-y-4">
                {INGREDIENTS.map((ingredient, i) => (
                  <div key={i} className="p-4 rounded-lg" style={{ backgroundColor: '#F9F4EA' }}>
                    <h4 className="font-bold mb-2" style={textStyle}>{ingredient.name}</h4>
                    <p className="text-sm" style={textStyle}>{ingredient.description}</p>
                  </div>
                ))}
                <p className="text-sm text-center mt-4" style={textStyle}>
                  ...plus 11 more powerful herbs including Senna, Neem, Irish Moss, Hibiscus, and more
                </p>
              </div>
            )}

            {activeTab === 'details' && (
              <div className="space-y-4" style={textStyle}>
                <div>
                  <h4 className="font-bold mb-2">How to Use</h4>
                  <p className="text-sm">Take one tablespoon of Soursop Bitters twice daily, preferably after meals. We recommend mixing it directly with your favorite beverage for smoother digestion and a nutritional boost. Consistent use is key for the best results.</p>
                </div>
                <div>
                  <h4 className="font-bold mb-2">What to Expect</h4>
                  <ul className="text-sm space-y-2">
                    <li><strong>Week 1:</strong> Kickstart detox, support immunity, promote digestion</li>
                    <li><strong>Month 1:</strong> Natural vitality & radiance, improved energy and skin health</li>
                    <li><strong>Month 2:</strong> Stronger immunity & mobility, enhanced stamina</li>
                    <li><strong>Month 3+:</strong> Circulatory & detox support, sustained wellness</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Shipping & Returns</h4>
                  <p className="text-sm">All products ship within 1-2 business days. Most orders arrive in 6-8 days. Free shipping on all subscriptions. 60-day money-back guarantee - if you don't see results, get a full refund!</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Guarantee Section */}
        <div className="mb-12 p-8 rounded-xl text-center" style={{ backgroundColor: '#fff', border: '2px solid #121212' }}>
          <div className="text-5xl mb-4">🛡️</div>
          <h2 className="text-2xl font-bold mb-4" style={headingStyle}>
            Every order comes with our:<br />60 Days Guarantee.
          </h2>
          <p className="text-lg mb-6" style={textStyle}>
            We believe in our product so much, and we don't want you to spend a dime until you are 100% certain that it works for you.
          </p>
          <p className="mb-6" style={textStyle}>
            That's why we are offering a <strong>60-day, no-questions-asked guarantee</strong>.
          </p>
          <p className="mb-8" style={textStyle}>
            If it somehow doesn't work for you and you don't experience any improvements, we will issue you an immediate refund.
          </p>
          <p className="text-lg font-bold" style={textStyle}>
            In other words, you are only paying if it turns out to be a complete lifesaver.
          </p>
        </div>

        {/* Value Proposition */}
        <div className="mb-12 p-8 rounded-xl" style={{ backgroundColor: 'rgba(189, 243, 97, 0.15)', border: '2px solid #BDF361' }}>
          <h2 className="text-2xl font-bold text-center mb-6" style={headingStyle}>
            How much is optimal health and vitality worth to you?
          </h2>
          <p className="text-center mb-6" style={textStyle}>
            Choosing the 3-month supply of Soursop Bitters ensures you get longer-lasting results.
          </p>
          <p className="text-center mb-6" style={textStyle}>
            While you'll notice improvements within 1-2 weeks, <strong>consistent use over 2-3 months</strong> ensures you deeply cleanse your system, strengthen immunity, and support lasting wellness. Plus, the larger bundles save you even more money.
          </p>
          <div className="text-center">
            <button
              onClick={() => {
                setSelectedPlan('6-bottles');
                scrollToOffer();
              }}
              className="cta-button cta-button-pulse"
              style={{...buttonStyle, maxWidth: '400px', margin: '0 auto'}}
            >
              GET 3 MONTH SUPPLY - BEST VALUE <ArrowRight size={24} color="#121212" />
            </button>
          </div>
        </div>

        {/* Pricing Section (Repeat) */}
        <div className="mb-12 rounded-xl" style={{ backgroundColor: '#fff', border: '2px solid #121212', padding: '24px' }}>
          <h3 className="text-lg font-bold mb-4" style={headingStyle}>
            Size
          </h3>

          {/* Pricing Options - Matching first section */}
          <div className="space-y-3 mb-6">
            {PRICING_OPTIONS.map((option) => (
              <div
                key={option.id}
                onClick={() => {
                  trackAnswerSelect(25, option.name, 'Which plan do you prefer?');
                  setSelectedPlan(option.id);
                }}
                className="relative rounded-lg cursor-pointer transition-all"
                style={{
                  backgroundColor: '#fff',
                  border: selectedPlan === option.id ? '2px solid #2d5016' : '1.5px solid #e5e7eb',
                  padding: '16px'
                }}
              >
                {option.label && (
                  <div 
                    className="absolute -top-2.5 left-16 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase"
                    style={{ backgroundColor: '#121212', color: '#fff' }}
                  >
                    {option.label}
                  </div>
                )}
                <div className="flex items-center gap-4">
                  {/* Product Image */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0" style={{ backgroundColor: '#f5f5f5' }}>
                    <img 
                      src={option.image || PRODUCT_IMAGES[0]} 
                      alt={option.name}
                      className="w-full h-full object-contain"
                      onError={(e) => { e.currentTarget.src = PRODUCT_IMAGES[0]; }}
                    />
                  </div>
                  
                  {/* Details */}
                  <div className="flex-1">
                    <h4 className="font-bold text-base mb-0.5" style={textStyle}>{option.name}</h4>
                    <p className="text-xs text-gray-600">{option.supplyLabel}</p>
                  </div>
                  
                  {/* Price */}
                  <div className="text-right">
                    <span className="text-xl font-bold" style={textStyle}>
                      ${option.salePrice.toFixed(2)}
                    </span>
                    <br />
                    <span className="text-sm line-through text-gray-400">
                      ${option.regularPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="cta-button mb-4"
            style={buttonStyle}
          >
            {isAddingToCart ? 'ADDING...' : `GET ${selectedOption.supplyLabel.toUpperCase()}`} <ArrowRight size={24} color="#121212" />
          </button>

          <p className="text-center text-xs text-gray-600">
            60-Day Money Back Guarantee • Free Shipping on All Orders
          </p>
        </div>

        {/* Customer Reviews */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-2" style={headingStyle}>
            Here's How Customers Are Rating Soursop Bitters
          </h2>
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={24} fill="#FFD700" stroke="#FFD700" />
              ))}
            </div>
            <p className="font-bold" style={textStyle}>RATED EXCELLENT</p>
            <p className="text-sm" style={textStyle}>Rated 4.7 out of 5 stars based on 5,245+ Reviews</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {REVIEWS.map((review, i) => (
              <div key={i} className="p-6 rounded-xl" style={{ backgroundColor: '#fff', border: '1.5px solid #121212' }}>
                <div className="flex items-center gap-2 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={16} fill="#FFD700" stroke="#FFD700" />
                  ))}
                </div>
                <h4 className="font-bold mb-2" style={textStyle}>{review.title}</h4>
                <p className="text-sm mb-3" style={textStyle}>"{review.text}"</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold" style={textStyle}>- {review.name}</p>
                  {review.verified && (
                    <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: '#22c55e', color: '#fff' }}>
                      ✓ Verified Buyer
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="mb-12 p-8 rounded-xl text-center" style={{ backgroundColor: '#fff', border: '2px solid #121212' }}>
          <h2 className="text-3xl font-bold mb-6" style={headingStyle}>
            Transform Your Health For Only ${selectedOption.perDay.toFixed(2)}/Day!
          </h2>
          <button
            onClick={scrollToOffer}
            className="cta-button cta-button-pulse"
            style={{...buttonStyle, maxWidth: '400px', margin: '0 auto'}}
          >
            Order Now & Save Up To 55% <ArrowRight size={24} color="#121212" />
          </button>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8" style={headingStyle}>
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div 
                key={i} 
                className="p-4 rounded-lg cursor-pointer"
                style={{ backgroundColor: '#fff', border: '1.5px solid #121212' }}
                onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-bold" style={textStyle}>{faq.question}</h4>
                  <span className="text-2xl font-bold" style={{ color: '#121212' }}>{openFaqIndex === i ? '−' : '+'}</span>
                </div>
                {openFaqIndex === i && (
                  <p className="mt-3 text-sm" style={textStyle}>{faq.answer}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center mb-12">
          <button
            onClick={scrollToOffer}
            className="cta-button cta-button-pulse"
            style={{...buttonStyle, maxWidth: '500px', margin: '0 auto'}}
          >
            Hurry! Order Now & Save Up To 55% Off <ArrowRight size={24} color="#121212" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-4 text-center" style={{ backgroundColor: '#121212', color: '#F9F4EA' }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center gap-6 mb-6 text-sm flex-wrap">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms and Conditions</a>
            <a href="mailto:support@sereneherbs.com" className="hover:underline">Contact Us</a>
            <a href="#" className="hover:underline">Refund Policy</a>
          </div>
          <p className="text-xs mb-4">support@sereneherbs.com</p>
          <p className="text-xs mb-6">
            The information presented on this website is not intended as specific medical advice and is not a substitute for professional treatment or diagnosis. These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.
          </p>
          <p className="text-sm font-semibold">
            2026 © Serene Herbs. All Rights Reserved.
          </p>
        </div>
      </footer>

      {/* Sticky Add to Cart Bar */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-50 shadow-2xl"
        style={{ backgroundColor: '#fff', borderTop: '2px solid #121212', borderRadius: '16px 16px 0 0', padding: '12px 16px' }}
      >
        <div className="max-w-5xl mx-auto flex justify-center">
          <button
            onClick={scrollToOffer}
            className="cta-button w-full"
            style={{
              ...buttonStyle, 
              maxWidth: '400px', 
              height: '48px', 
              padding: '12px 24px', 
              fontSize: '14px',
              fontWeight: 700
            }}
          >
            ORDER NOW & SAVE <ShoppingCart size={18} color="#121212" />
          </button>
        </div>
      </div>
    </div>
  );
}
