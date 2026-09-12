'use client';

import React from 'react';
import {
  Sparkles,
  Calendar as CalendarIcon,
  Clock,
  CheckSquare,
  RefreshCw,
  Settings,
  Globe2,
  PlusCircle,
} from 'lucide-react';

export type AppView = 'matrix' | 'week' | 'todos' | 'sync' | 'settings';

interface SidebarProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  onOpenNewEvent: () => void;
  onOpenSync: () => void;
  onOpenSettings: () => void;
  onOpenBrief: () => void;
  primaryLabel: string;
  secondaryLabel: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
  onOpenNewEvent,
  onOpenSync,
  onOpenSettings,
  onOpenBrief,
  primaryLabel,
  secondaryLabel,
}) => {
  const navItems = [

    {
      id: 'week' as AppView,
      icon: Clock,
      label: 'Week Timeline',
      action: () => onViewChange('week'),
    },
    {
      id: 'todos' as AppView,
      icon: CheckSquare,
      label: 'All Tasks & To-Dos',
      action: () => onViewChange('todos'),
    },
  ];

  return (
    <aside className="fixed bottom-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-xl border-t border-white/40 flex flex-row items-center justify-between px-4 sm:px-6 z-50 md:relative md:w-20 md:m-4 md:bg-white/70 md:shadow-clayCard md:border md:flex-col md:py-6 md:h-[calc(100dvh-32px)] md:rounded-[32px] md:sticky md:top-4 select-none overflow-x-auto overflow-y-hidden md:overflow-y-auto md:overflow-x-hidden no-scrollbar transition-all duration-300">
      {/* Top Section: App Badge & Quick Create */}
      <div className="flex flex-row md:flex-col items-center gap-2 sm:gap-4 md:gap-6">
        {/* Brand / Month Matrix Icon */}
        <div
          onClick={() => onViewChange('matrix')}
          className={`w-12 h-12 rounded-[20px] flex items-center justify-center transition-all cursor-pointer ${
            currentView === 'matrix'
              ? 'bg-[#EFEBF5] text-clay-accent shadow-clayPressed'
              : 'bg-gradient-to-br from-pink-400 to-purple-600 text-white shadow-clayButton hover:shadow-clayButtonHover hover:-translate-y-1 active:scale-[0.92] active:shadow-clayPressed'
          }`}
          title="Month Matrix"
        >
          <CalendarIcon className="w-6 h-6" />
        </div>

                {/* Quick Add Event / Task Button */}
        <div className="flex flex-row md:flex-col gap-2 md:gap-3">
          <button
            onClick={onOpenBrief}
            className="w-12 h-12 rounded-[20px] bg-gradient-to-br from-[#0EA5E9] to-[#38BDF8] text-white flex items-center justify-center shadow-clayButton hover:shadow-clayButtonHover hover:-translate-y-1 active:scale-[0.92] active:shadow-clayPressed transition-all"
            title="Generate Daily Brief"
          >
            <Sparkles className="w-5 h-5" />
          </button>
          <button
            onClick={onOpenNewEvent}
            className="w-12 h-12 rounded-[20px] bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] text-white flex items-center justify-center shadow-clayButton hover:shadow-clayButtonHover hover:-translate-y-1 active:scale-[0.92] active:shadow-clayPressed transition-all"
            title="Create New Event or Task"
          >
            <PlusCircle className="w-6 h-6" />
          </button>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-10 h-[2px] bg-clay-muted/10 rounded-full" />

        {/* Navigation Views */}
        <div className="flex flex-row md:flex-col items-center gap-2 md:gap-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={item.action}
                className={`w-12 h-12 rounded-[20px] flex items-center justify-center transition-all duration-200 ${
                  isActive
                    ? 'bg-[#EFEBF5] text-clay-accent shadow-clayPressed'
                    : 'text-clay-muted hover:bg-white/80 hover:text-clay-foreground hover:-translate-y-1 shadow-sm'
                }`}
                title={item.label}
              >
                <Icon className="w-5 h-5" />
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="hidden md:block w-10 h-[2px] bg-clay-muted/10 rounded-full my-1" />

        {/* Sync & Settings */}
        <div className="flex flex-row md:flex-col items-center gap-2 md:gap-3">
          <button
            onClick={onOpenSync}
            className="w-12 h-12 rounded-[20px] text-clay-muted hover:bg-white/80 hover:text-clay-foreground flex items-center justify-center transition-all duration-200 hover:-translate-y-1 shadow-sm shrink-0"
            title="Sync Calendars"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button
            onClick={onOpenSettings}
            className="w-12 h-12 rounded-[20px] text-clay-muted hover:bg-white/80 hover:text-clay-foreground flex items-center justify-center transition-all duration-200 hover:-translate-y-1 shadow-sm shrink-0"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
