'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Region, Area } from '@/types/destinations';
import { getRegionById, getAreasByRegion } from '@/data/mock';

/**
 * Region page component
 * Displays areas in a specific region
 */
export default function RegionPage() {
  const params = useParams();
  const continentId = params.continentId as string;
  const countryId = params.countryId as string;
  const regionId = params.regionId as string;
  
  const [region, setRegion] = useState<Region | null>(null);
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Get region data
      const regionData = getRegionById(regionId);
      if (regionData) {
        setRegion(regionData);
      }
      
      // Get areas in this region
      const areasData = getAreasByRegion(regionId);
      setAreas(areasData);
      
      setLoading(false);
    };
    
    fetchData();
  }, [regionId]);
  
  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }
  
  if (!region) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Piirkonda ei leitud</h1>
        <p>Kahjuks ei leitud soovitud piirkonda.</p>
        <Link href={`/continent/${continentId}/${countryId}`} className="text-orange-500 hover:underline">
          Tagasi riigi lehele
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{region.name}</h1>
        <p className="text-gray-600 mb-4">{region.description}</p>
        <div className="relative h-64 w-full rounded-lg overflow-hidden mb-6">
          <Image
            src={region.image}
            alt={region.name}
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mb-4">Alad ja kuurordid</h2>
      
      {areas.length === 0 ? (
        <p>Kahjuks ei leitud ühtegi ala selles piirkonnas.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {areas.map(area => (
            <Link
              key={area.id}
              href={`/continent/${continentId}/${countryId}/${regionId}/${area.id}`}
              className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={area.image}
                  alt={area.name}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">{area.name}</h3>
                <p className="text-gray-600 line-clamp-2">{area.description}</p>
                {area.weatherInfo && (
                  <div className="mt-2 text-sm text-gray-500">
                    <p>Parim aeg külastamiseks: {area.weatherInfo.bestTimeToVisit}</p>
                    <p>Keskmine temperatuur: {area.weatherInfo.averageTemperature}</p>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
      
      <div className="mt-8 flex gap-4">
        <Link href={`/continent/${continentId}/${countryId}`} className="text-orange-500 hover:underline">
          Tagasi riigi lehele
        </Link>
        <Link href={`/continent/${continentId}`} className="text-orange-500 hover:underline">
          Tagasi kontinendi lehele
        </Link>
      </div>
    </div>
  );
}
