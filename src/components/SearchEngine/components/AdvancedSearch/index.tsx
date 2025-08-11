'use client';

import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Check, Search} from 'lucide-react';
import {hotels} from '@/data/hotels';
import {mealPlans} from '@/data/mealPlans';
import {type City} from '@/data/regions';

interface AdvancedSearchProps {
  values: {
    hotelRating: string[];
    hotelNames: string[];
    mealPlans: string[];
    locations: string[];
    nights: number | string;
    isOpen: boolean;
    [key: string]: string[] | boolean | number | string;
  };
  onChangeAction: (values: AdvancedSearchProps['values']) => void;
  selectedCity: City | null;
}

const HOTEL_RATINGS = [
  { value: '5', label: '5 tärni', type: 'STARS' },
  { value: '4', label: '4 tärni', type: 'STARS' },
  { value: '3', label: '3 tärni', type: 'STARS' },
  { value: 'APT', label: 'Apartemendid', type: 'TYPE' },
  { value: 'HV1', label: 'Holiday Village', type: 'TYPE' },
  { value: 'SPECIAL', label: 'Special', type: 'TYPE' },
  { value: 'VILLA', label: 'Villa', type: 'TYPE' }
];

const MEAL_PLANS = [
  { value: 'UAI', label: 'UAI - Ultra kõik hinnas' },
  { value: 'AI', label: 'AI - Kõik hinnas' },
  { value: 'FB', label: 'FB - Hommiku-, lõuna- ja õhtusöök' },
  { value: 'HB', label: 'HB - Hommiku- ja õhtusöök' },
  { value: 'BB', label: 'BB - Hommikusöök' },
  { value: 'RO', label: 'RO - Toitlustuseta' }
];

const LOCATIONS = [
  { value: 'beach-first', label: 'Esimene rannariba' },
  { value: 'beach-second', label: 'Teine rannariba' },
  { value: 'center-500m', label: 'Keskusest kuni 500m' },
  { value: 'center-1000m', label: 'Keskusest kuni 1000m' },
  { value: 'quiet', label: 'Vaikne piirkond' }
];

export default function AdvancedSearch({ values, onChangeAction, selectedCity }: AdvancedSearchProps) {
  const { t } = useTranslation();
  const [hotelSearch, setHotelSearch] = useState('');

  const handleToggle = (field: string, value: string) => {
    const currentValues = values[field];
    if (!Array.isArray(currentValues)) return;

    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    onChangeAction({ ...values, [field]: newValues });
  };

  const filteredHotels = hotels.filter(hotel => {
    const matchesSearch = hotel.name.toLowerCase().includes(hotelSearch.toLowerCase());
    const matchesRegion = !selectedCity || hotel.id === selectedCity.id;
    const matchesRating = values.hotelRating.length === 0 || 
      values.hotelRating.some(rating => hotel.rating.includes(rating));
    
    return matchesSearch && matchesRegion && matchesRating;
  });

  return (
    <div className="border-t border-gray-200 pt-6">
      <div className="grid grid-cols-4 gap-6 h-[360px]">
        {/* Hotel rating */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="font-medium mb-3">Hotelli reiting</div>
          <div className="space-y-4 overflow-y-auto h-[280px] pr-2">
            {/* Stars */}
            <div>
              <div className="text-sm text-gray-600 mb-2">Tärnid</div>
              <div className="space-y-2">
                {HOTEL_RATINGS.filter(r => r.type === 'STARS').map(rating => (
                  <label key={rating.value} className="flex items-center gap-2 cursor-pointer">
                    <div className="relative flex items-center justify-center w-4 h-4">
                      <input
                        type="checkbox"
                        checked={values.hotelRating.includes(rating.value)}
                        onChange={() => handleToggle('hotelRating', rating.value)}
                        className="appearance-none w-4 h-4 border-2 border-gray-300 rounded-full checked:border-green-500 checked:bg-white"
                      />
                      {values.hotelRating.includes(rating.value) && (
                        <Check className="w-4 h-4 text-green-500 absolute stroke-[3.5]" />
                      )}
                    </div>
                    <div className="flex gap-1 text-orange-400">
                      {Array(parseInt(rating.value)).fill('★')}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Types */}
            <div>
              <div className="text-sm text-gray-600 mb-2">Tüüp</div>
              <div className="space-y-2">
                {HOTEL_RATINGS.filter(r => r.type === 'TYPE').map(rating => (
                  <label key={rating.value} className="flex items-center gap-2 cursor-pointer">
                    <div className="relative flex items-center justify-center w-4 h-4">
                      <input
                        type="checkbox"
                        checked={values.hotelRating.includes(rating.value)}
                        onChange={() => handleToggle('hotelRating', rating.value)}
                        className="appearance-none w-4 h-4 border-2 border-gray-300 rounded-full checked:border-green-500 checked:bg-white"
                      />
                      {values.hotelRating.includes(rating.value) && (
                        <Check className="w-4 h-4 text-green-500 absolute stroke-[3.5]" />
                      )}
                    </div>
                    <span className="text-sm">{rating.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Hotel name */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="font-medium mb-3">Hotell</div>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={hotelSearch}
              onChange={(e) => setHotelSearch(e.target.value)}
              placeholder="Search hotel"
              className="w-full pl-9 pr-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
          <div className="space-y-2 overflow-y-auto h-[280px] pr-2">
            {filteredHotels.length === 0 ? (
              <div className="text-sm text-gray-500 text-center py-4">
                No hotels found matching the selected filters
              </div>
            ) : (
              filteredHotels.map(hotel => (
                <label key={hotel.id} className="flex items-center gap-2 cursor-pointer">
                  <div className="relative flex items-center justify-center w-4 h-4">
                    <input
                      type="checkbox"
                      checked={values.hotelNames.includes(hotel.id)}
                      onChange={() => handleToggle('hotelNames', hotel.id)}
                      className="appearance-none w-4 h-4 border-2 border-gray-300 rounded-full checked:border-green-500 checked:bg-white"
                    />
                    {values.hotelNames.includes(hotel.id) && (
                      <Check className="w-4 h-4 text-green-500 absolute stroke-[3.5]" />
                    )}
                  </div>
                  <span className="text-sm">{hotel.name}</span>
                </label>
              ))
            )}
          </div>
        </div>

        {/* Meal plans */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="font-medium mb-3">Toitlustus</div>
          <div className="space-y-2 overflow-y-auto h-[280px] pr-2">
            {MEAL_PLANS.map(plan => (
              <label key={plan.value} className="flex items-center gap-2 cursor-pointer">
                <div className="relative flex items-center justify-center w-4 h-4">
                  <input
                    type="checkbox"
                    checked={values.mealPlans.includes(plan.value)}
                    onChange={() => handleToggle('mealPlans', plan.value)}
                    className="appearance-none w-4 h-4 border-2 border-gray-300 rounded-full checked:border-green-500 checked:bg-white"
                  />
                  {values.mealPlans.includes(plan.value) && (
                    <Check className="w-4 h-4 text-green-500 absolute stroke-[3.5]" />
                  )}
                </div>
                <span className="text-sm">{plan.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="font-medium mb-3">Asukoht</div>
          <div className="space-y-2 overflow-y-auto h-[280px] pr-2">
            {LOCATIONS.map(location => (
              <label key={location.value} className="flex items-center gap-2 cursor-pointer">
                <div className="relative flex items-center justify-center w-4 h-4">
                  <input
                    type="checkbox"
                    checked={values.locations.includes(location.value)}
                    onChange={() => handleToggle('locations', location.value)}
                    className="appearance-none w-4 h-4 border-2 border-gray-300 rounded-full checked:border-green-500 checked:bg-white"
                  />
                  {values.locations.includes(location.value) && (
                    <Check className="w-4 h-4 text-green-500 absolute stroke-[3.5]" />
                  )}
                </div>
                <span className="text-sm">{location.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
