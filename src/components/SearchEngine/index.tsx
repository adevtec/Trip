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
import AreaSelect from './components/AreaSelect';
import NightsInput from './components/NightsInput';

type NightsValue = number | string;

export default function SearchEngine() {
  const { t } = useTranslation();
  const router = useRouter();

  // API data state
  const [apiCities, setApiCities] = useState<TravelCity[]>([]);

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

  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Load cities from API
  useEffect(() => {
    async function loadCities() {
      try {
        const citiesData = await travelData.getCities();
        setApiCities(citiesData);
        // No auto-selection - user must manually select departure city
      } catch (error) {
        console.error('Failed to load cities:', error);
      }
    }
    loadCities();
  }, []); // Load cities only once on mount

  // Helper function to get city display name
  const getCityDisplayName = (cityId: string): string => {
    const apiCity = apiCities.find(city => city.id === cityId);
    return apiCity?.name || cityId;
  };

  const handleSearch = async () => {
    // Validate required fields - only departure city is required
    if (selectedDepartureCities.length === 0) {
      setSearchError('Palun vali vähemalt üks lähtekoht');
      setTimeout(() => setSearchError(null), 3000);
      return;
    }

    // Departure date is now optional

    try {
      setIsSearching(true);
      setSearchError(null);

      // Build URL search params for the search results page
      const params = new URLSearchParams();

      // Add basic search parameters
      selectedDepartureCities.forEach(city => {
        params.append('departureCities', city);
      });

      if (selectedCity?.country) {
        params.set('destination', selectedCity.country);
      }

      if (selectedAreaIds.length > 0) {
        selectedAreaIds.forEach(area => {
          params.append('area', area);
        });
      }

      // Add departure date only if selected
      if (dateRange?.from) {
        params.set('departureDate', dateRange.from.toISOString());
      }

      params.set('nights', advancedOptions.nights.toString());
      params.set('adults', travelers.adults.toString());
      params.set('children', travelers.children.toString());

      // Add advanced filters
      if (advancedOptions.hotelRating.length > 0) {
        advancedOptions.hotelRating.forEach(rating => {
          params.append('hotelRating', rating);
        });
      }

      if (advancedOptions.mealPlans.length > 0) {
        advancedOptions.mealPlans.forEach(plan => {
          params.append('mealPlan', plan);
        });
      }

      if (advancedOptions.hotelNames.length > 0) {
        advancedOptions.hotelNames.forEach(name => {
          params.append('hotelName', name);
        });
      }

      // Add sorting parameters
      params.set('sortBy', 'price');
      params.set('sortOrder', 'asc');

      // Navigate to search results page
      router.push(`/search?${params.toString()}`);
    } catch (error) {
      console.error('Search error:', error);
      setSearchError(error instanceof Error ? error.message : 'Otsingul tekkis viga');
      setIsSearching(false);
    }
  };

  // Handler for date selection
  const handleDateSelect = (range: DateRange | undefined) => {
    setDateRange(range);
    // Close the picker only if a complete range is selected
    if (range?.to) {
      setIsDatePickerOpen(false);
    }
  };

  // Format date for display
  const getDateDisplay = () => {
    if (!dateRange?.from) return 'Vali väljumiskuupäev';
    if (!dateRange.to) return format(dateRange.from, 'dd.MM.yyyy', { locale: et });
    return `${format(dateRange.from, 'dd.MM.yyyy', { locale: et })} - ${format(dateRange.to, 'dd.MM.yyyy', { locale: et })}`;
  };

  // Handler for opening calendar
  const handleCalendarOpen = () => {
    if (selectedDepartureCities.length === 0) {
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

  const handleDestinationSelect = (city: City | null) => {
    const country = city ? (countries.find(c => c.id === city.country) || null) : null;
    setSelectedCity(city);
    setSelectedCountry(country);
    setSelectedArea(null);
    setSelectedResort(null);
    setIsDestinationOpen(false);
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
            {advancedOptions.isOpen ? 'Vähem' : 'Rohkem'}
          </button>
        </div>

        {/* Ülemised read */}
        <div className="space-y-8">
          {/* First Row */}
          <div className="grid grid-cols-3 gap-4">
            {/* Departure Cities */}
            <div>
              <div className="text-sm text-gray-500 mb-1">Lähtekoht</div>
              <div className="relative">
                <button
                  onClick={() => setIsDepartureCityOpen(true)}
                  className="w-full h-12 px-3 text-left bg-gray-50 rounded flex items-center gap-2"
                >
                  <Building className="w-4 h-4 text-gray-400" />
                  <div className="flex-1 truncate">
                    {selectedDepartureCities.length > 0
                      ? selectedDepartureCities.map(getCityDisplayName).join(', ')
                      : 'Vali lähtekoht'}
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
                  onClick={handleAreaSelectOpen}
                >
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="flex-1 truncate text-gray-700">
                    {selectedAreaIds.length > 0
                      ? `Piirkond(${selectedAreaIds.length})`
                      : 'Vali piirkond'}
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
                    countryId={selectedCity.country}
                    onCloseAction={() => setIsAreaSelectOpen(false)}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-3 gap-4">
            {/* Date Range */}
            <div>
              <div className="text-sm text-gray-500 mb-1">Väljumine</div>
              <div className="relative">
                <button
                  onClick={handleCalendarOpen}
                  className="w-full h-12 px-3 text-left bg-gray-50 rounded flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="flex-1 truncate text-gray-700">
                    {dateRange?.from ? format(dateRange.from, 'dd.MM.yyyy', { locale: et }) : 'Vali väljumiskuupäev'}
                  </span>
                </button>

                {/* Error Tooltip */}
                {showCalendarError && (
                  <div className="absolute top-full left-0 mt-2 p-2 bg-gray-50 border border-gray-100 rounded-md shadow-sm z-10">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <span>Vali esmalt lähtekoht kalendri avamiseks</span>
                    </div>
                  </div>
                )}

                {/* Calendar Modal */}
                {isCalendarOpen && selectedDepartureCities.length > 0 && (
                  <DepartureCalendar
                    departureCities={selectedDepartureCities
                      .map(id => {
                        const apiCity = apiCities.find(city => city.id === id);
                        return apiCity ? {
                          id: apiCity.id,
                          name: apiCity.name,
                          code: apiCity.code,
                          country: apiCity.country
                        } : null;
                      })
                      .filter((city): city is DepartureCity => city !== null)}
                    isOpen={isCalendarOpen}
                    onClose={() => setIsCalendarOpen(false)}
                    onDateSelect={(date) => {
                      setDateRange({ from: date, to: undefined });
                      setIsCalendarOpen(false);
                    }}
                  />
                )}
              </div>
            </div>

            {/* Travelers */}
            <div>
              <div className="text-sm text-gray-500 mb-1">Reisijad</div>
              <TravelersInput
                value={travelers}
                onChangeAction={setTravelers}
              />
            </div>

            {/* Nights */}
            <div>
              <div className="text-sm text-gray-500 mb-1">Ööde arv</div>
              <NightsInput
                value={advancedOptions.nights}
                onChangeAction={(nights) => setAdvancedOptions({ ...advancedOptions, nights })}
                availableNights={selectedDepartureCities.length > 0 && dateRange?.from ? [7, 10, 14] : undefined}
              />
            </div>
          </div>
        </div>

        {/* Advanced Search section */}
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
          advancedOptions.isOpen ? 'max-h-[800px] mt-8' : 'max-h-0'
        }`}>
          <AdvancedSearch
            values={advancedOptions}
            onChangeAction={setAdvancedOptions}
            selectedCity={selectedCity}
          />
        </div>
      </div>

      {/* Otsingu nupp eraldi sektsioonis */}
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

          {/* Error message */}
          {searchError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-md">
              {searchError}
            </div>
          )}

          {/* Results summary */}
          {searchResults && !searchError && (
            <div className="mt-4 p-3 bg-green-50 border border-green-100 text-green-600 rounded-md">
              Leitud {searchResults.totalResults} reisi. Vaata tulemusi allpool.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
