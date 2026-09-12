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
      id: 'matrix' as AppView,
      icon: CalendarIcon,
      label: 'Month Matrix',
      action: () => onViewChange('matrix'),
    },
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
    <aside className="w-14 sm:w-16 bg-[#e8e8df] border-r border-[#d8d8ce] flex flex-col items-center py-4 justify-between h-screen sticky top-0 z-20 select-none overflow-y-auto no-scrollbar">
      {/* Top Section: App Badge & Quick Create */}
      <div className="flex flex-col items-center gap-4">
        {/* Brand Icon */}
        <div
          onClick={() => onViewChange('matrix')}
          className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#691864] to-[#261c6a] flex items-center justify-center text-white font-black text-sm shadow-md cursor-pointer hover:opacity-90 transition-transform active:scale-95"
          title="Personal Calendar"
        >
          H
        </div>

        {/* Quick Add Event / Task Button */}
        <button
          onClick={onOpenNewEvent}
          className="w-10 h-10 rounded-xl bg-[#2563eb] text-white flex items-center justify-center shadow hover:bg-blue-700 transition-colors"
          title="Create New Event or Task"
        >
          <PlusCircle className="w-5 h-5" />
        </button>

        {/* Divider */}
        <div className="w-8 h-[1px] bg-[#d0d0c4] my-1" />

        {/* Navigation Views */}
        <div className="flex flex-col items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={item.action}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-[#ffffff] text-zinc-900 shadow-sm border border-zinc-300'
                    : 'text-zinc-600 hover:bg-[#deded4] hover:text-zinc-900'
                }`}
                title={item.label}
              >
                <Icon className="w-5 h-5" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Section: Timezones, Sync & Settings */}
      <div className="flex flex-col items-center gap-3 mt-auto">
        <button
          onClick={onOpenSync}
          className="w-10 h-10 rounded-lg text-zinc-600 hover:bg-[#deded4] hover:text-zinc-900 flex items-center justify-center transition-colors shrink-0"
          title="Sync Calendars"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
        <button
          onClick={onOpenSettings}
          className="w-10 h-10 rounded-lg text-zinc-600 hover:bg-[#deded4] hover:text-zinc-900 flex items-center justify-center transition-colors shrink-0"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
};
