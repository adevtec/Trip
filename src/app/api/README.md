# Travel Services Documentation

## Overview

This travel services system provides a unified API for searching and booking travel offers from multiple Estonian travel providers.

## Architecture

```
src/services/
├── base/                 # Core interfaces and base classes
│   ├── types.ts         # TypeScript interfaces
│   └── aggregator.ts    # Main aggregator class
├── providers/           # Individual provider implementations
│   ├── novit/          # NovIT (NovaTours) provider
│   ├── joinup/         # JoinUp Travel provider
│   ├── tez-tour/       # TEZ Tour provider (future)
│   ├── anex/           # ANEX Tour provider (future)
│   └── coral-travel/   # Coral Travel provider (future)
├── config.ts           # Configuration and setup
└── index.ts            # Main exports
```

## Current Providers

### ✅ NovIT (NovaTours)
- **Status**: Implemented (based on WordPress plugin analysis)
- **Configuration**: Uses existing API key from wp-content analysis
- **Features**: Full search, offer details, health check

### 🚧 JoinUp Travel
- **Status**: Template ready, mock data for development
- **Next Steps**: Contact JoinUp for API access
- **Features**: Mock search results until real API available

### 📋 Future Providers
- **TEZ Tour**: Directory created, awaiting API details
- **ANEX Tour**: Directory created, awaiting API details  
- **Coral Travel**: Directory created, awaiting API details

## API Endpoints

### Search Travel Offers
```
GET /api/travel/search?departureCities=Tallinn&destination=Türgi&adults=2
POST /api/travel/search
```

### Health Check
```
GET /api/travel/health
```

## Usage Examples

### Basic Search
```typescript
import { getDefaultAggregator } from '@/app/api';

const aggregator = getDefaultAggregator();
const results = await aggregator.search({
  departureCities: ['Tallinn'],
  destination: 'Türgi',
  adults: 2,
  departureDate: new Date('2024-07-15'),
  nights: 7
});
```

### Combined Results
```typescript
const offers = await aggregator.getCombinedOffers({
  departureCities: ['Tallinn'],
  adults: 2
}, 'price'); // Sort by price
```

### Health Check
```typescript
const health = await aggregator.healthCheck();
console.log(health); // { novit: true, joinup: false }
```

## Configuration

### Environment Variables
Copy `.env.example` to `.env.local` and configure:

```bash
# Enable/disable providers
NOVIT_PROVIDER_ENABLED=true
JOINUP_PROVIDER_ENABLED=false

# API credentials
NOVIT_API_KEY=your_api_key_here
JOINUP_API_KEY=your_joinup_key_here
```

### Adding New Providers

1. **Create provider directory**:
   ```
   src/services/providers/new-provider/
   ├── provider.ts
   ├── types.ts (optional)
   └── README.md
   ```

2. **Implement TravelProvider interface**:
   ```typescript
   export class NewProvider extends TravelProvider {
     async search(params: SearchParams): Promise<SearchResult> {
       // Implementation
     }
     
     async getOffer(offerId: string): Promise<TravelOffer | null> {
       // Implementation
     }
     
     async healthCheck(): Promise<boolean> {
       // Implementation
     }
   }
   ```

3. **Register in config.ts**:
   ```typescript
   const newProvider = new NewProvider(providerConfigs.newProvider);
   aggregator.registerProvider(newProvider);
   ```

## Data Flow

1. **Client Request** → API Route (`/api/travel/search`)
2. **API Route** → Travel Aggregator
3. **Aggregator** → Multiple Providers (parallel)
4. **Providers** → External APIs (NovIT, JoinUp, etc.)
5. **Responses** → Standardized format → Client

## Error Handling

- Individual provider failures don't affect other providers
- Timeout handling for slow APIs
- Graceful degradation when providers are unavailable
- Comprehensive logging for debugging

## Future Improvements

1. **Caching**: Add Redis/memory cache for frequent searches
2. **Rate Limiting**: Implement per-provider rate limits
3. **Load Balancing**: Distribute requests across provider instances
4. **Monitoring**: Add metrics and alerting
5. **Booking**: Extend to handle actual bookings (not just search)
