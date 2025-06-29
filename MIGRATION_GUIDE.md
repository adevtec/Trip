# Migration Guide: api-integration → services

This document explains what was moved from `api-integration/` to the new unified services system.

## What Was Moved

### ✅ React Hooks
```
api-integration/hooks/ → src/hooks/novit/
├── useApi.ts           → src/hooks/novit/useApi.ts (✅ updated)
├── useDestinations.ts  → src/hooks/novit/useDestinations.ts (✅ updated)
└── useCustomers.ts     → src/hooks/novit/useCustomers.ts (✅ updated)
```

### ✅ TypeScript Types
```
api-integration/types/api.ts → src/services/providers/novit/types/api.ts (✅ extracted)
```

### ✅ Configuration
```
api-integration/lib/config.ts → src/services/providers/novit/lib/config.ts (✅ adapted)
```

### ✅ Documentation
```
api-integration/README.md → src/services/providers/novit/README.md (✅ updated)
api-integration/examples/ → Migration guide examples (✅ documented)
```

## What Stays (For Now)

### 🔄 Core Libraries (Still Referenced)
```
api-integration/lib/
├── http-client.ts      # ✅ Used by NovITProvider
├── encryption.ts       # ✅ Used by NovITProvider
└── cache.ts           # ✅ Used by NovITProvider
```

**Why:** These are working implementations. NovITProvider imports them directly.

### 🗑️ Can Be Removed Later
```
api-integration/
├── .env.example        # ❌ Duplicate (have root .env.example)
├── api/               # ❌ Replaced by src/app/api/travel/
├── GET_API_KEYS.md    # ❌ Temporary setup doc
└── index.ts           # ❌ Old exports
```

## New Structure

### Travel Services API
```
src/app/api/travel/
├── search/route.ts     # ✅ NEW unified search endpoint
└── health/route.ts     # ✅ NEW health check endpoint
```

### Provider System
```
src/services/
├── base/              # ✅ NEW unified interfaces
├── providers/
│   ├── novit/         # ✅ NEW NovIT provider (uses api-integration/lib/)
│   ├── joinup/        # ✅ NEW JoinUp template
│   └── ...
├── config.ts          # ✅ NEW multi-provider config
└── index.ts           # ✅ NEW exports
```

### React Integration
```
src/hooks/novit/       # ✅ NEW updated hooks
└── index.ts           # ✅ NEW exports
```

## Updated Import Paths

### Before (api-integration)
```typescript
import { useDestinations } from '../api-integration/hooks/useDestinations';
import { ApiClient } from '../api-integration/lib/http-client';
```

### After (services)
```typescript
import { useNovitDestinations } from '@/hooks/novit';
import { getDefaultAggregator } from '@/services';
```

## Environment Variables

### Consolidated in .env.local
```bash
# NovIT Provider (was in api-integration/.env.example)
NOVIT_PROVIDER_ENABLED=true
NOVIT_API_KEY=your_api_key_here
NOVIT_API_ENCRYPTION_KEY=This is my secret key
NOVIT_API_ENCRYPTION_IV=This is my secret iv
NOVIT_DEBUG=false

# Multi-provider support (NEW)
JOINUP_PROVIDER_ENABLED=false
TEZ_PROVIDER_ENABLED=false
# ... more providers
```

## Testing

Run migration test:
```bash
node test-novit-integration.js
```

Should show:
- ✅ All new files exist
- ✅ Environment variables loaded
- ✅ Ready for api-integration/ removal

## Next Steps

1. **Test the new system** thoroughly
2. **Verify all hooks work** with new API endpoints
3. **Get real NovIT API key** and test
4. **Remove api-integration/** when confident

## Safe Removal

When ready to remove `api-integration/`:

1. **Move core lib/ files** to `src/services/providers/novit/lib/`
2. **Update import paths** in NovITProvider
3. **Remove api-integration/** folder
4. **Update .gitignore** if needed

This ensures no code is lost and everything stays functional.
