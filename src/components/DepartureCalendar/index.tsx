// Remove this import since the module doesn't exist
import { DepartureCity } from '@/types/destinations';

export interface DepartureCalendarProps {
  departureCities: DepartureCity[];
  isOpen: boolean;
  onDateSelect?: (date: Date) => void;
}

export default function DepartureCalendar({ departureCities, isOpen, onDateSelect }: DepartureCalendarProps) {
  // ...
} 