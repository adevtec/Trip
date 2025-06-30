# API Konsolideerimine

## Probleem

Meil on kaks search API-t:
- `/api/search` - vana, ei toimi (puuduvad teenused)
- `/api/travel/search` - uus, töötab

## Soovitused

### Option 1: Liida vana API uude (SOOVITATAV)

1. **Kustuta vana API**: `src/app/api/search/`
2. **Liigu üle**: `/api/travel/search` kasutamisele
3. **Auth teenused**: Tee uued auth teenused kui vaja

### Option 2: Fiksi vana API

1. **Loo puuduvad teenused**: `services/auth/` ja `services/search/`
2. **Adapteri loomnie**: Kasuta uut provider süsteemi taustaks

### Option 3: Hoia mõlemad

1. **Erinevad eesmärgid**: `/api/search` - lihtne, `/api/travel/search` - keerulisem
2. **Fiksi vana**: Loo vajalikud teenused

## Minu soovitus: Option 1

Põhjused:
- Uus `/api/travel/search` on paremini disainitud
- Toetab mitut providerit
- Vähem koodi duplikatsiooni
- Lihtsam hooldada
