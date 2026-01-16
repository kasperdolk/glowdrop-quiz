# Soursop Bitters Offer Page

## Overview
I've created a comprehensive offer page for Soursop Bitters based on the Spartan hair product example you provided. The page is now available at `/offer` route.

## What's Included

### Page Structure (Similar to Spartan Example)
1. **Header** - Serene Herbs logo with sticky positioning
2. **Email Section** - Support email contact
3. **Profile Matched Headline** - "Health Profile Matched: Here is Your Wellness Plan"
4. **Product Image** - Carousel-ready (currently showing product from Serene Herbs website)
5. **Rating Display** - 4.7/5 stars from 5,245+ customers
6. **Benefits Icons** - Immune Support, Digestive Health, Natural Energy, Blood Pressure Support

### Key Features

#### Pricing Options
All 4 pricing tiers from Serene Herbs website:
- **Trial Bottle (1)**: $38.50 (was $73.99) - Save $35.49
- **2 Bottles**: $74.99 (was $139.99) - Save $65.00
- **4 Bottles** (MOST POPULAR): $124.99 (was $249.99) - Save $125.00
- **6 Bottles** (BEST VALUE): $186.99 (was $239.99) - Save $53.00

Each shows:
- Per bottle price
- Per day cost
- Customer purchase percentage

#### Purchase Types
- **One-time purchase**
- **Subscribe & Save** (25% off with benefits)
  - Price locked
  - Pause/change anytime
  - Free shipping
  - VIP group access

#### Product Information Tabs
- **Benefits** - 6 key benefits with icons
- **Ingredients** - Detailed information on 5 main ingredients (Soursop, Turmeric, Moringa, Ashwagandha, Black Seed)
- **Product Details** - How to use, what to expect timeline, shipping info

### Content Sections

1. **Three Main Benefits**
   - Strengthen Immune System
   - Deep Cellular Detox & Cleanse
   - Boost Energy & Vitality

2. **60-Day Guarantee** - Full money-back guarantee section

3. **Value Proposition** - "How much is optimal health worth to you?"

4. **Customer Reviews** - 4 verified customer testimonials with 5-star ratings

5. **FAQ Section** - 7 common questions with expandable answers

6. **Multiple CTAs** - Strategic placement of "Add to Cart" buttons throughout

### Design Elements

- Color scheme matches your quiz funnel:
  - Background: `#F9F4EA`
  - Primary CTA: Gradient `#BCF263` to `#D7FD41`
  - Border: `#121212`
  - Text: Inter font family
  - Headings: Cooper Lt BT Bold

- Interactive elements:
  - Plan selection with radio buttons
  - Tab navigation for product details
  - Expandable FAQ items
  - Hover effects on buttons
  - Smooth scroll to pricing

### Data Source
All product information, pricing, ingredients, and benefits are sourced from:
https://sereneherbs.com/products/soursop-bitters-copy1

## How to Access

1. **Quiz Flow**: The quiz already redirects to `/offer` at the end (step 17)
2. **Direct URL**: http://localhost:3000/offer

## Next Steps (Optional Enhancements)

### Images to Add
Consider adding these to `/public` folder:
- Product images/carousel (currently using external URL)
- Before/After images (if available)
- Lifestyle/usage photos
- Ingredient images
- Customer testimonial photos

### Functionality to Implement
- Cart integration (currently shows alert)
- Email capture form
- Subscription management
- Payment processing
- Analytics tracking
- Countdown timers (optional urgency element)

### Content to Review
- Verify all pricing is current
- Add more customer reviews if available
- Update shipping times if needed
- Add more FAQs based on common questions

## Files Created/Modified

- `/app/offer/page.tsx` - Main offer page component
- `/app/globals.css` - Added fade-in animations
- `OFFER_PAGE_README.md` - This documentation

## Technical Notes

- Built with Next.js 14+ App Router
- TypeScript for type safety
- Client-side component with React hooks
- Responsive design (mobile-first)
- No additional dependencies needed
- Uses existing design system from quiz

---

**Ready to test!** Visit http://localhost:3000/offer to see the page in action.
