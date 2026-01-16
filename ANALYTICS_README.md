# Analytics Dashboard

A complete funnel analytics system for tracking user behavior through the Serene Herbs quiz.

## Features

### 1. Funnel Tracking
- Tracks user progression through all 25 quiz steps
- Calculates drop-off rates between steps
- Measures conversion rates at each step
- Visual funnel chart with drop-off highlights

### 2. Answer Analytics
- Records all user answers and selections
- Shows distribution of answers per question
- Calculates percentages for each answer option
- Grouped by quiz step for easy analysis

### 3. Dashboard Features
- Password-protected access
- Real-time data refresh
- Export functionality (CSV format)
- Overview metrics (total sessions, completion rate)
- Visual charts and tables

## Setup Instructions

### 1. Installation
The analytics system is already integrated. No additional setup needed!

### 2. Database
- Uses SQLite for local storage
- Database file: `analytics.db` (created automatically)
- No external database required

### 3. Environment Variables
Set the dashboard password (optional):
```bash
DASHBOARD_PASSWORD=your_password_here
```
Default password: `analytics123`

## Usage

### Accessing the Dashboard
1. Navigate to `/dashboard`
2. Enter the password (default: `analytics123`)
3. View analytics data in real-time

### Dashboard Sections

#### Overview Cards
- **Total Sessions**: Number of unique users who started the quiz
- **Completion Rate**: Percentage of users who completed the quiz
- **Completed**: Number of users who reached the final step
- **Today**: New sessions today

#### Funnel Analysis
- Visual funnel chart showing drop-offs
- Detailed table with visitor counts and conversion rates
- Highlights significant drop-off points (>20% drop)
- Shows conversion rate relative to first step

#### Answer Distribution
- Groups answers by quiz step
- Shows count and percentage for each answer
- Helps identify popular choices and trends

#### Data Export
- Export sessions, events, or answers to CSV
- Use export buttons throughout the dashboard
- Data includes timestamps for time-based analysis

## What Gets Tracked

### Automatic Tracking
- Page views for each quiz step
- Answer selections with timestamps
- Button clicks and interactions
- Session completion status

### User Data Collected
- Anonymous session IDs (no personal info)
- User agent and IP address
- Quiz answers and selections
- Timestamps for all interactions

## Understanding the Data

### Funnel Steps
The quiz tracks 25 steps:
0. INTRO - Gender selection
1-24. Various quiz questions and interstitials
25. OFFER_PAGE - Product selection

### Key Metrics
- **Visitors**: Unique users who reached this step
- **Drop-off Rate**: % of users who left after this step
- **Conversion Rate**: % of original visitors still active
- **Answer Distribution**: Most popular choices per question

### Optimization Tips
- Look for steps with >20% drop-off rates
- Identify confusing questions with scattered answer distributions
- Focus on optimizing the biggest drop-off points first
- Monitor completion rates over time

## API Endpoints

### Tracking (Internal)
- `POST /api/analytics/track` - Record user events
- Used automatically by the quiz components

### Dashboard Data
- `GET /api/analytics/stats` - Retrieve analytics data
- Requires Basic Auth with dashboard password

### Export
- `GET /api/analytics/export?table=sessions` - Export sessions
- `GET /api/analytics/export?table=events` - Export events
- `GET /api/analytics/export?table=answers` - Export answers

## Security

### Privacy Focused
- No personal information collected
- Anonymous session tracking only
- Local database (no external services)

### Password Protection
- Dashboard requires authentication
- API endpoints require Basic Auth
- Change default password in production

### Data Storage
- All data stored locally in SQLite
- No third-party analytics services
- Full control over user data

## Development

### Adding New Tracking
```typescript
import { useAnalytics } from '@/lib/analytics';

const { trackButtonClick, trackAnswerSelect } = useAnalytics();

// Track button clicks
trackButtonClick(stepNumber, 'Button Text');

// Track answer selections
trackAnswerSelect(stepNumber, 'Selected Answer');
```

### Database Schema
- `sessions` - User sessions with metadata
- `events` - All user interactions
- `answers` - Quiz answer selections

### Custom Events
```typescript
import { analytics } from '@/lib/analytics';

analytics.trackCustomEvent('custom_event', stepNumber, { data: 'value' });
```

## Troubleshooting

### Database Issues
- Check if `analytics.db` file exists and is writable
- Restart the application to reinitialize database

### Dashboard Access
- Verify password is correct
- Check browser console for authentication errors
- Clear browser cache and try again

### Missing Data
- Ensure quiz pages include tracking imports
- Check browser console for tracking errors
- Verify API endpoints are accessible

## Performance

### Database Size
- SQLite handles thousands of sessions efficiently
- Regular cleanup recommended for production
- Archive old data as needed

### Real-time Updates
- Dashboard refreshes every 30 seconds
- Manual refresh button available
- No impact on quiz performance

### Scalability
- Current setup handles moderate traffic
- For high traffic, consider PostgreSQL migration
- Database operations are optimized with indexes

---

**Default Dashboard Password**: `analytics123`
**Dashboard URL**: `/dashboard`
**Support**: Check console logs for debugging