import { ServerAction } from '@/types/server-action';
import { type DepartureCity } from '@/data/departureCities';

export interface DepartureCitySelectProps extends ServerAction {
  selectedCities: string[];
  onChangeAction: (cities: string[]) => void;
  cities: DepartureCity[];
}

export default function DepartureCitySelect() {
// ...
} 