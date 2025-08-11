'use client';

import { useState, useRef, useEffect } from 'react';
import { Clock } from 'lucide-react';

export interface NightsInputProps {
  value: number | string;
  onChangeAction: (value: number | string) => void;
  availableNights?: number[]; // Konkreetse reisi puhul saadaolevad ööd
}

const NIGHT_RANGES = [
  { label: '3-5 ööd', min: 3, max: 5 },
  { label: '6-8 ööd', min: 6, max: 8 },
  { label: '9-14 ööd', min: 9, max: 14 },
  { label: '15+ ööd', min: 15, max: 21 }
];

export default function NightsInput({ value, onChangeAction, availableNights }: NightsInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRangeSelect = (min: number, max: number) => {
    onChangeAction(min === 15 ? 15 : `${min}-${max}`);
    setIsOpen(false);
  };

  const handleExactSelect = (nights: number) => {
    onChangeAction(nights);
    setIsOpen(false);
  };

  // Kuvame vahemiku või täpse arvu
  const getDisplayValue = () => {
    if (typeof value === 'string') {
      return value;
    }
    return `${value}`;
  };

  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen(true)}
        className="w-full h-12 px-3 text-left bg-gray-50 rounded flex items-center gap-2 cursor-pointer"
      >
        <Clock className="w-4 h-4 text-gray-400" />
        <span className="text-gray-700">{getDisplayValue()}</span>
      </div>

      {isOpen && (
        <div
          ref={modalRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
        >
          {availableNights ? (
            <div className="p-2 max-h-64 overflow-y-auto">
              {availableNights.map(nights => (
                <button
                  key={nights}
                  onClick={() => handleExactSelect(nights)}
                  className={`w-full p-2 text-left hover:bg-orange-50 rounded ${
                    value === nights ? 'bg-orange-50 text-orange-500' : ''
                  }`}
                >
                  {nights}
                </button>
              ))}
            </div>
          ) : (
            <div className="p-2">
              {NIGHT_RANGES.map(range => (
                <button
                  key={range.label}
                  onClick={() => handleRangeSelect(range.min, range.max)}
                  className={`w-full p-2 text-left hover:bg-orange-50 rounded ${
                    (typeof value === 'string' && value === `${range.min}-${range.max}`) ||
                    (typeof value === 'number' && value >= range.min && value <= range.max)
                      ? 'bg-orange-50 text-orange-500'
                      : ''
                  }`}
                >
                  {range.min === 15 ? '15+' : `${range.min}-${range.max}`}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 