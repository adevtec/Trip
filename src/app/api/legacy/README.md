# Legacy API Components

See kaust sisaldab vanu API komponente, mis olid varem `src/app/api/` kaustas.

## Struktuur:

- **auth/** - Autentimise API (ei tööta, puuduvad teenused)
- **lib/** - Ühised teegid (JWT, DB ühendus)
- **middleware/** - Auth middleware
- **users/** - Kasutajate API (ei tööta)
- **languages/** - Keelte API (ei tööta)
- **translations/** - Tõlgete API (ei tööta)
- **swagger/** - API dokumentatsioon

## Märkused:

- Enamik neist API-dest **ei tööta**, sest puuduvad vastavad teenused
- Kui mõni neist on vaja, siis:
  1. Loo vastav teenus `src/services/auth/`, `src/services/users/` jne
  2. Loo uus HTTP endpoint `src/app/api/auth/` mis kasutab teenust
  3. Kustuta legacy versioon

## Eesmärk:

Hoida kõike ühes kohas arendamisetapis, et saaks vajadusel elemente ümber tõsta.
Kui kõik on ümbertõstetud ja organiseeritud, saab selle kausta kustutada.
