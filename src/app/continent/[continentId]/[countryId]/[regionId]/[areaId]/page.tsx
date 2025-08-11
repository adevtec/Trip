'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Area, Hotel } from '@/types/destinations';
import { getAreaById, getHotelsByArea } from '@/data/mock';
import { Star } from 'lucide-react';

/**
 * Area page component
 * Displays hotels in a specific area
 */
export default function AreaPage() {
  const params = useParams();
  const continentId = params.continentId as string;
  const countryId = params.countryId as string;
  const regionId = params.regionId as string;
  const areaId = params.areaId as string;
  
  const [area, setArea] = useState<Area | null>(null);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Get area data
      const areaData = getAreaById(areaId);
      if (areaData) {
        setArea(areaData);
      }
      
      // Get hotels in this area
      const hotelsData = getHotelsByArea(areaId);
      setHotels(hotelsData);
      
      setLoading(false);
    };
    
    fetchData();
  }, [areaId]);
  
  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }
  
  if (!area) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Ala ei leitud</h1>
        <p>Kahjuks ei leitud soovitud ala.</p>
        <Link href={`/continent/${continentId}/${countryId}/${regionId}`} className="text-orange-500 hover:underline">
          Tagasi piirkonna lehele
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{area.name}</h1>
        <p className="text-gray-600 mb-4">{area.description}</p>
        <div className="relative h-64 w-full rounded-lg overflow-hidden mb-6">
          <Image
            src={area.image}
            alt={area.name}
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
        
        {area.weatherInfo && (
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="font-bold text-lg mb-2">Ilm ja kliima</h3>
            <p>Parim aeg külastamiseks: {area.weatherInfo.bestTimeToVisit}</p>
            <p>Keskmine temperatuur: {area.weatherInfo.averageTemperature}</p>
          </div>
        )}
        
        {area.attractions && area.attractions.length > 0 && (
          <div className="bg-green-50 p-4 rounded-lg mb-6">
            <h3 className="font-bold text-lg mb-2">Vaatamisväärsused</h3>
            <ul className="list-disc pl-5">
              {area.attractions.map((attraction, index) => (
                <li key={index}>{attraction}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <h2 className="text-2xl font-bold mb-4">Hotellid</h2>
      
      {hotels.length === 0 ? (
        <p>Kahjuks ei leitud ühtegi hotelli selles piirkonnas.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map(hotel => (
            <Link
              key={hotel.id}
              href={`/continent/${continentId}/${countryId}/${regionId}/${areaId}/${hotel.id}`}
              className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={hotel.images[0]}
                  alt={hotel.name}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">{hotel.name}</h3>
                <div className="flex items-center mb-2">
                  {Array.from({ length: hotel.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 line-clamp-2">{hotel.description}</p>
                <div className="mt-2">
                  <span className="text-sm bg-orange-100 text-orange-800 px-2 py-1 rounded">
                    Vaata pakkumisi
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      
      <div className="mt-8 flex gap-4">
        <Link href={`/continent/${continentId}/${countryId}/${regionId}`} className="text-orange-500 hover:underline">
          Tagasi piirkonna lehele
        </Link>
        <Link href={`/continent/${continentId}/${countryId}`} className="text-orange-500 hover:underline">
          Tagasi riigi lehele
        </Link>
      </div>
    </div>
  );
}
