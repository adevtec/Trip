'use client';

import {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Building, Check, Search, X} from 'lucide-react';
import {type DepartureCity} from '@/data/departureCities';

export interface DepartureCitySelectProps {
  selectedCities: string[];
  onChangeAction: (cities: string[]) => void;
  cities: DepartureCity[];
  onCloseAction: () => void;
}

export default function DepartureCitySelect({ selectedCities, onChangeAction, cities, onCloseAction }: DepartureCitySelectProps) {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onCloseAction();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onCloseAction]);

  const handleCityToggle = (cityId: string) => {
    if (selectedCities.includes(cityId)) {
      onChangeAction(selectedCities.filter(id => id !== cityId));
    } else if (selectedCities.length < 3) {
      onChangeAction([...selectedCities, cityId]);
    } else {
      alert('Maksimaalselt saab valida 3 lähtekohta');
    }
  };

  return (
    <div className="relative" ref={modalRef}>
      <div className="absolute top-0 left-0 w-full bg-white border border-gray-300 rounded shadow-lg z-50">
        {/* Search Input */}
        <div className="p-3 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('search.searchCity')}
              className="w-full h-10 pl-9 pr-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Cities List */}
        <div className="max-h-64 overflow-y-auto">
          {cities
            .filter(city => city.name.toLowerCase().includes(search.toLowerCase()))
            .map((city) => (
              <button
                key={city.id}
                onClick={() => handleCityToggle(city.id)}
                className={`w-full px-4 py-2 text-left hover:bg-orange-50 flex items-center gap-2 ${
                  selectedCities.includes(city.id) ? 'text-gray-900' : 'text-gray-700'
                }`}
              >
                <Building className="w-4 h-4 text-gray-400" />
                <span>{city.name}</span>
                {selectedCities.includes(city.id) && (
                  <Check className="w-4 h-4 ml-auto text-green-500" />
                )}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
