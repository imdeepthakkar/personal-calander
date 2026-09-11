'use client';

import React from 'react';
import { DayWorkload, UserSettings } from '@/types/calendar';
import { DayCell } from './DayCell';

interface CalendarGridProps {
  days: DayWorkload[];
  selectedDateKey: string | null;
  settings: UserSettings;
  onSelectDay: (workload: DayWorkload) => void;
}

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  days,
  selectedDateKey,
  settings,
  onSelectDay,
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 pb-6 select-none">
      {/* Weekday Column Headers */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-1 text-center">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="py-1.5 text-[11px] font-bold text-zinc-500 tracking-wider uppercase"
          >
            {day}
          </div>
        ))}
      </div>

      {/* 7-Column Days Grid */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {days.map((dayWorkload, index) => (
          <DayCell
            key={`${dayWorkload.dateKey}-${index}`}
            workload={dayWorkload}
            isSelected={selectedDateKey === dayWorkload.dateKey}
            settings={settings}
            onClick={() => onSelectDay(dayWorkload)}
          />
        ))}
      </div>
    </div>
  );
};
