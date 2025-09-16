# JoinUp API TypeScript Types

## 🎯 **JoinUp API Request/Response Types**

### **API Request Parameters**
```typescript
// Base API parameters for all requests
interface JoinUpBaseParams {
  samo_action: 'api';
  version: '1.0';
  oauth_token: string;
  type: 'json' | 'xml';
  action: JoinUpAction;
}

// All available API actions
type JoinUpAction = 
  | 'SearchTour_TOWNFROMS'
  | 'SearchTour_STATES'
  | 'SearchTour_CHECKIN'
  | 'SearchTour_NIGHTS'
  | 'SearchTour_PRICES'
  | 'SearchTour_HOTELS'
  | 'SearchTour_STARS'
  | 'SearchTour_MEALS'
  | 'SearchTour_TOWNS'
  | 'SearchTour_HOTELINFO'
  | 'SearchTour_ROOM_PLACEMENT'
  | 'SearchTour_CANCEL_POLICIES'
  | 'SearchTour_PAYMENT_POLICIES'
  | 'SearchTour_CALC'
  | 'SearchTour_BRON'
  | 'Tickets_PRICES'
  | 'Currency_CURRENCIES'
  | 'Currency_RATES';

// Search-specific parameters
interface JoinUpSearchParams extends JoinUpBaseParams {
  townfrom_id?: string;     // Departure city ID
  state_id?: string;        // Destination country ID
  checkin?: string;         // YYYY-MM-DD format
  nights?: number;          // Trip duration
  adults?: number;          // Number of adults
  children?: number;        // Number of children
  hotel_id?: string;        // Specific hotel ID
  room_id?: string;         // Specific room ID
}
```

### **API Response Types**

#### **SearchTour_TOWNFROMS Response**
```typescript
interface TownFromsResponse {
  townfroms: TownFrom[];
}

interface TownFrom {
  townfrom_id: string;
  townfrom_name: string;
  country: string;
  airport_code?: string;
}
```

#### **SearchTour_STATES Response**
```typescript
interface StatesResponse {
  states: State[];
}

interface State {
  state_id: string;
  state_name: string;
  country_code: string;
  region?: string;
}
```

#### **SearchTour_PRICES Response (Main Search)**
```typescript
interface PricesResponse {
  hotels: JoinUpHotel[];
  total_count: number;
  status: 'success' | 'error';
  error?: string;
}

interface JoinUpHotel {
  hotel_id: string;
  hotel_name: string;
  stars: string;                    // "1", "2", "3", "4", "5"
  town: string;
  region?: string;
  price: string;                    // Per person price
  total_price: string;              // Total price for all guests
  currency: string;                 // "EUR", "USD", etc.
  meal: JoinUpMealType;
  checkin: string;                  // "YYYY-MM-DD"
  nights: string;
  adults: string;
  children: string;
  hotel_image?: string;
  hotel_description?: string;
  location?: string;
  distance_to_center?: string;
  distance_to_beach?: string;
  room_type?: string;
  available_rooms?: number;
  last_update?: string;
}

type JoinUpMealType = 
  | 'RO'    // Room Only
  | 'BB'    // Bed & Breakfast  
  | 'HB'    // Half Board
  | 'FB'    // Full Board
  | 'AI'    // All Inclusive
  | 'UAI';  // Ultra All Inclusive
```

#### **SearchTour_STARS Response**
```typescript
interface StarsResponse {
  stars: HotelStar[];
}

interface HotelStar {
  star_id: string;
  star_name: string;      // "1 star", "2 stars", etc.
  star_value: number;     // 1, 2, 3, 4, 5
}
```

#### **SearchTour_MEALS Response**
```typescript
interface MealsResponse {
  meals: MealPlan[];
}

interface MealPlan {
  meal_id: string;
  meal_code: JoinUpMealType;
  meal_name: string;
  meal_description?: string;
}
```

#### **SearchTour_TOWNS Response**
```typescript
interface TownsResponse {
  towns: Town[];
}

interface Town {
  town_id: string;
  town_name: string;
  state_id: string;
  region?: string;
  is_popular?: boolean;
}
```

#### **SearchTour_HOTELINFO Response**
```typescript
interface HotelInfoResponse {
  hotel: JoinUpHotelDetails;
}

interface JoinUpHotelDetails {
  hotel_id: string;
  hotel_name: string;
  stars: number;
  address: string;
  town: string;
  country: string;
  description: string;
  images: string[];
  amenities: string[];
  location_info: {
    distance_to_center?: number;
    distance_to_beach?: number;
    distance_to_airport?: number;
  };
  contact_info?: {
    phone?: string;
    email?: string;
    website?: string;
  };
}
```

#### **SearchTour_ROOM_PLACEMENT Response**
```typescript
interface RoomPlacementResponse {
  rooms: RoomOption[];
}

interface RoomOption {
  room_id: string;
  room_name: string;
  room_type: string;
  max_adults: number;
  max_children: number;
  max_infants: number;
  price_per_person: number;
  total_price: number;
  currency: string;
  available_count: number;
  amenities: string[];
  size_sqm?: number;
  bed_type?: string;
}
```

## 🔄 **Mapping Types**

### **Our System → JoinUp Mapping**
```typescript
// Departure city mapping
interface DepartureCityMapping {
  [ourCityId: string]: string;  // our ID → JoinUp townfrom_id
}

const DEPARTURE_CITY_MAP: DepartureCityMapping = {
  'tallinn': '1',
  'riga': '2', 
  'vilnius': '3',
  'warsaw': '4',
  'palanga': '5'
};

// Destination mapping
interface DestinationMapping {
  [ourDestination: string]: string;  // our destination → JoinUp state_id
}

const DESTINATION_MAP: DestinationMapping = {
  'turkey': '17',
  'greece': '12',
  'spain': '15',
  'egypt': '8',
  'cyprus': '6'
};

// Meal plan mapping
interface MealPlanMapping {
  [ourMealPlan: string]: JoinUpMealType;
}

const MEAL_PLAN_MAP: MealPlanMapping = {
  'breakfast': 'BB',
  'half-board': 'HB', 
  'full-board': 'FB',
  'all-inclusive': 'AI',
  'room-only': 'RO'
};
```

## 🛠️ **Provider Configuration Types**

```typescript
interface JoinUpConfig {
  oauthToken: string;
  baseUrl?: string;
  timeout?: number;
  retries?: number;
  debug?: boolean;
}

interface JoinUpProviderState {
  isInitialized: boolean;
  lastSync: Date | null;
  departureCities: TownFrom[];
  destinations: State[];
  mealPlans: MealPlan[];
  hotelStars: HotelStar[];
  errorCount: number;
  lastError?: string;
}
```

## 🎯 **Unified Response Types**

### **Convert JoinUp to Our Standard Format**
```typescript
// Our unified travel offer interface
interface TravelOffer {
  id: string;
  provider: 'joinup';
  
  hotel: {
    id: string;
    name: string;
    rating: number;
    location: string;
    description?: string;
    images: string[];
    amenities?: string[];
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  
  price: {
    amount: number;
    currency: string;
    per: 'person' | 'total';
    breakdown?: {
      base: number;
      taxes: number;
      fees: number;
    };
  };
  
  itinerary: {
    departureCity: string;
    destination: string;
    checkIn: Date;
    checkOut: Date;
    nights: number;
  };
  
  inclusions: {
    meal: string;
    transport: boolean;
    accommodation: boolean;
    transfers?: boolean;
  };
  
  guests: {
    adults: number;
    children: number;
    childrenAges?: number[];
  };
  
  bookingInfo: {
    availableRooms: number;
    lastUpdate: Date;
    deepLinkUrl?: string;
    cancellationPolicy?: string;
    paymentPolicy?: string;
  };
  
  metadata: {
    searchTime: Date;
    ttl: number;  // Time to live in seconds
    sourceData: JoinUpHotel;  // Original response for debugging
  };
}

// Conversion function type
type JoinUpConverter = (
  joinupHotel: JoinUpHotel, 
  searchParams: SearchParams
) => TravelOffer;
```

## 🔍 **Error Types**

```typescript
interface JoinUpError {
  type: 'API_ERROR' | 'NETWORK_ERROR' | 'VALIDATION_ERROR' | 'RATE_LIMIT';
  message: string;
  code?: string;
  details?: any;
  timestamp: Date;
  requestId?: string;
}

interface JoinUpApiErrorResponse {
  Error?: string;
  message?: string;
  error_code?: string;
}
```

## 🎮 **Usage Example**

```typescript
// Complete typed implementation
class JoinUpProvider implements TravelProvider {
  private config: JoinUpConfig;
  private state: JoinUpProviderState;
  
  async search(params: SearchParams): Promise<TravelOffer[]> {
    const joinupParams: JoinUpSearchParams = {
      samo_action: 'api',
      version: '1.0',
      oauth_token: this.config.oauthToken,
      type: 'json',
      action: 'SearchTour_PRICES',
      townfrom_id: DEPARTURE_CITY_MAP[params.departureCities[0]],
      state_id: DESTINATION_MAP[params.destination!],
      checkin: params.departureDate?.toISOString().split('T')[0],
      nights: params.nights,
      adults: params.adults,
      children: params.children
    };
    
    const response: PricesResponse = await this.makeRequest(joinupParams);
    
    return response.hotels.map(hotel => 
      this.convertToStandardFormat(hotel, params)
    );
  }
}
```
