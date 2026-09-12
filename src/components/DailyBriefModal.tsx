'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, Copy, Calendar, CheckSquare, Clock } from 'lucide-react';
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
  if (!isOpen) return null;


  const todayString = dateKey || '2026-09-12';
  const [year, month, day] = todayString.split('-');
  const displayDate = new Date(Number(year), Number(month) - 1, Number(day));


  const todaysEvents = events
    .filter((e) => e.startTime.startsWith(todayString))
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const todaysTodos = todos.filter(
    (t) => !t.completed && (t.dueDate === todayString || t.priority === 'urgent' || t.priority === 'high')
  );

  
  const [displayedText, setDisplayedText] = useState('');
  const [fullText, setFullText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setDisplayedText('');
      setFullText('');
      setIsTypingComplete(false);
      return;
    }

    // Generate the smart AI text
    const hour = new Date().getHours();
    let greeting = 'Good evening';
    if (hour < 12) greeting = 'Good morning';
    else if (hour < 17) greeting = 'Good afternoon';

    const meetingCount = todaysEvents.length;
    let scheduleVibe = 'light';
    if (meetingCount > 4) scheduleVibe = 'heavy';
    else if (meetingCount > 2) scheduleVibe = 'steady';

    let text = `${greeting}! Looking at your schedule for ${displayDate.toLocaleDateString('en-US', { weekday: 'long' })}, `;

    if (meetingCount === 0) {
      text += 'your calendar is completely clear! ';
    } else {
      text += `you have a ${scheduleVibe} day ahead with ${meetingCount} meeting${meetingCount === 1 ? '' : 's'} scheduled. `;
      
      // Get first meeting
      const firstMeeting = todaysEvents[0];
      const firstTime = firstMeeting.startTime.split('T')[1].substring(0, 5);
      text += `Your day kicks off with "${firstMeeting.title}" at ${firstTime}. `;
    }

    const taskCount = todaysTodos.length;
    if (taskCount === 0) {
      text += '\n\nOn the task front, you have no urgent action items. Take it easy!';
    } else {
      text += `\n\nOn the task front, you have ${taskCount} critical action item${taskCount === 1 ? '' : 's'} pending. `;
      const topTask = todaysTodos.find(t => t.priority === 'urgent') || todaysTodos[0];
      text += `Make sure to prioritize "${topTask.title}".`;
    }
    
    text += '\n\nHave a productive day! ✨';

    setFullText(text);
    setDisplayedText('');
    setIsTypingComplete(false);
  }, [isOpen, dateKey, events, todos]);

  useEffect(() => {
    if (!fullText || isTypingComplete) return;
    
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        setIsTypingComplete(true);
        clearInterval(interval);
      }
    }, 25); // Typing speed

    return () => clearInterval(interval);
  }, [fullText]);

  const handleCopy = () => {
    navigator.clipboard.writeText(fullText);
    alert('AI Briefing copied to clipboard!');
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
          
          {/* AI Typewriter Output */}
          <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-clayPressed rounded-[32px] p-6 relative min-h-[160px]">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#A78BFA] animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#A78BFA]">AI Summary Agent</span>
            </div>
            
            <p className="text-sm font-bold text-clay-foreground leading-relaxed whitespace-pre-wrap font-dm-sans">
              {displayedText}
              {!isTypingComplete && (
                <span className="inline-block w-2 h-4 ml-1 bg-clay-accent animate-pulse" />
              )}
            </p>
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
