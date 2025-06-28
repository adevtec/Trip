'use client';

import {useEffect, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {format} from 'date-fns';
import {et} from 'date-fns/locale';
import {DateRange, DayPicker} from 'react-day-picker';
import 'react-day-picker/dist/style.css';

export interface DateRangePickerProps {
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
  onCloseAction: () => void;
}

export default function DateRangePicker({ value, onChange, onCloseAction }: DateRangePickerProps) {
  const { t } = useTranslation();
  const modalRef = useRef<HTMLDivElement>(null);

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);
    return maxDate;
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onCloseAction();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onCloseAction]);
  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50" ref={modalRef}>
      <div className="flex justify-between items-center p-3 border-b border-gray-200">
        <div className="text-base font-medium">Vali kuupäevad</div>
        <button
          onClick={() => onCloseAction()}
          className="text-2xl text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>
      <div className="p-3">
        <DayPicker
          mode="range"
          selected={value}
          onSelect={onChange}
          locale={et}
          showOutsideDays
          fixedWeeks
          className="border-0"
          disabled={{ before: getMinDate(), after: getMaxDate() }}
          styles={{
            caption: { color: 'rgb(249 115 22)' },
            head_cell: { color: 'rgb(107 114 128)' },
          }}
        />
      </div>
    </div>
  );
}
