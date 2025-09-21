# CLAUDE Working Notes

## CRITICAL: AVOID DUPLICATE FILES
- Always check for existing files before creating new ones
- Use `find` and `ls` commands to verify file structure
- SearchEngine components are in `/src/components/SearchEngine/` NOT `/src/components/`
- RegionSelect, AreaSelect, TravelersInput etc are in subdirectories

## Current Working Files
### Main SearchEngine
- `/src/components/SearchEngine/index.tsx` - Main component (correct one)
- `/src/components/SearchEngine/components/RegionSelect/index.tsx` - Destination selector
- `/src/components/SearchEngine/components/AreaSelect/index.tsx` - Areas/regions dropdown
- `/src/components/SearchEngine/components/TravelersInput/index.tsx` - Travelers selector
- `/src/components/SearchEngine/components/AdvancedSearch/index.tsx` - Advanced options

### API Files
- `/src/app/api/providers/joinup/api.ts` - JoinUp API functions
- `/src/app/api/travel/data/route.ts` - Travel data endpoint
- `/src/lib/travel-data.ts` - Travel data client with caching

## Component Props Mapping
### SearchEngine main props
- `travelers` + `onTravelersChange` (NOT value/onChangeAction)
- `advancedOptions` + `setAdvancedOptions` (NOT values/onChangeAction)
- `isOpen` + `options` + `onOptionsChange` for AdvancedSearch

### RegionSelect props
- `selectedCity` + `onSelectAction` + `selectedDepartureCities` + `onCloseAction`

### AreaSelect props
- `selectedAreas` + `onSelectAction` + `destinationId` + `onCloseAction`

## JoinUp API Documentation
### Reference Location
- `/Users/andrepark/trip_app/eksootikareisid-new/joinup-api/` - Complete API documentation
- `api-example/README.md` - Main integration guide
- `api-example/endpoints.md` - All available endpoints
- `api-example/doc/` - Individual endpoint documentation

### Key API Endpoints Used
- `SearchTour_TOWNFROMS` - Get departure cities
- `SearchTour_STATES` - Get destination countries
- `SearchTour_TOWNS` - Get regions/towns (CRITICAL: needs TOWNFROMINC + STATEINC)
- `SearchTour_CHECKIN` - Get available departure dates
- `SearchTour_PRICES` - Main search for travel packages

## API Issues Found & Fixed
### JoinUp API Problems (SOLVED)
- ✅ **Fixed**: Egypt (destinationId=9) was returning Bulgarian regions
- **Root cause**: Missing TOWNFROMINC parameter in SearchTour_TOWNS call
- **Solution**: Added both TOWNFROMINC and STATEINC parameters (`api.ts:332`)
- **Result**: Now correctly returns 28 Egypt regions, 31 Turkey regions

## Cache Clearing Commands
```bash
rm -rf .next && npm run dev
```

## Debug Workflow
1. Check console logs for API calls
2. Test API endpoints directly with curl
3. Clear cache if components not updating
4. Verify prop names match between parent/child components

## Latest Implementation: Hierarchical AreaSelect (2025-09-21)

### ✅ **COMPLETED: Hierarchical Region Structure**
**Problem**: User wanted AreaSelect dropdown rebuilt like screenshot - showing regions with collapsible cities underneath

**Solution Implemented**:
1. **Fixed JoinUp API** (`api.ts:332`):
   - Issue: Egypt (destinationId=9) returned Bulgarian regions due to missing TOWNFROMINC parameter
   - Fix: Added both TOWNFROMINC and STATEINC parameters to SearchTour_TOWNS call
   - Result: Now correctly returns 28 Egypt regions (Alamein, Alexandria, Dahab, El Gouna, Hurghada, etc.)

2. **Created Hierarchical Grouping Logic** (`AreaSelect/index.tsx:74-104`):
   ```typescript
   // Groups regions intelligently:
   // - "Sharm El Sheikh" + all "Sharm El Sheikh / ..." sub-areas → "Sharm El Sheikh" group
   // - "El Gouna", "Madinat Makadi", "Makadi Bay" → "Hurghada" group
   // - "Alexandria/Montazah" → "Alexandria" group
   ```

3. **Rebuilt AreaSelect Component** with:
   - **Collapsible regions**: ChevronRight/ChevronDown arrows like screenshot
   - **Region-level selection**: Click "Hurghada" = select all 3 cities in that region
   - **Individual city selection**: Can select specific cities within region
   - **Visual indicators**: Green checkmark (all selected), Orange partial (some selected)

4. **Smart Display Text** (`getAreaDisplayText()` helper):
   - Single region, all cities: "Hurghada (kõik)"
   - Single region, partial: "Hurghada (2)"
   - Multiple regions: "3 piirkonda"
   - No selection: "Vali piirkond"

5. **SearchEngine Integration** (`index.tsx:191-216`):
   - Added `currentRegions` state to store loaded regions
   - Modified `handleDestinationSelect()` to load regions when destination changes
   - Updated display text to use `getAreaDisplayText(selectedAreaIds, currentRegions)`

### **Technical Details**
- **Files Modified**:
  - `AreaSelect/index.tsx` - Complete rewrite with hierarchical structure
  - `SearchEngine/index.tsx` - Added regions loading + display text
  - `api.ts` - Fixed TOWNFROMINC parameter for correct Egypt regions

- **API Working**:
  - Turkey (destinationId=8): 31 regions ✅
  - Egypt (destinationId=9): 28 regions ✅ (was returning Bulgarian data before)

- **UI Behavior**: Matches screenshot exactly - expandable regions with cities underneath

## Fixed Issues
- Removed duplicate SearchEngine.tsx, RegionSelect/, AreaSelect/ from root components/
- Fixed TravelersInput props (travelers/onTravelersChange)
- Fixed AdvancedSearch props (isOpen/options/onOptionsChange)
- ✅ **NEW**: Fixed JoinUp API returning wrong regions for Egypt (TOWNFROMINC missing)
- ✅ **NEW**: Implemented hierarchical AreaSelect with collapsible regions like screenshot
- ✅ **NEW**: Fixed DepartureCitySelect props mismatch (onSelectAction → onChangeAction) in SearchEngine
- ✅ **NEW**: Fixed TypeScript errors in SearchEngine (DepartureCalendar props, NightsInput props, unused variables)
- ✅ **NEW**: Replaced hardcoded Egypt grouping with global smart grouping algorithm in AreaSelect
- ✅ **NEW**: Fixed API to include JoinUp region/regionKey fields for true hierarchical data
- ✅ **NEW**: Updated grouping algorithm to use JoinUp's region field instead of text parsing
- ✅ **NEW**: Fixed departure city display to show actual city names ("Tallinn (Estonia)") instead of count ("1 linn valitud")