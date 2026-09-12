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
        className="fixed inset-0 bg-black/30 backdrop-blur-2xs z-40 transition-opacity"
      />

      {/* Slide-over Drawer */}
      <div className="fixed top-0 right-0 bottom-0 w-full sm:w-[480px] bg-[#fbfbf7] border-l border-[#e4e4d8] shadow-2xl z-50 flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-5 bg-[#f0f0e6] border-b border-[#dedecf]">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                Daily Workspace Breakdown
              </span>
              <h2 className="text-base font-bold text-zinc-900 mt-0.5">
                {formattedDate}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200 transition-colors"
              title="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Metrics Badges for this day */}
          <div className="flex items-center gap-2 mt-3">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#7a1236] text-white">
              Total: {workload.totalCount}
            </span>

          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => setActiveTab('timeline')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'timeline'
                  ? 'bg-white text-zinc-900 shadow-sm border border-zinc-300'
                  : 'text-zinc-600 hover:bg-zinc-200/60'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Timeline ({workload.events.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('todos')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'todos'
                  ? 'bg-white text-zinc-900 shadow-sm border border-zinc-300'
                  : 'text-zinc-600 hover:bg-zinc-200/60'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>To-Dos ({workload.todos.length})</span>
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
        <div className="p-4 bg-[#f0f0e6] border-t border-[#dedecf] flex items-center justify-between">
          <button
            onClick={onOpenNewEvent}
            className="flex-1 mr-2 px-3 py-2 bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Meeting / Event
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-zinc-300 bg-white hover:bg-zinc-100 text-zinc-700 text-xs font-semibold rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </>
  );
};
