# NovIT Provider Integration Guide

This provider integrates NovIT (NovaTours) API into our unified travel services system.

## Files Structure

```
src/services/providers/novit/
├── provider.ts          # Main NovITProvider class
├── types/
│   └── api.ts          # NovIT-specific types
├── lib/
│   └── config.ts       # NovIT configuration
└── README.md           # This file
```

## Integration Sources

This provider is built using code extracted from:

1. **wp-content/plugins/novit_tours/** - WordPress plugin analysis
   - HttpClient.php → NovitApiClient (migrated to lib/)
   - Encryption.php → NovitEncryption (migrated to lib/)  
   - Cache.php → NovitCache (migrated to lib/)

2. **src/services/providers/novit/lib/** - TypeScript implementation
   - http-client.ts - Main API client
   - encryption.ts - API key encryption
   - cache.ts - Response caching
   - config.ts - Configuration management

## How It Works

1. **NovITProvider** extends the base `TravelProvider` interface
2. Uses migrated `lib/` classes for actual API communication
3. Converts NovIT API responses to our standard `TravelOffer` format
4. Handles caching, error handling, and health checks

## API Endpoints Used

- `validateApiKey()` - Check if API key is valid
- `getCountries()` - Get available destination countries
- Future: `searchOffers()` - Search for travel offers (when API key available)

## Configuration

Set environment variables in `.env.local`:

```bash
# Enable NovIT provider
NOVIT_PROVIDER_ENABLED=true

# API credentials (get from NovIT)
NOVIT_API_KEY=your_real_api_key_here

# Encryption settings (from wp-content analysis)
NOVIT_API_ENCRYPTION_KEY=This is my secret key
NOVIT_API_ENCRYPTION_IV=This is my secret iv

# Debug mode
NOVIT_DEBUG=false
```

## Usage in Application

```typescript
import { getDefaultAggregator } from '@/app/api';

// Get aggregator with NovIT provider included
const aggregator = getDefaultAggregator();

// Search across all providers (including NovIT)
const results = await aggregator.search({
  departureCities: ['Tallinn'],
  destination: 'Türgi',
  adults: 2,
  departureDate: new Date('2024-07-15')
});

// Check NovIT health
const health = await aggregator.healthCheck();
console.log(health.novit); // true/false
```

## React Hooks

Use the NovIT-specific React hooks:

```typescript
import { useTravelSearch, useApiValidation } from '@/hooks/novit';

function SearchComponent() {
  const { search, loading, results } = useTravelSearch();
  const { isValidKey, checkApiKey } = useApiValidation();
  
  // Check API key on mount
  useEffect(() => {
    checkApiKey();
  }, []);
  
  return (
    <div>
      {isValidKey ? (
        <button onClick={() => search({ ... })}>
          Search {loading && '...'}
        </button>
      ) : (
        <p>API key not valid</p>
      )}
    </div>
  );
}
```

## Next Steps

1. **Get real API key** from NovIT/NovaTours
2. **Test with real data** instead of mock responses
3. **Implement full search API** when endpoints available
4. **Add booking functionality** if needed

## Migration Notes

- ✅ **Migration completed** - All lib/ files moved from api-integration/
- ✅ **No duplication** - Provider uses local lib/ classes
- ✅ **api-integration/** can now be safely removed
- ✅ **All hooks moved** to `src/hooks/novit/` and updated for new API endpoints
