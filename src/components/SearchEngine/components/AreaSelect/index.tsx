'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, Check, ChevronDown, ChevronRight } from 'lucide-react';
import { travelData } from '@/lib/travel-data';
import { availabilityValidator } from '@/lib/availability-validator';

export interface AreaSelectProps {
  selectedAreas: string[];
  onSelectAction: (areas: string[]) => void;
  destinationId: string;
  fromCityId: string;
  onCloseAction: () => void;
}

// Helper function to generate display text for selected areas
export function getAreaDisplayText(selectedAreaIds: string[], allRegions: any[]): string {
  if (selectedAreaIds.length === 0) {
    return 'Vali piirkond';
  }

  const groupRegions = (regions: any[]): RegionGroup[] => {
    const groups: { [key: string]: RegionGroup } = {};

    regions.forEach(region => {
      let groupName = region.name; // Start with full name

      // PRIORITY 1: Smart text parsing for hierarchical names
      if (region.name.includes(' - ')) {
        // Pattern 1: "Parent - Child" format (e.g., "Chania - Agia Marina")
        const parts = region.name.split(' - ');
        if (parts.length >= 2) {
          groupName = parts[0].trim();
        }
      }
      else if (region.name.includes(' / ')) {
        // Pattern 2: "Parent / Child" format (e.g., "Sharm El Sheikh / Naama Bay")
        const parts = region.name.split(' / ');
        if (parts.length >= 2) {
          groupName = parts[0].trim();
        }
      }
      else if (region.name.includes('/')) {
        // Pattern 3: "Parent/Child" format (e.g., "Alexandria/Montazah")
        const parts = region.name.split('/');
        if (parts.length >= 2) {
          groupName = parts[0].trim();
        }
      }
      // PRIORITY 2: Use JoinUp's region field if no hierarchical pattern found
      else if (region.region && region.region !== region.name) {
        groupName = region.region;
      }

      if (!groups[groupName]) {
        groups[groupName] = {
          name: groupName,
          cities: []
        };
      }

      groups[groupName].cities.push({
        id: region.id,
        name: region.name,
        nameAlt: region.nameAlt
      });
    });

    return Object.values(groups);
  };

  const regionGroups = groupRegions(allRegions);
  const selectedRegions: { name: string; count: number; total: number }[] = [];

  regionGroups.forEach(group => {
    const selectedCitiesInGroup = group.cities.filter(city => selectedAreaIds.includes(city.id));

    if (selectedCitiesInGroup.length > 0) {
      selectedRegions.push({
        name: group.name,
        count: selectedCitiesInGroup.length,
        total: group.cities.length
      });
    }
  });

  if (selectedRegions.length === 1) {
    const region = selectedRegions[0];
    if (region.count === region.total) {
      return `${region.name} (kõik)`;
    } else {
      return `${region.name} (${region.count})`;
    }
  } else if (selectedRegions.length > 1) {
    return `${selectedRegions.length} piirkonda`;
  }

  return `Piirkond (${selectedAreaIds.length})`;
}

interface RegionGroup {
  name: string;
  cities: Array<{
    id: string;
    name: string;
    nameAlt: string;
  }>;
}

export default function AreaSelect({ selectedAreas, onSelectAction, destinationId, fromCityId, onCloseAction }: AreaSelectProps) {
  const [search, setSearch] = useState('');
  const [regions, setRegions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRegions, setExpandedRegions] = useState<Set<string>>(new Set());
  const modalRef = useRef<HTMLDivElement>(null);

  // Load regions from API
  useEffect(() => {
    console.log('🔥 AreaSelect useEffect triggered! destinationId:', destinationId);

    async function loadRegions() {
      if (!destinationId) {
        console.log('❌ AreaSelect No destinationId, skipping load');
        setRegions([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('🏖️ AreaSelect Loading regions for destinationId:', destinationId, 'fromCityId:', fromCityId);

        const regionsData = await travelData.getRegions(fromCityId, destinationId);
        console.log('✅ AreaSelect Got regions count:', regionsData?.length);

        // TEMPORARILY DISABLE region filtering due to API issues
        console.log('⚠️  Region filtering temporarily disabled');
        setRegions(regionsData || []);

        // TODO: Re-enable when API is stable
        // if (regionsData && regionsData.length > 0) {
        //   const availableRegions = await availabilityValidator.filterAvailableRegions(
        //     regionsData,
        //     destinationId,
        //     fromCityId
        //   ).catch(error => {
        //     console.warn('Failed to filter regions by availability:', error);
        //     return regionsData;
        //   });
        //   setRegions(availableRegions);
        // } else {
        //   setRegions(regionsData || []);
        // }
      } catch (error) {
        console.error('❌ AreaSelect Failed to load regions:', error);
        setRegions([]);
      } finally {
        setLoading(false);
      }
    }

    loadRegions();
  }, [destinationId, fromCityId]);

  // Click-outside handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onCloseAction();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onCloseAction]);

  // Group regions hierarchically using smart text parsing and JoinUp data
  const groupRegions = (regions: any[]): RegionGroup[] => {
    const groups: { [key: string]: RegionGroup } = {};

    regions.forEach(region => {
      let groupName = region.name; // Start with full name

      // PRIORITY 1: Smart text parsing for hierarchical names
      if (region.name.includes(' - ')) {
        // Pattern 1: "Parent - Child" format (e.g., "Chania - Agia Marina")
        const parts = region.name.split(' - ');
        if (parts.length >= 2) {
          groupName = parts[0].trim();
        }
      }
      else if (region.name.includes(' / ')) {
        // Pattern 2: "Parent / Child" format (e.g., "Sharm El Sheikh / Naama Bay")
        const parts = region.name.split(' / ');
        if (parts.length >= 2) {
          groupName = parts[0].trim();
        }
      }
      else if (region.name.includes('/')) {
        // Pattern 3: "Parent/Child" format (e.g., "Alexandria/Montazah")
        const parts = region.name.split('/');
        if (parts.length >= 2) {
          groupName = parts[0].trim();
        }
      }
      // PRIORITY 2: Use JoinUp's region field if no hierarchical pattern found
      else if (region.region && region.region !== region.name) {
        groupName = region.region;
      }

      if (!groups[groupName]) {
        groups[groupName] = {
          name: groupName,
          cities: []
        };
      }

      groups[groupName].cities.push({
        id: region.id,
        name: region.name,
        nameAlt: region.nameAlt
      });
    });

    return Object.values(groups).sort((a, b) => a.name.localeCompare(b.name, 'et'));
  };

  const regionGroups = groupRegions(regions);

  // Filter groups based on search
  const filteredGroups = search
    ? regionGroups.filter(group =>
        group.name.toLowerCase().includes(search.toLowerCase()) ||
        group.cities.some(city =>
          city.name.toLowerCase().includes(search.toLowerCase()) ||
          city.nameAlt.toLowerCase().includes(search.toLowerCase())
        )
      ).map(group => ({
        ...group,
        cities: group.cities.filter(city =>
          city.name.toLowerCase().includes(search.toLowerCase()) ||
          city.nameAlt.toLowerCase().includes(search.toLowerCase())
        )
      }))
    : regionGroups;

  const handleCitySelect = (cityId: string) => {
    let newSelectedAreas: string[];

    if (selectedAreas.includes(cityId)) {
      newSelectedAreas = selectedAreas.filter(areaId => areaId !== cityId);
    } else {
      newSelectedAreas = [...selectedAreas, cityId];
    }

    onSelectAction(newSelectedAreas);
  };

  const handleRegionSelect = (regionName: string) => {
    const group = regionGroups.find(g => g.name === regionName);
    if (!group) return;

    const allCityIds = group.cities.map(city => city.id);
    const allSelected = allCityIds.every(cityId => selectedAreas.includes(cityId));

    let newSelectedAreas: string[];
    if (allSelected) {
      // Deselect all cities in this region
      newSelectedAreas = selectedAreas.filter(areaId => !allCityIds.includes(areaId));
    } else {
      // Select all cities in this region
      const alreadySelected = selectedAreas.filter(areaId => !allCityIds.includes(areaId));
      newSelectedAreas = [...alreadySelected, ...allCityIds];
    }

    onSelectAction(newSelectedAreas);
  };

  const toggleRegionExpansion = (regionName: string) => {
    const newExpanded = new Set(expandedRegions);
    if (newExpanded.has(regionName)) {
      newExpanded.delete(regionName);
    } else {
      newExpanded.add(regionName);
    }
    setExpandedRegions(newExpanded);
  };

  const getRegionSelectionStatus = (group: RegionGroup) => {
    const allCityIds = group.cities.map(city => city.id);
    const selectedCount = allCityIds.filter(cityId => selectedAreas.includes(cityId)).length;

    if (selectedCount === 0) return 'none';
    if (selectedCount === allCityIds.length) return 'all';
    return 'partial';
  };

  // Get clean city name without region prefix
  const getCleanCityName = (cityName: string, regionName: string) => {
    // Remove region prefix from city name for display in expanded view
    // "Sharm El Sheikh / Coral Bay" → "Coral Bay"
    if (cityName.includes(' / ')) {
      const parts = cityName.split(' / ');
      if (parts.length >= 2 && parts[0].trim() === regionName) {
        return parts.slice(1).join(' / ').trim();
      }
    }
    // "Sharm El Sheikh/Coral Bay" → "Coral Bay"
    else if (cityName.includes('/')) {
      const parts = cityName.split('/');
      if (parts.length >= 2 && parts[0].trim() === regionName) {
        return parts.slice(1).join('/').trim();
      }
    }
    // "Sharm El Sheikh - Coral Bay" → "Coral Bay"
    else if (cityName.includes(' - ')) {
      const parts = cityName.split(' - ');
      if (parts.length >= 2 && parts[0].trim() === regionName) {
        return parts.slice(1).join(' - ').trim();
      }
    }

    // If no prefix matches or no separator found, return original name
    return cityName;
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
        {loading ? (
          <div className="p-4 text-center text-gray-500">Loading regions...</div>
        ) : filteredGroups.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {!destinationId ? 'Vali esmalt sihtkoht' : 'Ühtegi piirkonda ei leitud'}
          </div>
        ) : (
          filteredGroups.map(group => {
            const selectionStatus = getRegionSelectionStatus(group);
            const isExpanded = expandedRegions.has(group.name);
            const hasMultipleCities = group.cities.length > 1;

            return (
              <div key={group.name} className="mb-1">
                {/* Region header */}
                <div className="flex items-center">
                  <button
                    onClick={() => handleRegionSelect(group.name)}
                    className={`flex-1 px-3 py-2 text-left hover:bg-orange-50 flex items-center gap-2 ${
                      selectionStatus !== 'none' ? 'text-gray-900' : 'text-gray-700'
                    }`}
                  >
                    <div className="w-4 h-4 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                    </div>
                    <span className="font-medium">{group.name}</span>
                    {selectionStatus === 'all' && <Check className="w-4 h-4 ml-auto text-green-500" />}
                    {selectionStatus === 'partial' && (
                      <div className="w-4 h-4 ml-auto bg-orange-500 rounded-sm flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-sm"></div>
                      </div>
                    )}
                  </button>

                  {/* Expand/collapse button */}
                  {hasMultipleCities && (
                    <button
                      onClick={() => toggleRegionExpansion(group.name)}
                      className="px-2 py-2 hover:bg-gray-100 rounded"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                      )}
                    </button>
                  )}
                </div>

                {/* Cities list */}
                {hasMultipleCities && isExpanded && (
                  <div className="ml-6 border-l border-gray-200 pl-2">
                    {group.cities.map(city => (
                      <button
                        key={city.id}
                        onClick={() => handleCitySelect(city.id)}
                        className={`w-full px-3 py-1.5 text-left hover:bg-orange-50 flex items-center gap-2 text-sm ${
                          selectedAreas.includes(city.id) ? 'text-gray-900' : 'text-gray-600'
                        }`}
                      >
                        <div className="w-3 h-3 text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                        <span>{getCleanCityName(city.name, group.name)}</span>
                        {selectedAreas.includes(city.id) && (
                          <Check className="w-3 h-3 ml-auto text-green-500" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
} 