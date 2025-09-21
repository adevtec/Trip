'use client';

import {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {Building, Calendar, MapPin} from 'lucide-react';
import {format} from 'date-fns';
import {et} from 'date-fns/locale';
import {useRouter} from 'next/navigation';

import {travelData, type TravelCity} from '@/lib/travel-data';
import {type DepartureCity} from '@/data/departureCities';
import {type City} from '@/data/regions';
import RegionSelect from './components/RegionSelect';
import TravelersInput, {type Traveler} from './components/TravelersInput';
import AdvancedSearch from './components/AdvancedSearch';
import DepartureCitySelect from './components/DepartureCitySelect';
import type {DateRange} from 'react-day-picker';
import DepartureCalendar from '@/components/DepartureCalendar';
import {type Area, countries, type Country, type Resort} from '@/data/destinations';
import AreaSelect, { getAreaDisplayText } from './components/AreaSelect';
import NightsInput from './components/NightsInput';

type NightsValue = number | string;

export default function SearchEngine() {
  const {t} = useTranslation();
  const router = useRouter();

  // Cities and API state
  const [departureCities, setDepartureCities] = useState<TravelCity[]>([]);

  // Search state
  const [selectedDepartureCities, setSelectedDepartureCities] = useState<string[]>([]);
  const [isDepartureCityOpen, setIsDepartureCityOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [travelers, setTravelers] = useState<Traveler>({
    adults: 1, // Default to 1 adult
    children: 0,
    childrenAges: []
  });
  const [advancedOptions, setAdvancedOptions] = useState({
    hotelRating: [] as string[],
    hotelNames: [] as string[],
    mealPlans: [] as string[],
    locations: [] as string[],
    nights: '7' as NightsValue,
    isOpen: false
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [showCalendarError, setShowCalendarError] = useState(false);
  const [isDestinationOpen, setIsDestinationOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  const [selectedResort, setSelectedResort] = useState<Resort | null>(null);
  const [isAreaSelectOpen, setIsAreaSelectOpen] = useState(false);
  const [selectedAreaIds, setSelectedAreaIds] = useState<string[]>([]);
  const [showAreaSelectError, setShowAreaSelectError] = useState(false);
  const [currentRegions, setCurrentRegions] = useState<any[]>([]);

  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any>(null);

  // Formatitud reisijate arv
  const formattedTravelers = () => {
    const parts = [];
    if (travelers.adults > 0) parts.push(`${travelers.adults} täiskasvanu${travelers.adults > 1 ? 't' : ''}`);
    if (travelers.children > 0) parts.push(`${travelers.children} last${travelers.children > 1 ? 'e' : ''}t`);
    return parts.join(', ') || '1 täiskasvanu';
  };

  // Format date range for display
  const formatDateRange = (range?: DateRange) => {
    if (!range?.from) return 'Vali kuupäevad';

    if (!range.to) {
      return format(range.from, 'd. MMMM yyyy', {locale: et});
    }

    return `${format(range.from, 'd. MMM', {locale: et})} - ${format(range.to, 'd. MMM yyyy', {locale: et})}`;
  };

  // Format departure cities for display
  const getDepartureCitiesText = () => {
    if (selectedDepartureCities.length === 0) {
      return 'Vali lähtekoht';
    }

    if (selectedDepartureCities.length === 1) {
      const city = departureCities.find(c => c.id === selectedDepartureCities[0]);
      return city ? `${city.name} (${city.country})` : selectedDepartureCities[0];
    }

    return `${selectedDepartureCities.length} linn${selectedDepartureCities.length > 1 ? 'a' : ''} valitud`;
  };

  // Load cities on component mount
  useEffect(() => {
    async function loadCities() {
      try {
        const cities = await travelData.getCities();
        setDepartureCities(cities || []);
      } catch (error) {
        console.error('Failed to load cities:', error);
      }
    }

    loadCities();
  }, []);

  const handleSearch = async () => {
    console.log('🔍 Search initiated');
    console.log('Selected cities:', selectedDepartureCities);
    console.log('Selected destination:', selectedCity);
    console.log('Date range:', dateRange);
    console.log('Travelers:', travelers);
    console.log('Advanced options:', advancedOptions);

    if (selectedDepartureCities.length === 0) {
      alert('Palun vali lähtekoht');
      return;
    }

    if (!selectedCity) {
      alert('Palun vali sihtkoht');
      return;
    }

    if (!dateRange?.from) {
      alert('Palun vali väljumiskuupäev');
      return;
    }

    setIsSearching(true);

    try {
      const searchParams = {
        departureCities: selectedDepartureCities,
        destination: selectedCity.id,
        startDate: dateRange.from.toISOString().split('T')[0],
        endDate: dateRange.to?.toISOString().split('T')[0],
        adults: travelers.adults,
        children: travelers.children,
        childrenAges: travelers.childrenAges,
        nights: typeof advancedOptions.nights === 'string' ? parseInt(advancedOptions.nights) : advancedOptions.nights,
        mealPlans: advancedOptions.mealPlans,
        hotelRating: advancedOptions.hotelRating,
        hotelNames: advancedOptions.hotelNames,
        areas: selectedAreaIds
      };

      console.log('Search params:', searchParams);

      const response = await fetch('/api/travel/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(searchParams)
      });

      const data = await response.json();
      console.log('Search results:', data);

      setSearchResults(data);

      // Navigate to search results page with params
      const params = new URLSearchParams({
        from: selectedDepartureCities.join(','),
        to: selectedCity.name,
        date: dateRange.from.toISOString().split('T')[0],
        adults: travelers.adults.toString(),
        children: travelers.children.toString()
      });

      router.push(`/search?${params.toString()}`);

    } catch (error) {
      console.error('Search failed:', error);
      alert('Otsing ebaõnnestus. Palun proovi uuesti.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleCalendarOpen = () => {
    if (selectedDepartureCities.length === 0 || !selectedCity) {
      setShowCalendarError(true);
      setTimeout(() => setShowCalendarError(false), 3000);
      return;
    }
    setIsCalendarOpen(true);
  };

  const handleAreaSelectOpen = () => {
    if (!selectedCity) {
      setShowAreaSelectError(true);
      setTimeout(() => setShowAreaSelectError(false), 3000);
      return;
    }
    setIsAreaSelectOpen(true);
  };

  const handleDestinationSelect = async (city: City | null) => {
    console.log('🎯 FIXED handleDestinationSelect called with:', city);
    console.log('🎯 FIXED handleDestinationSelect function triggered!');
    const country = city ? (countries.find(c => c.id === city.country) || null) : null;
    setSelectedCity(city);
    setSelectedCountry(country);
    setSelectedArea(null);
    setSelectedResort(null);
    setIsDestinationOpen(false);
    console.log('✅ FIXED selectedCity set to:', city);
    console.log('✅ FIXED State will update - forcing render');

    if (city) {
      // Load regions for this destination
      try {
        const regionsData = await travelData.getRegions(undefined, city.id);
        setCurrentRegions(regionsData || []);
      } catch (error) {
        console.error('Failed to load regions for destination:', error);
        setCurrentRegions([]);
      }
    } else {
      setCurrentRegions([]);
      setSelectedAreaIds([]);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg max-w-5xl mx-auto">
      <div className="p-10 pb-0">
        {/* Päis */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-xl font-semibold text-orange-500">Otsi reisi</div>
          <button
            onClick={() => setAdvancedOptions({ ...advancedOptions, isOpen: !advancedOptions.isOpen })}
            className="text-gray-600 hover:text-gray-800 font-medium"
          >
            Rohkem
          </button>
        </div>

        {/* Põhilised valikud */}
        <div className="space-y-8">
          {/* Esimene rida */}
          <div className="grid grid-cols-3 gap-4">
            {/* Departure City */}
            <div>
              <div className="text-sm text-gray-500 mb-1">Lähtekoht</div>
              <div className="relative">
                <button
                  className="w-full h-12 px-3 text-left bg-gray-50 rounded flex items-center gap-2"
                  onClick={() => setIsDepartureCityOpen(!isDepartureCityOpen)}
                >
                  <Building className="w-4 h-4 text-gray-400" />
                  <div className="flex-1 truncate">
                    {getDepartureCitiesText()}
                  </div>
                </button>
                {isDepartureCityOpen && (
                  <DepartureCitySelect
                    selectedCities={selectedDepartureCities}
                    onChangeAction={setSelectedDepartureCities}
                    onCloseAction={() => setIsDepartureCityOpen(false)}
                  />
                )}
              </div>
            </div>

            {/* Destination */}
            <div>
              <div className="text-sm text-gray-500 mb-1">Sihtkoht</div>
              <div className="relative">
                <button
                  onClick={() => setIsDestinationOpen(!isDestinationOpen)}
                  className="w-full h-12 px-3 text-left bg-gray-50 rounded flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="flex-1 truncate text-gray-700">
                    {selectedCity?.name || 'Vali sihtkoht'}
                  </span>
                </button>
                {isDestinationOpen && (
                  <RegionSelect
                    selectedCity={selectedCity}
                    onSelectAction={handleDestinationSelect}
                    selectedDepartureCities={selectedDepartureCities}
                    onCloseAction={() => setIsDestinationOpen(false)}
                  />
                )}
              </div>
            </div>

            {/* Region */}
            <div>
              <div className="text-sm text-gray-500 mb-1">Piirkond</div>
              <div className="relative">
                <button
                  className="w-full h-12 px-3 text-left bg-gray-50 rounded flex items-center gap-2"
                  onClick={() => {
                    console.log('🔥 Area button clicked! selectedCity:', selectedCity);
                    handleAreaSelectOpen();
                  }}
                >
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="flex-1 truncate text-gray-700">
                    {getAreaDisplayText(selectedAreaIds, currentRegions)}
                  </span>
                </button>

                {/* Error Tooltip */}
                {showAreaSelectError && (
                  <div className="absolute top-full left-0 mt-2 p-2 bg-gray-50 border border-gray-100 rounded-md shadow-sm z-10">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <span>Vali esmalt sihtkoht piirkonna valimiseks</span>
                    </div>
                  </div>
                )}

                {/* Area Select Modal */}
                {isAreaSelectOpen && selectedCity && (
                  <AreaSelect
                    selectedAreas={selectedAreaIds}
                    onSelectAction={setSelectedAreaIds}
                    destinationId={selectedCity.id}
                    onCloseAction={() => setIsAreaSelectOpen(false)}
                  />
                )}

              </div>
            </div>
          </div>

          {/* Teine rida */}
          <div className="grid grid-cols-3 gap-4">
            {/* Date Picker */}
            <div>
              <div className="text-sm text-gray-500 mb-1">Väljumine</div>
              <div className="relative">
                <button
                  className="w-full h-12 px-3 text-left bg-gray-50 rounded flex items-center gap-2"
                  onClick={handleCalendarOpen}
                >
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="flex-1 truncate text-gray-700">
                    {formatDateRange(dateRange)}
                  </span>
                </button>

                {/* Error Tooltip */}
                {showCalendarError && (
                  <div className="absolute top-full left-0 mt-2 p-2 bg-gray-50 border border-gray-100 rounded-md shadow-sm z-10">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <span>Vali esmalt lähtekoht ja sihtkoht</span>
                    </div>
                  </div>
                )}

                {isCalendarOpen && (
                  <div className="absolute top-full left-0 mt-1 z-50">
                    <DepartureCalendar
                      departureCities={[]}
                      isOpen={isCalendarOpen}
                      onClose={() => setIsCalendarOpen(false)}
                      onDateSelect={(date: Date) => {
                        setDateRange({ from: date, to: date });
                        setIsCalendarOpen(false);
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Travelers */}
            <div>
              <div className="text-sm text-gray-500 mb-1">Reisijad</div>
              <div className="relative">
                <TravelersInput
                  travelers={travelers}
                  onTravelersChange={setTravelers}
                />
              </div>
            </div>

            {/* Nights */}
            <div>
              <div className="text-sm text-gray-500 mb-1">Ööde arv</div>
              <div className="relative">
                <NightsInput
                  value={advancedOptions.nights}
                  onChangeAction={(nights: number | string) => setAdvancedOptions({ ...advancedOptions, nights })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Search Options */}
        <AdvancedSearch
          isOpen={advancedOptions.isOpen}
          options={advancedOptions}
          onOptionsChange={setAdvancedOptions}
        />
      </div>

      {/* Search Button */}
      <div className="py-8">
        <div className="flex flex-col items-center">
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className={`h-12 px-10 text-white rounded focus:outline-none font-semibold text-lg ${
              isSearching
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-orange-500 hover:bg-orange-600'
            }`}
          >
            {isSearching ? 'Otsin...' : 'Otsi reisi'}
          </button>
        </div>
      </div>
    </div>
  );
}