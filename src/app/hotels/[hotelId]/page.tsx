'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getHotelById } from '@/data/mock';

/**
 * Hotel redirect page
 * Redirects to the full hotel URL
 */
export default function HotelRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const hotelId = params.hotelId as string;

  useEffect(() => {
    const redirectToFullUrl = async () => {
      // Get hotel data
      const hotel = getHotelById(hotelId);

      if (hotel) {
        // Get the continent ID from the country
        let continentId = '';
        if (hotel.countryId === 'turkey' || hotel.countryId === 'cyprus') {
          continentId = 'asia';
        } else if (hotel.countryId === 'egypt') {
          continentId = 'africa';
        } else if (hotel.countryId === 'greece' || hotel.countryId === 'spain' || hotel.countryId === 'italy' || hotel.countryId === 'bulgaria') {
          continentId = 'europe';
        } else {
          continentId = 'europe'; // Default to Europe if unknown
        }

        // Redirect to the full URL
        router.push(`/continent/${continentId}/${hotel.countryId}/${hotel.regionId}/${hotel.areaId}/${hotelId}`);
      } else {
        // If hotel not found, redirect to home
        router.push('/');
      }
    };

    redirectToFullUrl();
  }, [hotelId, router]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    </div>
  );
}
