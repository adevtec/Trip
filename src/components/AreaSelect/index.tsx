import { ServerAction } from '@/types/server-action';

export interface AreaSelectProps extends ServerAction {
  selectedAreas: string[];
  onSelect: (areas: string[]) => void;
  countryId: string;
}

export default function AreaSelect({ selectedAreas, onSelect, countryId }: AreaSelectProps) {
  // ...
} 