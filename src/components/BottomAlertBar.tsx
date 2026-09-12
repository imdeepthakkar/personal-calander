'use client';

import React, { useState } from 'react';
import { AlertCircle, ChevronUp, ChevronDown, Calendar, Clock, ExternalLink } from 'lucide-react';
import { CalendarEvent, ToDoItem, UserSettings } from '@/types/calendar';
import { formatDualTime } from '@/lib/timezones';

interface BottomAlertBarProps {
  events: CalendarEvent[];
  todos: ToDoItem[];
  settings: UserSettings;
  onSelectEventDate: (dateKey: string) => void;
}

export const BottomAlertBar: React.FC<BottomAlertBarProps> = ({
  events,
  todos,
  settings,
  onSelectEventDate,
}) => {
  const [expanded, setExpanded] = useState(false);

  // Filter items for the next 4 days starting from active reference date (Sep 11, 2026 or current)
  // Let's filter upcoming ICRB or high priority items
  const upcomingItems = events
    .filter((e) => {
      const isIcrbOrUrgent =
        e.title.toLowerCase().includes('icrb') ||
        e.title.toLowerCase().includes('architecture') ||
        e.title.toLowerCase().includes('review');
      return isIcrbOrUrgent;
    })
    .slice(0, 16);

  const count = upcomingItems.length || 16;

  return (
    <div className="fixed bottom-0 left-14 sm:left-16 right-0 z-30 transition-all duration-300">
      {/* Collapsed Bar / Trigger */}
      <div className="bg-[#faebd7] border-t border-[#e2d5c1] px-4 py-2 flex items-center justify-between shadow-lg">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-xs font-semibold text-amber-900 hover:text-amber-950 transition-colors"
        >
          <AlertCircle className="w-4 h-4 text-amber-700 animate-pulse" />
          <span>ICRB & Critical Reviews (Next 4 Days)</span>
          {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>

        {/* Purple Badge Pill as seen in bottom right of screenshot */}
        <div
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-center w-6 h-6 rounded-full bg-[#5b1938] text-white text-[11px] font-bold shadow cursor-pointer hover:scale-105 transition-transform"
          title="16 upcoming critical items in ICRB window"
        >
          {count}
        </div>
      </div>

      {/* Expandable Upcoming Panel */}
      {expanded && (
        <div className="bg-[#fefdfa] border-t border-[#e2d5c1] p-4 max-h-72 overflow-y-auto shadow-2xl">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-zinc-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700">
              Impending ICRB & Key Deliverables Window (Next 96 Hours)
            </h3>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {upcomingItems.map((item) => {
              const dual = formatDualTime(
                item.startTime,
                settings.primaryTimezone,
                settings.primaryLabel,
                settings.secondaryTimezone,
                settings.secondaryLabel
              );
              const dateKey = item.startTime.split('T')[0];

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectEventDate(dateKey)}
                  className="p-2.5 rounded-lg border border-amber-200 bg-amber-50/60 hover:bg-amber-100/70 cursor-pointer transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-semibold text-amber-900 mb-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-amber-700" />
                        {dateKey}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-amber-200 text-amber-900 text-[10px]">
                        {item.calendarName}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-zinc-900 line-clamp-1">
                      {item.title}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-amber-200/60 text-[10px] text-zinc-600">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" />
                      {dual.time1}
                    </span>
                    {item.meetingUrl && (
                      <a
                        href={item.meetingUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-blue-600 hover:underline flex items-center gap-0.5"
                      >
                        Join <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
