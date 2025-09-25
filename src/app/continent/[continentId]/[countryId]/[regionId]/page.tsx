'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { travelData, type TravelRegion } from '@/lib/travel-data';
import { getRegionImage } from '@/utils/imageUtils';

interface RegionGroup {
  name: string;
  cities: Array<{
    id: string;
    name: string;
    nameAlt?: string;
  }>;
}

/**
 * Region page component
 * Displays grouped regions without subdivisions (like AreaSelect)
 */
export default function RegionPage() {
  const params = useParams();
  const continentId = params.continentId as string;
  const countryId = params.countryId as string;
  const regionId = params.regionId as string;

  const [country, setCountry] = useState<{ name: string } | null>(null);
  const [regionGroups, setRegionGroups] = useState<RegionGroup[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Group regions hierarchically using JoinUp region data (same logic as AreaSelect)
  const groupRegions = (regions: TravelRegion[]): RegionGroup[] => {
    const groups: { [key: string]: RegionGroup } = {};

    regions.forEach(region => {
      // PRIORITY 1: Use JoinUp's region field (most accurate)
      let groupName = region.region || region.name;

      // FALLBACK: Smart text parsing for non-JoinUp providers
      if (!region.region) {
        // Pattern 1: "Parent - Child" format
        if (region.name.includes(' - ')) {
          const parts = region.name.split(' - ');
          if (parts.length >= 2) {
            groupName = parts[0].trim();
          }
        }
        // Pattern 2: "Parent / Child" format
        else if (region.name.includes(' / ')) {
          const parts = region.name.split(' / ');
          if (parts.length >= 2) {
            groupName = parts[0].trim();
          }
        }
      }

      if (!groups[groupName]) {
        groups[groupName] = {
          name: groupName,
          cities: []
        };
      }

      groups[groupName].cities.push({
        id: region.id,
        name: region.name,
        nameAlt: region.nameAlt
      });
    });

    return Object.values(groups);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        // Get country info
        const tallinnCityId = '2552'; // Default city
        const destinations = await travelData.getDestinations(tallinnCityId);
        const countryData = destinations.find(dest => dest.id === countryId);

        if (countryData) {
          setCountry({ name: countryData.name });

          // Get all regions for this country
          const regions = await travelData.getRegions(tallinnCityId, countryId);
          const groupedRegions = groupRegions(regions);
          setRegionGroups(groupedRegions);
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
        <h1 className="text-3xl font-bold mb-2">{country.name} - Piirkonnad</h1>
        <p className="text-gray-600 mb-4">Vali piirkond, et avastada reisipakkumisi</p>
      </div>

      <h2 className="text-2xl font-bold mb-4">Saadaolevad piirkonnad</h2>

      {regionGroups.length === 0 ? (
        <p>Kahjuks ei leitud ühtegi piirkonda selles riigis.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regionGroups.map(group => (
            <div
              key={group.name}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={getRegionImage(group.name)}
                  alt={group.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">{group.name}</h3>
                <p className="text-gray-600 text-sm mb-3">
                  {group.cities.length} {group.cities.length === 1 ? 'koht' : 'kohta'} selles piirkonnas
                </p>
                <Link
                  href={`/?destination=${encodeURIComponent(group.name)}`}
                  className="inline-block bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors text-sm font-semibold"
                >
                  Otsi pakkumisi
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex gap-4">
        <Link href={`/continent/${continentId}/${countryId}`} className="text-orange-500 hover:underline">
          ← Tagasi riigi lehele
        </Link>
        <Link href={`/continent/${continentId}`} className="text-orange-500 hover:underline">
          ← Tagasi kontinendi lehele
        </Link>
        <Link href="/" className="text-orange-500 hover:underline">
          ← Tagasi avalehele
        </Link>
      </div>
    </div>
  );
}
