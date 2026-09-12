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
    <header className="flex flex-col items-center justify-center pt-5 pb-3 px-4 w-full">
      {/* Title */}
      <h1 className="text-2xl font-bold tracking-widest text-zinc-800 uppercase mb-3 select-none">
        {settings.boardTitle || 'PERSONAL CALENDAR'}
      </h1>

      {/* Metric Summary Gradient Badges */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-2">
        {/* Total Pill */}
        <div className="inline-flex items-center justify-center px-6 py-1.5 rounded-full text-white font-bold text-sm shadow-md bg-gradient-to-r from-[#7a1236] via-[#941344] to-[#6d1033] tracking-wide cursor-default transition-transform hover:scale-105">
          <span>TOTAL: {totalCount}</span>
        </div>
      </div>

      {/* Month Subtitle & Quick Navigation */}
      <div className="flex items-center justify-center gap-2 mt-1">
        <button
          onClick={onPrevMonth}
          className="p-1 rounded-full text-zinc-500 hover:text-zinc-800 hover:bg-zinc-200/60 transition-colors"
          title="Previous Month"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="text-xs font-semibold text-zinc-700 tracking-tight min-w-[130px] text-center">
          {monthYearString}
        </span>

        <button
          onClick={onNextMonth}
          className="p-1 rounded-full text-zinc-500 hover:text-zinc-800 hover:bg-zinc-200/60 transition-colors"
          title="Next Month"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <button
          onClick={onToday}
          className="px-2.5 py-1 rounded-full text-[11px] font-bold text-zinc-600 bg-zinc-200/50 hover:text-zinc-900 hover:bg-zinc-200 transition-colors ml-2"
          title="Jump to Today"
        >
          TODAY
        </button>
      </div>
    </header>
  );
};
