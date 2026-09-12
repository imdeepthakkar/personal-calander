'use client';

import React from 'react';
import {
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
  primaryLabel: string;
  secondaryLabel: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
  onOpenNewEvent,
  onOpenSync,
  onOpenSettings,
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
    <aside className="w-16 sm:w-20 m-4 bg-white/70 shadow-clayCard backdrop-blur-xl border border-white/40 flex flex-col items-center py-6 justify-between h-[calc(100dvh-32px)] rounded-[32px] sticky top-4 z-20 select-none overflow-y-auto no-scrollbar transition-all duration-300">
      {/* Top Section: App Badge & Quick Create */}
      <div className="flex flex-col items-center gap-6">
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
        <button
          onClick={onOpenNewEvent}
          className="w-12 h-12 rounded-[20px] bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] text-white flex items-center justify-center shadow-clayButton hover:shadow-clayButtonHover hover:-translate-y-1 active:scale-[0.92] active:shadow-clayPressed transition-all"
          title="Create New Event or Task"
        >
          <PlusCircle className="w-6 h-6" />
        </button>

        {/* Divider */}
        <div className="w-10 h-[2px] bg-clay-muted/10 rounded-full" />

        {/* Navigation Views */}
        <div className="flex flex-col items-center gap-3">
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
        <div className="w-10 h-[2px] bg-clay-muted/10 rounded-full my-1" />

        {/* Sync & Settings */}
        <div className="flex flex-col items-center gap-3">
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
