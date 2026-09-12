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
    <header className="flex flex-col items-center justify-center pt-8 pb-4 px-4 w-full">
      {/* Title */}
      <h1 
        className="text-4xl font-black tracking-tight text-clay-foreground uppercase mb-4 select-none"
        style={{ fontFamily: 'var(--font-nunito)' }}
      >
        {settings.boardTitle || 'PERSONAL CALENDAR'}
      </h1>

      {/* Metric Summary Gradient Badges */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
        {/* Total Pill */}
        <div className="inline-flex items-center justify-center px-6 py-2 rounded-full text-white font-bold text-sm bg-gradient-to-br from-[#A78BFA] to-clay-accent shadow-clayButton cursor-default transition-all duration-300 hover:shadow-clayButtonHover hover:-translate-y-1">
          <span className="tracking-wide">TOTAL: {totalCount}</span>
        </div>
      </div>

      {/* Month Subtitle & Quick Navigation */}
      <div className="flex items-center justify-center gap-4 mt-2">
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
