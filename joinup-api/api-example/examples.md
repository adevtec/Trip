# JoinUp API Implementation Examples

## 🔄 **Parameter Mapping Examples**

### **Our Search Params → JoinUp API**

```typescript
// Our current search interface
interface OurSearchParams {
  departureCities: ['tallinn', 'riga'];
  destination: 'turkey';
  areas: ['antalya', 'alanya'];
  departureDate: new Date('2025-08-15');
  nights: 7;
  adults: 2;
  children: 1;
  childrenAges: [8];
  hotelRating: [4, 5];
  mealPlans: ['AI', 'FB'];
}

// Step 1: Map departure cities
const departureCityMapping = {
  'tallinn': '1',    // From SearchTour_TOWNFROMS response
  'riga': '2',
  'vilnius': '3'
};

// Step 2: Map destinations
const destinationMapping = {
  'turkey': '17',    // From SearchTour_STATES response
  'greece': '12',
  'spain': '15'
};

// Step 3: Build JoinUp API call
const joinupParams = {
  townfrom_id: '1',              // tallinn
  state_id: '17',                // turkey
  checkin: '2025-08-15',
  nights: 7,
  adults: 2,
  children: 1
};
```

## 🔗 **API Call Examples**

### **1. Basic Search Flow**

```javascript
// Step 1: Get departure cities (once, cache result)
const departureCitiesResponse = await fetch(
  `https://online.joinupbaltic.eu/export/default.php?` +
    `samo_action=api&version=1.0&oauth_token=${OAUTH_TOKEN}&type=json&action=SearchTour_TOWNFROMS`
);

// Step 2: Get available countries for Tallinn
const countriesResponse = await fetch(
  `https://online.joinupbaltic.eu/export/default.php?` +
    `samo_action=api&version=1.0&oauth_token=${OAUTH_TOKEN}&type=json&action=SearchTour_STATES&townfrom_id=1`
);

// Step 3: Main search
const searchResponse = await fetch(
  `https://online.joinupbaltic.eu/export/default.php?` +
    `samo_action=api&version=1.0&oauth_token=${OAUTH_TOKEN}&type=json&action=SearchTour_PRICES` +
    `&townfrom_id=1&state_id=17&checkin=2025-08-15&nights=7&adults=2&children=1`
);

const offers = await searchResponse.json();
```

### **2. Enhanced Search with Filters**

```javascript
async function searchWithFilters(params) {
  // First get basic results
  const baseResults = await getBasicSearch(params);

  // Then apply additional filters
  if (params.hotelRating.length > 0) {
    const starFilter = await fetch(
      `https://online.joinupbaltic.eu/export/default.php?` +
        `samo_action=api&version=1.0&oauth_token=${OAUTH_TOKEN}&type=json&action=SearchTour_STARS` +
        `&townfrom_id=${params.townfrom_id}&state_id=${params.state_id}`
    );
    // Filter results by stars
  }

  if (params.mealPlans.length > 0) {
    const mealFilter = await fetch(
      `https://online.joinupbaltic.eu/export/default.php?` +
        `samo_action=api&version=1.0&oauth_token=${OAUTH_TOKEN}&type=json&action=SearchTour_MEALS` +
        `&townfrom_id=${params.townfrom_id}&state_id=${params.state_id}`
    );
    // Filter results by meal plans
  }

  return filteredResults;
}
```

## 📊 **Response Processing Examples**

### **JoinUp Response Format:**

```json
{
  "hotels": [
    {
      "hotel_id": "12345",
      "hotel_name": "Grand Resort Antalya",
      "stars": "5",
      "town": "Antalya",
      "price": "899.00",
      "currency": "EUR",
      "meal": "AI",
      "checkin": "2025-08-15",
      "nights": "7",
      "adults": "2",
      "children": "1",
      "total_price": "1798.00",
      "hotel_image": "https://...",
      "hotel_description": "Luxury resort...",
      "location": "Beachfront"
    }
  ],
  "total_count": 1,
  "status": "success"
}
```

### **Convert to Our Format:**

```typescript
function convertJoinUpResponse(joinupData: any): TravelOffer[] {
  return joinupData.hotels.map((hotel) => ({
    id: `joinup-${hotel.hotel_id}-${hotel.checkin}`,
    provider: "joinup",

    hotel: {
      id: hotel.hotel_id,
      name: hotel.hotel_name,
      rating: parseInt(hotel.stars),
      location: hotel.town,
      description: hotel.hotel_description,
      images: [hotel.hotel_image].filter(Boolean),
    },

    price: {
      amount: parseFloat(hotel.total_price),
      currency: hotel.currency,
      per: "total",
      breakdown: {
        base: parseFloat(hotel.price),
        perPerson: parseFloat(hotel.price),
      },
    },

    itinerary: {
      departureCity: params.departureCities[0], // Map back from townfrom_id
      destination: hotel.town,
      checkIn: new Date(hotel.checkin),
      nights: parseInt(hotel.nights),
      checkOut: new Date(
        new Date(hotel.checkin).getTime() +
          parseInt(hotel.nights) * 24 * 60 * 60 * 1000
      ),
    },

    inclusions: {
      meal: hotel.meal,
      transport: true, // JoinUp usually includes transport
      accommodation: true,
    },

    guests: {
      adults: parseInt(hotel.adults),
      children: parseInt(hotel.children),
    },

    bookingInfo: {
      availableRooms: 1, // Would need SearchTour_ROOM_PLACEMENT for exact count
      lastUpdate: new Date(),
      deepLinkUrl: `${params.bookingBaseUrl}?hotel_id=${hotel.hotel_id}&checkin=${hotel.checkin}`,
    },
  }));
}
```

## 🔄 **Integration with Our Aggregator**

### **JoinUp Provider Implementation:**

```typescript
// src/app/api/providers/joinup/provider_enhanced.ts
export class JoinUpProvider extends TravelProvider {
  private baseUrl = "https://online.joinupbaltic.eu/export/default.php";
  private oauthToken: string;

  constructor(config: JoinUpConfig) {
    super("joinup");
    this.oauthToken = config.oauthToken;
  }

  async search(params: SearchParams): Promise<TravelOffer[]> {
    try {
      // 1. Map our parameters to JoinUp format
      const joinupParams = await this.mapParameters(params);

      // 2. Make API call
      const response = await this.makeSearchRequest(joinupParams);

      // 3. Convert response to our format
      const offers = this.convertResponse(response, params);

      // 4. Apply additional filtering if needed
      return this.applyFilters(offers, params);
    } catch (error) {
      console.error("JoinUp search error:", error);
      return [];
    }
  }

  private async mapParameters(
    params: SearchParams
  ): Promise<JoinUpSearchParams> {
    // Get mappings from cache or API
    const departureCityMap = await this.getDepartureCityMapping();
    const destinationMap = await this.getDestinationMapping();

    return {
      townfrom_id: departureCityMap[params.departureCities[0]],
      state_id: destinationMap[params.destination],
      checkin: params.departureDate?.toISOString().split("T")[0],
      nights: params.nights,
      adults: params.adults,
      children: params.children || 0,
    };
  }
}
```

## 🎯 **Real Implementation Example**

### **Complete Search Function:**

```typescript
async function performJoinUpSearch(searchParams: OurSearchParams) {
  const joinup = new JoinUpProvider({
    oauthToken: process.env.JOINUP_OAUTH_TOKEN!,
  });

  // Convert our parameters
  const offers = await joinup.search({
    departureCities: searchParams.departureCities,
    destination: searchParams.destination,
    departureDate: searchParams.departureDate,
    nights: searchParams.nights,
    adults: searchParams.adults,
    children: searchParams.children,
    hotelRating: searchParams.hotelRating,
    mealPlans: searchParams.mealPlans,
  });

  // Integrate with our existing aggregator
  return {
    provider: "joinup",
    offers: offers,
    totalCount: offers.length,
    searchTime: Date.now(),
    status: "success",
  };
}
```

## 📱 **Client-Side Usage**

### **How to serve this to our clients:**

```typescript
// Our unified API response to frontend
interface UnifiedSearchResponse {
  success: boolean;
  results: TravelOffer[];
  providers: {
    joinup: { count: number; status: "success" | "error" };
    novit: { count: number; status: "success" | "error" };
    tezTour: { count: number; status: "success" | "error" };
  };
  totalOffers: number;
  searchParams: SearchParams;
  timestamp: string;
}

// Frontend receives consistent format regardless of provider
const searchResults = await fetch("/api/travel/search", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    departureCities: ["tallinn"],
    destination: "turkey",
    departureDate: "2025-08-15",
    nights: 7,
    adults: 2,
  }),
});

// Results are automatically combined and sorted
const data = await searchResults.json();
console.log(
  `Found ${data.totalOffers} offers from ${
    Object.keys(data.providers).length
  } providers`
);
```
