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
      return 'bg-[#f4f4ec]/40 opacity-40';
    }
    if (totalCount === 0) {
      return 'bg-[#ecece5]/60 hover:bg-[#ecece5]';
    }
    if (totalCount <= 5) {
      return 'bg-[#dbeef0]/70 hover:bg-[#d5ecee]'; // soft mint-blue
    }
    if (totalCount <= 12) {
      return 'bg-[#f6ebd4] hover:bg-[#f3e5c7]'; // warm wheat / amber
    }
    // High workload (e.g. 17 on Sep 9)
    return 'bg-[#fcdcdc] hover:bg-[#fad3d3]'; // soft blush / rose
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
        relative flex flex-col justify-between p-2.5 min-h-[96px] sm:min-h-[110px] md:min-h-[120px] rounded-lg transition-all duration-150 cursor-pointer select-none border
        ${getBackgroundColor()}
        ${
          isHighlighted
            ? 'border-[#2d5aa8] ring-2 ring-[#2d5aa8] shadow-md z-10'
            : 'border-[#dfdfd5] hover:border-zinc-400 hover:shadow-sm'
        }
      `}
    >
      {/* Center: Large Day Number */}
      <div className="flex items-center justify-center my-auto">
        <span
          className={`text-2xl sm:text-3xl font-bold tracking-tight ${
            isCurrentMonth ? 'text-zinc-900' : 'text-zinc-400'
          }`}
        >
          {dayNumber}
        </span>
      </div>

      {/* Bottom row: Workload Metric */}
      {isCurrentMonth && totalCount > 0 ? (
        <div className="flex justify-center w-full">
          <span className="px-2 py-0.5 bg-black/10 text-zinc-700 text-[10px] font-bold rounded">
            {totalCount} item{totalCount !== 1 ? 's' : ''}
          </span>
        </div>
      ) : (
        <div className="h-4" />
      )}
    </div>
  );
};
