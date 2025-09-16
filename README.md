# 🌍 Eksootikareisid - Arendaja Juhend

**Täielik juhend Eksootikareisid OÜ reisiotsingu platvormi arendamiseks**

---

## 📋 Sisukord

- [🎯 Projekt Ülevaade](#projekt-ülevaade)
- [🚀 Kiire Start](#kiire-start)
- [🏗️ Arhitektuur](#arhitektuur)
- [🛠️ API Integratsioonid](#api-integratsioonid)
- [🧩 Komponendid](#komponendid)
- [🔧 Arendamine](#arendamine)
- [🐛 Troubleshooting](#troubleshooting)
- [📚 Detailne Dokumentatsioon](#detailne-dokumentatsioon)

---

## 🎯 Projekt Ülevaade

### Mis see on?
Eksootikareisid on **Next.js 14** põhinev reisiotsingu platvorm, mis ühendab mitu reisipakkujat ühtsesse otsingumootorisse.

### Põhifunktsioonid
- 🔍 **Ühtne otsingumootor** - otsi reise kõigist partneritest korraga
- 🏨 **Hotellide võrdlus** - kombineerib NovIT, JoinUp, TEZ Tour pakkumisi
- 💰 **Hindade võrdlus** - leia parim hind automaatselt
- 📱 **Responsiivne disain** - toimib kõigis seadmetes
- 🌐 **Mitmekeelne** - eesti ja vene keel

### Tehnoloogiad
```
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React Hook Form
- Date-fns
- i18next (tõlked)
```

---

## 🚀 Kiire Start

### 1. Installimine

```bash
# Klooni repo
git clone https://github.com/adevtec/trip-app.git
cd eksootikareisid-new

# Installi dependencies
npm install

# Loo env fail
cp .env.example .env.local
```

### 2. Environment Setup

```bash
# .env.local
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here

# JoinUp API (valikuline, dev-is töötab mock andmetega)
JOINUP_OAUTH_TOKEN=your-token
JOINUP_API_BASE_URL=https://online.joinupbaltic.eu

# NovIT (kasutab WordPress cache'i)
NOVIT_CACHE_PATH=../eksootikareisid-old/wp-content/cache/novit_tours
```

### 3. Käivitamine

```bash
# Development server
npm run dev

# Production build
npm run build
npm start

# Linting
npm run lint
```

### 4. Esimene test

1. Mine http://localhost:3000
2. Vali lähtekohaks "Tallinn"
3. Vali sihtkoht "Türgi"
4. Käivita otsing
5. Peaksid nägema mock tulemusi

---

## 🏗️ Arhitektuur

### Projektijuurdus

```
src/
├── app/                     # Next.js 14 App Router
│   ├── api/                # 🎯 UNIFIED API LAYER
│   │   ├── travel/         # Travel endpoints
│   │   ├── providers/      # Provider integrations
│   │   └── auth/           # Authentication
│   ├── [routes]/           # Page routes
│   └── globals.css         # Global styles
├── components/             # React components
│   ├── SearchEngine/       # Main search interface
│   ├── TravelOffers/       # Results display
│   └── [others]/          # UI components
├── hooks/                  # React hooks
├── lib/                    # Utilities and configs
├── data/                   # Static data and mock data
└── types/                  # TypeScript definitions
```

### API Arhitektuur

```
GET /api/travel/search      # Ühtne otsing
GET /api/travel/health      # Provider status
GET /api/travel/data        # Reference data

Provider-specific:
GET /api/providers/joinup/  # JoinUp API proxy
GET /api/providers/novit/   # NovIT integration
```

### Andmevoog

```
Klient → SearchEngine → Unified API → [
  JoinUp Provider
  NovIT Provider  
  TEZ Provider
] → Kombineeritud tulemused → Klient
```

---

## 🛠️ API Integratsioonid

### ✅ NovIT Provider
**Status:** Töötav  
**Allikas:** WordPress cache from eksootikareisid-old  
```typescript
// Kasutamine
const { search, loading, results } = useTravel();
await search({
  departureCities: ['tallinn'],
  destination: 'turkey',
  adults: 2,
  nights: 7
});
```

### 🚧 JoinUp Provider
**Status:** Dev (mock data), Production (vajalik OAuth)  
**API:** https://online.joinupbaltic.eu  

**Peamised endpoint'id:**
- `SearchTour_TOWNFROMS` - Väljumislinnad
- `SearchTour_STATES` - Sihtkoha riigid
- `SearchTour_PRICES` - Hinnapakkumised

```typescript
// API test
curl "http://localhost:3000/api/joinup/cities"
```

**📋 Detailne dok:** [`joinup-api/api-example/README.md`](./joinup-api/api-example/README.md)

### 📋 TEZ Tour Provider
**Status:** Template, vajab API võtmeid  
**API:** xml.tezapi.eu  

### Uue provideri lisamine

1. **Loo provider kaust:**
```bash
mkdir src/app/api/providers/new-provider
```

2. **Implementeeri TravelProvider interface:**
```typescript
export class NewProvider extends TravelProvider {
  async search(params: SearchParams): Promise<TravelOffer[]> {
    // Provider-specific search logic
  }
  
  async healthCheck(): Promise<boolean> {
    // Health check implementation
  }
}
```

3. **Registreeri config.ts-is:**
```typescript
aggregator.registerProvider(new NewProvider(config));
```

---

## 🧩 Komponendid

### SearchEngine
**Asukoht:** `src/components/SearchEngine/`  
**Eesmärk:** Peamine otsinguliides  

**Alamkomponendid:**
- `DepartureCitySelect` - Lähtekohade valik
- `RegionSelect` - Sihtkohtade valik  
- `DepartureCalendar` - Kuupäevade valik
- `TravelersInput` - Reisijate arv
- `AdvancedSearch` - Täpsustatud otsing

```typescript
// Kasutamine
<SearchEngine 
  onSearch={(params) => handleSearch(params)}
  initialParams={savedParams}
/>
```

### TravelOffers
**Eesmärk:** Otsingutulemuste kuvamine  
```typescript
<TravelOffers 
  offers={searchResults}
  loading={isSearching}
  onOfferClick={(offer) => navigateToDetails(offer)}
/>
```

### Keeletugi
**i18next setup:**
```typescript
const { t } = useTranslation();
t('search.departure'); // "Lähtekohad"
```

---

## 🔧 Arendamine

### Uue komponendi loomine

1. **Loo komponent:**
```typescript
// src/components/NewComponent/index.tsx
'use client';
import { useState } from 'react';

export default function NewComponent() {
  return <div>New Component</div>;
}
```

2. **Lisa tüübid:**
```typescript
// src/types/new-component.ts
export interface NewComponentProps {
  title: string;
  onAction: () => void;
}
```

3. **Lisa testid:**
```typescript
// src/components/NewComponent/__tests__/index.test.tsx
import { render } from '@testing-library/react';
import NewComponent from '../index';

test('renders component', () => {
  render(<NewComponent />);
});
```

### API endpoint'i loomine

```typescript
// src/app/api/new-endpoint/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({ success: true });
}
```

### Hook'i loomine

```typescript
// src/hooks/useNewHook.ts
import { useState, useCallback } from 'react';

export function useNewHook() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const fetchData = useCallback(async () => {
    setLoading(true);
    // fetch logic
    setLoading(false);
  }, []);
  
  return { data, loading, fetchData };
}
```

---

## 🐛 Troubleshooting

### Tavalised probleemid

#### ❌ Moldova/Chisinau kuvatakse otsingus
**Lahendus:** JoinUp API filtreerib Moldova linnad välja
```bash
# Kontrolli filtrit
curl "http://localhost:3000/api/joinup/cities" | grep -i moldova
```

#### ❌ Image "fill" hoiatused
**Lahendus:** Lisa `sizes` prop kõigile fill Image'itele
```typescript
<Image 
  src={src} 
  alt={alt} 
  fill 
  sizes="(max-width: 768px) 100vw, 50vw"  // ← VAJALIK!
  className="object-cover" 
/>
```

#### ❌ Cache probleemid
**Lahendus:** Puhasta localStorage
```javascript
// Browser Console'is
localStorage.clear();
sessionStorage.clear();
location.reload();
```

#### ❌ API CORS errorid
**Lahendus:** Kasuta proxy endpoint'e
```typescript
// ✅ Hea - läbi meie proxy
fetch('/api/joinup/cities')

// ❌ Halb - otse external API
fetch('https://online.joinupbaltic.eu/...')
```

#### ❌ TypeScript errorid
```bash
# Kontrolli tüüpe
npx tsc --noEmit

# Paranda import pathid
# Kasuta @/ alias'eid: @/components, @/hooks, @/lib
```

### Debug juhised

#### API debug
```bash
# Provider health check
curl http://localhost:3000/api/travel/health

# Search debug
curl "http://localhost:3000/api/travel/search?departureCities=tallinn&adults=2"
```

#### Component debug
```typescript
// Lisa console.log
console.log('SearchEngine params:', searchParams);

// Kasuta React DevTools
// Installi: https://react.dev/learn/react-developer-tools
```

#### Network debug
```bash
# Terminal'is
npm run dev

# Browser DevTools → Network tab
# Vaata API calls ja response'e
```

---

## 📚 Detailne Dokumentatsioon

###  API integratsioonid
- [`src/app/api/README.md`](./src/app/api/README.md) - API struktuuri ülevaade
- [`joinup-api/api-example/README.md`](./joinup-api/api-example/README.md) - JoinUp API juhend
- [`joinup-api/api-example/integration-strategy.md`](./joinup-api/api-example/integration-strategy.md) - Integreerimise strateegia

### 🎯 JoinUp API detailid
- [`joinup-api/api-example/endpoints.md`](./joinup-api/api-example/endpoints.md) - API endpoint'ide nimekiri
- [`joinup-api/api-example/types.md`](./joinup-api/api-example/types.md) - Andmetüübid
- [`joinup-api/api-example/examples.md`](./joinup-api/api-example/examples.md) - Kasutamise näited

### 🛠️ Provider-spetsiifilised
- [`src/app/api/providers/novit/README.md`](./src/app/api/providers/novit/README.md) - NovIT provider
- [`src/app/api/providers/joinup/README.md`](./src/app/api/providers/joinup/README.md) - JoinUp provider  
- [`src/app/api/providers/tez-tour/README.md`](./src/app/api/providers/tez-tour/README.md) - TEZ Tour provider

---

## 🎯 Kiired käsud

```bash
# Arendus
npm run dev              # Käivita dev server
npm run build           # Production build
npm run lint            # ESLint check

# Debug
curl localhost:3000/api/travel/health    # Provider status
curl localhost:3000/api/joinup/cities    # JoinUp cities

# Cache puhastus (browser console)
localStorage.clear(); location.reload();

# TypeScript check
npx tsc --noEmit
```

---

## ✨ Järgmised sammud

1. **JoinUp OAuth tokeni saamine** - kontakti JoinUp'iga
2. **TEZ Tour API integratsiooni lõpetamine**
3. **Cache kihi lisamine** (Redis)
4. **Testide kirjutamine**
5. **Monitoring ja analytics**
6. **Deployment setup**

---

**💡 Tip:** Alusta detailsete API juhendite lugemisest [`joinup-api/api-example/`](./joinup-api/api-example/) kaustas, kui vajad API integratsioonide süvitsi minna!

---

*Dokumentatsiooni uuendatud: 16. september 2025*