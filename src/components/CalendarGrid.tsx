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
      <div className="grid grid-cols-8 gap-1 sm:gap-2 mb-1 text-center">
        <div className="py-1.5 text-[11px] font-bold text-zinc-400 tracking-wider uppercase">
          WK
        </div>
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="py-1.5 text-[11px] font-bold text-zinc-500 tracking-wider uppercase"
          >
            {day}
          </div>
        ))}
      </div>

      {/* 8-Column Grid (1 for WK, 7 for Days) */}
      <div className="flex flex-col gap-1 sm:gap-2">
        {Array.from({ length: days.length / 7 }).map((_, weekIndex) => {
          const weekDays = days.slice(weekIndex * 7, (weekIndex + 1) * 7);
          
          // Calculate approximate week number based on the first day of the week
          const firstDay = weekDays[0]?.date;
          let weekNum = '';
          if (firstDay) {
            const d = new Date(Date.UTC(firstDay.getFullYear(), firstDay.getMonth(), firstDay.getDate()));
            const dayNum = d.getUTCDay() || 7;
            d.setUTCDate(d.getUTCDate() + 4 - dayNum);
            const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
            weekNum = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7).toString();
          }

          return (
            <div key={`week-${weekIndex}`} className="grid grid-cols-8 gap-1 sm:gap-2">
              <div className="flex items-center justify-center font-mono text-[11px] font-semibold text-zinc-400 bg-[#e4e4db]/30 rounded-xl">
                W{weekNum}
              </div>
              {weekDays.map((dayWorkload, index) => (
                <DayCell
                  key={`${dayWorkload.dateKey}-${index}`}
                  workload={dayWorkload}
                  isSelected={selectedDateKey === dayWorkload.dateKey}
                  settings={settings}
                  onClick={() => onSelectDay(dayWorkload)}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};
