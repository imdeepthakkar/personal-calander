'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, CalendarDays, Settings, RefreshCw } from 'lucide-react';
import { UserSettings } from '@/types/calendar';

interface HeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  totalCount: number;
  tz1Count: number;
  tz2Count: number;
  settings: UserSettings;
}

export const Header: React.FC<HeaderProps> = ({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onToday,
  totalCount,
  tz1Count,
  tz2Count,
  settings,
}) => {
  const monthYearString = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(currentDate);

  return (
    <header className="flex flex-col items-center justify-center pt-6 pb-2 px-4 w-full">
      {/* Title */}
      <h1 
        className="text-4xl font-black tracking-tight text-clay-foreground uppercase mb-2 select-none"
        style={{ fontFamily: 'var(--font-nunito)' }}
      >
        {settings.boardTitle || 'PERSONAL CALENDAR'}
      </h1>



      {/* Month Subtitle & Quick Navigation */}
      <div className="flex items-center justify-center gap-4 mt-1 mb-4">
        <button
          onClick={onPrevMonth}
          className="p-2.5 rounded-[16px] text-clay-foreground bg-white shadow-clayButton hover:shadow-clayButtonHover hover:-translate-y-1 active:scale-95 active:shadow-clayPressed transition-all"
          title="Previous Month"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <span 
          className="text-2xl font-bold text-clay-foreground tracking-tight min-w-[200px] text-center"
          style={{ fontFamily: 'var(--font-nunito)' }}
        >
          {monthYearString}
        </span>

        <button
          onClick={onNextMonth}
          className="p-2.5 rounded-[16px] text-clay-foreground bg-white shadow-clayButton hover:shadow-clayButtonHover hover:-translate-y-1 active:scale-95 active:shadow-clayPressed transition-all"
          title="Next Month"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <button
          onClick={onToday}
          className="px-4 py-2.5 rounded-[16px] text-sm font-bold text-clay-foreground bg-white shadow-clayButton hover:shadow-clayButtonHover hover:-translate-y-1 active:scale-95 active:shadow-clayPressed transition-all ml-2"
          title="Jump to Today"
        >
          TODAY
        </button>
      </div>
    </header>
  );
};
