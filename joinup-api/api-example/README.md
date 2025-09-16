# JoinUp API Integration Guide

**Eksootikareisid OÜ - JoinUp Travel Provider**

## 📋 Ülevaade

JoinUp API võimaldab meil:

- Otsida reisipakkumisi
- Võrrelda hindu
- Broneerida reise
- Hallata kliendiinfot

## 🎯 Meie praegused otsinguparameetrid vs JoinUp API

### 🔍 **Meie praegused parameetrid:**

```typescript
interface OurSearchParams {
  departureCities: string[]; // ['tallinn', 'riga']
  destination?: string; // 'turkey', 'greece'
  areas?: string[]; // ['antalya', 'alanya']
  departureDate?: Date; // Väljumiskuupäev
  nights?: number; // 7, 14 päeva
  adults: number; // Täiskasvanute arv
  children?: number; // Laste arv
  childrenAges?: number[]; // [5, 12]
  hotelRating?: number[]; // [4, 5]
  mealPlans?: string[]; // ['AI', 'FB', 'HB']
  priceRange?: { min?; max? }; // Hinnavahemik
}
```

### 🔗 **JoinUp API vastavus:**

## 1. **PÕHILISED OTSINGU MEETODID**

### 🏙️ **SearchTour_TOWNFROMS** - Väljumislinnad

```http
GET https://online.joinupbaltic.eu/export/default.php?
samo_action=api&version=1.0&oauth_token={TOKEN}&type=json&action=SearchTour_TOWNFROMS
```

**Vastus:** Kõik võimalikud väljumislinnad  
**Meie kasutus:** Valideerida `departureCities` parameetrit

### 🌍 **SearchTour_STATES** - Riigid/Sihtkohad

```http
GET https://online.joinupbaltic.eu/export/default.php?
samo_action=api&version=1.0&oauth_token={TOKEN}&type=json&action=SearchTour_STATES&townfrom_id={CITY_ID}
```

**Vastus:** Kõik sihtkohariigid konkreetsest linnast  
**Meie kasutus:** Mapime meie `destination` JoinUp riigi ID-ga

### 🗓️ **SearchTour_CHECKIN** - Väljumiskuupäevad

```http
GET https://online.joinupbaltic.eu/export/default.php?
samo_action=api&version=1.0&oauth_token={TOKEN}&type=json&action=SearchTour_CHECKIN&townfrom_id={CITY_ID}&state_id={STATE_ID}
```

**Vastus:** Saadaolevad väljumiskuupäevad  
**Meie kasutus:** Valideerida ja pakkuda `departureDate` valikuid

### 🏨 **SearchTour_HOTELS** - Hotellid

```http
GET https://online.joinupbaltic.eu/export/default.php?
samo_action=api&version=1.0&oauth_token={TOKEN}&type=json&action=SearchTour_HOTELS&townfrom_id={CITY_ID}&state_id={STATE_ID}&checkin={DATE}
```

**Vastus:** Kõik saadaolevad hotellid  
**Meie kasutus:** Täita hotellide nimekiri otsingumootoris

### 💰 **SearchTour_PRICES** - Hinnad (PÕHILINE!)

```http
GET https://online.joinupbaltic.eu/export/default.php?
samo_action=api&version=1.0&oauth_token={TOKEN}&type=json&action=SearchTour_PRICES&townfrom_id={CITY_ID}&state_id={STATE_ID}&checkin={DATE}&nights={NIGHTS}&adults={ADULTS}&children={CHILDREN}
```

**Vastus:** Kõik hinnapakkumised  
**Meie kasutus:** Peamine otsingumeetod

## 2. **TÄIENDAVAD FILTREERIMISE MEETODID**

### ⭐ **SearchTour_STARS** - Hotellide tärnid

```http
GET .../action=SearchTour_STARS&...
```

**Meie kasutus:** `hotelRating` filter

### 🍽️ **SearchTour_MEALS** - Toitlustuse tüübid

```http
GET .../action=SearchTour_MEALS&...
```

**Meie kasutus:** `mealPlans` filter

### 🏖️ **SearchTour_TOWNS** - Kuurordid/Piirkonnad

```http
GET .../action=SearchTour_TOWNS&state_id={STATE_ID}
```

**Meie kasutus:** `areas` filter

## 3. **BRONEERIMINE**

### 📝 **SearchTour_CALC/SearchTour_BRON** - Arvutamine/Broneerimine

```http
GET .../action=SearchTour_CALC&hotel_id={HOTEL_ID}&checkin={DATE}&nights={NIGHTS}&adults={ADULTS}&children={CHILDREN}
```

## 🔄 **API INTEGREERIMISE VOOG**

### **Samm 1: Andmete laadmine (ühekordne)**

```javascript
1. SearchTour_TOWNFROMS → Salvesta väljumislinnad
2. SearchTour_STATES → Salvesta sihtkohariigid
3. SearchTour_STARS → Salvesta tärnide süsteem
4. SearchTour_MEALS → Salvesta toitlustuse tüübid
```

### **Samm 2: Otsingu käivitamine**

```javascript
1. Kasutaja valib parameetrid meie UI-s
2. Mapime meie parameetrid JoinUp parameetriteks
3. Kutsume SearchTour_PRICES
4. Töötleme ja kuvame tulemused
```

### **Samm 3: Detailvaade**

```javascript
1. SearchTour_HOTELINFO → Hotelli detailid
2. SearchTour_ROOM_PLACEMENT → Toatüübid
3. SearchTour_CANCEL_POLICIES → Tühistamistingimused
```

## 📊 **ANDMETE TÖÖTLEMINE**

### **JoinUp vastuse näidis:**

```json
{
  "hotels": [
    {
      "hotel_id": "12345",
      "hotel_name": "Grand Resort Antalya",
      "stars": 5,
      "town": "Antalya",
      "price": 899,
      "currency": "EUR",
      "meal": "AI",
      "checkin": "2025-08-15",
      "nights": 7
    }
  ]
}
```

### **Meie ühtsesse formaati konverteerimine:**

```typescript
interface TravelOffer {
  id: string;
  provider: "joinup";
  hotel: {
    name: string;
    rating: number;
    location: string;
  };
  price: {
    amount: number;
    currency: string;
    per: "person" | "total";
  };
  itinerary: {
    departureCity: string;
    destination: string;
    checkIn: Date;
    nights: number;
  };
  inclusions: {
    meal: string;
    transport: boolean;
  };
}
```

## 🔧 **IMPLEMENTEERIMISE SAMMUD**

### **1. Andmete sünkroniseerimine**

- Laadi JoinUp referentsandmed (linnad, riigid, hotellid)
- Salvesta meie andmebaasi või cache-i
- Uuenda regulaarselt

### **2. Parameetrite mappimine**

- Loo mappingu meie `departureCities` → JoinUp `townfrom_id`
- Loo mappingu meie `destination` → JoinUp `state_id`
- Loo mappingu meie `areas` → JoinUp `town_id`

### **3. Otsingu optimeerimine**

- Cache populaarseid otsinguid
- Paralleelsed päringud mitmele API-le
- Timeout ja error handling

### **4. Tulemuste ühendamine**

- Kombineeri JoinUp tulemused teiste provideritega
- Sorteeri hinna/kvaliteedi järgi
- Eemalda duplikaadid

## 🚀 **JÄRGMISED SAMMUD**

1. **Loo JoinUp provider klass** `src/app/api/providers/joinup/`
2. **Implementeeri põhilised meetodid** (TOWNFROMS, STATES, PRICES)
3. **Testi väikese andmekogumiga**
4. **Integreeri olemasoleva aggregaatoriga**
5. **Lisa cache ja optimiseerimine**

## 📝 **API Võtmed**

```bash
# .env.local
JOINUP_OAUTH_TOKEN=your_token_here
JOINUP_API_BASE_URL=https://online.joinupbaltic.eu/export/default.php
```
