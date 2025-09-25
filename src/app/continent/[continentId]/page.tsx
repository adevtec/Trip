'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { travelData, type TravelDestination } from '@/lib/travel-data';
import { ContinentInfo } from '@/lib/continent-mapping';
import { TRAVEL_IMAGES } from '@/utils/imageUtils';

/**
 * Continent page component
 * Displays countries in a specific continent
 */
export default function ContinentPage() {
  const params = useParams();
  const continentId = params.continentId as string;
  
  const [continent, setContinent] = useState<ContinentInfo | null>(null);
  const [countries, setCountries] = useState<TravelDestination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        // Get continent data
        const continentData = await travelData.getContinent(continentId);
        if (continentData) {
          setContinent(continentData);
        }

        // Get countries in this continent
        const countriesData = await travelData.getCountriesByContinent(continentId);
        setCountries(countriesData);
      } catch (error) {
        console.error('Failed to load continent data:', error);
      }

      setLoading(false);
    };

    fetchData();
  }, [continentId]);
  
  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }
  
  if (!continent) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Kontinenti ei leitud</h1>
        <p>Kahjuks ei leitud soovitud kontinenti.</p>
        <Link href="/" className="text-orange-500 hover:underline">
          Tagasi avalehele
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{continent.name}</h1>
        <p className="text-gray-600 mb-4">{continent.description}</p>
        <div className="relative h-64 w-full rounded-lg overflow-hidden mb-6">
          <Image
            src={TRAVEL_IMAGES.continents[continent.id as keyof typeof TRAVEL_IMAGES.continents] || '/placeholder-continent.jpg'}
            alt={continent.name}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mb-4">Sihtkohad</h2>
      
      {countries.length === 0 ? (
        <p>Kahjuks ei leitud ühtegi sihtkohta selles kontinendis.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {countries.map(country => (
            <Link
              key={country.id}
              href={`/continent/${continentId}/${country.id}`}
              className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={TRAVEL_IMAGES.destinations[country.name.toLowerCase() as keyof typeof TRAVEL_IMAGES.destinations] || '/placeholder-country.jpg'}
                  alt={country.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">{country.name}</h3>
                <p className="text-gray-600 line-clamp-2">Avasta {country.name} reisipaketid</p>
              </div>
            </Link>
          ))}
        </div>
      )}
      
      <div className="mt-8">
        <Link href="/" className="text-orange-500 hover:underline">
          Tagasi avalehele
        </Link>
      </div>
    </div>
  );
}
