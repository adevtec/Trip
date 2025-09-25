'use client';

import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {type DepartureCity} from '@/data/departureCities';
import {travelData, type TravelCheckinDate} from '@/lib/travel-data';

/**
 * Interface representing a trip with departure date and destinations
 */
interface Trip {
  date: Date;
  destinations: string[];
  price: number;
  availableOffers?: number;
  minPrice?: number | null;
  maxPrice?: number | null;
  provider?: string;
}

/**
 * Props for the DepartureCalendar component
 */
interface DepartureCalendarProps {
  departureCities: DepartureCity[];
  isOpen: boolean;
  onClose: () => void;
  onDateSelect?: (date: Date) => void;
}

const WEEK_DAYS = ['E', 'T', 'K', 'N', 'R', 'L', 'P'] as const;
const CURRENT_DATE = new Date(); // Real current date
const CURRENT_YEAR = CURRENT_DATE.getFullYear();
const CURRENT_MONTH = CURRENT_DATE.getMonth();

const MONTHS = [
  'JAANUAR', 'VEEBRUAR', 'MÄRTS', 'APRILL', 'MAI', 'JUUNI',
  'JUULI', 'AUGUST', 'SEPTEMBER', 'OKTOOBER', 'NOVEMBER', 'DETSEMBER'
] as const;

const DepartureCalendar = ({ departureCities, isOpen, onClose, onDateSelect }: DepartureCalendarProps) => {
  const { t } = useTranslation();
  const [selectedMonth, setSelectedMonth] = useState(CURRENT_MONTH);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [apiTrips, setApiTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  const modalRef = React.useRef<HTMLDivElement>(null);

  // Load check-in dates from API when component opens or cities change
  useEffect(() => {
    if (!isOpen || !departureCities || departureCities.length === 0) {
      setApiTrips([]);
      setLoading(false);
      return;
    }

    async function loadCheckinDates() {
      try {
        setLoading(true);
        const allTrips: Trip[] = [];

        // Load checkin dates for each selected departure city
        for (const city of departureCities) {
          try {
            const checkinDates = await travelData.getCheckinDates(city.id);

            // Convert API checkin dates to Trip format
            const cityTrips = checkinDates.map((checkin: TravelCheckinDate) => ({
              date: new Date(checkin.date),
              destinations: checkin.destinations,
              price: checkin.minPrice || 0, // Use min price as main price
              availableOffers: checkin.availableOffers,
              minPrice: checkin.minPrice,
              maxPrice: checkin.maxPrice,
              provider: checkin.provider
            }));

            allTrips.push(...cityTrips);
          } catch (error) {
            console.warn(`Failed to load checkin dates for ${city.id}:`, error);
          }
        }

        // Remove duplicates based on date
        const uniqueTrips = Array.from(
          new Map(allTrips.map(trip => [trip.date.toISOString().split('T')[0], trip])).values()
        );

        setApiTrips(uniqueTrips);
      } catch (error) {
        console.error('Failed to load API trip data:', error);
        setApiTrips([]);
      } finally {
        setLoading(false);
      }
    }

    loadCheckinDates();
  }, [isOpen, departureCities]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  if (!isOpen) return null;
  if (!departureCities || departureCities.length === 0) return null;

  // Use only API trips - no fallback to mock data
  const allTrips = apiTrips;
  
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const hasTripOnDate = (date: Date): Trip | undefined => {
    // Don't show trips for past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) {
      return undefined;
    }

    return allTrips.find(trip =>
      trip.date.getDate() === date.getDate() &&
      trip.date.getMonth() === date.getMonth() &&
      trip.date.getFullYear() === date.getFullYear()
    );
  };

  const handleDateClick = (date: Date, trip?: Trip) => {
    if (trip && onDateSelect) {
      onDateSelect(date);
    }
  };

  const renderCalendarDays = () => {
    const days = [];
    // Handle next year months (selectedMonth >= 12)
    const calendarYear = selectedMonth >= 12 ? CURRENT_YEAR + 1 : CURRENT_YEAR;
    const calendarMonth = selectedMonth >= 12 ? selectedMonth - 12 : selectedMonth;

    const daysInMonth = getDaysInMonth(calendarYear, calendarMonth);
    const firstDay = getFirstDayOfMonth(calendarYear, calendarMonth);
    const totalDays = Math.ceil((daysInMonth + firstDay) / 7) * 7;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < totalDays; i++) {
      const dayNumber = i - firstDay + 1;
      const currentDayDate = new Date(calendarYear, calendarMonth, dayNumber);
      const trip = hasTripOnDate(currentDayDate);
      const isPastDate = dayNumber > 0 && dayNumber <= daysInMonth && currentDayDate < today;

      let className = 'group relative p-1.5 text-center ';
      if (isPastDate) {
        className += 'text-gray-300'; // Very light gray for past dates
      } else if (trip) {
        className += 'text-gray-900 font-bold cursor-pointer';
      } else {
        className += 'text-gray-500';
      }

      days.push(
        <div
          key={i}
          className={className}
          onMouseEnter={() => !isPastDate && setHoveredDate(currentDayDate)}
          onMouseLeave={() => setHoveredDate(null)}
          onClick={() => !isPastDate && trip && handleDateClick(currentDayDate, trip)}
        >
          {dayNumber > 0 && dayNumber <= daysInMonth ? dayNumber : ''}
          {hoveredDate?.getDate() === dayNumber && trip && (
            <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 bg-orange-500 text-white shadow-lg rounded-lg px-2.5 py-1.5 mb-2 text-sm w-max max-w-[180px] group-hover:visible">
              <div className="flex flex-col items-center -my-0.5">
                {trip.destinations.map((dest, index) => (
                  <div key={index} className="whitespace-nowrap leading-5">{dest}</div>
                ))}
                {trip.availableOffers && (
                  <div className="text-xs opacity-90 mt-1">
                    {trip.availableOffers} pakkumist
                  </div>
                )}
                {(trip.minPrice || trip.maxPrice) && (
                  <div className="text-xs opacity-90 mt-0.5">
                    {trip.minPrice && trip.maxPrice && trip.minPrice !== trip.maxPrice
                      ? `${trip.minPrice}€ - ${trip.maxPrice}€`
                      : `${trip.minPrice || trip.maxPrice}€`}
                  </div>
                )}
              </div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-orange-500"></div>
            </div>
          )}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl w-full max-w-2xl mx-4 flex h-[420px] overflow-hidden shadow-xl">

        <div className="w-44 bg-[#F8F9FB] p-4 rounded-l-2xl">
          <div className="text-gray-400 mb-2 text-sm">{CURRENT_YEAR}</div>
          <div className="space-y-1">
            {MONTHS.map((month, index) => {
              // Only show current and future months
              if (index < CURRENT_MONTH) return null;

              return (
                <button
                  key={month}
                  onClick={() => setSelectedMonth(index)}
                  className={`text-left w-full py-0.5 text-sm ${index === selectedMonth ? 'bg-white rounded-xl px-3 shadow-sm font-bold' : 'text-gray-800 px-3 font-medium'}`}
                >
                  {month}
                </button>
              );
            })}
          </div>
          <div className="text-gray-400 mt-2 text-sm">{CURRENT_YEAR + 1}</div>
          <div className="mt-1 space-y-1">
            {MONTHS.map((month, index) => (
              <button
                key={`${CURRENT_YEAR + 1}-${month}`}
                onClick={() => setSelectedMonth(index + 12)} // Offset by 12 for next year
                className={`text-left w-full py-0.5 text-sm ${(index + 12) === selectedMonth ? 'bg-white rounded-xl px-3 shadow-sm font-bold' : 'text-gray-800 px-3 font-medium'}`}
              >
                {month}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 p-4 relative">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-bold">
              {MONTHS[selectedMonth >= 12 ? selectedMonth - 12 : selectedMonth]}
              {selectedMonth >= 12 && <span className="text-gray-500 text-lg ml-2">{CURRENT_YEAR + 1}</span>}
            </h2>
            <div className="text-base">
              Väljumine: <span className="font-bold text-orange-500">{departureCities.map(city => city.name).join(', ')}</span>
            </div>
            <button
              onClick={onClose}
              className="text-2xl text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {WEEK_DAYS.map(day => (
              <div key={day} className="p-1.5 text-center text-gray-900 text-sm font-bold">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 relative">
            {loading && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-lg">
                <div className="text-gray-500 text-sm">
                  Laen kuupäevi...
                </div>
              </div>
            )}
            {renderCalendarDays()}
          </div>


        </div>
      </div>
    </div>
  );
};

export default DepartureCalendar;
