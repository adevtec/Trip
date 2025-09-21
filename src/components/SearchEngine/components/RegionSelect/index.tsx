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
      console.log('🔍 RegionSelect: selectedDepartureCities:', selectedDepartureCities);

      // Allow search without departure cities - load all destinations
      if (selectedDepartureCities.length === 0) {
        try {
          setLoading(true);
          // Load destinations from all available cities
          const allAvailableCities = await travelData.getCities();
          const allDestinations: TravelDestination[] = [];

          // Get destinations from first few cities to populate the list
          const sampleCities = allAvailableCities.slice(0, 3); // Use first 3 cities as sample

          for (const city of sampleCities) {
            try {
              const cityDestinations = await travelData.getDestinations(city.id);
              allDestinations.push(...cityDestinations);
            } catch (error) {
              console.warn(`Failed to load destinations for ${city.id}:`, error);
            }
          }

          // Remove duplicates
          const uniqueDestinations = Array.from(
            new Map(allDestinations.map(dest => [dest.name.toLowerCase(), dest])).values()
          );

          setDestinations(uniqueDestinations);
        } catch (error) {
          console.error('Failed to load default destinations:', error);
          setDestinations([]);
        } finally {
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        const allDestinations: TravelDestination[] = [];

        for (const cityId of selectedDepartureCities) {
          try {
            console.log(`🌍 Loading destinations for cityId: ${cityId}`);
            const cityDestinations = await travelData.getDestinations(cityId);
            console.log(`✅ Got ${cityDestinations.length} destinations for ${cityId}:`, cityDestinations);
            allDestinations.push(...cityDestinations);
          } catch (error) {
            console.error(`❌ Failed to load destinations for ${cityId}:`, error);
          }
        }

        // Remove duplicates based on name
        const uniqueDestinations = Array.from(
          new Map(allDestinations.map(dest => [dest.name.toLowerCase(), dest])).values()
        );

        console.log(`🎯 Final destinations (${uniqueDestinations.length}):`, uniqueDestinations);
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
    console.log('🔥 RegionSelect handleDestinationClick:', destination);
    console.log('🔥 RegionSelect About to call onSelectAction...');
    if (selectedCity?.id === destination.id) {
      console.log('🔄 Deselecting destination');
      onSelectAction(null);
    } else {
      console.log('✅ Selecting new destination');
      const cityObject = { id: destination.id, name: destination.name, country: destination.name };
      console.log('🚀 RegionSelect calling onSelectAction with:', cityObject);
      console.log('🚀 RegionSelect onSelectAction type:', typeof onSelectAction);
      console.log('🚀 RegionSelect onSelectAction function name:', onSelectAction.name);
      console.log('🚀 RegionSelect onSelectAction function preview:', onSelectAction.toString().substring(0, 150));
      console.log('🚀 RegionSelect CALLING onSelectAction NOW...');
      onSelectAction(cityObject);
      console.log('✅ RegionSelect onSelectAction COMPLETED');
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
            Ühtegi sihtkohta ei leitud
          </div>
        ) : (
          displayDestinations.map(destination => (
            <button
              key={destination.id}
              onClick={() => handleDestinationClick(destination)}
              className={`w-full px-4 py-2 text-left hover:bg-orange-50 flex items-center gap-2 ${
                selectedCity?.id === destination.id ? 'text-gray-900' : 'text-gray-700'
              }`}
            >
              <div className="w-4 h-4 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              </div>
              <span>{destination.name}</span>
              {selectedCity?.id === destination.id && (
                <Check className="w-4 h-4 ml-auto text-green-500" />
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
}