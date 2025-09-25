'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { travelData, type TravelDestination } from '@/lib/travel-data';
import { TRAVEL_IMAGES } from '@/utils/imageUtils';

export default function PopularDestinations() {
  const [destinations, setDestinations] = useState<TravelDestination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPopularDestinations() {
      try {
        const popularDestinations = await travelData.getPopularDestinations();
        setDestinations(popularDestinations);
      } catch (error) {
        console.error('Failed to load popular destinations:', error);
        setDestinations([]);
      } finally {
        setLoading(false);
      }
    }

    loadPopularDestinations();
  }, []);

  if (loading) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Populaarsed sihtkohad</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-200 rounded-lg aspect-[4/3]" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Populaarsed sihtkohad</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination) => {
            const imageSrc = getDestinationImage(destination.name);
            return (
              <Link
                key={destination.id}
                href={`/search?destination=${destination.id}`}
                className="group relative overflow-hidden rounded-lg aspect-[4/3] shadow-lg"
              >
                {imageSrc ? (
                  <Image
                    src={imageSrc}
                    alt={destination.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <div className="text-gray-600 text-center">
                      <div className="text-4xl mb-2">🌍</div>
                      <div className="text-sm">Pilt tulekul</div>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent
                              transition-opacity duration-300 group-hover:opacity-90" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-semibold mb-2">{destination.name}</h3>
                  <p className="text-lg">Avasta pakkumised</p>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0
                              group-hover:opacity-100 transition-opacity duration-300">
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-full
                                   transform transition-transform duration-300 hover:scale-105">
                    Otsi reise
                  </button>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Helper function to get destination images
function getDestinationImage(destinationName: string): string | null {
  const imageMap: Record<string, string | null> = {
    'Turkey': TRAVEL_IMAGES.destinations.turkey,
    'Egypt': TRAVEL_IMAGES.destinations.egypt,
    'Spain': TRAVEL_IMAGES.destinations.spain,
    'Greece': TRAVEL_IMAGES.destinations.greece,
    'Bulgaria': TRAVEL_IMAGES.destinations.bulgaria,
    'Tunisia': TRAVEL_IMAGES.destinations.tunisia,
    'Cyprus': TRAVEL_IMAGES.destinations.cyprus,
    'Vietnam': TRAVEL_IMAGES.destinations.vietnam,
  };

  return imageMap[destinationName] || null; // no fallback to avoid showing wrong images
}
