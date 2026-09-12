'use client';

import React, { useState } from 'react';
import { X, Calendar, CheckSquare, Clock, Plus, Video } from 'lucide-react';
import { DayWorkload, CalendarEvent, ToDoItem, UserSettings } from '@/types/calendar';
import { TimelineView } from './TimelineView';
import { DayTodoList } from './DayTodoList';

interface DayDetailDrawerProps {
  workload: DayWorkload | null;
  settings: UserSettings;
  onClose: () => void;
  onToggleTodo: (todoId: string) => void;
  onAddTodo: (newTodo: Omit<ToDoItem, 'id'>) => void;
  onDeleteTodo: (todoId: string) => void;
  onDeleteEvent: (eventId: string) => void;
  onOpenNewEvent: () => void;
}

export const DayDetailDrawer: React.FC<DayDetailDrawerProps> = ({
  workload,
  settings,
  onClose,
  onToggleTodo,
  onAddTodo,
  onDeleteTodo,
  onDeleteEvent,
  onOpenNewEvent,
}) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'todos'>('timeline');

  if (!workload) return null;

  // Format title date e.g. "Friday, September 11, 2026"
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(workload.date);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-clay-foreground/10 backdrop-blur-sm z-40 transition-opacity"
      />

      {/* Slide-over Drawer */}
      <div className="fixed top-4 right-4 bottom-4 w-full sm:w-[480px] bg-white/70 backdrop-blur-xl border border-white/40 shadow-clayCard rounded-[32px] z-50 flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-8 border-b border-white/40 bg-white/40">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-black uppercase tracking-widest text-clay-muted">
                Workspace Details
              </span>
              <h2 
                className="text-2xl font-black text-clay-foreground mt-1"
                style={{ fontFamily: 'var(--font-nunito)' }}
              >
                {formattedDate}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-2.5 rounded-full text-clay-muted hover:text-clay-foreground bg-white shadow-clayButton hover:shadow-clayButtonHover hover:-translate-y-1 active:scale-95 active:shadow-clayPressed transition-all"
              title="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Metrics Badges for this day */}
          <div className="flex items-center gap-3 mt-4">
            <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-gradient-to-br from-[#A78BFA] to-clay-accent text-white shadow-clayButton">
              TOTAL: {workload.totalCount}
            </span>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-3 mt-6 p-1.5 bg-[#EFEBF5]/50 rounded-[20px] shadow-clayPressed">
            <button
              onClick={() => setActiveTab('timeline')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-[16px] transition-all duration-200 ${
                activeTab === 'timeline'
                  ? 'bg-white text-clay-foreground shadow-clayCard'
                  : 'text-clay-muted hover:text-clay-foreground'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>TIMELINE ({workload.events.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('todos')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-[16px] transition-all duration-200 ${
                activeTab === 'todos'
                  ? 'bg-white text-clay-foreground shadow-clayCard'
                  : 'text-clay-muted hover:text-clay-foreground'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>TASKS ({workload.todos.length})</span>
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'timeline' ? (
            <TimelineView
              events={workload.events}
              settings={settings}
              onDeleteEvent={onDeleteEvent}
            />
          ) : (
            <DayTodoList
              dateKey={workload.dateKey}
              todos={workload.todos}
              onToggleTodo={onToggleTodo}
              onAddTodo={onAddTodo}
              onDeleteTodo={onDeleteTodo}
            />
          )}
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 bg-white/40 border-t border-[#dedecf] flex items-center justify-between">
          <button
            onClick={onOpenNewEvent}
            className="flex-1 mr-2 px-3 py-2 bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Meeting / Event
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-white/50 bg-white hover:bg-[#EFEBF5] text-clay-muted text-xs font-semibold rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </>
  );
};

