'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Hotel, TravelPackage, MealPlan } from '@/types/destinations';
import { getHotelById, getAllPackagesByHotel, getMealPlanById } from '@/data/mock';
import { Star, Utensils, Calendar, Users, Check } from 'lucide-react';
import { format } from 'date-fns';
import { et } from 'date-fns/locale';

/**
 * Hotel page component
 * Displays hotel details and available packages
 */
export default function HotelPage() {
  const params = useParams();
  const continentId = params.continentId as string;
  const countryId = params.countryId as string;
  const regionId = params.regionId as string;
  const areaId = params.areaId as string;
  const hotelId = params.hotelId as string;
  
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Get hotel data
      const hotelData = getHotelById(hotelId);
      if (hotelData) {
        setHotel(hotelData);
      }
      
      // Get packages for this hotel
      const packagesData = getAllPackagesByHotel(hotelId);
      setPackages(packagesData);
      
      setLoading(false);
    };
    
    fetchData();
  }, [hotelId]);
  
  if (loading) {
    return (
      <div className="container mx-auto p-4 pt-20">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }
  
  if (!hotel) {
    return (
      <div className="container mx-auto p-4 pt-20">
        <h1 className="text-2xl font-bold mb-4">Hotelli ei leitud</h1>
        <p>Kahjuks ei leitud soovitud hotelli.</p>
        <Link href={`/continent/${continentId}/${countryId}/${regionId}/${areaId}`} className="text-orange-500 hover:underline">
          Tagasi ala lehele
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4 pt-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{hotel.name}</h1>
        <div className="flex items-center mb-4">
          {Array.from({ length: hotel.rating }).map((_, i) => (
            <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
          ))}
        </div>
        
        {/* Image gallery */}
        <div className="mb-6">
          <div className="relative h-96 w-full rounded-lg overflow-hidden mb-2">
            <Image
              src={hotel.images[activeImageIndex]}
              alt={`${hotel.name} - pilt ${activeImageIndex + 1}`}
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {hotel.images.map((image, index) => (
              <div
                key={index}
                className={`relative h-20 w-32 rounded overflow-hidden cursor-pointer ${
                  index === activeImageIndex ? 'ring-2 ring-orange-500' : ''
                }`}
                onClick={() => setActiveImageIndex(index)}
              >
                <Image
                  src={image}
                  alt={`${hotel.name} - pisipilt ${index + 1}`}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Hotel description */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-bold mb-2">Hotelli kirjeldus</h2>
            <p className="text-gray-700 mb-4">{hotel.description}</p>
            
            <h3 className="text-lg font-bold mb-2">Mugavused</h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {hotel.features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            
            <h3 className="text-lg font-bold mb-2">Toatüübid</h3>
            <div className="space-y-2 mb-4">
              {hotel.roomTypes.map(roomType => (
                <div key={roomType.id} className="bg-gray-50 p-3 rounded">
                  <h4 className="font-bold">{roomType.name}</h4>
                  <p className="text-sm text-gray-600">{roomType.description}</p>
                  <p className="text-sm text-gray-600">Mahutab kuni {roomType.capacity} inimest</p>
                </div>
              ))}
            </div>
            
            <h3 className="text-lg font-bold mb-2">Toitlustus</h3>
            <div className="space-y-2">
              {hotel.availableMealPlans.map(mealPlanId => {
                const mealPlan = getMealPlanById(mealPlanId);
                return mealPlan ? (
                  <div key={mealPlan.id} className="flex items-start">
                    <Utensils className="w-4 h-4 text-orange-500 mr-2 mt-1" />
                    <div>
                      <span className="font-bold">{mealPlan.name} ({mealPlan.code})</span>
                      <p className="text-sm text-gray-600">{mealPlan.description}</p>
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          </div>
          
          {/* Location info */}
          <div>
            <h2 className="text-xl font-bold mb-2">Asukoht</h2>
            <div className="bg-gray-50 p-4 rounded mb-4">
              <p className="mb-1"><strong>Riik:</strong> {countryId}</p>
              <p className="mb-1"><strong>Piirkond:</strong> {regionId}</p>
              <p><strong>Ala:</strong> {areaId}</p>
            </div>
            
            {hotel.coordinates && (
              <div className="bg-gray-100 p-4 rounded mb-4 text-center">
                <p className="text-sm text-gray-600">Kaart tuleb peagi</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Available packages */}
        <h2 className="text-2xl font-bold mb-4">Saadaolevad pakkumised</h2>
        
        {packages.length === 0 ? (
          <p>Kahjuks ei leitud ühtegi pakkumist sellele hotellile.</p>
        ) : (
          <div className="space-y-4">
            {packages.map(pkg => {
              const mealPlan = getMealPlanById(pkg.mealPlan);
              const roomType = hotel.roomTypes.find(r => r.id === pkg.roomType);
              
              return (
                <div key={pkg.id} className="bg-white rounded-lg shadow-md p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-3">
                    <div className="flex flex-wrap gap-4 mb-2">
                      <div>
                        <span className="text-sm text-gray-500">Väljumine</span>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{format(new Date(pkg.departureDate), 'dd.MM.yyyy', { locale: et })}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Tagasitulek</span>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{format(new Date(pkg.returnDate), 'dd.MM.yyyy', { locale: et })}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Ööde arv</span>
                        <div className="flex items-center">
                          <span>{pkg.nights} ööd</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-2">
                      <span className="text-sm text-gray-500">Tuba</span>
                      <div>{roomType?.name || 'Standard tuba'}</div>
                    </div>
                    
                    <div className="mb-2">
                      <span className="text-sm text-gray-500">Toitlustus</span>
                      <div className="flex items-center">
                        <Utensils className="w-4 h-4 mr-1" />
                        <span>{mealPlan?.name || 'Toitlustus'} ({mealPlan?.code || 'N/A'})</span>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-sm text-gray-500">Reisijad</span>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        <span>2 täiskasvanut</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col justify-between">
                    <div>
                      {pkg.originalPrice && (
                        <div className="text-gray-500 line-through text-sm">
                          {pkg.originalPrice} €
                        </div>
                      )}
                      <div className="text-2xl font-bold text-orange-600">
                        {pkg.price} €
                      </div>
                      <div className="text-sm text-gray-500">
                        {pkg.pricePerPerson} € inimese kohta
                      </div>
                    </div>
                    
                    <button className="mt-2 bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition-colors">
                      Broneeri
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      <div className="mt-8 flex gap-4">
        <Link href={`/continent/${continentId}/${countryId}/${regionId}/${areaId}`} className="text-orange-500 hover:underline">
          Tagasi ala lehele
        </Link>
        <Link href={`/continent/${continentId}/${countryId}/${regionId}`} className="text-orange-500 hover:underline">
          Tagasi piirkonna lehele
        </Link>
      </div>
      
      {/* Short URL for sharing */}
      <div className="mt-4 text-sm text-gray-500">
        <p>Lühike URL: <Link href={`/hotels/${hotelId}`} className="text-orange-500 hover:underline">/hotels/{hotelId}</Link></p>
      </div>
    </div>
  );
}
