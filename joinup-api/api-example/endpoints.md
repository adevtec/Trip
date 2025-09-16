# JoinUp API Endpoint Reference

## 🔍 **SEARCH API ENDPOINTS**

### **Core Search Methods**

#### 1. **SearchTour_TOWNFROMS** - Departure Cities

```http
GET /export/default.php?samo_action=api&version=1.0&oauth_token={TOKEN}&type=json&action=SearchTour_TOWNFROMS
```

**Response:** List of all available departure cities
**Usage:** Validate our `departureCities` parameter

---

#### 2. **SearchTour_STATES** - Countries/Destinations

```http
GET /export/default.php?samo_action=api&version=1.0&oauth_token={TOKEN}&type=json&action=SearchTour_STATES&townfrom_id={CITY_ID}
```

**Parameters:**

- `townfrom_id` - Departure city ID from TOWNFROMS
  **Response:** Available countries for selected departure city
  **Usage:** Map our `destination` to JoinUp state_id

---

#### 3. **SearchTour_CHECKIN** - Available Departure Dates

```http
GET /export/default.php?samo_action=api&version=1.0&oauth_token={TOKEN}&type=json&action=SearchTour_CHECKIN&townfrom_id={CITY_ID}&state_id={STATE_ID}
```

**Parameters:**

- `townfrom_id` - Departure city ID
- `state_id` - Destination country ID
  **Response:** Available departure dates
  **Usage:** Validate and suggest `departureDate` options

---

#### 4. **SearchTour_NIGHTS** - Available Durations

```http
GET /export/default.php?samo_action=api&version=1.0&oauth_token={TOKEN}&type=json&action=SearchTour_NIGHTS&townfrom_id={CITY_ID}&state_id={STATE_ID}&checkin={DATE}
```

**Parameters:**

- `townfrom_id` - Departure city ID
- `state_id` - Destination country ID
- `checkin` - Departure date (YYYY-MM-DD)
  **Response:** Available trip durations
  **Usage:** Suggest `nights` options

---

#### 5. **SearchTour_PRICES** - Main Search Results ⭐

```http
GET /export/default.php?samo_action=api&version=1.0&oauth_token={TOKEN}&type=json&action=SearchTour_PRICES&townfrom_id={CITY_ID}&state_id={STATE_ID}&checkin={DATE}&nights={NIGHTS}&adults={ADULTS}&children={CHILDREN}
```

**Parameters:**

- `townfrom_id` - Departure city ID (required)
- `state_id` - Destination country ID (required)
- `checkin` - Departure date YYYY-MM-DD (required)
- `nights` - Trip duration (required)
- `adults` - Number of adults (required)
- `children` - Number of children (optional, default: 0)
  **Response:** All available offers with prices
  **Usage:** Primary search method

---

### **Filtering Methods**

#### 6. **SearchTour_HOTELS** - Hotels List

```http
GET /export/default.php?samo_action=api&version=1.0&oauth_token={TOKEN}&type=json&action=SearchTour_HOTELS&townfrom_id={CITY_ID}&state_id={STATE_ID}&checkin={DATE}
```

**Usage:** Get hotel list for autocomplete

---

#### 7. **SearchTour_STARS** - Hotel Ratings

```http
GET /export/default.php?samo_action=api&version=1.0&oauth_token={TOKEN}&type=json&action=SearchTour_STARS&townfrom_id={CITY_ID}&state_id={STATE_ID}
```

**Usage:** Map to our `hotelRating` filter

---

#### 8. **SearchTour_MEALS** - Meal Plans

```http
GET /export/default.php?samo_action=api&version=1.0&oauth_token={TOKEN}&type=json&action=SearchTour_MEALS&townfrom_id={CITY_ID}&state_id={STATE_ID}
```

**Usage:** Map to our `mealPlans` filter

---

#### 9. **SearchTour_TOWNS** - Resorts/Areas

```http
GET /export/default.php?samo_action=api&version=1.0&oauth_token={TOKEN}&type=json&action=SearchTour_TOWNS&state_id={STATE_ID}
```

**Usage:** Map to our `areas` filter

---

### **Detail Methods**

#### 10. **SearchTour_HOTELINFO** - Hotel Details

```http
GET /export/default.php?samo_action=api&version=1.0&oauth_token={TOKEN}&type=json&action=SearchTour_HOTELINFO&hotel_id={HOTEL_ID}
```

**Usage:** Show detailed hotel information

---

#### 11. **SearchTour_ROOM_PLACEMENT** - Room Types

```http
GET /export/default.php?samo_action=api&version=1.0&oauth_token={TOKEN}&type=json&action=SearchTour_ROOM_PLACEMENT&hotel_id={HOTEL_ID}&checkin={DATE}&nights={NIGHTS}&adults={ADULTS}&children={CHILDREN}
```

**Usage:** Show available room configurations

---

#### 12. **SearchTour_CANCEL_POLICIES** - Cancellation Terms

```http
GET /export/default.php?samo_action=api&version=1.0&oauth_token={TOKEN}&type=json&action=SearchTour_CANCEL_POLICIES&hotel_id={HOTEL_ID}
```

**Usage:** Show cancellation conditions

---

#### 13. **SearchTour_PAYMENT_POLICIES** - Payment Terms

```http
GET /export/default.php?samo_action=api&version=1.0&oauth_token={TOKEN}&type=json&action=SearchTour_PAYMENT_POLICIES&hotel_id={HOTEL_ID}
```

**Usage:** Show payment conditions

---

## 🎫 **FLIGHT SEARCH ENDPOINTS**

#### **Tickets_PRICES** - Flight Prices

```http
GET /export/default.php?samo_action=api&version=1.0&oauth_token={TOKEN}&type=json&action=Tickets_PRICES&source={SOURCE}&target={TARGET}&checkin={DATE}&checkout={DATE}&adults={ADULTS}&children={CHILDREN}
```

**Usage:** If we want to offer flights separately

---

## 📝 **BOOKING ENDPOINTS**

#### **SearchTour_CALC** - Price Calculation

```http
GET /export/default.php?samo_action=api&version=1.0&oauth_token={TOKEN}&type=json&action=SearchTour_CALC&hotel_id={HOTEL_ID}&checkin={DATE}&nights={NIGHTS}&adults={ADULTS}&children={CHILDREN}&room_id={ROOM_ID}
```

**Usage:** Calculate exact price before booking

---

#### **SearchTour_BRON** - Make Booking (SOAP API)

```http
POST /webservice/booking.asmx
```

**Usage:** Create actual booking

---

## 🔄 **CURRENCY & RATES**

#### **Currency_CURRENCIES** - Available Currencies

```http
GET /export/default.php?samo_action=api&version=1.0&oauth_token={TOKEN}&type=json&action=Currency_CURRENCIES
```

#### **Currency_RATES** - Exchange Rates

```http
GET /export/default.php?samo_action=api&version=1.0&oauth_token={TOKEN}&type=json&action=Currency_RATES
```

---

## 🛠️ **ERROR HANDLING**

### Common Errors:

- `apiKey provided, but invalid` - Wrong oauth_token
- `apiKey blacklisted` - IP not whitelisted
- `Method does not exists` - Wrong action parameter
- Empty response - No results for criteria

### Error Response Format:

```json
{
  "Error": "apiKey provided, but invalid"
}
```

## 📋 **IMPLEMENTATION PRIORITY**

### **Phase 1 - Basic Search:**

1. SearchTour_TOWNFROMS
2. SearchTour_STATES
3. SearchTour_PRICES

### **Phase 2 - Enhanced Filtering:**

4. SearchTour_STARS
5. SearchTour_MEALS
6. SearchTour_TOWNS

### **Phase 3 - Details & Booking:**

7. SearchTour_HOTELINFO
8. SearchTour_CALC
9. SearchTour_BRON
