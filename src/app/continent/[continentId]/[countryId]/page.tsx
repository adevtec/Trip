'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { travelData, type TravelDestination, type TravelRegion } from '@/lib/travel-data';
import { TRAVEL_IMAGES, getRegionImage } from '@/utils/imageUtils';

/**
 * Country page component
 * Displays regions in a specific country
 */
export default function CountryPage() {
  const params = useParams();
  const continentId = params.continentId as string;
  const countryId = params.countryId as string;
  
  const [country, setCountry] = useState<TravelDestination | null>(null);
  const [regions, setRegions] = useState<TravelRegion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        // Get all destinations and find the specific country
        const tallinnCityId = '2552'; // Default city
        const destinations = await travelData.getDestinations(tallinnCityId);
        const countryData = destinations.find(dest => dest.id === countryId);

        if (countryData) {
          setCountry(countryData);

          // Get regions for this destination
          const regionsData = await travelData.getRegions(tallinnCityId, countryId);
          setRegions(regionsData);
        }
      } catch (error) {
        console.error('Failed to load country data:', error);
      }

      setLoading(false);
    };

    fetchData();
  }, [countryId]);
  
  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }
  
  if (!country) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Riiki ei leitud</h1>
        <p>Kahjuks ei leitud soovitud riiki.</p>
        <Link href={`/continent/${continentId}`} className="text-orange-500 hover:underline">
          Tagasi kontinendi lehele
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{country.name}</h1>
        <p className="text-gray-600 mb-4">Avasta {country.name} regioonid</p>
        <div className="relative h-64 w-full rounded-lg overflow-hidden mb-6">
          <Image
            src={TRAVEL_IMAGES.destinations[country.name.toLowerCase() as keyof typeof TRAVEL_IMAGES.destinations] || '/placeholder-country.jpg'}
            alt={country.name}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mb-4">Piirkonnad</h2>
      
      {regions.length === 0 ? (
        <p>Kahjuks ei leitud ühtegi piirkonda selles riigis.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regions.map(region => (
            <Link
              key={region.id}
              href={`/continent/${continentId}/${countryId}/${region.id}`}
              className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={getRegionImage(region.name)}
                  alt={region.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">{region.name}</h3>
                <p className="text-gray-600 line-clamp-2">{region.nameAlt || 'Avasta see piirkond'}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
      
      <div className="mt-8 flex gap-4">
        <Link href={`/continent/${continentId}`} className="text-orange-500 hover:underline">
          Tagasi kontinendi lehele
        </Link>
        <Link href="/" className="text-orange-500 hover:underline">
          Tagasi avalehele
        </Link>
      </div>
    </div>
  );
}
