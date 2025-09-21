'use client';

import React, {useEffect, useRef, useState} from 'react';
import {Users} from 'lucide-react';

export interface Traveler {
  adults: number;
  children: number;
  childrenAges: number[];
}

interface TravelersInputProps {
  travelers: Traveler;
  onTravelersChange: (value: Traveler) => void;
}

export default function TravelersInput({ travelers, onTravelersChange }: TravelersInputProps) {
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

  const handleAdultsChange = (delta: number) => {
    const newAdults = Math.max(1, travelers.adults + delta);
    onTravelersChange({ ...travelers, adults: newAdults });
  };

  const handleChildrenChange = (delta: number) => {
    const newChildren = Math.max(0, travelers.children + delta);
    const newChildrenAges = delta > 0 
      ? [...travelers.childrenAges, 9]
      : travelers.childrenAges.slice(0, -1);
    onTravelersChange({ ...travelers, children: newChildren, childrenAges: newChildrenAges });
  };

  const handleChildAgeChange = (index: number, age: number) => {
    const newChildrenAges = [...travelers.childrenAges];
    newChildrenAges[index] = age;
    onTravelersChange({ ...travelers, childrenAges: newChildrenAges });
  };

  return (
    <div className="relative">
      {/* Input display */}
      <div
        onClick={() => setIsOpen(true)}
        className="w-full h-12 px-3 text-left bg-gray-50 rounded flex items-center gap-2 cursor-pointer"
      >
        <Users className="w-4 h-4 text-gray-400" />
        <span className="text-gray-700">
          {travelers.adults}{travelers.children > 0 ? ` + ${travelers.children}` : ''}
        </span>
      </div>

      {/* Modal */}
      {isOpen && (
        <div 
          ref={modalRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
        >
          {/* Täiskasvanud */}
          <div className="p-4 border-b border-gray-200">
            <div className="text-center">
              <div className="text-lg font-medium mb-2">Täiskasvanud</div>
              <div className="text-sm text-gray-600">Vanus 16+</div>
            </div>
            <div className="flex items-center justify-center gap-6 mt-2">
              <button
                onClick={() => handleAdultsChange(-1)}
                className="w-8 h-8 rounded-full bg-orange-50 hover:bg-orange-100 flex items-center justify-center text-orange-500"
                disabled={travelers.adults <= 1}
              >
                -
              </button>
              <span className="text-lg w-8 text-center">{travelers.adults}</span>
              <button
                onClick={() => handleAdultsChange(1)}
                className="w-8 h-8 rounded-full bg-orange-50 hover:bg-orange-100 flex items-center justify-center text-orange-500"
              >
                +
              </button>
            </div>
          </div>

          {/* Lapsed */}
          <div className="p-4">
            <div className="text-center">
              <div className="text-lg font-medium mb-2">Lapsed</div>
              <div className="text-sm text-gray-600">Vanus 0-15 aastat</div>
            </div>
            <div className="flex items-center justify-center gap-6 mt-2">
              <button
                onClick={() => handleChildrenChange(-1)}
                className="w-8 h-8 rounded-full bg-orange-50 hover:bg-orange-100 flex items-center justify-center text-orange-500"
                disabled={travelers.children <= 0}
              >
                -
              </button>
              <span className="text-lg w-8 text-center">{travelers.children}</span>
              <button
                onClick={() => handleChildrenChange(1)}
                className="w-8 h-8 rounded-full bg-orange-50 hover:bg-orange-100 flex items-center justify-center text-orange-500"
              >
                +
              </button>
            </div>

            {/* Laste vanused */}
            {travelers.children > 0 && (
              <div className="mt-4 space-y-3">
                {travelers.childrenAges.map((age, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="text-sm">
                      {index + 1}. Lapse vanus:
                    </div>
                    <div className="flex items-center justify-center gap-6">
                      <button
                        onClick={() => handleChildAgeChange(index, Math.max(0, age - 1))}
                        className="w-8 h-8 rounded-full bg-orange-50 hover:bg-orange-100 flex items-center justify-center text-orange-500"
                      >
                        -
                      </button>
                      <span className="text-lg w-8 text-center">{age}</span>
                      <button
                        onClick={() => handleChildAgeChange(index, Math.min(15, age + 1))}
                        className="w-8 h-8 rounded-full bg-orange-50 hover:bg-orange-100 flex items-center justify-center text-orange-500"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
