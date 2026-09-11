'use client';

import React, { useState } from 'react';
import { X, Calendar as CalendarIcon, Clock, Video, FileText } from 'lucide-react';
import { CalendarEvent, UserSettings } from '@/types/calendar';

interface NewEventModalProps {
  isOpen: boolean;
  initialDateKey: string;
  settings: UserSettings;
  onClose: () => void;
  onAddEvent: (newEvent: Omit<CalendarEvent, 'id'>) => void;
}

export const NewEventModal: React.FC<NewEventModalProps> = ({
  isOpen,
  initialDateKey,
  settings,
  onClose,
  onAddEvent,
}) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(initialDateKey || '2026-09-11');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('11:00');
  const [calendarName, setCalendarName] = useState('Work Google');
  const [meetingUrl, setMeetingUrl] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const startIso = `${date}T${startTime}:00+05:30`;
    const endIso = `${date}T${endTime}:00+05:30`;

    const colors: Record<string, string> = {
      'Work Google': '#2563eb',
      'Office 365': '#7c3aed',
      'Engineering Cal': '#059669',
      'Personal': '#0891b2',
    };

    onAddEvent({
      title: title.trim(),
      startTime: startIso,
      endTime: endIso,
      allDay: false,
      calendarName,
      calendarColor: colors[calendarName] || '#2563eb',
      source: 'local',
      meetingUrl: meetingUrl.trim() || undefined,
      description: description.trim() || undefined,
    });

    setTitle('');
    setMeetingUrl('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-zinc-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#f4f4ec] border-b border-[#e0e0d6]">
          <h3 className="text-sm font-bold text-zinc-800">Create New Event / Meeting</h3>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-800 p-1 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
              Event Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. ICRB Architecture Sync"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-800"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                Calendar
              </label>
              <select
                value={calendarName}
                onChange={(e) => setCalendarName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-800 bg-white"
              >
                <option value="Work Google">Work Google (Gmail)</option>
                <option value="Office 365">Office 365 / Outlook</option>
                <option value="Engineering Cal">Engineering Cal (iCal)</option>
                <option value="Personal">Personal</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                Start Time ({settings.primaryLabel})
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-800"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                End Time ({settings.primaryLabel})
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
              Video Call URL (Google Meet / Teams / Zoom)
            </label>
            <input
              type="url"
              placeholder="https://meet.google.com/..."
              value={meetingUrl}
              onChange={(e) => setMeetingUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-800"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
              Description / Agenda Notes
            </label>
            <textarea
              rows={2}
              placeholder="Optional notes or agenda topics..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-800"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-zinc-300 text-zinc-700 font-semibold hover:bg-zinc-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#2563eb] text-white font-semibold hover:bg-blue-700 shadow-sm transition-colors"
            >
              Save Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
