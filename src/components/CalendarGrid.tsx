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
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 pb-6 select-none relative z-10">
      <div className="bg-white/60 backdrop-blur-xl shadow-clayCard border border-white/40 rounded-[48px] p-4 sm:p-6 transition-all duration-500 hover:shadow-[16px_16px_40px_rgba(160,150,180,0.3),-10px_-10px_30px_rgba(255,255,255,1),inset_6px_6px_12px_rgba(139,92,246,0.03),inset_-6px_-6px_12px_rgba(255,255,255,1)]">
        {/* Weekday Column Headers */}
        <div className="grid grid-cols-8 gap-1 sm:gap-3 mb-2 text-center">
          <div className="py-2 text-[11px] font-black text-clay-muted/50 tracking-widest uppercase">
            WK
          </div>
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="py-2 text-[11px] font-black text-clay-muted tracking-widest uppercase"
              style={{ fontFamily: 'var(--font-nunito)' }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* 8-Column Grid (1 for WK, 7 for Days) */}
        <div className="flex flex-col gap-2 sm:gap-3">
          {Array.from({ length: days.length / 7 }).map((_, weekIndex) => {
            const weekDays = days.slice(weekIndex * 7, (weekIndex + 1) * 7);
            
            // Calculate approximate week number
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
              <div key={`week-${weekIndex}`} className="grid grid-cols-8 gap-2 sm:gap-3">
                <div className="flex items-center justify-center font-bold text-[10px] text-clay-muted bg-[#EFEBF5] shadow-clayPressed rounded-[20px] opacity-70">
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
    </div>
  );
};

