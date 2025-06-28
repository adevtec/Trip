/**
 * Standard search filter structure used across the application
 * This defines what parameters can be used to filter search results
 */
export interface SearchFilters {
  // Basic search parameters
  departureCities: string[];        // IDs of departure cities
  destination?: string;             // Country ID
  areas?: string[];                 // Area IDs within the destination
  resorts?: string[];               // Resort IDs within the areas
  departureDate?: Date;             // Departure date
  returnDate?: Date;                // Return date (optional, can be calculated from nights)
  nights?: number;                  // Number of nights
  
  // Travelers information
  adults: number;                   // Number of adults
  children: number;                 // Number of children
  childrenAges?: number[];          // Ages of children (if needed for pricing)
  
  // Additional filters
  hotelRating?: number[];           // Hotel star ratings (e.g., [3, 4, 5] for 3+ stars)
  mealPlans?: string[];             // Meal plan codes (e.g., ["AI", "HB", "BB"])
  hotelNames?: string[];            // Specific hotel names to filter by
  priceRange?: {                    // Price range filter
    min?: number;
    max?: number;
  };
  
  // Pagination and sorting
  page?: number;                    // Page number for pagination
  pageSize?: number;                // Number of results per page
  sortBy?: string;                  // Field to sort by (e.g., "price", "rating")
  sortOrder?: 'asc' | 'desc';       // Sort order
}

/**
 * Standard search result structure
 * This is the unified format that all travel agency data will be converted to
 */
export interface SearchResult {
  id: string;                       // Unique identifier for the result
  
  // Basic information
  hotelName: string;                // Name of the hotel
  hotelRating: number;              // Star rating (1-5)
  location: {                       // Location information
    country: string;                // Country name
    area: string;                   // Area name
    resort: string;                 // Resort name
  };
  
  // Trip details
  departureCity: string;            // Departure city name
  departureDate: Date;              // Departure date
  returnDate: Date;                 // Return date
  nights: number;                   // Number of nights
  
  // Room and meal information
  roomType: string;                 // Room type description
  mealPlan: string;                 // Meal plan description
  mealPlanCode: string;             // Meal plan code (AI, HB, BB, etc.)
  
  // Pricing
  price: number;                    // Total price
  pricePerPerson: number;           // Price per person
  originalPrice?: number;           // Original price (if discounted)
  discount?: number;                // Discount percentage
  
  // Additional information
  description?: string;             // Hotel description
  images: string[];                 // Array of image URLs
  features?: string[];              // Hotel features/amenities
  
  // Availability
  available: boolean;               // Whether the offer is available
  
  // Metadata (for internal use)
  agencyId: string;                 // ID of the travel agency (not shown to users)
  agencyName: string;               // Name of the travel agency (not shown to users)
  deepLink?: string;                // Direct link to the offer on the agency's site (internal use)
}

/**
 * Search response structure
 */
export interface SearchResponse {
  results: SearchResult[];          // Array of search results
  totalResults: number;             // Total number of results (for pagination)
  page: number;                     // Current page
  pageSize: number;                 // Number of results per page
  filters: {                        // Available filters based on results
    hotelRatings: number[];         // Available hotel ratings
    mealPlans: string[];            // Available meal plans
    locations: {                    // Available locations
      countries: string[];
      areas: string[];
      resorts: string[];
    };
    priceRange: {                   // Price range in results
      min: number;
      max: number;
    };
  };
}

/**
 * Travel agency interface (for internal use only)
 */
export interface TravelAgency {
  id: string;                       // Unique identifier
  name: string;                     // Agency name
  logo?: string;                    // Agency logo URL
  enabled: boolean;                 // Whether the agency is enabled
  priority: number;                 // Priority for sorting results (higher = first)
  supportedDestinations: string[];  // List of supported destination IDs
}
