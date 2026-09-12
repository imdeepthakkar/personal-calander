'use client';

import React from 'react';
import { X, Sparkles, Copy, Calendar, CheckSquare, Clock } from 'lucide-react';
import { CalendarEvent, ToDoItem, UserSettings } from '@/types/calendar';
import { formatDualTime } from '@/lib/timezones';

interface DailyBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: CalendarEvent[];
  todos: ToDoItem[];
  settings: UserSettings;
}

export const DailyBriefModal: React.FC<DailyBriefModalProps> = ({
  isOpen,
  onClose,
  events,
  todos,
  settings,
}) => {
  if (!isOpen) return null;

  // Use today's date for the brief
  const todayDate = new Date(2026, 8, 12); // Using the static reference date from page.tsx for consistency
  const todayString = todayDate.toISOString().split('T')[0];

  const todaysEvents = events
    .filter((e) => e.startTime.startsWith(todayString))
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const todaysTodos = todos.filter(
    (t) => !t.completed && (t.dueDate === todayString || t.priority === 'urgent' || t.priority === 'high')
  );

  const handleCopy = () => {
    const text = `✨ Daily Briefing - ${todayString}\n\n🗓️ Meetings:\n${
      todaysEvents.length > 0
        ? todaysEvents.map((e) => `- ${e.startTime.split('T')[1].substring(0, 5)}: ${e.title}`).join('\n')
        : '- No meetings today!'
    }\n\n✅ Priority Tasks:\n${
      todaysTodos.length > 0
        ? todaysTodos.map((t) => `- [ ] ${t.title} (${t.priority.toUpperCase()})`).join('\n')
        : '- No urgent tasks pending!'
    }`;
    navigator.clipboard.writeText(text);
    alert('Briefing copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-clay-foreground/10 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white/70 backdrop-blur-xl rounded-[48px] shadow-clayCard max-w-lg w-full overflow-hidden border border-white/40 animate-in fade-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/40 bg-white/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-gradient-to-br from-[#A78BFA] to-clay-accent text-white shadow-clayButton">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 
                className="text-xl font-black text-clay-foreground"
                style={{ fontFamily: 'var(--font-nunito)' }}
              >
                Daily Briefing
              </h3>
              <p className="text-[11px] font-bold text-clay-muted tracking-widest uppercase">
                {todayDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white shadow-clayButton hover:shadow-clayButtonHover hover:-translate-y-1 active:scale-95 active:shadow-clayPressed text-clay-muted hover:text-clay-foreground transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 flex flex-col gap-6 bg-white/40 max-h-[60vh] overflow-y-auto">
          {/* Meetings Section */}
          <div>
            <h4 className="text-xs font-black text-clay-muted uppercase tracking-wider mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-clay-sky" /> Today's Schedule
            </h4>
            {todaysEvents.length === 0 ? (
              <div className="p-4 rounded-[24px] bg-white/50 border border-white/50 shadow-sm text-sm font-bold text-clay-muted/70 text-center">
                Your schedule is clear!
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {todaysEvents.map((event) => {
                  const dual = formatDualTime(
                    event.startTime,
                    settings.primaryTimezone,
                    settings.primaryLabel,
                    settings.secondaryTimezone,
                    settings.secondaryLabel
                  );
                  return (
                    <div key={event.id} className="p-3 rounded-[20px] bg-white border border-white/40 shadow-sm flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-2 h-8 rounded-full"
                          style={{ backgroundColor: event.calendarColor }}
                        />
                        <div>
                          <p className="text-sm font-bold text-clay-foreground line-clamp-1">{event.title}</p>
                          <p className="text-[10px] font-bold text-clay-muted uppercase tracking-wider">
                            {dual.time1} • {event.calendarName}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Tasks Section */}
          <div>
            <h4 className="text-xs font-black text-clay-muted uppercase tracking-wider mb-3 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-clay-accent" /> Critical Action Items
            </h4>
            {todaysTodos.length === 0 ? (
              <div className="p-4 rounded-[24px] bg-white/50 border border-white/50 shadow-sm text-sm font-bold text-clay-muted/70 text-center">
                No pressing tasks for today!
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {todaysTodos.map((task) => (
                  <div key={task.id} className="p-3 rounded-[20px] bg-[#EFEBF5]/50 border border-white/40 shadow-sm flex flex-col justify-center">
                    <p className="text-sm font-bold text-clay-foreground flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full border-2 border-clay-muted/30" />
                      {task.title}
                    </p>
                    {task.priority === 'urgent' && (
                      <span className="ml-6 mt-1 self-start text-[9px] font-black uppercase tracking-widest text-red-500 bg-red-500/10 px-2 py-0.5 rounded-lg">
                        Urgent Priority
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-white/50 border-t border-white/40 flex gap-3">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-[20px] bg-white text-clay-foreground font-black tracking-widest uppercase shadow-clayButton hover:shadow-clayButtonHover hover:-translate-y-1 active:scale-95 active:shadow-clayPressed transition-all"
            style={{ fontFamily: 'var(--font-nunito)' }}
          >
            <Copy className="w-4 h-4" /> Copy to Clipboard
          </button>
        </div>
      </div>
    </div>
  );
};
