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
  color: '#562935',
  fontFamily: 'Inter',
  lineHeight: '150%'
};

const headingStyle = {
  color: '#562935',
  fontFamily: 'Instrument Serif, serif',
  lineHeight: '120%'
};

const buttonStyle = {
  background: '#7A1E3A',
  border: 'none',
  borderRadius: '9999px',
  padding: '16px 32px',
  height: '56px',
  fontFamily: 'Inter',
  fontWeight: 700,
  fontSize: '16px',
  lineHeight: '150%',
  letterSpacing: '0.5px',
  textTransform: 'uppercase' as const,
  color: '#FFFFFF',
  display: 'flex',
  flexDirection: 'row' as const,
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
  gap: '12px',
  width: '100%',
  cursor: 'pointer',
  transition: 'all 0.25s'
};

// Currency formatting utility
const formatCurrency = (amount: number, currencyCode: string = 'USD'): string => {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  } catch (error) {
    // Fallback to basic formatting if currency code is invalid
    const currencySymbols: Record<string, string> = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      AED: 'د.إ',
      CAD: 'C$',
      AUD: 'A$',
      JPY: '¥',
      CHF: 'CHF',
      CNY: '¥',
      SEK: 'kr',
      NZD: 'NZ$'
    };
    const symbol = currencySymbols[currencyCode] || currencyCode;
    return `${symbol}${amount.toFixed(2)}`;
  }
};

// Product data will be fetched from API
interface ProductVariant {
  id: number;
  title: string;
  price: string;
  compare_at_price: string | null;
  option1: string;
  option2?: string; // For quantity
  price_currency?: string;
  compare_at_price_currency?: string;
}

interface ProductImage {
  src: string;
  position: number;
}

interface ProductData {
  variants: ProductVariant[];
  images: ProductImage[];
  title: string;
  body_html: string;
}

interface PricingOption {
  id: string;
  name: string;
  supplyLabel: string;
  regularPrice: number;
  salePrice: number;
  oneTimePrice: number;
  savings: number;
  perBottle: number;
  perDay: number;
  popular: boolean;
  label: string | null;
  variantId: string;
  image: string;
  currency: string;
  quantity: number;
  freeItems?: { name: string; image: string; count: number }[];
  totalItems: number;
}

const INGREDIENTS = [
  {
    name: 'Beta-Carotene',
    description: 'The same natural pigment found in carrots and sweet potatoes. Safely deposits in your skin over time, creating that golden undertone you\'ve been chasing.'
  },
  {
    name: 'L-Tyrosine',
    description: 'An amino acid that\'s the building block of melanin. Helps your body produce its own natural pigment more efficiently.'
  },
  {
    name: 'Hyaluronic Acid',
    description: 'Holds 1000x its weight in water. Keeps your skin plump, hydrated, and glowing from within.'
  },
  {
    name: 'Marine Collagen',
    description: 'Supports skin elasticity and firmness. Works with your natural collagen production for firmer, more youthful skin.'
  },
  {
    name: 'Vitamin C',
    description: 'Powerful antioxidant that brightens skin and supports collagen production. Enhances the glow effect.'
  },
  {
    name: 'Vitamin E',
    description: 'Protects skin cells from damage. Works synergistically with Vitamin C for maximum skin health benefits.'
  },
  {
    name: 'Vitamin B12',
    description: 'Supports healthy skin cell production and helps maintain even skin tone.'
  }
];

const REVIEWS = [
  {
    name: 'Rachel M.',
    rating: 5,
    title: 'People keep asking if I went on vacation',
    text: 'I was SO skeptical—I\'ve tried every self-tanner and they all made me look like a streaky orange mess. But this? After about 2 weeks my coworkers started asking if I\'d been somewhere sunny. I literally just add drops to my morning coffee. No smell, no stains, just... a glow. I\'m obsessed.',
    verified: true
  },
  {
    name: 'Jennifer K.',
    rating: 5,
    title: 'Finally ditched my self-tanner',
    text: 'As a busy mom of 3, I don\'t have 30 minutes to stand around waiting for tanning mousse to dry. This takes 5 seconds and actually works better than anything I\'ve tried. My legs look tan for the first time in YEARS without me doing anything. Wish I found this sooner.',
    verified: true
  },
  {
    name: 'Sarah T.',
    rating: 5,
    title: 'My dermatologist was impressed',
    text: 'I\'m super fair-skinned and have always avoided the sun because of skin cancer concerns in my family. I showed my derm the ingredient list and she actually said it looked great. After 6 weeks I have a subtle golden tone that looks completely natural. No UV damage, no guilt, just glow.',
    verified: true
  },
  {
    name: 'Ashley P.',
    rating: 5,
    title: 'This is my little secret now',
    text: 'I do content creation and I\'m ALWAYS in front of a camera. Used to spend so much time and money on spray tans. Now I just drink my tan every morning and I look bronzed 24/7. My followers think I\'m naturally this color now 😂 Not telling them otherwise!',
    verified: true
  }
];

const FAQS = [
  {
    question: 'How long until I see results?',
    answer: 'Most customers notice a subtle "healthy" undertone within 7-10 days. Visible, compliment-worthy glow typically develops around weeks 2-3. For best results, use consistently for at least 4-6 weeks.'
  },
  {
    question: 'What is GlowDrop?',
    answer: 'GlowDrop is a drinkable tanning supplement that uses natural ingredients like Beta-Carotene and L-Tyrosine to boost your body\'s natural melanin production from within. It\'s like a tan that builds gradually—without UV exposure or messy self-tanners.'
  },
  {
    question: 'How do I take GlowDrop?',
    answer: 'Add 10-15 drops to any cold or room-temperature beverage once daily. Coffee, water, smoothies, juice—whatever you\'re already drinking. Takes about 5 seconds.'
  },
  {
    question: 'What does GlowDrop help with?',
    answer: 'GlowDrop gives you a natural, year-round tan without sun damage or self-tanner hassle. The formula also includes skincare actives like Hyaluronic Acid and Collagen for more hydrated, healthier-looking skin.'
  },
  {
    question: 'When will my order ship?',
    answer: 'Orders ship within 1-2 business days. Most US customers receive their order within 3-5 business days. You\'ll get a tracking number as soon as it ships.'
  },
  {
    question: 'What if it doesn\'t work for me?',
    answer: 'We\'ve got you covered with our 30-Day Glow Guarantee. If you don\'t see results or you\'re not thrilled for any reason, email us for a full refund. No questions asked.'
  },
  {
    question: 'Is it suitable for all skin types?',
    answer: 'GlowDrop works best on fair to medium skin tones. If you\'re already quite dark, results may be more subtle. It\'s gentle enough for sensitive skin and is dermatologist-tested.'
  }
];

export default function OfferPage() {
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<string>(''); // Color selection
  const [activeTab, setActiveTab] = useState<'details' | 'benefits' | 'ingredients'>('benefits');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pricingOptions, setPricingOptions] = useState<PricingOption[]>([]);
  const [productImages, setProductImages] = useState<string[]>([]);
  const [currency, setCurrency] = useState<string>('USD');
  const [availableVariants, setAvailableVariants] = useState<ProductVariant[]>([]);

  // Track offer page view as step 25 (after prediction)
  usePageTracking(25);
  const { trackButtonClick, trackAnswerSelect } = useAnalytics();

  // Fetch product data on mount
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await fetch('https://glowdrop.co/products/tanning-drops-the-tan-you-drink.json');
        const data = await response.json();
        
        if (data.product) {
          setProductData(data.product);
          
          // Get currency from first variant (all variants should have same currency)
          const firstVariant = data.product.variants[0];
          const variantCurrency = firstVariant.price_currency || 'USD';
          setCurrency(variantCurrency);
          
          // Set available variants for color selection
          setAvailableVariants(data.product.variants);

          // Set default selected variant to first variant
          if (data.product.variants.length > 0) {
            setSelectedVariant(data.product.variants[0].id.toString());
          }

          // Create bundle pricing options with new structure
          const bundleOptions = [
            {
              id: 'buy-2',
              name: 'Buy 2',
              supplyLabel: 'Buy 2 = 1 Free (3 total)',
              regularPrice: 120,
              salePrice: 80,
              oneTimePrice: 80,
              savings: 40,
              perBottle: 26.67,
              perDay: 2.67,
              popular: false,
              label: null,
              variantId: data.product.variants[0]?.id.toString() || '',
              image: data.product.images[0]?.src || '',
              currency: variantCurrency,
              quantity: 2,
              freeItems: [{ name: 'Exclusive Habit Tracker Card', image: 'https://assets.replocdn.com/projects/149a24dc-b65a-423d-a51b-0d10fafbd16f/1c76d339-a4cd-4aed-8770-25b0a31851f6?width=96', count: 1 }],
              totalItems: 3
            },
            {
              id: 'buy-3',
              name: 'Buy 3',
              supplyLabel: 'Buy 3 = 2 Free (5 total)',
              regularPrice: 200,
              salePrice: 120,
              oneTimePrice: 120,
              savings: 80,
              perBottle: 24,
              perDay: 2.4,
              popular: true,
              label: 'MOST POPULAR',
              variantId: data.product.variants[0]?.id.toString() || '',
              image: data.product.images[0]?.src || '',
              currency: variantCurrency,
              quantity: 3,
              freeItems: [
                { name: 'Free Extra Bottle', image: 'https://glowdrop.co/cdn/shop/files/glowdrop-product-1.webp?v=1760196168&width=96', count: 1 },
                { name: 'Free GlowDrop Water Bottle', image: 'https://assets.replocdn.com/projects/149a24dc-b65a-423d-a51b-0d10fafbd16f/24d97c7e-5138-418e-8063-60bfa0d29475?width=96', count: 1 }
              ],
              totalItems: 5
            }
          ];

          const transformedOptions = bundleOptions;
          
          setPricingOptions(transformedOptions);
          
          // Set product images for carousel (sorted by position)
          const sortedImages = [...data.product.images]
            .sort((a: ProductImage, b: ProductImage) => a.position - b.position)
            .map((img: ProductImage) => img.src);
          setProductImages(sortedImages);
          
          // Set default selected plan to first bundle option
          if (transformedOptions.length > 0) {
            setSelectedPlan(transformedOptions[0].id);
          }
        }
      } catch (error) {
        console.error('Error fetching product data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductData();
  }, []);

  const selectedOption = pricingOptions.find(opt => opt.id === selectedPlan) || pricingOptions[0];

  // Bundle purchase with selected variant
  const handleAddToCart = () => {
    if (!selectedOption || !selectedVariant) return;

    setIsAddingToCart(true);

    // Track purchase attempt
    trackButtonClick(25, 'Add to Cart - Bundle', {
      plan: selectedOption.id,
      variant: selectedVariant,
      price: selectedOption.salePrice,
      type: 'bundle'
    });

    // Add to cart with selected variant and quantity
    const checkoutUrl = `https://glowdrop.co/cart/add?id=${selectedVariant}&quantity=${selectedOption.quantity}&properties[Source]=Quiz&properties[Bundle]=${selectedOption.name}&return_to=/checkout`;

    window.location.href = checkoutUrl;
  };

  // One-time purchase - same as subscribe for GlowDrop
  const handleOneTimePurchase = () => {
    // Track one-time purchase
    trackButtonClick(25, 'Add to Cart - One Time', {
      plan: selectedOption.id,
      price: selectedOption.oneTimePrice,
      type: 'one-time'
    });

    const checkoutUrl = `https://glowdrop.co/cart/add?id=${selectedOption.variantId}&quantity=1&properties[Source]=Quiz&return_to=/checkout`;
    window.location.href = checkoutUrl;
  };

  // Scroll to offer selection
  const scrollToOffer = () => {
    const element = document.getElementById('offer-selection');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F9F7F5FF' }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 rounded-full animate-spin mb-6 mx-auto" style={{ borderColor: '#E0D1D5', borderTopColor: '#562935' }}></div>
          <p style={textStyle}>Loading product information...</p>
        </div>
      </div>
    );
  }

  // Show error state if no product data
  if (!productData || pricingOptions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F9F7F5FF' }}>
        <div className="text-center">
          <p style={textStyle}>Unable to load product information. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9F7F5FF' }}>
      {/* Header */}
      <div className="w-full bg-white shadow-sm flex justify-between items-center sticky top-0 z-50 px-4 md:px-8" style={{ height: '80px' }}>
        <img
          src="/glowdrop-black-svg.svg"
          alt="Glowdrop"
          className="h-8 object-contain"
        />
        <a
          href="https://glowdrop.co/products/tanning-drops-the-tan-you-drink"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-lg font-semibold text-xs transition-all"
          style={{
            backgroundColor: '#FFF4FD',
            border: '1px solid #E0D1D5',
            color: '#562935',
            fontFamily: 'Inter'
          }}
        >
          See our solution
        </a>
      </div>

      {/* Email Section */}
      <div className="text-center py-3 px-4" style={{ backgroundColor: '#562935' }}>
        <p className="text-xs mb-1" style={{ color: '#FFF4FD', fontFamily: 'Inter' }}>
          Need help? We're here!
        </p>
        <a href="mailto:help@glowdrop.com" className="text-sm font-semibold" style={{ color: '#FFF4FD', fontFamily: 'Inter' }}>
          help@glowdrop.com
        </a>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 pb-20">
        {/* Profile Matched Header */}
        <div className="text-center mb-8">
          <div className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4" style={{ backgroundColor: '#FFF4FD', border: '1px solid #E0D1D5', color: '#562935' }}>
            Your Glow Assessment Results Are In
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3" style={headingStyle}>
            Based On Your Answers: Here Is Your Personalized Glow Protocol
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
                border: '2px solid #E0D1D5',
                borderRadius: '12px',
                overflow: 'hidden'
              }}
            >
              {productImages.length > 0 ? (
                productImages.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div style={{ backgroundColor: '#fff' }}>
                      <img 
                        src={image} 
                        alt={`Tanning Drops ${index + 1}`}
                        className="w-full h-auto"
                      />
                    </div>
                  </SwiperSlide>
                ))
              ) : (
                <SwiperSlide>
                  <div style={{ backgroundColor: '#fff', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <p style={textStyle}>Loading images...</p>
                  </div>
                </SwiperSlide>
              )}
            </Swiper>
          </div>
        </div>

        {/* Perfect Solution For */}
        <div className="text-center mb-6">
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            {['☀️ No More Sun Damage', '🧴 No Messy Self-Tanners', '⏱️ Just 5 Seconds Daily', '✨ Year-Round Natural Glow'].map((benefit) => (
              <span 
                key={benefit}
                className="px-4 py-2 rounded-full text-sm font-semibold"
                style={{
                  backgroundColor: '#FFF4FD',
                  border: '1px solid #E0D1D5',
                  color: '#562935'
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
            Rated 4.8/5 by 86,000+ Happy Customers
          </span>
        </div>

        {/* Product Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2" style={headingStyle}>
            GlowDrop Tanning Drops
          </h2>
          <div className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: '#FFF4FD', border: '1px solid #E0D1D5', color: '#562935' }}>
            Dermatologist-Approved • 7 Skin-Loving Ingredients
          </div>
        </div>

        {/* Main CTA Section */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-center mb-4" style={headingStyle}>
            Join Thousands Who Ditched Messy Self-Tanners and Risky Sun Exposure for a Natural, Year-Round Glow in Just 5 Seconds a Day
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-start gap-3 p-4 rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E0D1D5' }}>
              <Check size={24} color="#7A1E3A" className="shrink-0 mt-1" />
              <div>
                <h4 className="font-bold mb-1" style={textStyle}>See Visible Results Fast</h4>
                <p className="text-sm" style={textStyle}>Notice a subtle golden undertone in as little as 7-10 days. Most customers report friends asking "did you just get back from vacation?" within 2 weeks.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E0D1D5' }}>
              <Check size={24} color="#7A1E3A" className="shrink-0 mt-1" />
              <div>
                <h4 className="font-bold mb-1" style={textStyle}>Works From The Inside Out</h4>
                <p className="text-sm" style={textStyle}>Unlike self-tanners that paint color ON your skin, GlowDrop works with your body's natural melanin production. The result? An even, natural-looking glow that doesn't streak, stain, or wash off.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E0D1D5' }}>
              <Check size={24} color="#7A1E3A" className="shrink-0 mt-1" />
              <div>
                <h4 className="font-bold mb-1" style={textStyle}>Ridiculously Simple</h4>
                <p className="text-sm" style={textStyle}>Add drops to your morning coffee, water, or smoothie. That's it. No 30-minute application sessions. No drying time. No stained sheets. No "self-tanner smell."</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E0D1D5' }}>
              <Check size={24} color="#7A1E3A" className="shrink-0 mt-1" />
              <div>
                <h4 className="font-bold mb-1" style={textStyle}>Actually Good For Your Skin</h4>
                <p className="text-sm" style={textStyle}>Packed with Hyaluronic Acid, Collagen, and Vitamins C, E & B12. You're not just getting a tan—you're nourishing your skin. 94% of users reported more hydrated skin.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Best Results Callout */}
        <div className="mb-4 p-3 rounded-lg flex items-center gap-3" style={{ backgroundColor: '#FFF4FD', border: '1px solid #E0D1D5' }}>
          <span className="text-2xl">📅</span>
          <p className="text-sm" style={textStyle}>
            Best results seen after <strong>4-6 weeks</strong> of consistent daily use
          </p>
        </div>

        {/* Color Selection */}
        <div className="mb-8 rounded-xl" style={{ backgroundColor: '#FFFFFF', border: '2px solid #E0D1D5', padding: '24px' }}>
          <h3 className="text-lg font-bold mb-4" style={headingStyle}>
            Select Color
          </h3>

          <div className="space-y-3 mb-6">
            {availableVariants.map((variant) => (
              <div
                key={variant.id}
                onClick={() => {
                  setSelectedVariant(variant.id.toString());
                  trackAnswerSelect(25, variant.option1, 'Which color do you prefer?');
                }}
                className="relative rounded-lg cursor-pointer transition-all"
                style={{
                  backgroundColor: '#fff',
                  border: selectedVariant === variant.id.toString() ? '2px solid #7A1E3A' : '1.5px solid #E0D1D5',
                  padding: '16px'
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full border-2" style={{
                    backgroundColor: variant.option1?.toLowerCase() === 'tropical' ? '#FFB347' :
                                   variant.option1?.toLowerCase() === 'golden' ? '#FFD700' :
                                   variant.option1?.toLowerCase() === 'bronze' ? '#CD7F32' : '#E0D1D5',
                    borderColor: selectedVariant === variant.id.toString() ? '#7A1E3A' : '#E0D1D5'
                  }}></div>
                  <div className="flex-1">
                    <h4 className="font-bold text-base" style={textStyle}>{variant.option1}</h4>
                  </div>
                  {selectedVariant === variant.id.toString() && (
                    <Check size={20} color="#7A1E3A" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quantity Selection */}
        <div id="offer-selection" className="mb-8 rounded-xl" style={{ backgroundColor: '#FFFFFF', border: '2px solid #E0D1D5', padding: '24px' }}>
          <h3 className="text-lg font-bold mb-4" style={headingStyle}>
            Select Quantity
          </h3>

          {/* Bundle Options with Free Items */}
          {isLoading ? (
            <div className="text-center py-8">
              <p style={textStyle}>Loading bundle options...</p>
            </div>
          ) : (
          <div className="space-y-4 mb-6">
            {pricingOptions.map((option) => (
              <div
                key={option.id}
                onClick={() => {
                  trackAnswerSelect(25, option.name, 'Which bundle do you prefer?');
                  setSelectedPlan(option.id);
                }}
                className="relative rounded-lg cursor-pointer transition-all"
                style={{
                  backgroundColor: '#fff',
                  border: selectedPlan === option.id ? '2px solid #7A1E3A' : '1.5px solid #E0D1D5',
                  padding: '20px'
                }}
              >
                {option.label && (
                  <div
                    className="absolute -top-2.5 left-6 px-3 py-1 rounded text-xs font-bold uppercase"
                    style={{ backgroundColor: '#7A1E3A', color: '#FFFFFF' }}
                  >
                    {option.label}
                  </div>
                )}

                <div className="flex items-start gap-4">
                  {/* Main Product */}
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0" style={{ backgroundColor: '#f5f5f5' }}>
                      {productImages.length > 0 && (
                        <img
                          src={option.image || productImages[0]}
                          alt="GlowDrop Tanning Drops"
                          className="w-full h-full object-contain"
                          onError={(e) => { if (productImages.length > 0) e.currentTarget.src = productImages[0]; }}
                        />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-bold" style={textStyle}>×{option.quantity} GlowDrop Bottles</div>
                    </div>
                  </div>

                  {/* Plus icon and free items */}
                  {option.freeItems && option.freeItems.length > 0 && (
                    <>
                      <div className="text-2xl font-bold" style={{ color: '#7A1E3A' }}>+</div>
                      <div className="flex flex-col gap-2">
                        {option.freeItems.map((freeItem, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0" style={{ backgroundColor: '#f5f5f5' }}>
                              <img
                                src={freeItem.image}
                                alt={freeItem.name}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-green-600">FREE</div>
                              <div className="text-xs" style={textStyle}>{freeItem.name}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Price */}
                  <div className="ml-auto text-right">
                    <div className="text-xl font-bold" style={textStyle}>
                      {formatCurrency(option.salePrice, option.currency)}
                    </div>
                    <div className="text-sm line-through text-gray-400">
                      {formatCurrency(option.regularPrice, option.currency)}
                    </div>
                    <div className="text-xs font-semibold" style={{ color: '#7A1E3A' }}>
                      Save {formatCurrency(option.savings, option.currency)}
                    </div>
                  </div>
                </div>

                {/* Bundle description */}
                <div className="mt-3 pt-3 border-t" style={{ borderColor: '#E0D1D5' }}>
                  <div className="text-sm font-bold mb-1" style={textStyle}>{option.supplyLabel}</div>
                  <div className="text-xs text-gray-600">Total items: {option.totalItems}</div>
                </div>
              </div>
            ))}
          </div>
          )}

          {/* Add to Cart Button - Bundle Purchase */}
          {selectedOption && selectedVariant && (
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart || !selectedVariant}
              className="cta-button mb-4"
              style={buttonStyle}
            >
              {isAddingToCart ? 'ADDING...' : `GET ${selectedOption.supplyLabel.toUpperCase()}`} <ArrowRight size={24} color="#FFFFFF" />
            </button>
          )}

          {/* One-Time Purchase Link */}
          {selectedOption && (
            <div className="text-center mb-4">
              <button 
                onClick={handleOneTimePurchase}
                className="text-sm underline hover:no-underline cursor-pointer transition-all"
                style={{ ...textStyle, background: 'none', border: 'none' }}
              >
                One-Time Purchase <span className="font-bold">{formatCurrency(selectedOption.oneTimePrice, selectedOption.currency)}</span>{' '}
                <span className="line-through text-gray-400">{formatCurrency(selectedOption.regularPrice, selectedOption.currency)}</span>
                <ArrowRight size={14} className="inline ml-1" color="#562935" />
              </button>
            </div>
          )}

          {/* Trust Badges */}
          <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFF4FD', border: '1px solid #E0D1D5' }}>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Check size={18} color="#7A1E3A" />
                <span className="text-xs font-medium" style={textStyle}>30-Day Money Back Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={18} color="#7A1E3A" />
                <span className="text-xs font-medium" style={textStyle}>Ships Every 3 Months (Cancel Anytime)</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={18} color="#7A1E3A" />
                <span className="text-xs font-medium" style={textStyle}>Free Shipping on All Orders</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={18} color="#7A1E3A" />
                <span className="text-xs font-medium" style={textStyle}>Made in FDA-Registered Facility</span>
              </div>
            </div>
          </div>
        </div>

        {/* Finally - Something That Works */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8" style={headingStyle}>
            Finally – A Tan That Actually Makes Sense
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Step 1 */}
            <div className="p-6 rounded-xl" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E0D1D5' }}>
              <div className="text-4xl mb-4 text-center">☕</div>
              <h3 className="text-xl font-bold mb-3 text-center" style={headingStyle}>
                Step 1: Add Drops to Any Drink
              </h3>
              <ul className="space-y-2 text-sm" style={textStyle}>
                <li className="flex items-start gap-2">
                  <Check size={16} color="#7A1E3A" className="shrink-0 mt-1" />
                  <span>Coffee, water, smoothie—whatever you're already drinking</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} color="#7A1E3A" className="shrink-0 mt-1" />
                  <span>Light tropical taste that blends into any beverage</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} color="#7A1E3A" className="shrink-0 mt-1" />
                  <span>Takes literally 5 seconds</span>
                </li>
              </ul>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-xl" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E0D1D5' }}>
              <div className="text-4xl mb-4 text-center">✨</div>
              <h3 className="text-xl font-bold mb-3 text-center" style={headingStyle}>
                Step 2: Your Body Does The Work
              </h3>
              <ul className="space-y-2 text-sm" style={textStyle}>
                <li className="flex items-start gap-2">
                  <Check size={16} color="#7A1E3A" className="shrink-0 mt-1" />
                  <span>Beta-Carotene and L-Tyrosine naturally boost melanin production</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} color="#7A1E3A" className="shrink-0 mt-1" />
                  <span>Gradual, even color develops from within—not painted on</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} color="#7A1E3A" className="shrink-0 mt-1" />
                  <span>Works on ALL skin types (fair to medium)</span>
                </li>
              </ul>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-xl" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E0D1D5' }}>
              <div className="text-4xl mb-4 text-center">💫</div>
              <h3 className="text-xl font-bold mb-3 text-center" style={headingStyle}>
                Step 3: Wake Up Glowing
              </h3>
              <ul className="space-y-2 text-sm" style={textStyle}>
                <li className="flex items-start gap-2">
                  <Check size={16} color="#7A1E3A" className="shrink-0 mt-1" />
                  <span>Natural sun-kissed glow without a single UV ray</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} color="#7A1E3A" className="shrink-0 mt-1" />
                  <span>No streaks, no orange, no weird smell</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} color="#7A1E3A" className="shrink-0 mt-1" />
                  <span>Maintain year-round with daily use</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mb-12 p-6 rounded-xl" style={{ backgroundColor: '#FFFFFF', border: '2px solid #E0D1D5' }}>
          <h2 className="text-2xl font-bold text-center mb-6" style={headingStyle}>
            Discover GlowDrop Tanning Drops
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
                  backgroundColor: activeTab === tab.id ? '#7A1E3A' : '#FFF4FD',
                  border: '1px solid #E0D1D5',
                  color: activeTab === tab.id ? '#FFFFFF' : '#562935'
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
                    { icon: '✨', title: 'Natural-Looking Tan', desc: 'Builds a gradual, sun-kissed glow that looks like you just got back from two weeks in Bali—not like you wrestled with a bottle of self-tanner' },
                    { icon: '🛡️', title: '100% UV-Free', desc: 'Get the glow without the guilt. No sun damage, no premature aging, no skin cancer risk. Your dermatologist would actually approve.' },
                    { icon: '⏱️', title: '5-Second Routine', desc: 'Drop. Sip. Done. No 30-minute application sessions, no drying time, no contorting to reach your back, no "oops I missed a spot" moments' },
                    { icon: '🧴', title: 'No Mess, No Stains', desc: 'Your white sheets, towels, and clothes are safe. No more bronze handprints on everything you touch. No more "self-tanner smell."' },
                    { icon: '💧', title: 'Hydrating Skincare', desc: 'Hyaluronic Acid and Collagen work alongside the tanning actives. You\'re not just getting bronze—you\'re getting genuinely healthier skin.' },
                    { icon: '🌿', title: 'Clean Formula', desc: '100% Vegan. No artificial dyes. No harsh chemicals. Just vitamins and plant-derived ingredients your body recognizes.' }
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-lg" style={{ backgroundColor: '#FFF4FD', border: '1px solid #E0D1D5' }}>
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
                  <div key={i} className="p-4 rounded-lg" style={{ backgroundColor: '#FFF4FD', border: '1px solid #E0D1D5' }}>
                    <h4 className="font-bold mb-2" style={textStyle}>{ingredient.name}</h4>
                    <p className="text-sm" style={textStyle}>{ingredient.description}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'details' && (
              <div className="space-y-4" style={textStyle}>
                <div>
                  <h4 className="font-bold mb-2">How to Use</h4>
                  <p className="text-sm">Add 10-15 drops to any cold or room temperature beverage, once daily. For best results, use consistently for at least 4-6 weeks.</p>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Serving Size</h4>
                  <p className="text-sm">15 drops (1ml) per day</p>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Bottle Size</h4>
                  <p className="text-sm">30ml per bottle (approximately 30 servings / 1 month supply)</p>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Taste</h4>
                  <p className="text-sm">Light tropical flavor that blends easily into any beverage</p>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Made In</h4>
                  <p className="text-sm">USA, in an FDA-registered, GMP-certified facility</p>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Certifications</h4>
                  <p className="text-sm">100% Vegan • Gluten-Free • Non-GMO • No Artificial Colors • Dermatologist-Tested</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Guarantee Section */}
        <div className="mb-12 p-8 rounded-xl text-center" style={{ backgroundColor: '#fff', border: '2px solid #121212' }}>
          <div className="text-5xl mb-4">🛡️</div>
          <h2 className="text-2xl font-bold mb-4" style={headingStyle}>
            Every Order Comes With Our 30-Day Glow Guarantee
          </h2>
          <p className="text-lg mb-6" style={textStyle}>
            We're so confident GlowDrop will give you the natural, year-round tan you've been chasing that we're taking ALL the risk off your shoulders.
          </p>
          <p className="mb-6" style={textStyle}>
            Try it for 30 days. If you don't notice a visible glow—or you're not absolutely thrilled for ANY reason—just email us. We'll refund every penny. No questions. No hassle. No hard feelings.
          </p>
          <p className="text-lg font-bold mb-6" style={textStyle}>
            You're not risking a single dollar.
          </p>
          <p className="mb-6" style={textStyle}>
            Either you get the effortless, natural glow you've always wanted... or you get your money back. That's a promise from real people who actually answer our emails (try us: help@glowdrop.com).
          </p>
        </div>

        {/* Value Proposition */}
        <div className="mb-12 p-8 rounded-xl" style={{ backgroundColor: '#FFF4FD', border: '2px solid #E0D1D5' }}>
          <h2 className="text-2xl font-bold text-center mb-6" style={headingStyle}>
            Why Do Our Happiest Customers Choose The 3-Month Supply?
          </h2>
          <p className="text-center mb-4" style={textStyle}>
            Here's the truth about getting a natural-looking tan from within:
          </p>
          <div className="space-y-3 mb-6" style={textStyle}>
            <p><strong>Week 1-2:</strong> You might notice your skin looks a bit more "alive"—a subtle healthy undertone starts developing.</p>
            <p><strong>Week 3-4:</strong> This is when friends start asking if you went somewhere. The glow becomes visible to others.</p>
            <p><strong>Month 2-3:</strong> Your tan deepens and stabilizes. This is when you hit that "I just always look like this" level. The goal.</p>
          </div>
          <p className="text-center mb-6" style={textStyle}>
            The 3-month supply ensures you don't run out right when you're hitting your stride. Plus, you save the most money and get free shipping.
          </p>
          <p className="text-center mb-6 italic" style={textStyle}>
            It's the "no-brainer" choice for anyone serious about maintaining a year-round glow without ever touching a self-tanner again.
          </p>
          <div className="text-center">
            <button
              onClick={() => {
                if (pricingOptions.length > 0) {
                  const bestValue = pricingOptions.find(opt => opt.label === 'BEST VALUE') || pricingOptions[pricingOptions.length - 1];
                  setSelectedPlan(bestValue.id);
                }
                scrollToOffer();
              }}
              className="cta-button cta-button-pulse"
              style={{...buttonStyle, maxWidth: '400px', margin: '0 auto'}}
            >
              GET MY 3 MONTH GLOW SUPPLY <ArrowRight size={24} color="#FFFFFF" />
            </button>
          </div>
        </div>

        {/* Pricing Section (Repeat) */}
        <div className="mb-12 rounded-xl" style={{ backgroundColor: '#FFFFFF', border: '2px solid #E0D1D5', padding: '24px' }}>
          <h3 className="text-lg font-bold mb-4" style={headingStyle}>
            Size
          </h3>

          {/* Pricing Options - Matching first section */}
          {isLoading ? (
            <div className="text-center py-8">
              <p style={textStyle}>Loading pricing options...</p>
            </div>
          ) : (
          <div className="space-y-3 mb-6">
            {pricingOptions.map((option) => (
              <div
                key={option.id}
                onClick={() => {
                  trackAnswerSelect(25, option.name, 'Which plan do you prefer?');
                  setSelectedPlan(option.id);
                }}
                className="relative rounded-lg cursor-pointer transition-all"
                style={{
                  backgroundColor: '#fff',
                  border: selectedPlan === option.id ? '2px solid #7A1E3A' : '1.5px solid #E0D1D5',
                  padding: '16px'
                }}
              >
                {option.label && (
                  <div 
                    className="absolute -top-2.5 left-16 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase"
                    style={{ backgroundColor: '#7A1E3A', color: '#FFFFFF' }}
                  >
                    {option.label}
                  </div>
                )}
                <div className="flex items-center gap-4">
                  {/* Product Image */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0" style={{ backgroundColor: '#f5f5f5' }}>
                    {productImages.length > 0 && (
                      <img 
                        src={option.image || productImages[0]} 
                        alt={option.name}
                        className="w-full h-full object-contain"
                        onError={(e) => { if (productImages.length > 0) e.currentTarget.src = productImages[0]; }}
                      />
                    )}
                  </div>
                  
                  {/* Details */}
                  <div className="flex-1">
                    <h4 className="font-bold text-base mb-0.5" style={textStyle}>{option.name}</h4>
                    <p className="text-xs text-gray-600">{option.supplyLabel}</p>
                  </div>
                  
                  {/* Price */}
                  <div className="text-right">
                    <span className="text-xl font-bold" style={textStyle}>
                      {formatCurrency(option.salePrice, option.currency)}
                    </span>
                    <br />
                    <span className="text-sm line-through text-gray-400">
                      {formatCurrency(option.regularPrice, option.currency)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}

          {selectedOption && (
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="cta-button mb-4"
              style={buttonStyle}
            >
              {isAddingToCart ? 'ADDING...' : `GET ${selectedOption.supplyLabel.toUpperCase()}`} <ArrowRight size={24} color="#FFFFFF" />
            </button>
          )}

          <p className="text-center text-xs text-gray-600">
            30-Day Money Back Guarantee • Free Shipping on All Orders
          </p>
        </div>

        {/* Customer Reviews */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-2" style={headingStyle}>
            Here's What Real Customers Are Saying
          </h2>
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={24} fill="#FFD700" stroke="#FFD700" />
              ))}
            </div>
            <p className="font-bold" style={textStyle}>RATED EXCELLENT</p>
            <p className="text-sm" style={textStyle}>Rated 4.8 out of 5 stars based on 1,247+ Verified Reviews</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {REVIEWS.map((review, i) => (
              <div key={i} className="p-6 rounded-xl" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E0D1D5' }}>
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
                    <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: '#7A1E3A', color: '#fff' }}>
                      ✓ Verified Buyer
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        {selectedOption && (
          <div className="mb-12 p-8 rounded-xl text-center" style={{ backgroundColor: '#fff', border: '2px solid #121212' }}>
            <h2 className="text-3xl font-bold mb-6" style={headingStyle}>
              Get Your Year-Round Glow For Less Than {formatCurrency(selectedOption.perDay, selectedOption.currency)}/Day
            </h2>
            <p className="mb-4" style={textStyle}>
              Compare the cost:
            </p>
            <div className="text-left max-w-md mx-auto mb-6 space-y-2" style={textStyle}>
              <p className="text-sm">• Professional spray tan: $40-70 per session, lasts ~1 week = $160-280/month</p>
              <p className="text-sm">• Quality self-tanner: $30-50/bottle, reapply weekly + your time & mess</p>
              <p className="text-sm font-bold">• GlowDrop: Less than {formatCurrency(selectedOption.perDay, selectedOption.currency)}/day, zero effort, year-round glow</p>
            </div>
            <button
              onClick={scrollToOffer}
              className="cta-button cta-button-pulse"
              style={{...buttonStyle, maxWidth: '400px', margin: '0 auto'}}
            >
              Order Now & Save Up To 50% <ArrowRight size={24} color="#FFFFFF" />
            </button>
          </div>
        )}

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
                style={{ backgroundColor: '#FFFFFF', border: '1px solid #E0D1D5' }}
                onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-bold" style={textStyle}>{faq.question}</h4>
                  <span className="text-2xl font-bold" style={{ color: '#562935' }}>{openFaqIndex === i ? '−' : '+'}</span>
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
          <h2 className="text-2xl font-bold mb-4" style={headingStyle}>
            Hurry! Order Now & Save Up To 50%
          </h2>
          <button
            onClick={scrollToOffer}
            className="cta-button cta-button-pulse"
            style={{...buttonStyle, maxWidth: '500px', margin: '0 auto'}}
          >
            GET MY GLOW SUPPLY <ArrowRight size={24} color="#FFFFFF" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-4 text-center" style={{ backgroundColor: '#562935', color: '#FFF4FD' }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center gap-6 mb-6 text-sm flex-wrap">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms and Conditions</a>
            <a href="mailto:help@glowdrop.com" className="hover:underline">Contact Us</a>
            <a href="#" className="hover:underline">Refund Policy</a>
          </div>
          <p className="text-xs mb-4">help@glowdrop.com</p>
          <p className="text-xs mb-6">
            The information presented on this website is not intended as specific medical advice and is not a substitute for professional treatment or diagnosis. These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.
          </p>
          <p className="text-sm font-semibold">
            2026 © GlowDrop. All Rights Reserved.
          </p>
        </div>
      </footer>

      {/* Sticky Add to Cart Bar */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-50 shadow-2xl"
        style={{ backgroundColor: '#FFFFFF', borderTop: '2px solid #E0D1D5', borderRadius: '16px 16px 0 0', padding: '12px 16px' }}
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
            ORDER NOW & SAVE <ShoppingCart size={18} color="#FFFFFF" />
          </button>
        </div>
      </div>
    </div>
  );
}
