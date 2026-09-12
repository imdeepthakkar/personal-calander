'use client';

import React from 'react';
import { DayWorkload, UserSettings } from '@/types/calendar';

interface DayCellProps {
  workload: DayWorkload;
  isSelected: boolean;
  settings: UserSettings;
  onClick: () => void;
}

export const DayCell: React.FC<DayCellProps> = ({
  workload,
  isSelected,
  settings,
  onClick,
}) => {
  const { dayNumber, totalCount, tz1Count, tz2Count, isCurrentMonth, isToday } = workload;

  // Background tint calculation based on screenshot heat levels
  const getBackgroundColor = () => {
    if (!isCurrentMonth) {
      return 'bg-clay-canvas/20 opacity-40';
    }
    if (isHighlighted) {
      return 'bg-white';
    }
    if (totalCount === 0) {
      return 'bg-[#EFEBF5]/50';
    }
    if (totalCount <= 5) {
      return 'bg-blue-100/70';
    }
    if (totalCount <= 12) {
      return 'bg-amber-100/70';
    }
    return 'bg-rose-100/70';
  };

  const isHighlighted = isSelected || isToday;

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className={`
        relative flex flex-col justify-between p-2.5 min-h-[72px] sm:min-h-[84px] md:min-h-[96px] rounded-[24px] transition-all duration-300 cursor-pointer select-none
        ${getBackgroundColor()}
        ${
          isHighlighted
            ? 'shadow-clayButton scale-105 z-10 border-2 border-clay-accent'
            : 'border-2 border-transparent hover:bg-white hover:shadow-clayCard hover:-translate-y-1 hover:scale-[1.02]'
        }
        active:scale-95 active:shadow-clayPressed
      `}
    >
      {/* Top right: Event Count Badge */}
      {isCurrentMonth && totalCount > 0 && (
        <div className="absolute top-2 right-2">
          <span 
            className="flex items-center justify-center min-w-[22px] h-[22px] px-1 bg-gradient-to-br from-[#A78BFA] to-clay-accent text-white text-[11px] font-black rounded-full shadow-clayButton"
            style={{ fontFamily: 'var(--font-nunito)' }}
          >
            {totalCount}
          </span>
        </div>
      )}

      {/* Center: Large Day Number */}
      <div className="flex-1 flex items-center justify-center pointer-events-none">
        <span
          className={`text-3xl sm:text-4xl font-black tracking-tighter ${
            isCurrentMonth ? 'text-clay-foreground' : 'text-clay-muted/40'
          }`}
          style={{ fontFamily: 'var(--font-nunito)' }}
        >
          {dayNumber}
        </span>
      </div>
    </div>
  );
};

