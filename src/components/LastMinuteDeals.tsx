'use client';

import Image from 'next/image';
import Link from 'next/link';
import { getAllPackages, getHotelById } from '@/data/mock';
import { format } from 'date-fns';
import { et } from 'date-fns/locale';

export default function LastMinuteDeals() {
  // Get packages with discounts
  const allPackages = getAllPackages();
  const discountedPackages = allPackages
    .filter(pkg => pkg.discount && pkg.discount > 0)
    .sort((a, b) => (b.discount || 0) - (a.discount || 0))
    .slice(0, 3);

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Viimase hetke pakkumised</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {discountedPackages.map((deal) => {
            const hotel = getHotelById(deal.hotelId);
            if (!hotel) return null;

            return (
              <Link
                key={deal.id}
                href={`/hotels/${deal.hotelId}`}
                className="bg-white rounded-lg overflow-hidden shadow-lg group"
              >
                <div className="relative aspect-[4/3]">
                                    <Image
                    src={hotel.images?.[0] || '/placeholder-hotel.jpg'}
                    alt={hotel.name || 'Hotel'}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full">
                    {deal.discount}% soodustus
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{hotel.name}</h3>
                  <p className="text-gray-600 mb-3">
                    {deal.nights} ööd, {format(new Date(deal.departureDate), 'dd.MM.yyyy', { locale: et })}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-red-600 font-bold text-xl">{deal.price}€</span>
                    {deal.originalPrice && (
                      <span className="text-gray-400 line-through">{deal.originalPrice}€</span>
                    )}
                  </div>
                  <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md
                                   transition-colors duration-300 hover:bg-blue-700">
                    Broneeri kohe
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
