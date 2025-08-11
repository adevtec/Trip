import { TRAVEL_IMAGES } from "@/utils/imageUtils";

export interface RoomType {
  id: string;
  name: string;
  capacity: number;
  description: string;
}

export interface MealPlan {
  id: string;
  name: string;
  code: string; // AI, HB, BB jne
  description: string;
}

export interface Hotel {
  id: string;
  name: string;
  rating: string[];
  description: string;
  images: string[];
  features: string[];
  roomTypes: RoomType[];
  mealPlans: MealPlan[];
}

export const hotels: Hotel[] = [
  {
    id: "all-hotel-obakoy",
    name: "All Hotel Obakoy",
    rating: ["4"],
    description: "Luksuslik hotell Antalya rannikul",
    images: [TRAVEL_IMAGES.hotels.all_hotel_obakoy],
    features: ["Spaa", "Basseinid", "Lasteklubi"],
    roomTypes: [
      {
        id: "standard",
        name: "Standard tuba",
        capacity: 2,
        description: "Mugav tuba kahe inimese jaoks",
      },
    ],
    mealPlans: [
      {
        id: "ai",
        name: "Ultra All Inclusive",
        code: "UAI",
        description: "Kõik hinnas",
      },
    ],
  },
  {
    id: "acanthus-cennet",
    name: "Acanthus & Cennet Barut Collection",
    rating: ["5"],
    description: "Luksuslik puhkusekompleks Antalya südames",
    images: [TRAVEL_IMAGES.hotels.acanthus_cennet],
    features: ["Eralrand", "Spaa", "Tenniseväljakud"],
    roomTypes: [
      {
        id: "deluxe",
        name: "Deluxe tuba",
        capacity: 3,
        description: "Avar tuba merevaatega",
      },
    ],
    mealPlans: [
      {
        id: "uai",
        name: "Ultra All Inclusive",
        code: "UAI",
        description: "Kõik hinnas pluss lisateenused",
      },
    ],
  },
  {
    id: "royal-dragon",
    name: "Royal Dragon Hotel",
    rating: ["5"],
    description: "Luksuslik spaahotell Side piirkonnas",
    images: [TRAVEL_IMAGES.hotels.royal_dragon],
    features: ["Spaa", "Veepargi", "Konverentsikeskus"],
    roomTypes: [
      {
        id: "standard",
        name: "Standard tuba",
        capacity: 2,
        description: "Mugav tuba kahe inimese jaoks",
      },
    ],
    mealPlans: [
      {
        id: "uai",
        name: "Ultra All Inclusive",
        code: "UAI",
        description: "Kõik hinnas pluss lisateenused",
      },
    ],
  },
  {
    id: "club-hotel-sera",
    name: "Club Hotel Sera",
    rating: ["4"],
    description: "Perehotell Lara rannas",
    images: [TRAVEL_IMAGES.hotels.club_hotel_sera],
    features: ["Lasteklubi", "Rannabaar", "Spordiväljakud"],
    roomTypes: [
      {
        id: "family",
        name: "Peretuba",
        capacity: 4,
        description: "Avar tuba kuni 4 inimesele",
      },
    ],
    mealPlans: [
      {
        id: "ai",
        name: "All Inclusive",
        code: "AI",
        description: "Kõik hinnas",
      },
    ],
  },
  {
    id: "limak-atlantis",
    name: "Limak Atlantis",
    rating: ["5"],
    description: "Modernne kuurorthotell Antalya keskuses",
    images: [TRAVEL_IMAGES.hotels.limak_atlantis],
    features: ["Spaa", "Basseinid", "Restoran"],
    roomTypes: [
      {
        id: "standard",
        name: "Standard tuba",
        capacity: 2,
        description: "Mugav tuba",
      },
    ],
    mealPlans: [
      {
        id: "ai",
        name: "All Inclusive",
        code: "AI",
        description: "Kõik hinnas",
      },
    ],
  },
  {
    id: "crystal-sunset",
    name: "Crystal Sunset",
    rating: ["5"],
    description: "Luksuslik rannahotell",
    images: [TRAVEL_IMAGES.hotels.crystal_sunset],
    features: ["Eralrand", "Spaa", "Lasteklubi"],
    roomTypes: [
      {
        id: "standard",
        name: "Standard tuba",
        capacity: 2,
        description: "Mugav tuba",
      },
    ],
    mealPlans: [
      {
        id: "ai",
        name: "All Inclusive",
        code: "AI",
        description: "Kõik hinnas",
      },
    ],
  },
  {
    id: "delphin-palace",
    name: "Delphin Palace",
    rating: ["5"],
    description: "Luksuslik puhkusekompleks",
    images: [TRAVEL_IMAGES.hotels.delphin_palace],
    features: ["Eralrand", "Spaa", "Lasteklubi"],
    roomTypes: [
      {
        id: "deluxe",
        name: "Deluxe tuba",
        capacity: 3,
        description: "Avar tuba merevaatega",
      },
    ],
    mealPlans: [
      {
        id: "uai",
        name: "Ultra All Inclusive",
        code: "UAI",
        description: "Kõik hinnas pluss lisateenused",
      },
    ],
  },
  {
    id: "granada-luxury",
    name: "Granada Luxury",
    rating: ["5"],
    description: "Luksuslik puhkusekompleks",
    images: [TRAVEL_IMAGES.hotels.limak_atlantis],
    features: ["Eralrand", "Spaa", "Lasteklubi"],
    roomTypes: [
      {
        id: "deluxe",
        name: "Deluxe tuba",
        capacity: 3,
        description: "Avar tuba merevaatega",
      },
    ],
    mealPlans: [
      {
        id: "uai",
        name: "Ultra All Inclusive",
        code: "UAI",
        description: "Kõik hinnas pluss lisateenused",
      },
    ],
  },
  {
    id: "miracle-resort",
    name: "Miracle Resort",
    rating: ["5"],
    description: "Luksuslik puhkusekompleks",
    images: [TRAVEL_IMAGES.hotels.crystal_sunset],
    features: ["Eralrand", "Spaa", "Lasteklubi"],
    roomTypes: [
      {
        id: "deluxe",
        name: "Deluxe tuba",
        capacity: 3,
        description: "Avar tuba merevaatega",
      },
    ],
    mealPlans: [
      {
        id: "uai",
        name: "Ultra All Inclusive",
        code: "UAI",
        description: "Kõik hinnas pluss lisateenused",
      },
    ],
  },
  {
    id: "titanic-beach",
    name: "Titanic Beach",
    rating: ["5"],
    description: "Luksuslik puhkusekompleks",
    images: [TRAVEL_IMAGES.hotels.delphin_palace],
    features: ["Eralrand", "Spaa", "Lasteklubi"],
    roomTypes: [
      {
        id: "deluxe",
        name: "Deluxe tuba",
        capacity: 3,
        description: "Avar tuba merevaatega",
      },
    ],
    mealPlans: [
      {
        id: "uai",
        name: "Ultra All Inclusive",
        code: "UAI",
        description: "Kõik hinnas pluss lisateenused",
      },
    ],
  },
  // Hurghada hotellid
  {
    id: "steigenberger-aldau",
    name: "Steigenberger Aldau Beach",
    rating: ["5"],
    description: "Luksuslik rannahotell Hurghada südames",
    images: [TRAVEL_IMAGES.hotels.steigenberger_aldau],
    features: ["Eralrand", "Spaa", "Golfiväljakud", "Sukeldumiskeskus"],
    roomTypes: [
      {
        id: "deluxe-sea",
        name: "Deluxe merevaatega",
        capacity: 3,
        description: "Avar tuba otsevaatega merele",
      },
      {
        id: "suite",
        name: "Suite",
        capacity: 4,
        description: "Luksuslik sviit eraldi elutoaga",
      },
    ],
    mealPlans: [
      {
        id: "uai",
        name: "Ultra All Inclusive",
        code: "UAI",
        description: "Premium klassi kõik hinnas",
      },
    ],
  },
  {
    id: "sunrise-garden-beach",
    name: "Sunrise Garden Beach Resort",
    rating: ["5"],
    description: "Perehotell suure veepargiga",
    images: [TRAVEL_IMAGES.hotels.rixos_sharm],
    features: ["Veepark", "Lasteklubi", "4 restorani", "Spordiväljakud"],
    roomTypes: [
      {
        id: "family",
        name: "Peretuba",
        capacity: 4,
        description: "Suur tuba peredele",
      },
      {
        id: "standard",
        name: "Standard tuba",
        capacity: 2,
        description: "Mugav tuba kahele",
      },
    ],
    mealPlans: [
      {
        id: "ai",
        name: "All Inclusive",
        code: "AI",
        description: "Kõik hinnas",
      },
    ],
  },
  // Sharm el Sheikh hotellid
  {
    id: "rixos-sharm",
    name: "Rixos Premium Seagate",
    rating: ["5"],
    description: "Ultra-luksuslik kuurort Nabq Bay piirkonnas",
    images: [TRAVEL_IMAGES.hotels.rixos_sharm],
    features: ["Aquapark", "Spaa", "7 restorani", "Eraldi täiskasvanute ala"],
    roomTypes: [
      {
        id: "deluxe",
        name: "Deluxe merevaatega",
        capacity: 3,
        description: "Avar tuba otsevaatega merele",
      },
      {
        id: "swim-up",
        name: "Swim-up Suite",
        capacity: 2,
        description: "Sviit otse basseini ääres",
      },
    ],
    mealPlans: [
      {
        id: "uai",
        name: "Ultra All Inclusive",
        code: "UAI",
        description: "Premium klassi kõik hinnas",
      },
    ],
  },
  {
    id: "four-seasons",
    name: "Four Seasons Resort",
    rating: ["5"],
    description: "Eksklusiivne kuurort privaatses lahes",
    images: [TRAVEL_IMAGES.hotels.four_seasons],
    features: ["Privaatrand", "Spaa", "Sukeldumiskeskus", "Tenniseväljakud"],
    roomTypes: [
      {
        id: "premier",
        name: "Premier Suite",
        capacity: 3,
        description: "Luksuslik sviit terrassiga",
      },
      {
        id: "villa",
        name: "Beach Villa",
        capacity: 6,
        description: "Privaatne villa rannas",
      },
    ],
    mealPlans: [
      {
        id: "bb",
        name: "Bed & Breakfast",
        code: "BB",
        description: "Hommikusöök",
      },
      {
        id: "hb",
        name: "Half Board",
        code: "HB",
        description: "Hommiku- ja õhtusöök",
      },
    ],
  },
  {
    id: "coral-sea",
    name: "Coral Sea Sensatori",
    rating: ["5"],
    description: "Modernne kuurort Sharks Bay piirkonnas",
    images: [TRAVEL_IMAGES.hotels.coral_sea],
    features: ["4 basseini", "Spaa", "Veespordikeskus", "Lasteklubi"],
    roomTypes: [
      {
        id: "family",
        name: "Family Suite",
        capacity: 4,
        description: "Suur sviit peredele",
      },
      {
        id: "swim-up",
        name: "Swim-up Room",
        capacity: 2,
        description: "Tuba otse basseini ääres",
      },
    ],
    mealPlans: [
      {
        id: "ai",
        name: "All Inclusive",
        code: "AI",
        description: "Kõik hinnas",
      },
    ],
  },
  // New Turkey Hotels
  {
    id: "sueno-beach",
    name: "Sueno Beach Side",
    rating: ["5"],
    description: "Luksuslik hotell Antalya Side piirkonnas",
    images: [TRAVEL_IMAGES.hotels.limak_atlantis],
    features: ["Eralrand", "Spaa", "Akvapargid", "Golfiväljakud"],
    roomTypes: [
      {
        id: "deluxe",
        name: "Deluxe tuba",
        capacity: 2,
        description: "Luksuslik tuba merevaatega",
      },
      {
        id: "suite",
        name: "Family Suite",
        capacity: 4,
        description: "Suur sviit peredele",
      },
    ],
    mealPlans: [
      {
        id: "uai",
        name: "Ultra All Inclusive",
        code: "UAI",
        description: "Kõik hinnas pluss premium teenused",
      },
    ],
  },
  {
    id: "side-star-elegance",
    name: "Side Star Elegance",
    rating: ["5"],
    description: "Elegantne kuurort Side keskuses",
    images: [TRAVEL_IMAGES.hotels.crystal_sunset],
    features: ["Veepargid", "Spaa", "Tenniseväljak", "Lastetegevused"],
    roomTypes: [
      {
        id: "standard",
        name: "Standard tuba",
        capacity: 2,
        description: "Mugav tuba aiapoolse vaatega",
      },
    ],
    mealPlans: [
      {
        id: "ai",
        name: "All Inclusive",
        code: "AI",
        description: "Kõik hinnas",
      },
    ],
  },

  // New Egypt Hotels
  {
    id: "hilton-hurghada",
    name: "Hilton Hurghada Resort",
    rating: ["5"],
    description: "Rahvusvaheline luksushotell Hurghada südames",
    images: [TRAVEL_IMAGES.hotels.four_seasons],
    features: ["Eralrand", "Spaa", "Sukeldumiskeskus", "Marina"],
    roomTypes: [
      {
        id: "ocean-view",
        name: "Ocean View tuba",
        capacity: 2,
        description: "Tuba ookeanivaatega",
      },
    ],
    mealPlans: [
      {
        id: "ai",
        name: "All Inclusive",
        code: "AI",
        description: "Kõik hinnas",
      },
    ],
  },
  {
    id: "steigenberger-coraya",
    name: "Steigenberger Coraya Beach",
    rating: ["5"],
    description: "Luksuskuurort Marsa Alami piirkonnas",
    images: [TRAVEL_IMAGES.hotels.rixos_sharm],
    features: ["Korallriff", "Spaa", "Veespordikeskus", "Golf"],
    roomTypes: [
      {
        id: "deluxe",
        name: "Deluxe Beach tuba",
        capacity: 3,
        description: "Deluxe tuba rannalähedal",
      },
    ],
    mealPlans: [
      {
        id: "uai",
        name: "Ultra All Inclusive",
        code: "UAI",
        description: "Kõik hinnas pluss premium teenused",
      },
    ],
  },
  {
    id: "jaz-aquaviva",
    name: "Jaz Aquaviva",
    rating: ["5"],
    description: "Modernne hotell Makadi Bay kuurordis",
    images: [TRAVEL_IMAGES.hotels.coral_sea],
    features: ["Veepargid", "Akvapargid", "Spaa", "Lasteklubi"],
    roomTypes: [
      {
        id: "standard",
        name: "Standard tuba",
        capacity: 2,
        description: "Mugav tuba basseivaatega",
      },
    ],
    mealPlans: [
      {
        id: "ai",
        name: "All Inclusive",
        code: "AI",
        description: "Kõik hinnas",
      },
    ],
  },

  // New Greece Hotels
  {
    id: "blue-palace-crete",
    name: "Blue Palace Resort & Spa",
    rating: ["5"],
    description: "Luksuslik kuurort Kreekas, Crete saarel",
    images: [TRAVEL_IMAGES.hotels.acanthus_cennet],
    features: ["Spaa", "Privaatrannad", "Golfiväljakud", "Marina"],
    roomTypes: [
      {
        id: "villa",
        name: "Private Villa",
        capacity: 4,
        description: "Privaatne villa merevaatega",
      },
    ],
    mealPlans: [
      {
        id: "hb",
        name: "Half Board",
        code: "HB",
        description: "Hommiku- ja õhtusöök",
      },
    ],
  },
  {
    id: "mitsis-grand-hotel",
    name: "Mitsis Grand Hotel",
    rating: ["4"],
    description: "Sõbralik perehotell Rhodose saarel",
    images: [TRAVEL_IMAGES.hotels.royal_dragon],
    features: ["Lasteklubi", "Basseinid", "Tenniseväljak", "Animatsioon"],
    roomTypes: [
      {
        id: "family",
        name: "Family Room",
        capacity: 4,
        description: "Suur tuba peredele",
      },
    ],
    mealPlans: [
      {
        id: "ai",
        name: "All Inclusive",
        code: "AI",
        description: "Kõik hinnas",
      },
    ],
  },

  // New Spain Hotels
  {
    id: "iberostar-selection",
    name: "Iberostar Selection Anthelia",
    rating: ["5"],
    description: "Premium hotell Tenerife saarel",
    images: [TRAVEL_IMAGES.hotels.club_hotel_sera],
    features: ["Spaa", "Golf", "Basseinid", "Lasteprogrammid"],
    roomTypes: [
      {
        id: "junior-suite",
        name: "Junior Suite",
        capacity: 3,
        description: "Ruumikas suite merevaatega",
      },
    ],
    mealPlans: [
      {
        id: "ai",
        name: "All Inclusive",
        code: "AI",
        description: "Kõik hinnas",
      },
    ],
  },

  // New Cyprus Hotels
  {
    id: "olympic-lagoon",
    name: "Olympic Lagoon Resort",
    rating: ["5"],
    description: "Luksusliku designiga hotell Ayia Napa lähedal",
    images: [TRAVEL_IMAGES.hotels.delphin_palace],
    features: ["Lagunbasseini", "Spaa", "Veesport", "Lasteklubi"],
    roomTypes: [
      {
        id: "lagoon-view",
        name: "Lagoon View tuba",
        capacity: 2,
        description: "Tuba lagunvaatega",
      },
    ],
    mealPlans: [
      {
        id: "ai",
        name: "All Inclusive",
        code: "AI",
        description: "Kõik hinnas",
      },
    ],
  },
];

export default hotels;
// Hiljem asendada API päringuga
export async function fetchHotels() {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return hotels;
}
