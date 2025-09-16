'use client';

import {useEffect, useRef, useState} from 'react';
import {Check, Search} from 'lucide-react';
import {type City} from '@/data/regions';
import {travelData, type TravelDestination} from '@/lib/travel-data';

export interface RegionSelectProps {
  selectedCity: City | null;
  onSelectAction: (city: City | null) => void;
  selectedDepartureCities: string[];
  onCloseAction: () => void;
}

export default function RegionSelect({ selectedCity, onSelectAction, selectedDepartureCities, onCloseAction }: RegionSelectProps)  {
  const [search, setSearch] = useState('');
  const [destinations, setDestinations] = useState<TravelDestination[]>([]);
  const [loading, setLoading] = useState(true);
  const modalRef = useRef<HTMLDivElement>(null);

  // Load destinations based on selected departure cities
  useEffect(() => {
    async function loadDestinations() {
      if (selectedDepartureCities.length === 0) {
        setDestinations([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const allDestinations: TravelDestination[] = [];

        for (const cityId of selectedDepartureCities) {
          try {
            const cityDestinations = await travelData.getDestinations(cityId);
            allDestinations.push(...cityDestinations);
          } catch (error) {
            console.warn(`Failed to load destinations for ${cityId}:`, error);
          }
        }

        // Remove duplicates based on name
        const uniqueDestinations = Array.from(
          new Map(allDestinations.map(dest => [dest.name.toLowerCase(), dest])).values()
        );

        setDestinations(uniqueDestinations);
      } catch (error) {
        console.error('Failed to load destinations:', error);
      } finally {
        setLoading(false);
      }
    }

    loadDestinations();
  }, [selectedDepartureCities]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onCloseAction();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onCloseAction]);

  // Filter API destinations based on search
  const filteredApiDestinations = destinations.filter(destination =>
    destination.name.toLowerCase().includes(search.toLowerCase()) ||
    destination.nameAlt.toLowerCase().includes(search.toLowerCase())
  );

  // Use only API destinations - no fallback to mock data
  const displayDestinations = filteredApiDestinations.map(dest => ({
    id: dest.id,
    name: dest.name,
    provider: dest.provider
  }));

  // Destination click handler
  const handleDestinationClick = (destination: { id: string; name: string }) => {
    if (selectedCity?.id === destination.id) {
      onSelectAction(null);
    } else {
      onSelectAction({ id: destination.id, name: destination.name, country: destination.id });
    }
    onCloseAction();
  };

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50" ref={modalRef}>
      {/* Search input */}
      <div className="p-3 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Otsi sihtkohta"
            className="w-full h-10 pl-9 pr-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Destinations list */}
      <div className="max-h-64 overflow-y-auto p-2">
        {loading ? (
          <div className="p-4 text-center text-gray-500">Loading destinations...</div>
        ) : displayDestinations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {selectedDepartureCities.length === 0
              ? 'Vali esmalt lähtekoht'
              : 'Ühtegi sihtkohta ei leitud'}
          </div>
        ) : (
          displayDestinations.map(destination => (
            <label
              key={destination.id}
              className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-50 rounded"
              onClick={() => handleDestinationClick(destination)}
            >
              <div className="relative flex items-center justify-center w-4 h-4">
                <input
                  type="radio"
                  checked={selectedCity?.id === destination.id}
                  onChange={() => handleDestinationClick(destination)}
                  className="appearance-none w-4 h-4 border-2 border-gray-300 rounded-full checked:border-green-500 checked:bg-white"
                />
                {selectedCity?.id === destination.id && (
                  <Check className="w-4 h-4 text-green-500 absolute stroke-[3.5]" />
                )}
              </div>
              <span className="text-sm">{destination.name}</span>
              {destination.provider && (
                <span className="ml-auto text-xs text-blue-500 capitalize">
                  {destination.provider}
                </span>
              )}
            </label>
          ))
        )}
      </div>
    </div>
  );
}