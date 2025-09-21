'use client';

import {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {Check, Search} from 'lucide-react';
import {travelData, type TravelMealPlan, type TravelRating, type TravelHotel} from '@/lib/travel-data';
import {type City} from '@/data/regions';

interface AdvancedSearchProps {
  isOpen: boolean;
  options: {
    hotelRating: string[];
    hotelNames: string[];
    mealPlans: string[];
    locations: string[];
    nights: number | string;
    isOpen: boolean;
    [key: string]: string[] | boolean | number | string;
  };
  onOptionsChange: (values: AdvancedSearchProps['options']) => void;
}




export default function AdvancedSearch({ isOpen, options, onOptionsChange }: AdvancedSearchProps) {
  const { t } = useTranslation();
  const [hotelSearch, setHotelSearch] = useState('');
  const [apiMealPlans, setApiMealPlans] = useState<TravelMealPlan[]>([]);
  const [apiRatings, setApiRatings] = useState<TravelRating[]>([]);
  const [apiHotels, setApiHotels] = useState<TravelHotel[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data from API
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [mealPlansData, ratingsData] = await Promise.all([
          travelData.getMealPlans(),
          travelData.getRatings()
        ]);
        setApiMealPlans(mealPlansData);
        setApiRatings(ratingsData);
      } catch (error) {
        console.error('Failed to load advanced search data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Load hotels when search query changes
  useEffect(() => {
    if (hotelSearch.length >= 2) {
      async function loadHotels() {
        try {
          const hotelsData = await travelData.getHotels(hotelSearch);
          setApiHotels(hotelsData);
        } catch (error) {
          console.error('Failed to load hotels:', error);
        }
      }
      loadHotels();
    } else {
      setApiHotels([]);
    }
  }, [hotelSearch]);

  const handleToggle = (field: string, value: string) => {
    const currentValues = options[field];
    if (!Array.isArray(currentValues)) return;

    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    onOptionsChange({ ...options, [field]: newValues });
  };

  // Use only API data - no fallback to mock data
  const displayRatings = apiRatings.map(rating => ({
    value: rating.id,
    label: rating.name,
    type: 'STARS'
  }));

  const displayMealPlans = apiMealPlans.map(plan => ({
    value: plan.id,
    label: `${plan.code} - ${plan.name}`
  }));

  // Use only API hotels
  const allHotels = apiHotels.map(hotel => ({
    id: hotel.id,
    name: hotel.name,
    rating: [hotel.provider || 'api']
  }));

  const filteredHotels = allHotels.filter(hotel => {
    const matchesSearch = hotel.name.toLowerCase().includes(hotelSearch.toLowerCase());
    // Removed region filter - we don't need it here
    const matchesRating = options.hotelRating.length === 0 ||
      options.hotelRating.some(rating => hotel.rating.includes(rating));

    return matchesSearch && matchesRating;
  });

  if (!isOpen) return null;

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
                {loading ? (
                  <div className="text-xs text-gray-500">Loading...</div>
                ) : (
                  displayRatings.map(rating => (
                    <label key={rating.value} className="flex items-center gap-2 cursor-pointer">
                      <div className="relative flex items-center justify-center w-4 h-4">
                        <input
                          type="checkbox"
                          checked={options.hotelRating.includes(rating.value)}
                          onChange={() => handleToggle('hotelRating', rating.value)}
                          className="appearance-none w-4 h-4 border-2 border-gray-300 rounded-full checked:border-green-500 checked:bg-white"
                        />
                        {options.hotelRating.includes(rating.value) && (
                          <Check className="w-4 h-4 text-green-500 absolute stroke-[3.5]" />
                        )}
                      </div>
                      <div className="flex gap-1 text-orange-400">
                        {rating.label.includes('⭐') ? (
                          <span className="text-sm">{rating.label}</span>
                        ) : (
                          Array(parseInt(rating.value)).fill('★')
                        )}
                      </div>
                    </label>
                  ))
                )}
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
                      checked={options.hotelNames.includes(hotel.id)}
                      onChange={() => handleToggle('hotelNames', hotel.id)}
                      className="appearance-none w-4 h-4 border-2 border-gray-300 rounded-full checked:border-green-500 checked:bg-white"
                    />
                    {options.hotelNames.includes(hotel.id) && (
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
            {loading ? (
              <div className="text-xs text-gray-500">Loading...</div>
            ) : (
              displayMealPlans.map(plan => (
                <label key={plan.value} className="flex items-center gap-2 cursor-pointer">
                  <div className="relative flex items-center justify-center w-4 h-4">
                    <input
                      type="checkbox"
                      checked={options.mealPlans.includes(plan.value)}
                      onChange={() => handleToggle('mealPlans', plan.value)}
                      className="appearance-none w-4 h-4 border-2 border-gray-300 rounded-full checked:border-green-500 checked:bg-white"
                    />
                    {options.mealPlans.includes(plan.value) && (
                      <Check className="w-4 h-4 text-green-500 absolute stroke-[3.5]" />
                    )}
                  </div>
                  <span className="text-sm">{plan.label}</span>
                </label>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
