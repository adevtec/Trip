'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, Check, ChevronDown, ChevronUp, ChevronRight } from 'lucide-react';
import { type Area, type Resort, areas, resorts, countries } from '@/data/destinations';

export interface AreaSelectProps {
  selectedAreas: string[];
  onSelectAction: (areas: string[]) => void;
  countryId: string;
  onCloseAction: () => void;
}

export default function AreaSelect({ selectedAreas, onSelectAction, countryId, onCloseAction }: AreaSelectProps) {
  const [search, setSearch] = useState('');
  const [expandedAreas, setExpandedAreas] = useState<string[]>(
    areas.filter(area => area.countryId === countryId).map(area => area.id)
  );
  const modalRef = useRef<HTMLDivElement>(null);

  // Lisa click-outside handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onCloseAction();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onCloseAction]);

  // Get areas for selected country
  const countryAreas = areas.filter(area => area.countryId === countryId);

  // Filter based on search
  const filteredAreas = countryAreas.filter(area => {
    const areaMatches = area.name.toLowerCase().includes(search.toLowerCase());
    const subAreaMatches = area.subAreas?.some(subArea => 
      subArea.name.toLowerCase().includes(search.toLowerCase())
    );
    return areaMatches || subAreaMatches;
  }).map(area => ({
    ...area,
    name: area.name.replace(countries.find(c => c.id === area.countryId)?.name || '', '').trim()
  }));

  const handleSelect = (id: string, area?: Area) => {
    let newSelectedAreas: string[];
    
    if (area) {
      // Kui valitakse peapiirkond
      const subAreaIds = area.subAreas?.map(sa => sa.id) || [];
      if (selectedAreas.includes(id)) {
        // Eemalda peapiirkond ja kõik alampiirkonnad
        newSelectedAreas = selectedAreas.filter(areaId => 
          areaId !== id && !subAreaIds.includes(areaId)
        );
      } else {
        // Lisa peapiirkond ja kõik alampiirkonnad
        newSelectedAreas = [...selectedAreas, id, ...subAreaIds];
      }
    } else {
      // Üksiku alampiirkonna valimine/eemaldamine
      if (selectedAreas.includes(id)) {
        // Eemalda alampiirkond ja vajadusel ka peapiirkond
        const parentArea = areas.find(area => 
          area.subAreas?.some(sa => sa.id === id)
        );
        newSelectedAreas = selectedAreas.filter(areaId => 
          areaId !== id && areaId !== parentArea?.id
        );
      } else {
        newSelectedAreas = [...selectedAreas, id];
      }
    }
    
    onSelectAction(newSelectedAreas);
  };

  const toggleExpand = (areaId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setExpandedAreas(prev => 
      prev.includes(areaId) ? prev.filter(id => id !== areaId) : [...prev, areaId]
    );
  };

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-h-[300px]" ref={modalRef}>
      <div className="text-base font-medium p-3 border-b border-gray-200">
        Piirkond
      </div>

      <div className="p-3 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Otsi piirkonda"
            className="w-full h-10 pl-9 pr-3 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>
      </div>

      <div className="max-h-64 overflow-y-auto p-2">
        {filteredAreas.map(area => (
          <div key={area.id}>
            <div className="flex items-center justify-between p-2 cursor-pointer hover:bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 flex-1">
                <div 
                  className="flex items-center gap-3"
                  onClick={() => handleSelect(area.id, area)}
                >
                  <div className="relative flex items-center justify-center w-4 h-4">
                    <input
                      type="checkbox"
                      checked={selectedAreas.includes(area.id)}
                      onChange={() => handleSelect(area.id, area)}
                      className="appearance-none w-4 h-4 border-2 border-gray-300 rounded-full checked:border-green-500 checked:bg-white"
                    />
                    {selectedAreas.includes(area.id) && (
                      <Check className="absolute w-3 h-3 text-green-500 stroke-[3.5]" />
                    )}
                  </div>
                  <span className="text-sm font-medium">{area.name}</span>
                </div>
              </div>
              <button
                onClick={(e) => toggleExpand(area.id, e)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                {expandedAreas.includes(area.id) 
                  ? <ChevronDown className="w-4 h-4 text-gray-400" />
                  : <ChevronRight className="w-4 h-4 text-gray-400" />
                }
              </button>
            </div>

            {expandedAreas.includes(area.id) && area.subAreas && (
              <div className="ml-8 space-y-1 mt-1 border-l-2 border-gray-100 pl-4">
                {area.subAreas.map(subArea => (
                  <div
                    key={subArea.id}
                    className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-50 rounded-lg"
                    onClick={() => handleSelect(subArea.id)}
                  >
                    <div className="relative flex items-center justify-center w-4 h-4">
                      <input
                        type="checkbox"
                        checked={selectedAreas.includes(subArea.id)}
                        onChange={() => handleSelect(subArea.id)}
                        className="appearance-none w-4 h-4 border-2 border-gray-300 rounded-full checked:border-green-500 checked:bg-white"
                      />
                      {selectedAreas.includes(subArea.id) && (
                        <Check className="absolute w-3 h-3 text-green-500 stroke-[3.5]" />
                      )}
                    </div>
                    <span className="text-sm">{subArea.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 