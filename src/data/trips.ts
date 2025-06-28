/**
 * Types and data for trips and destinations
 */

import { format } from 'date-fns';

/**
 * Interface for trip data
 */
export interface Trip {
  id: string;                // Unique identifier for the trip
  departureCityId: string;  // ID of the departure city
  destinationId: string;    // ID of the destination city
  departureDate: string;    // ISO string format
  nights: number;          // Number of nights
  price: number;           // Price in EUR
  availableSeats: number;  // Number of available seats
}

/**
 * List of available trips
 * Used in search engine and calendar components
 */
export const trips: Trip[] = [
  {
    id: 'tll-egy-20240307',
    departureCityId: 'tallinn',
    destinationId: 'egypt',
    departureDate: '2024-03-07',
    nights: 7,
    price: 899,
    availableSeats: 20
  },
  {
    id: 'tll-lka-20240307',
    departureCityId: 'tallinn',
    destinationId: 'sri-lanka',
    departureDate: '2024-03-07',
    nights: 14,
    price: 1299,
    availableSeats: 15
  },
  {
    id: 'trip-2',
    departureCityId: 'tallinn',
    destinationId: 'turkey',
    departureDate: '2025-02-30',
    nights: 7,
    price: 599,
    availableSeats: 15
  },
  {
    id: 'trip-3',
    departureCityId: 'riia',
    destinationId: 'turkey',
    departureDate: '2025-02-08',
    nights: 10,
    price: 999,
    availableSeats: 10
  }
] as const;

/**
 * Helper function to get trips for a specific city
 */
export function getTripsForCity(cityId: string): Trip[] {
  return trips.filter(trip => trip.departureCityId === cityId);
}

/**
 * Helper function to format trip date
 */
export function formatTripDate(date: Date): string {
  return format(date, 'dd.MM.yyyy');
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
  return trips.filter(trip => 
    trip.departureCityId === departureCityId &&
    trip.departureDate === date.toISOString().split('T')[0]
  );
}
