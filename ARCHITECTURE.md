# Unified API and Hooks Structure

This document describes the consolidated API and hooks structure after the refactoring.

## Directory Structure

```
src/
├── app/api/                 # Unified API endpoints
│   ├── auth/               # Authentication endpoints (placeholder)
│   ├── base/               # Core API types and utilities
│   ├── config.ts           # API configuration
│   ├── index.ts            # Main API exports
│   ├── legacy/             # Legacy API endpoints (deprecated)
│   ├── providers/          # Travel provider integrations
│   │   ├── novit/          # NovIT provider
│   │   ├── tez-tour/       # TEZ Tour provider
│   │   └── joinup/         # JoinUp provider
│   └── travel/             # Travel search and health endpoints
│       ├── health/         # Provider health check
│       └── search/         # Unified travel search
├── hooks/                  # React hooks
│   ├── index.ts            # Main hooks exports
│   ├── useTravel.ts        # Universal travel hooks
│   └── novit/              # NovIT-specific hooks (legacy)
│       ├── index.ts
│       ├── useApi.ts
│       ├── useCustomers.ts
│       └── useDestinations.ts
└── data/                   # Static data and mock data
```

## API Endpoints

### Travel API
- `GET /api/travel/health` - Check provider health and status
- `GET /api/travel/search` - Search travel offers (query params)
- `POST /api/travel/search` - Search travel offers (JSON body)

### Authentication API (Placeholder)
- `POST /api/auth` - Login/register
- `POST /api/auth/reset-password` - Password reset

### Legacy API (Deprecated)
- `/api/legacy/*` - Old API endpoints (not functional)

## Travel Providers

### Integrated Providers
1. **NovIT** (`/api/providers/novit/`)
   - Uses encrypted cache from WordPress system
   - Supports search, hotels, and destinations
   - Legacy hooks: `useNovitDestinations`, `useTravelSearch`

2. **TEZ Tour** (`/api/providers/tez-tour/`)
   - XML API integration (xml.tezapi.eu)
   - Requires authentication and IP whitelisting
   - Turkish destinations focus

3. **JoinUp** (`/api/providers/joinup/`)
   - API integration (online.joinupbaltic.eu)
   - Requires authentication
   - Baltic region focus

### Provider Configuration
Each provider has:
- `types.ts` - TypeScript type definitions
- `config.ts` - Configuration and settings
- `provider.ts` - Main provider implementation
- `index.ts` - Public exports
- `README.md` - Documentation

## React Hooks

### Universal Hooks (Recommended)
```typescript
import { useTravel, useTravelHealth, usePopularDestinations } from '@/hooks';

// Travel search
const { search, loading, results, error } = useTravel();

// Provider health check
const { checkHealth, isHealthy, healthyProviders } = useTravelHealth();

// Popular destinations
const { destinations, fetchDestinations } = usePopularDestinations();
```

### Legacy Hooks (Backward Compatibility)
```typescript
import { useTravelSearch, useNovitDestinations } from '@/hooks/novit';

// Still works but consider migrating to universal hooks
const { search, loading, results } = useTravelSearch();
const { countries, refetch } = useNovitDestinations();
```

## Search Parameters

```typescript
interface SearchParams {
  departureCities: string[];     // ['Tallinn', 'Riga']
  destination?: string;          // 'Türgi'
  areas?: string[];             // ['Antalya', 'Alanya']
  resorts?: string[];           // ['Belek', 'Side']
  departureDate?: Date;         // Departure date
  returnDate?: Date;            // Return date
  nights?: number;              // Duration in nights
  adults: number;               // Number of adults
  children?: number;            // Number of children
  childrenAges?: number[];      // Ages of children
  hotelRating?: number[];       // [4, 5]
  mealPlans?: string[];         // ['AI', 'FB']
  priceRange?: {
    min?: number;
    max?: number;
  };
}
```

## Travel Offer Interface

```typescript
interface TravelOffer {
  id: string;
  title: string;
  description?: string;
  price: {
    amount: number;
    currency: string;
    pricePerPerson?: number;
  };
  hotel: {
    name: string;
    rating?: number;
    location: string;
    amenities?: string[];
  };
  flight: {
    departure: Date;
    return: Date;
    duration: number;
    airline?: string;
  };
  mealPlan?: string;
  provider: string;
  source: string;
  availability: boolean;
  lastUpdated: Date;
  deepLink?: string;
  images?: string[];
}
```

## Environment Variables

```bash
# TEZ Tour API
TEZ_TOUR_API_URL=https://xml.tezapi.eu
TEZ_TOUR_API_KEY=your_api_key
TEZ_TOUR_PARTNER_CODE=your_partner_code

# JoinUp API
JOINUP_API_URL=https://online.joinupbaltic.eu
JOINUP_API_KEY=your_api_key
JOINUP_PARTNER_CODE=your_partner_code

# NovIT (uses WordPress cache)
NOVIT_CACHE_PATH=../eksootikareisid-old/wp-content/cache/novit_tours
```

## Migration Notes

### Completed
- ✅ Unified all API logic under `src/app/api/`
- ✅ Removed duplicate `src/services/` and `api-integration/` directories
- ✅ Integrated TEZ Tour and JoinUp providers
- ✅ Created universal travel hooks
- ✅ Added placeholder auth endpoints
- ✅ Updated provider configuration and aggregation
- ✅ Cleaned up legacy references and comments

### Future Improvements
- 🔄 Implement actual authentication service
- 🔄 Add caching layer for provider responses
- 🔄 Implement error handling and retry logic
- 🔄 Add rate limiting and request throttling
- 🔄 Integrate real API credentials and IP whitelisting
- 🔄 Add comprehensive testing suite
- 🔄 Implement monitoring and analytics

## Usage Examples

### Basic Travel Search
```typescript
import { useTravel } from '@/hooks';

function SearchPage() {
  const { search, loading, results, error } = useTravel();
  
  const handleSearch = async () => {
    try {
      await search({
        departureCities: ['Tallinn'],
        destination: 'Türgi',
        adults: 2,
        children: 1,
        childrenAges: [8],
        nights: 7,
        departureDate: new Date('2024-06-01'),
        returnDate: new Date('2024-06-08')
      });
    } catch (err) {
      console.error('Search failed:', err);
    }
  };
  
  return (
    <div>
      <button onClick={handleSearch} disabled={loading}>
        Search {loading && '(Loading...)'}
      </button>
      {results.map(offer => (
        <div key={offer.id}>
          <h3>{offer.title}</h3>
          <p>{offer.hotel.name} - {offer.price.amount} {offer.price.currency}</p>
        </div>
      ))}
    </div>
  );
}
```

### Provider Health Check
```typescript
import { useTravelHealth } from '@/hooks';

function HealthStatus() {
  const { checkHealth, isHealthy, healthyProviders, totalProviders } = useTravelHealth();
  
  useEffect(() => {
    checkHealth();
  }, []);
  
  return (
    <div>
      <p>System Status: {isHealthy ? 'Healthy' : 'Degraded'}</p>
      <p>Providers: {healthyProviders}/{totalProviders} operational</p>
    </div>
  );
}
```

## File Structure Summary

All business logic and API integrations are now centralized under `src/app/api/`, with clean separation between:

1. **Core API** (`base/`, `config.ts`, `index.ts`) - Common types and utilities
2. **Providers** (`providers/`) - External service integrations
3. **Endpoints** (`travel/`, `auth/`) - HTTP API routes
4. **Hooks** (`../hooks/`) - React state management
5. **Data** (`../data/`) - Static data and mock responses

The system is now ready for production with proper provider integrations and unified interfaces.
