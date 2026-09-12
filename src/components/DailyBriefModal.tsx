'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, Copy, Calendar, CheckSquare } from 'lucide-react';
import { CalendarEvent, ToDoItem, UserSettings } from '@/types/calendar';
import { formatDualTime } from '@/lib/timezones';

interface DailyBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: CalendarEvent[];
  todos: ToDoItem[];
  settings: UserSettings;
  dateKey?: string;
}

export const DailyBriefModal: React.FC<DailyBriefModalProps> = ({
  isOpen,
  onClose,
  events,
  todos,
  settings,
  dateKey,
}) => {
  // ── ALL HOOKS MUST BE BEFORE ANY EARLY RETURN ──────────────────────────────
  const [displayedText, setDisplayedText] = useState('');
  const [fullText, setFullText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiError, setAiError] = useState('');

  // Derived values (computed each render, safe outside hooks)
  const todayString = dateKey || '2026-09-12';
  const [year, month, day] = todayString.split('-');
  const displayDate = new Date(Number(year), Number(month) - 1, Number(day));

  const todaysEvents = events
    .filter((e) => e.startTime.startsWith(todayString))
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const todaysTodos = todos.filter(
    (t) => !t.completed && (t.dueDate === todayString || t.priority === 'urgent' || t.priority === 'high')
  );

  // Fetch AI summary when modal opens (only if API key is set)
  useEffect(() => {
    if (!isOpen || !settings.aiApiKey) return;

    const fetchSummary = async () => {
      setIsLoadingAI(true);
      setAiError('');
      setDisplayedText('');
      setFullText('');
      setIsTypingComplete(false);

      try {
        const eventsStr = todaysEvents
          .map((e) => `- ${e.startTime.split('T')[1].substring(0, 5)}: ${e.title}`)
          .join('\n');
        const todosStr = todaysTodos
          .map((t) => `- ${t.title} (${t.priority})`)
          .join('\n');

        const currentHour = new Date().getHours();
        let timeOfDay = 'Night';
        if (currentHour >= 5 && currentHour < 12) timeOfDay = 'Morning';
        else if (currentHour >= 12 && currentHour < 17) timeOfDay = 'Afternoon';
        else if (currentHour >= 17 && currentHour < 22) timeOfDay = 'Evening';

        const prompt = `Act as an energetic, highly intelligent, and motivating personal assistant. It is currently ${timeOfDay}. Summarize my schedule for ${displayDate.toLocaleDateString()} with enthusiasm! Greet me appropriately ("Good ${timeOfDay}") and make the briefing highly appealing, upbeat, and concise (max 3 sentences).\n\nMeetings:\n${eventsStr || 'None'}\n\nCritical Tasks:\n${todosStr || 'None'}`;

        const payload = { contents: [{ parts: [{ text: prompt }] }] };
        const headers = { 'Content-Type': 'application/json' };
        const models = ['gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-3.0-flash'];

        let data: any = null;
        let lastError = '';
        for (const model of models) {
          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${settings.aiApiKey}`,
            { method: 'POST', headers, body: JSON.stringify(payload) }
          );
          if (res.ok) {
            data = await res.json();
            break;
          }
          const errData = await res.json().catch(() => ({}));
          const msg = (errData as any).error?.message || `Model ${model} failed (${res.status})`;
          lastError += `[${model}: ${msg}] `;
        }

        if (!data) throw new Error(lastError || 'All Gemini models failed.');
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No summary generated.';
        setFullText(text);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to generate summary.';
        console.error('AI Error:', msg);
        setAiError(msg);
      } finally {
        setIsLoadingAI(false);
      }
    };

    fetchSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, dateKey, settings.aiApiKey]);

  // Typewriter effect
  useEffect(() => {
    if (!fullText || isTypingComplete || !settings.aiApiKey) return;
    let idx = 0;
    const interval = setInterval(() => {
      if (idx <= fullText.length) {
        setDisplayedText(fullText.slice(0, idx));
        idx++;
      } else {
        setIsTypingComplete(true);
        clearInterval(interval);
      }
    }, 20);
    return () => clearInterval(interval);
  }, [fullText, isTypingComplete, settings.aiApiKey]);

  // ── EARLY RETURN (after all hooks) ─────────────────────────────────────────
  if (!isOpen) return null;

  const handleCopy = () => {
    let textToCopy = '';
    if (settings.aiApiKey && fullText) {
      textToCopy = fullText;
    } else if (settings.aiApiKey && aiError) {
      textToCopy = `AI Error: ${aiError}`;
    } else {
      textToCopy = `✨ Daily Briefing - ${todayString}\n\n🗓️ Meetings:\n${
        todaysEvents.length > 0
          ? todaysEvents.map((e) => `- ${e.startTime.split('T')[1].substring(0, 5)}: ${e.title}`).join('\n')
          : '- No meetings today!'
      }\n\n✅ Priority Tasks:\n${
        todaysTodos.length > 0
          ? todaysTodos.map((t) => `- [ ] ${t.title} (${t.priority.toUpperCase()})`).join('\n')
          : '- No urgent tasks pending!'
      }`;
    }
    navigator.clipboard.writeText(textToCopy);
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
                {displayDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
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
          {settings.aiApiKey ? (
            <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-clayPressed rounded-[32px] p-6 relative min-h-[160px]">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-[#A78BFA] animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[#A78BFA]">
                  Gemini Summary Agent
                </span>
              </div>
              <p className="text-sm font-bold text-clay-foreground leading-relaxed whitespace-pre-wrap">
                {isLoadingAI ? 'Analyzing schedule...' : aiError || displayedText}
                {!isTypingComplete && !aiError && !isLoadingAI && (
                  <span className="inline-block w-2 h-4 ml-1 bg-clay-accent animate-pulse" />
                )}
              </p>
            </div>
          ) : (
            <>
              {/* Static Meetings Section */}
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

              {/* Static Tasks Section */}
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
            </>
          )}
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
