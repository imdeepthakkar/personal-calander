'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/Header';
import { CalendarGrid } from '@/components/CalendarGrid';
import { Sidebar, AppView } from '@/components/Sidebar';
import { DayDetailDrawer } from '@/components/DayDetailDrawer';

import { NewEventModal } from '@/components/NewEventModal';
import { DailyBriefModal } from '@/components/DailyBriefModal';
import { NewTaskModal } from '@/components/NewTaskModal';
import { SyncModal } from '@/components/SyncModal';
import { SettingsModal } from '@/components/SettingsModal';
import {
  CalendarEvent,
  ToDoItem,
  DayWorkload,
  UserSettings,
  ICalFeed,
} from '@/types/calendar';
import {
  loadEvents,
  saveEvents,
  loadTodos,
  saveTodos,
  loadUserSettings,
  saveUserSettings,
} from '@/lib/storage';
import { DEFAULT_SETTINGS } from '@/lib/mockData';
import { CheckCircle2, Circle, Clock, Trash2, Video, Plus } from 'lucide-react';
import { formatDualTime } from '@/lib/timezones';

export default function CalendarHome() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 8, 12)); // Fallback static date for SSR
  const [actualToday, setActualToday] = useState<Date>(new Date(2026, 8, 12)); // Fallback static for SSR
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [todos, setTodos] = useState<ToDoItem[]>([]);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // View state
  const [currentView, setCurrentView] = useState<AppView>('matrix');
  const [selectedDateKey, setSelectedDateKey] = useState<string>('2026-09-12');
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [syncModalOpen, setSyncModalOpen] = useState<boolean>(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState<boolean>(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState<boolean>(false);
  const [newEventModalOpen, setNewEventModalOpen] = useState<boolean>(false);
  const [briefModalOpen, setBriefModalOpen] = useState<boolean>(false);

  // Load from IndexedDB on initial mount
  useEffect(() => {
    async function init() {
      try {
        const [loadedSettings, loadedEvents, loadedTodos] = await Promise.all([
          loadUserSettings(),
          loadEvents(),
          loadTodos(),
        ]);
        setSettings(loadedSettings);
        setEvents(loadedEvents);
        setTodos(loadedTodos);

        // Safely set the actual local date on the client side
        const today = new Date();
        setActualToday(today);
        setCurrentDate(today);
        setSelectedDateKey(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`);
      } catch (err) {
        console.error('Failed to initialize storage:', err);
      } finally {
        setIsLoading(false);
      }
    }
    init();

    // Register Service Worker for PWA
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/personal-calendar/sw.js', { scope: '/personal-calendar/' }).catch((err) => {
        console.log('SW registration error:', err);
      });
    }
  }, []);

  // Calculate monthly days grid with day workloads
  const { monthDays, monthTotal, monthTz1Total, monthTz2Total } = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); // 0-indexed (8 = September)

    // First day of month
    const firstDay = new Date(year, month, 1);
    const startWeekday = firstDay.getDay(); // 0=Sun, 1=Mon, 2=Tue...

    // Total days in month
    const lastDay = new Date(year, month + 1, 0);
    const totalDaysInMonth = lastDay.getDate();

    const days: DayWorkload[] = [];
    let grandTotal = 0;
    let grandTz1 = 0;
    let grandTz2 = 0;

    // Previous month filler days for clean grid alignment
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startWeekday - 1; i >= 0; i--) {
      const prevDayNum = prevMonthLastDay - i;
      const prevDate = new Date(year, month - 1, prevDayNum);
      const prevDateKey = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}-${String(prevDayNum).padStart(2, '0')}`;
      days.push({
        date: prevDate,
        dateKey: prevDateKey,
        dayNumber: prevDayNum,
        isCurrentMonth: false,
        isToday: false,
        totalCount: 0,
        tz1Count: 0,
        tz2Count: 0,
        heatLevel: 'zero',
        events: [],
        todos: [],
      });
    }

    // Current month days
    for (let d = 1; d <= totalDaysInMonth; d++) {
      const date = new Date(year, month, d);
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

      // Filter events and todos for this date
      const dayEvents = events.filter((e) => e.startTime.startsWith(dateKey));
      const dayTodos = todos.filter((t) => t.dueDate === dateKey);

      // Separate counts by timezones / tags
      const tz1Items = [
        ...dayEvents.filter((e) => e.timezone === settings.primaryTimezone || !e.timezone),
        ...dayTodos.filter((t) => !t.tags?.includes(settings.secondaryLabel)),
      ];
      const tz2Items = [
        ...dayEvents.filter((e) => e.timezone === settings.secondaryTimezone),
        ...dayTodos.filter((t) => t.tags?.includes(settings.secondaryLabel)),
      ];

      const dayTotal = dayEvents.length + dayTodos.length;
      grandTotal += dayTotal;
      grandTz1 += tz1Items.length;
      grandTz2 += tz2Items.length;

      let heatLevel: DayWorkload['heatLevel'] = 'zero';
      if (dayTotal > 0 && dayTotal <= 5) heatLevel = 'low';
      else if (dayTotal > 5 && dayTotal <= 12) heatLevel = 'medium';
      else if (dayTotal > 12) heatLevel = 'high';

      const isToday = actualToday.toDateString() === date.toDateString();

      days.push({
        date,
        dateKey,
        dayNumber: d,
        isCurrentMonth: true,
        isToday,
        totalCount: dayTotal,
        tz1Count: tz1Items.length,
        tz2Count: tz2Items.length,
        heatLevel,
        events: dayEvents,
        todos: dayTodos,
      });
    }

    // Trailing days to fill the final week row
    const remainder = days.length % 7;
    if (remainder !== 0) {
      const daysToAdd = 7 - remainder;
      for (let j = 1; j <= daysToAdd; j++) {
        const nextDate = new Date(year, month + 1, j);
        const nextDateKey = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}-${String(j).padStart(2, '0')}`;
        days.push({
          date: nextDate,
          dateKey: nextDateKey,
          dayNumber: j,
          isCurrentMonth: false,
          isToday: false,
          totalCount: 0,
          tz1Count: 0,
          tz2Count: 0,
          heatLevel: 'zero',
          events: [],
          todos: [],
        });
      }
    }

    return {
      monthDays: days,
      monthTotal: grandTotal,
      monthTz1Total: grandTz1,
      monthTz2Total: grandTz2,
    };
  }, [currentDate, events, todos, actualToday]);

  // Selected day workload object for drawer
  const selectedWorkload = useMemo(() => {
    return monthDays.find((d) => d.dateKey === selectedDateKey && d.isCurrentMonth) || null;
  }, [monthDays, selectedDateKey]);

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDateKey(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`);
  };

  const handleSelectDay = (workload: DayWorkload) => {
    if (!workload.isCurrentMonth) return;
    setSelectedDateKey(workload.dateKey);
    setDrawerOpen(true);
  };

  // Event & Task actions
  const handleToggleTodo = async (todoId: string) => {
    const updated = todos.map((t) => (t.id === todoId ? { ...t, completed: !t.completed } : t));
    setTodos(updated);
    await saveTodos(updated);
  };

  const handleAddTodo = async (newTodo: Omit<ToDoItem, 'id'>) => {
    const item: ToDoItem = {
      ...newTodo,
      id: `todo-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    const updated = [item, ...todos];
    setTodos(updated);
    await saveTodos(updated);
  };

  const handleDeleteTodo = async (todoId: string) => {
    const updated = todos.filter((t) => t.id !== todoId);
    setTodos(updated);
    await saveTodos(updated);
  };

  const handleAddEvent = async (newEvent: Omit<CalendarEvent, 'id'>) => {
    const evt: CalendarEvent = {
      ...newEvent,
      id: `event-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    const updated = [...events, evt];
    setEvents(updated);
    await saveEvents(updated);
  };

  const handleDeleteEvent = async (eventId: string) => {
    const updated = events.filter((e) => e.id !== eventId);
    setEvents(updated);
    await saveEvents(updated);
  };

  const handleUpdateSettings = async (newSettings: UserSettings) => {
    setSettings(newSettings);
    await saveUserSettings(newSettings);
  };

  const handleImportICalEvents = async (feed: ICalFeed, newEvents: CalendarEvent[]) => {
    const nonFeedEvents = events.filter((e) => e.calendarName !== feed.name);
    const merged = [...nonFeedEvents, ...newEvents];
    setEvents(merged);
    await saveEvents(merged);
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-clay-canvas">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-clay-accent border-t-transparent rounded-full animate-spin" />
          <span 
            className="text-sm font-black text-clay-foreground tracking-widest uppercase"
            style={{ fontFamily: 'var(--font-nunito)' }}
          >
            Loading Calendar
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-clay-canvas text-clay-foreground relative overflow-hidden z-0">
      {/* Animated 3D Floating Blobs Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute h-[60vh] w-[60vh] rounded-full bg-[#8B5CF6]/15 blur-3xl -top-[10%] -left-[10%] animate-clay-float" />
        <div className="absolute h-[50vh] w-[50vh] rounded-full bg-[#EC4899]/10 blur-3xl right-[10%] top-[20%] animate-clay-float-delayed" />
        <div className="absolute h-[70vh] w-[70vh] rounded-full bg-[#0EA5E9]/15 blur-3xl -bottom-[10%] left-[20%] animate-clay-float-slow" />
      </div>
      {/* Left Navigation Ribbon */}
      <Sidebar
        currentView={currentView}
        onViewChange={(view) => setCurrentView(view)}
        onOpenNewEvent={() => setNewEventModalOpen(true)}
        onOpenSync={() => setSyncModalOpen(true)}
        onOpenSettings={() => setSettingsModalOpen(true)}
            onOpenBrief={() => setBriefModalOpen(true)}
        primaryLabel={settings.primaryLabel}
        secondaryLabel={settings.secondaryLabel}
      />

      {/* Main Workspace Area */}
      <main className="flex-1 flex flex-col min-w-0 pb-16">
        {/* View 1: Month Heatmap Matrix (Screenshot 1:1 Layout) */}
        {currentView === 'matrix' && (
          <div className="flex flex-col items-center w-full">
            <Header
              currentDate={currentDate}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              onToday={handleToday}
              totalCount={monthTotal}
              tz1Count={monthTz1Total}
              tz2Count={monthTz2Total}
              settings={settings}
            />

            <CalendarGrid
              days={monthDays}
              selectedDateKey={selectedDateKey}
              settings={settings}
              onSelectDay={handleSelectDay}
            />
          </div>
        )}

        {/* View 2: Week Dual-Timeline View */}
        {currentView === 'week' && (
          <div className="p-6 max-w-5xl mx-auto w-full relative z-10">
            <div className="bg-white/60 backdrop-blur-xl shadow-clayCard border border-white/40 rounded-[48px] p-8">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/50">
                <div>
                  <h2 
                    className="text-3xl font-black text-clay-foreground"
                    style={{ fontFamily: 'var(--font-nunito)' }}
                  >
                    Week Timeline
                  </h2>
                  <p className="text-sm font-medium text-clay-muted mt-1">
                    Daily commitments and scheduled events
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsNewTaskModalOpen(true)}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-br from-[#A78BFA] to-clay-accent shadow-clayButton hover:shadow-clayButtonHover hover:-translate-y-1 active:scale-95 text-sm font-black text-white transition-all flex items-center gap-2 tracking-wide"
                  >
                    <Plus className="w-4 h-4" /> Add Task
                  </button>
                  <button
                    onClick={() => setCurrentView('matrix')}
                    className="px-6 py-3 rounded-2xl bg-white shadow-clayButton hover:shadow-clayButtonHover hover:-translate-y-1 active:scale-95 active:shadow-clayPressed text-sm font-black text-clay-foreground transition-all tracking-wide"
                  >
                    Matrix View
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {monthDays
                .filter((d) => d.isCurrentMonth && d.dayNumber >= 6 && d.dayNumber <= 12)
                .map((day) => (
                  <div
                    key={day.dateKey}
                    onClick={() => {
                      setSelectedDateKey(day.dateKey);
                      setDrawerOpen(true);
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      day.isToday
                        ? 'border-blue-500 bg-blue-50/50 shadow'
                        : 'border-zinc-200 bg-white hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-zinc-800">
                        {new Intl.DateTimeFormat('en-US', { weekday: 'short', day: 'numeric' }).format(day.date)}
                      </span>
                      <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700">
                        {day.totalCount}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      {day.events.slice(0, 3).map((e) => (
                        <div
                          key={e.id}
                          className="p-1.5 rounded text-[11px] font-medium truncate"
                          style={{
                            backgroundColor: `${e.calendarColor}15`,
                            color: e.calendarColor,
                          }}
                        >
                          {e.title}
                        </div>
                      ))}
                      {day.events.length > 3 && (
                        <span className="text-[10px] text-zinc-400">
                          +{day.events.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
          </div>
        )}

        {/* View 3: All Tasks & To-Do Board */}
        {currentView === 'todos' && (
          <div className="p-6 max-w-5xl mx-auto w-full relative z-10">
            <div className="bg-white/60 backdrop-blur-xl shadow-clayCard border border-white/40 rounded-[48px] p-8">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/50">
                <div>
                  <h2 
                    className="text-3xl font-black text-clay-foreground"
                    style={{ fontFamily: 'var(--font-nunito)' }}
                  >
                    To-Do Master Hub
                  </h2>
                  <p className="text-sm font-medium text-clay-muted mt-1">
                    Consolidated action items across all synced accounts
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsNewTaskModalOpen(true)}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-br from-[#A78BFA] to-clay-accent shadow-clayButton hover:shadow-clayButtonHover hover:-translate-y-1 active:scale-95 text-sm font-black text-white transition-all flex items-center gap-2 tracking-wide"
                  >
                    <Plus className="w-4 h-4" /> Add Task
                  </button>
                  <button
                    onClick={() => setCurrentView('matrix')}
                    className="px-6 py-3 rounded-2xl bg-white shadow-clayButton hover:shadow-clayButtonHover hover:-translate-y-1 active:scale-95 active:shadow-clayPressed text-sm font-black text-clay-foreground transition-all tracking-wide"
                  >
                    Matrix View
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pending */}
                <div className="bg-[#EFEBF5]/50 p-6 rounded-[32px] border border-white/50 shadow-clayPressed">
                <h3 className="font-bold text-xs uppercase tracking-wider text-clay-muted mb-4 flex items-center justify-between">
                  <span>Pending Tasks ({todos.filter((t) => !t.completed).length})</span>
                </h3>
                
                <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto">
                  {todos
                    .filter((t) => !t.completed)
                    .map((t) => (
                      <div
                        key={t.id}
                        className="p-4 rounded-[20px] shadow-clayCard border border-white/40 bg-white flex items-start justify-between"
                      >
                        <div className="flex items-start gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleTodo(t.id)}
                            className="text-clay-muted hover:text-clay-accent mt-0.5 transition-colors"
                          >
                            <Circle className="w-4 h-4" />
                          </button>
                          <div>
                            <p className="text-sm font-bold text-clay-foreground">{t.title}</p>
                            <div className="flex items-center gap-2 mt-1 text-[11px] font-bold text-clay-muted tracking-wider">
                              <span>Due: {t.dueDate}</span>
                              <span className="uppercase px-2 py-0.5 rounded-[8px] bg-[#EFEBF5] text-clay-muted shadow-clayPressed">
                                {t.priority}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteTodo(t.id)}
                          className="text-clay-muted hover:text-red-500 p-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                </div>
              </div>

              {/* Completed */}
              <div className="bg-[#EFEBF5]/50 p-6 rounded-[32px] border border-white/50 shadow-clayPressed">
                <h3 className="font-bold text-xs uppercase tracking-wider text-clay-muted mb-4 flex items-center justify-between">
                  Completed Tasks ({todos.filter((t) => t.completed).length})
                </h3>
                <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto">
                  {todos
                    .filter((t) => t.completed)
                    .map((t) => (
                      <div
                        key={t.id}
                        className="p-2.5 rounded-lg border border-zinc-200 bg-zinc-50 flex items-start justify-between opacity-60"
                      >
                        <div className="flex items-start gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleTodo(t.id)}
                            className="text-clay-success mt-0.5"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <div>
                            <p className="text-sm font-bold text-clay-muted line-through">
                              {t.title}
                            </p>
                            <span className="text-[11px] font-bold text-clay-muted/60 tracking-wider">COMPLETED</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteTodo(t.id)}
                          className="text-clay-muted hover:text-red-500 p-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
          </div>
        )}
      </main>

      {/* Sliding Day Detail Drawer */}
      <DayDetailDrawer
        workload={drawerOpen ? selectedWorkload : null}
        settings={settings}
        onClose={() => setDrawerOpen(false)}
        onToggleTodo={handleToggleTodo}
        onAddTodo={handleAddTodo}
        onDeleteTodo={handleDeleteTodo}
        onDeleteEvent={handleDeleteEvent}
        onOpenNewEvent={() => {
          setDrawerOpen(false);
          setNewEventModalOpen(true);
        }}
      />




      {/* New Event Modal */}
            <DailyBriefModal
        isOpen={briefModalOpen}
        onClose={() => setBriefModalOpen(false)}
        events={events}
        todos={todos}
        settings={settings}
      />

      <NewEventModal
        isOpen={newEventModalOpen}
        initialDateKey={selectedDateKey}
        settings={settings}
        onClose={() => setNewEventModalOpen(false)}
        onAddEvent={handleAddEvent}
      />

      {/* Sync & Accounts Modal */}
      <SyncModal
        isOpen={syncModalOpen}
        settings={settings}
        onClose={() => setSyncModalOpen(false)}
        onUpdateSettings={handleUpdateSettings}
        onImportICalEvents={handleImportICalEvents}
      />

      {/* Settings Modal */}
      
      <NewTaskModal
        isOpen={isNewTaskModalOpen}
        settings={settings}
        onClose={() => setIsNewTaskModalOpen(false)}
        onAddTask={handleAddTodo}
      />

      <SettingsModal
        isOpen={settingsModalOpen}
        settings={settings}
        onClose={() => setSettingsModalOpen(false)}
        onSaveSettings={handleUpdateSettings}
      />
    </div>
  );
}


