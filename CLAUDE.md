# CLAUDE Working Notes

## 📋 IMPORTANT: READ PROJECT_GUIDE.md FIRST
- **PROJECT_GUIDE.md** - Comprehensive business logic, architecture and strategy guide
- **This file** - Technical implementation notes and working progress
- **Always consider provider-agnostic design** - Don't hardcode JoinUp-specific logic

## 🆕 MAJOR UPDATE (2025-09-24): IMAGE SYSTEM & REGION GROUPING FIXES
### ✅ COMPLETED: Local Image System Implementation
- **Hero Image**: Restored original Maldives water villa (`/images/hero.jpg`)
- **Continent Images**: All 6 downloaded locally (`/public/images/continents/`)
- **Destination Images**: 9 authentic Wikimedia Commons images (`/public/images/destinations/`)
- **No External Dependencies**: Platform works offline with local images only

### ✅ COMPLETED: AreaSelect Region Grouping Bug Fix
- **Problem**: Greece regions showed flat list instead of hierarchical groups
- **Root Cause**: Grouping logic prioritized JoinUp `region` field over text parsing
- **Solution**: Smart text parsing first, then JoinUp fallback
- **Result**: All countries now show proper hierarchical regions:
  - Egypt: Alexandria, Hurghada, Sharm EL Sheikh, etc groups
  - Turkey: Alanya, Antalya, Belek, Kemer, etc groups
  - Greece: Chania, Heraklion, Rethymno, etc groups (fixed!)
  - Other countries: Automatic detection of best grouping method

## CRITICAL: AVOID DUPLICATE FILES
- Always check for existing files before creating new one
- Use `find` and `ls` commands to verify file structure
- SearchEngine components are in `/src/components/SearchEngine/` NOT `/src/components/`
- RegionSelect, AreaSelect, TravelersInput etc are in subdirectories

## ⚠️ CRITICAL: RIIKIDE PILTIDE REEGLID
**OLULINE - KUNAGI EI TOHI:**
- ❌ Kasutada sama pilti erinevatel riikidel (duplikaadid)
- ❌ Kasutada vale riigi pilti (nt Itaalia pilt Türgi jaoks)
- ❌ Kasutada üldiseid/mittekonkreetseid pilte (nt hotelli bassein)
- ❌ Kasutada poolikuid/halva kvaliteediga pilte

**ALATI PEAD:**
- ✅ Iga riik peab omama UNIKAALSET pilti
- ✅ Pilt peab kajastama ÕIGET riiki (nt Egiptus = püramiidid/kaamelid)
- ✅ Kontrollida `node -e` skriptiga duplikaate enne muudatuste tegemist
- ✅ Testida pilti cURL-iga (HTTP 200)

**Current Image System:** `/src/utils/imageUtils.ts` - Local images only, no external URLs
- `TRAVEL_IMAGES.hero` → `/images/hero.jpg` (Maldives)
- `TRAVEL_IMAGES.continents` → `/images/continents/` (6 files)
- `TRAVEL_IMAGES.destinations` → `/images/destinations/` (9 authentic landmarks)

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

## 🎉 **MAJOR MILESTONE: COMPLETE PLATFORM CLEANUP (2025-09-22)**

### **ALL CRITICAL ISSUES RESOLVED - PLATFORM NOW PRODUCTION-READY**

## ✅ **PHASE 3 COMPLETED (Hotellide Pildid - 2025-09-22)**

### 6. **Implementeeri JoinUp hotellide pildid**
- **Files**: `/src/app/api/providers/joinup/api.ts`, `/src/app/api/providers/joinup/provider.ts`
- **Problem**: Hotellid kuvasid placeholder/vale pilte
- **Solution**: Eager loading - search ajal laeme iga hotelli jaoks päris pildid
- **Result**: ✅ Hotellid kuvatakse ainult oma õigete piltidega JoinUp CMS-ist
- **API**: SearchTour_HOTELINFO endpoint `hotel.images[]` array

## ✅ **PHASE 1 COMPLETED (Critical Platform Fixes)**

### 1. **Remove Novaturas References**
- **File**: `/src/app/reisitingimused/page.tsx`
- **Action**: Commented out non-integrated providers safely for future restoration
- **Status**: ✅ Safe reversible removal

### 2. **Popular Destinations with JoinUp API**
- **Files**: `/src/components/PopularDestinations.tsx`, `/src/lib/travel-data.ts`
- **Action**: Complete rewrite to use real JoinUp API data instead of mock data
- **Result**: Homepage now loads 6 real destinations from JoinUp API
- **Features**: Loading states, error handling, proper destination linking

### 3. **Fix Critical Search Implementation**
- **Files**: `/src/app/api/providers/joinup/provider.ts`
- **Problem**: Core search functionality returned empty arrays (platform unusable)
- **Solution**: Uncommented and implemented `searchOffers()` function call
- **Result**: ✅ Real search functionality working - API calls JoinUp SearchTour_PRICES endpoint
- **Impact**: Platform now has business value - users can search for real travel offers

## ✅ **PHASE 2 COMPLETED (Architecture Improvements)**

### 4. **Fix AreaSelect Provider Coupling**
- **Files**: `/src/lib/travel-data.ts`
- **Problem**: AreaSelect only worked with JoinUp provider (`region.region` field)
- **Solution**: Added optional `region` and `nameAlt` fields to `TravelRegion` interface
- **Result**: ✅ Provider-agnostic architecture ready for multi-provider expansion
- **Features**: Smart grouping patterns for any provider (JoinUp hierarchy + text parsing fallback)

### 5. **Unify SearchEngine Data Sources**
- **Files**: `/src/components/SearchEngine/index.tsx`
- **Problem**: 4 conflicting data sources causing confusion (API + 3 static files)
- **Solution**: Removed static type imports, unified to single API-based data source
- **Result**: ✅ Single source of truth - consistent data flow
- **Impact**: Easier maintenance, no more data conflicts

## 🚀 **PLATFORM STATUS AFTER CLEANUP**

### **Before Cleanup**:
- ❌ Core search functionality broken (empty results)
- ❌ Popular destinations using mock data
- ❌ AreaSelect coupled to JoinUp only
- ❌ SearchEngine data source confusion
- ❌ Platform had no business value

### **After Cleanup**:
- ✅ **Fully functional search** with real JoinUp API integration
- ✅ **Real destination data** on homepage
- ✅ **Provider-agnostic architecture** ready for multi-provider
- ✅ **Single source of truth** for all data
- ✅ **Platform has business value** - users can search and book

### **Multi-Provider Ready**:
The architecture is now prepared for adding new travel providers:
- AreaSelect works with any provider (hierarchy or text parsing)
- SearchEngine uses unified API pattern
- Type system supports provider-specific extensions
- Clean separation of concerns

## **Previous Implementation: Hierarchical AreaSelect**
**Note**: The hierarchical AreaSelect structure was completed in earlier sessions.
- **Provider-agnostic grouping**: Uses JoinUp hierarchy + text parsing fallback
- **UI**: Collapsible regions with visual selection indicators
- **API Integration**: Dynamic region loading per destination

## Fixed Issues
- Removed duplicate SearchEngine.tsx, RegionSelect/, AreaSelect/ from root components/
- Fixed TravelersInput props (travelers/onTravelersChange)
- Fixed AdvancedSearch props (isOpen/options/onOptionsChange)
- ✅ Fixed JoinUp API returning wrong regions for Egypt (TOWNFROMINC missing)
- ✅ **LATEST**: Fixed AreaSelect region grouping bug for Greece (2025-09-24)
  - **Issue**: Greece showed flat list "Chania - Kolymbari" instead of hierarchical groups
  - **Fix**: Changed grouping priority from JoinUp `region` field to text parsing first
  - **Location**: `/src/components/SearchEngine/components/AreaSelect/index.tsx:161-189`
  - **Result**: All countries now show proper collapsible region groups
- ✅ **NEW**: Implemented hierarchical AreaSelect with collapsible regions like screenshot
- ✅ **NEW**: Fixed DepartureCitySelect props mismatch (onSelectAction → onChangeAction) in SearchEngine
- ✅ **NEW**: Fixed TypeScript errors in SearchEngine (DepartureCalendar props, NightsInput props, unused variables)
- ✅ **NEW**: Replaced hardcoded Egypt grouping with global smart grouping algorithm in AreaSelect
- ✅ **NEW**: Fixed API to include JoinUp region/regionKey fields for true hierarchical data
- ✅ **NEW**: Updated grouping algorithm to use JoinUp's region field instead of text parsing
- ✅ **NEW**: Fixed departure city display to show actual city names ("Tallinn (Estonia)") instead of count ("1 linn valitud")
- ✅ Created PROJECT_GUIDE.md with comprehensive business logic and architecture strategy
- ✅ **RESOLVED**: AreaSelect grouping is now fully provider-agnostic (2025-09-24)
- ✅ Implemented complete navigation hierarchy: Continent → Country → Region with real JoinUp API data
- ✅ Country page shows regions, Region page shows search link and region details

## 📁 Key Files Modified Today (2025-09-24)
- `/src/components/SearchEngine/components/AreaSelect/index.tsx` - Fixed region grouping logic
- `/src/utils/imageUtils.ts` - Converted to local image system, restored hero image
- `/public/images/` - Added hero.jpg, continents/, destinations/ directories
- `CLAUDE.md` - Updated with latest fixes and local image system documentation