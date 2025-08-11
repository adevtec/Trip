/**
 * Types and data for trips and destinations
 */

import { format } from "date-fns";

/**
 * Interface for trip data
 */
export interface Trip {
  id: string; // Unique identifier for the trip
  departureCityId: string; // ID of the departure city
  destinationId: string; // ID of the destination city
  departureDate: string; // ISO string format
  nights: number; // Number of nights
  price: number; // Price in EUR
  availableSeats: number; // Number of available seats
}

/**
 * List of available trips
 * Used in search engine and calendar components
 */
export const trips: Trip[] = [
  // August 2025 trips (updated to future dates)
  {
    id: "tll-turkey-20250825",
    departureCityId: "tallinn",
    destinationId: "turkey",
    departureDate: "2025-08-25",
    nights: 7,
    price: 599,
    availableSeats: 20,
  },
  {
    id: "tll-egypt-20250830",
    departureCityId: "tallinn",
    destinationId: "egypt",
    departureDate: "2025-08-30",
    nights: 10,
    price: 899,
    availableSeats: 15,
  },
  {
    id: "tll-greece-20250828",
    departureCityId: "tallinn",
    destinationId: "greece",
    departureDate: "2025-08-28",
    nights: 7,
    price: 749,
    availableSeats: 18,
  },

  // September 2025 trips
  {
    id: "tll-turkey-20250905",
    departureCityId: "tallinn",
    destinationId: "turkey",
    departureDate: "2025-09-05",
    nights: 14,
    price: 999,
    availableSeats: 12,
  },
  {
    id: "riia-turkey-20250910",
    departureCityId: "riia",
    destinationId: "turkey",
    departureDate: "2025-09-10",
    nights: 7,
    price: 649,
    availableSeats: 25,
  },
  {
    id: "tll-spain-20250915",
    departureCityId: "tallinn",
    destinationId: "spain",
    departureDate: "2025-09-15",
    nights: 7,
    price: 799,
    availableSeats: 20,
  },
  {
    id: "tll-egypt-20250918",
    departureCityId: "tallinn",
    destinationId: "egypt",
    departureDate: "2025-09-18",
    nights: 7,
    price: 849,
    availableSeats: 16,
  },

  // October 2025 trips
  {
    id: "tll-turkey-20251003",
    departureCityId: "tallinn",
    destinationId: "turkey",
    departureDate: "2025-10-03",
    nights: 7,
    price: 549,
    availableSeats: 30,
  },
  {
    id: "tartu-greece-20251010",
    departureCityId: "tartu",
    destinationId: "greece",
    departureDate: "2025-10-10",
    nights: 10,
    price: 699,
    availableSeats: 14,
  },
  {
    id: "tll-cyprus-20251015",
    departureCityId: "tallinn",
    destinationId: "cyprus",
    departureDate: "2025-10-15",
    nights: 7,
    price: 799,
    availableSeats: 18,
  },
  {
    id: "riia-spain-20251020",
    departureCityId: "riia",
    destinationId: "spain",
    departureDate: "2025-10-20",
    nights: 14,
    price: 1199,
    availableSeats: 8,
  },

  // November 2025 trips
  {
    id: "tll-egypt-20251105",
    departureCityId: "tallinn",
    destinationId: "egypt",
    departureDate: "2025-11-05",
    nights: 7,
    price: 699,
    availableSeats: 22,
  },
  {
    id: "tll-turkey-20251112",
    departureCityId: "tallinn",
    destinationId: "turkey",
    departureDate: "2025-11-12",
    nights: 10,
    price: 649,
    availableSeats: 19,
  },
  {
    id: "tartu-egypt-20251120",
    departureCityId: "tartu",
    destinationId: "egypt",
    departureDate: "2025-11-20",
    nights: 7,
    price: 749,
    availableSeats: 13,
  },

  // December 2025 trips
  {
    id: "tll-egypt-20251205",
    departureCityId: "tallinn",
    destinationId: "egypt",
    departureDate: "2025-12-05",
    nights: 10,
    price: 899,
    availableSeats: 24,
  },
  {
    id: "riia-turkey-20251210",
    departureCityId: "riia",
    destinationId: "turkey",
    departureDate: "2025-12-10",
    nights: 7,
    price: 599,
    availableSeats: 28,
  },
  {
    id: "tll-cyprus-20251220",
    departureCityId: "tallinn",
    destinationId: "cyprus",
    departureDate: "2025-12-20",
    nights: 14,
    price: 1099,
    availableSeats: 15,
  },

  // January 2026 trips
  {
    id: "tll-egypt-20260108",
    departureCityId: "tallinn",
    destinationId: "egypt",
    departureDate: "2026-01-08",
    nights: 7,
    price: 749,
    availableSeats: 20,
  },
  {
    id: "tll-turkey-20260115",
    departureCityId: "tallinn",
    destinationId: "turkey",
    departureDate: "2026-01-15",
    nights: 10,
    price: 699,
    availableSeats: 17,
  },
] as const;

/**
 * Helper function to get trips for a specific city
 */
export function getTripsForCity(cityId: string): Trip[] {
  return trips.filter((trip) => trip.departureCityId === cityId);
}

/**
 * Helper function to format trip date
 */
export function formatTripDate(date: Date): string {
  return format(date, "dd.MM.yyyy");
}

/**
 * Helper function to format trip price
 */
export function formatTripPrice(price: number): string {
  return `${price} €`;
}

/**
 * Abifunktsioon kalendri jaoks
 */
export function getAvailableTripsForDate(date: Date, departureCityId: string) {
  return trips.filter(
    (trip) =>
      trip.departureCityId === departureCityId &&
      trip.departureDate === date.toISOString().split("T")[0]
  );
}
