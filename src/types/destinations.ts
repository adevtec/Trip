/**
 * Destination data types
 * This file contains all types related to the destination hierarchy:
 * Continent → Country → Region → Area → Hotel
 */

/**
 * Continent
 * Top level in the destination hierarchy
 */
export interface Continent {
  id: string;           // Unique identifier (e.g., 'europe', 'asia')
  name: string;         // Display name (e.g., 'Europe', 'Asia')
  slug: string;         // URL-friendly name (e.g., 'europe', 'asia')
  image: string;        // Image URL
  description: string;  // Short description
}

/**
 * Country
 * Second level in the destination hierarchy
 */
export interface Country {
  id: string;           // Unique identifier (e.g., 'turkey', 'egypt')
  continentId: string;  // Reference to parent continent
  name: string;         // Display name (e.g., 'Turkey', 'Egypt')
  slug: string;         // URL-friendly name (e.g., 'turkey', 'egypt')
  image: string;        // Image URL
  description: string;  // Short description
  departureCities: string[]; // Available departure cities (IDs)
}

/**
 * Region
 * Third level in the destination hierarchy
 */
export interface Region {
  id: string;           // Unique identifier (e.g., 'turkish-riviera', 'red-sea')
  countryId: string;    // Reference to parent country
  name: string;         // Display name (e.g., 'Turkish Riviera', 'Red Sea')
  slug: string;         // URL-friendly name
  image: string;        // Image URL
  description: string;  // Short description
}

/**
 * Area
 * Fourth level in the destination hierarchy
 */
export interface Area {
  id: string;           // Unique identifier (e.g., 'antalya', 'hurghada')
  regionId: string;     // Reference to parent region
  countryId: string;    // Reference to country (for easier filtering)
  name: string;         // Display name (e.g., 'Antalya', 'Hurghada')
  slug: string;         // URL-friendly name
  image: string;        // Image URL
  description: string;  // Short description
  weatherInfo?: {       // Optional weather information
    bestTimeToVisit: string;
    averageTemperature: string;
  };
  attractions?: string[]; // Optional list of attractions
}

/**
 * Room Type
 * Used in Hotel
 */
export interface RoomType {
  id: string;           // Unique identifier
  name: string;         // Display name (e.g., 'Standard Room', 'Suite')
  capacity: number;     // Maximum number of guests
  description: string;  // Short description
  images?: string[];    // Optional room images
}

/**
 * Meal Plan
 * Used in Hotel and Package
 */
export interface MealPlan {
  id: string;           // Unique identifier (e.g., 'ai', 'hb', 'bb')
  code: string;         // Short code (e.g., 'AI', 'HB', 'BB')
  name: string;         // Display name (e.g., 'All Inclusive', 'Half Board')
  description: string;  // Short description
}

/**
 * Hotel
 * Fifth level in the destination hierarchy
 */
export interface Hotel {
  id: string;           // Unique identifier
  areaId: string;       // Reference to parent area
  regionId: string;     // Reference to region (for easier filtering)
  countryId: string;    // Reference to country (for easier filtering)
  name: string;         // Display name
  slug: string;         // URL-friendly name
  rating: number;       // Star rating (1-5)
  description: string;  // Detailed description
  images: string[];     // Array of image URLs
  features: string[];   // Array of hotel features/amenities
  roomTypes: RoomType[]; // Available room types
  availableMealPlans: string[]; // Available meal plan IDs
  coordinates?: {       // Optional geographic coordinates
    latitude: number;
    longitude: number;
  };
}

/**
 * Travel Package
 * Represents a specific offer from a travel agency
 */
export interface TravelPackage {
  id: string;           // Unique identifier
  hotelId: string;      // Reference to hotel
  agencyId: string;     // Reference to travel agency (internal use only)
  departureCity: string; // Departure city ID
  departureDate: string; // Departure date (ISO string)
  returnDate: string;   // Return date (ISO string)
  nights: number;       // Number of nights
  roomType: string;     // Room type ID
  mealPlan: string;     // Meal plan ID
  price: number;        // Total price
  pricePerPerson: number; // Price per person
  originalPrice?: number; // Original price (if discounted)
  discount?: number;    // Discount percentage
  available: boolean;   // Whether the package is available
  deepLink?: string;    // Direct link to the offer on the agency's site (internal use)
}

/**
 * Departure City
 * Used for departure locations
 */
export interface DepartureCity {
  id: string;           // Unique identifier
  name: string;         // Display name
  code: string;         // Airport code (e.g., 'TLL', 'RIX')
  country: string;      // Country of the city
}

/**
 * Travel Agency
 * Used for internal reference only (not exposed to users)
 */
export interface TravelAgency {
  id: string;           // Unique identifier
  name: string;         // Agency name
  logo?: string;        // Agency logo URL
  enabled: boolean;     // Whether the agency is enabled
  priority: number;     // Priority for sorting results (higher = first)
  supportedDestinations: string[]; // List of supported destination IDs
}
