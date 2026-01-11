# Feed Services

This folder contains centralized feed fetching services for the alpha-monitor application. The refactoring improves code organization, reduces duplication, and makes the codebase more maintainable.

## Structure

```
src/services/feeds/
├── index.js                    # Central export for all services
├── feedConfig.js               # Centralized feed URLs and configuration
├── baseFeedService.js          # Base service with common functionality
├── aiRaceFeedService.js        # AI race panel feed service
├── blockchainFeedService.js    # Blockchain/crypto panel feed service
├── goodNewsFeedService.js      # Good news panel feed service
├── layoffsFeedService.js       # Layoffs panel feed service
├── newsFeedService.js          # General news panel feed service
├── startupsFeedService.js      # Startups panel feed service
├── vcFeedService.js            # VC activity panel feed service
└── warWatchFeedService.js      # War watch panel feed service
```

## Key Components

### feedConfig.js
Centralized configuration for all RSS feeds used across the application. This file consolidates all feed URLs that were previously scattered across individual panel components.

### baseFeedService.js
Base service class providing common functionality used by all feed services:
- `fetchFeeds()` - Fetch and parse multiple RSS feeds
- `fetchSingleFeed()` - Fetch a single RSS feed
- `getTimeAgo()` - Calculate time ago string from a date
- `filterByKeywords()` - Filter items by keywords

### Specialized Services
Each panel type has its own dedicated service that extends or uses the base service:
- **BlockchainFeedService** - Fetches crypto/blockchain news
- **AIRaceFeedService** - Fetches AI-related news with keyword filtering
- **GoodNewsFeedService** - Fetches positive news stories
- **LayoffsFeedService** - Fetches tech layoffs news
- **NewsFeedService** - Fetches general news (politics, tech, finance, gov, intel)
- **StartupsFeedService** - Fetches startup funding news with amount extraction
- **VCFeedService** - Fetches VC activity news
- **WarWatchFeedService** - Fetches defense and conflict news

## Usage

### Basic Usage
```javascript
import { BlockchainFeedService } from '@services/feeds'

// Fetch crypto news
const news = await BlockchainFeedService.fetchCryptoNews(15)
```

### Using Time Formatting
```javascript
import { BaseFeedService } from '@services/feeds'

const timeAgo = BaseFeedService.getTimeAgo(new Date('2024-01-01'))
// Returns: "5d" or "2h" etc.
```

### Accessing Feed Configuration
```javascript
import { FEED_CONFIG, NEWS_FEEDS } from '@services/feeds'

// Access specific feed configuration
const cryptoFeeds = FEED_CONFIG.blockchain
const politicsFeeds = NEWS_FEEDS.politics
```

## Benefits of This Refactoring

1. **Centralized Configuration**: All feed URLs are now in one place (`feedConfig.js`)
2. **Reduced Code Duplication**: Common fetching logic is in `baseFeedService.js`
3. **Better Organization**: Each panel type has its own dedicated service
4. **Easier Maintenance**: Changes to feed URLs or fetching logic can be made in one place
5. **Improved Testability**: Services can be tested independently
6. **Type Safety**: Services provide a clear API for each panel type
7. **Reusability**: Common utilities like `getTimeAgo()` are available to all components

## Migration Notes

### Before
- Feed URLs were hardcoded in each panel component
- Each panel had its own `fetchNews()` implementation
- Time formatting logic was duplicated across panels
- No centralized place to manage feed configurations

### After
- All feed URLs are in `feedConfig.js`
- Panels use dedicated services for fetching
- Common utilities are in `baseFeedService.js`
- Easy to add new feeds or modify existing ones

## Adding a New Feed Service

To add a new feed service:

1. Create a new service file (e.g., `myNewFeedService.js`)
2. Import and extend/use `BaseFeedService`
3. Add feed configuration to `feedConfig.js`
4. Export the service from `index.js`
5. Use the service in your panel component

Example:
```javascript
// myNewFeedService.js
import { BaseFeedService } from './baseFeedService.js'
import { FEED_CONFIG } from './feedConfig.js'

export class MyNewFeedService extends BaseFeedService {
  static async fetchMyNews(maxItems = 10) {
    return await this.fetchFeeds(FEED_CONFIG.myNew, { maxItems })
  }
}
```
