# Mock Data Structure

This directory contains mock data for the travel search engine. The data is organized in a hierarchical structure that follows the business logic of the application.

## Hierarchy

The data follows this hierarchy:
```
Continent → Country → Region → Area → Hotel
```

Each level has a reference to its parent level:
- `country.continentId` references `continent.id`
- `region.countryId` references `country.id`
- `area.regionId` references `region.id`
- `hotel.areaId` references `area.id`

## Directory Structure

```
mock/
├── common/                      # Common data shared across all agencies
│   ├── continents.ts            # Continents data
│   ├── countries.ts             # Countries data
│   ├── regions.ts               # Regions data
│   ├── areas.ts                 # Areas data
│   ├── hotels.ts                # Hotels data
│   ├── mealPlans.ts             # Meal plans data
│   └── departureCities.ts       # Departure cities data
├── novatours/                   # Novatours-specific data
│   ├── packages.ts              # Travel packages (references hotels)
│   └── prices.ts                # Pricing data (optional)
├── teztour/                     # Tez Tour-specific data
│   ├── packages.ts              # Travel packages
│   └── prices.ts                # Pricing data (optional)
└── index.ts                     # Exports all mock data
```

## Data Relationships

### Common Data

- **Continents**: Top level of the hierarchy
- **Countries**: Each country belongs to a continent (`continentId`)
- **Regions**: Each region belongs to a country (`countryId`)
- **Areas**: Each area belongs to a region (`regionId`) and a country (`countryId`)
- **Hotels**: Each hotel belongs to an area (`areaId`), a region (`regionId`), and a country (`countryId`)
- **Meal Plans**: Common meal plans used across all hotels
- **Departure Cities**: Common departure cities used across all packages

### Agency-Specific Data

- **Packages**: Each package references a hotel (`hotelId`), a departure city (`departureCity`), and a meal plan (`mealPlan`)
- **Prices**: Optional pricing data for packages

## Important Notes

1. **Hotel Data**: Hotels are stored in the common directory because they are shared across all agencies. The same hotel can be offered by multiple agencies with different prices and availability.

2. **Package Data**: Packages are agency-specific and contain references to common data (hotels, meal plans, etc.). This allows different agencies to offer the same hotel with different prices and availability.

3. **Internal Use Only**: Agency information (`agencyId`, `agencyName`, etc.) is for internal use only and should not be exposed to users. The frontend should never display which agency is offering a package.

4. **Data Validation**: All references between data entities should be validated to ensure data integrity. For example, a package should only reference a valid hotel ID.

## Usage in Code

When using this data in the application, follow these guidelines:

1. Import data from the appropriate files:
   ```typescript
   import { continents } from '@/data/mock/common/continents';
   import { countries } from '@/data/mock/common/countries';
   // etc.
   ```

2. Use the hierarchy to filter data:
   ```typescript
   // Get all regions for a country
   const countryRegions = regions.filter(region => region.countryId === countryId);
   
   // Get all areas for a region
   const regionAreas = areas.filter(area => area.regionId === regionId);
   
   // Get all hotels for an area
   const areaHotels = hotels.filter(hotel => hotel.areaId === areaId);
   ```

3. When displaying packages, never show the agency information:
   ```typescript
   // WRONG: Exposing agency information
   <div>{package.agencyName}</div>
   
   // RIGHT: Only show relevant information
   <div>{package.price}</div>
   ```
