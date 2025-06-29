# ANEX Tour Provider

This provider will be implemented when ANEX Tour API details become available.

## Known Information from wp-content analysis:
- ANEX has travel terms at `/reisitingimused/anex/`
- Part of Estonian travel market

## TODO:
1. Contact ANEX Tour for API access
2. Implement provider based on their API specification
3. Add authentication and request formatting
4. Map their data format to our standard TravelOffer interface

## Expected files:
- `provider.ts` - Main ANEX provider implementation
- `types.ts` - ANEX specific types (if needed)
- `config.ts` - Configuration helpers
