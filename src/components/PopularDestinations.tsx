'use client';

import Image from 'next/image';
import Link from 'next/link';
import { getHotelsByCountry } from '@/data/mock';

export default function PopularDestinations() {
  // Get a selection of unique popular hotels from different countries
  // We'll select specific hotels to ensure variety and avoid duplicates
  const popularHotels = [
    getHotelsByCountry('turkey').find(h => h.id === 'titanic-beach-lara'),
    getHotelsByCountry('turkey').find(h => h.id === 'kleopatra-beach-hotel'),
    getHotelsByCountry('egypt').find(h => h.id === 'steigenberger-al-dau-beach'),
    getHotelsByCountry('egypt').find(h => h.id === 'sunrise-royal-makadi'),
    getHotelsByCountry('turkey').find(h => h.id === 'royal-holiday-palace'),
    getHotelsByCountry('turkey').find(h => h.id === 'alaiye-resort')
  ].filter((hotel): hotel is NonNullable<typeof hotel> => hotel !== undefined); // Type-safe filter

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Populaarsed sihtkohad</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularHotels.map((hotel) => (
            <Link
              key={hotel.id}
              href={`/hotels/${hotel.id}`}
              className="group relative overflow-hidden rounded-lg aspect-[4/3] shadow-lg"
            >
              <Image
                src={hotel.images?.[0] || '/placeholder-hotel.jpg'}
                alt={hotel.name || 'Hotel'}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent
                            transition-opacity duration-300 group-hover:opacity-90" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-semibold mb-2">{hotel.name || 'Unknown Hotel'}</h3>
                <p className="text-lg">Alates €599</p>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0
                            group-hover:opacity-100 transition-opacity duration-300">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-full
                                 transform transition-transform duration-300 hover:scale-105">
                  Vaata lähemalt
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
