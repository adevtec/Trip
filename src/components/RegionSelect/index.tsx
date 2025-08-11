import { type City } from '@/data/regions';

export interface RegionSelectProps {
  selectedCity: City | null;
  onSelectAction: (city: City | null) => void;  // muudetud onSelect -> onSelectAction
  selectedDepartureCities: string[];
  onCloseAction: () => void;
}

export default function RegionSelect({ selectedCity, onSelectAction, selectedDepartureCities, onCloseAction }: RegionSelectProps) {
  // ...
}