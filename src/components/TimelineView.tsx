'use client';

import React from 'react';
import { Video, Clock, MapPin, ExternalLink, Calendar, Trash2 } from 'lucide-react';
import { CalendarEvent, UserSettings } from '@/types/calendar';
import { formatDualTime } from '@/lib/timezones';

interface TimelineViewProps {
  events: CalendarEvent[];
  settings: UserSettings;
  onDeleteEvent: (eventId: string) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  events,
  settings,
  onDeleteEvent,
}) => {
  // Sort events chronologically
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  return (
    <div className="flex flex-col gap-3">


      {sortedEvents.length === 0 ? (
        <div className="text-center py-8 text-xs text-zinc-400">
          No calendar events scheduled for this day.
        </div>
      ) : (
        <div className="flex flex-col gap-2.5 max-h-[360px] overflow-y-auto pr-1">
          {sortedEvents.map((evt) => {
            const startDual = formatDualTime(
              evt.startTime,
              settings.primaryTimezone,
              settings.primaryLabel,
              settings.secondaryTimezone,
              settings.secondaryLabel
            );
            const endDual = formatDualTime(
              evt.endTime,
              settings.primaryTimezone,
              settings.primaryLabel,
              settings.secondaryTimezone,
              settings.secondaryLabel
            );

            return (
              <div
                key={evt.id}
                className="group relative p-3 rounded-lg border border-zinc-200 bg-white hover:border-zinc-300 shadow-2xs transition-all flex flex-col justify-between"
                style={{ borderLeftColor: evt.calendarColor || '#2563eb', borderLeftWidth: '4px' }}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider"
                      style={{
                        backgroundColor: `${evt.calendarColor}15`,
                        color: evt.calendarColor,
                      }}
                    >
                      {evt.calendarName}
                    </span>

                    <button
                      type="button"
                      onClick={() => onDeleteEvent(evt.id)}
                      className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 transition-opacity p-0.5"
                      title="Delete event"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 className="text-xs font-bold text-zinc-900 leading-snug">
                    {evt.title}
                  </h4>

                  {evt.description && (
                    <p className="text-[11px] text-zinc-500 mt-1 line-clamp-2">
                      {evt.description}
                    </p>
                  )}
                </div>

                {/* Times & Video Link */}
                <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2 border-t border-zinc-100 text-[11px]">
                  <div className="flex flex-col text-zinc-600 font-mono text-[10px]">
                    <span className="font-semibold text-zinc-700">
                      {startDual.time1} - {endDual.time1}
                    </span>
                  </div>

                  {evt.meetingUrl && (
                    <a
                      href={evt.meetingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#2563eb] text-white hover:bg-blue-700 text-xs font-semibold shadow-2xs transition-colors"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Call</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
