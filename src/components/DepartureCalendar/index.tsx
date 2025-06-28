import { ServerActionComponent } from '@/types/server-action';

export interface DepartureCalendarProps extends ServerActionComponent {
  departureCities: DepartureCity[];
  isOpen: boolean;
  onDateSelect?: (date: Date) => void;
}

export default function DepartureCalendar({ departureCities, isOpen, onDateSelect }: DepartureCalendarProps) {
  // ...
} 