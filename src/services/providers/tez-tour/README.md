# TEZ Tour Provider

This provider will be implemented when TEZ Tour API details become available.

## Known Information from wp-content analysis:
- TEZ Tour has travel terms at `/reisitingimused/tez-tour/`
- Likely has their own API or data feed

## TODO:
1. Contact TEZ Tour for API access
2. Implement provider based on their API specification
3. Add authentication and request formatting
4. Map their data format to our standard TravelOffer interface

## Expected files:
- `provider.ts` - Main TEZ Tour provider implementation
- `types.ts` - TEZ Tour specific types (if needed)
- `config.ts` - Configuration helpers
