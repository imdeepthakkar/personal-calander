'use client';

import React, { useState } from 'react';
import { X, Settings, Globe, Clock, Type } from 'lucide-react';
import { UserSettings } from '@/types/calendar';
import { POPULAR_TIMEZONES } from '@/lib/timezones';

interface SettingsModalProps {
  isOpen: boolean;
  settings: UserSettings;
  onClose: () => void;
  onSaveSettings: (newSettings: UserSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  settings,
  onClose,
  onSaveSettings,
}) => {
  const [boardTitle, setBoardTitle] = useState(settings.boardTitle || 'HERACLES');
  const [primaryTimezone, setPrimaryTimezone] = useState(settings.primaryTimezone);
  const [primaryLabel, setPrimaryLabel] = useState(settings.primaryLabel);
  const [secondaryTimezone, setSecondaryTimezone] = useState(settings.secondaryTimezone);
  const [secondaryLabel, setSecondaryLabel] = useState(settings.secondaryLabel);
  const [workingHoursStart, setWorkingHoursStart] = useState(settings.workingHoursStart || 9);
  const [workingHoursEnd, setWorkingHoursEnd] = useState(settings.workingHoursEnd || 18);

  if (!isOpen) return null;

  const handlePrimaryChange = (tzValue: string) => {
    setPrimaryTimezone(tzValue);
    const match = POPULAR_TIMEZONES.find((t) => t.value === tzValue);
    if (match) setPrimaryLabel(match.shortLabel);
  };

  const handleSecondaryChange = (tzValue: string) => {
    setSecondaryTimezone(tzValue);
    const match = POPULAR_TIMEZONES.find((t) => t.value === tzValue);
    if (match) setSecondaryLabel(match.shortLabel);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      ...settings,
      boardTitle: boardTitle.trim() || 'HERACLES',
      primaryTimezone,
      primaryLabel: primaryLabel.trim() || 'IST',
      secondaryTimezone,
      secondaryLabel: secondaryLabel.trim() || 'CST',
      workingHoursStart: Number(workingHoursStart),
      workingHoursEnd: Number(workingHoursEnd),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-zinc-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#f4f4ec] border-b border-[#e0e0d6]">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-zinc-700" />
            <h3 className="text-sm font-bold text-zinc-800">
              Board & Dual-Timezone Configuration
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-800 p-1 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-5 flex flex-col gap-4 text-xs">
          {/* Board Title */}
          <div>
            <label className="block text-[11px] font-semibold text-zinc-700 mb-1 flex items-center gap-1">
              <Type className="w-3.5 h-3.5" /> Dashboard Board Title
            </label>
            <input
              type="text"
              required
              value={boardTitle}
              onChange={(e) => setBoardTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:ring-2 focus:ring-blue-500 text-zinc-800 uppercase font-bold"
            />
          </div>

          {/* Primary Timezone */}
          <div className="p-3 bg-[#f8f8f2] rounded-lg border border-zinc-200">
            <label className="block text-[11px] font-semibold text-emerald-800 mb-1 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" /> Primary Timezone (Left Pill & Green Badge)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <select
                value={primaryTimezone}
                onChange={(e) => handlePrimaryChange(e.target.value)}
                className="col-span-2 px-3 py-1.5 rounded border border-zinc-300 bg-white text-zinc-800 text-xs"
              >
                {POPULAR_TIMEZONES.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Label"
                value={primaryLabel}
                onChange={(e) => setPrimaryLabel(e.target.value)}
                className="px-2 py-1.5 rounded border border-zinc-300 bg-white text-zinc-800 font-bold uppercase text-center"
              />
            </div>
          </div>

          {/* Secondary Timezone */}
          <div className="p-3 bg-[#f8f8f2] rounded-lg border border-zinc-200">
            <label className="block text-[11px] font-semibold text-sky-800 mb-1 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" /> Secondary Timezone (Right Pill & Blue Badge)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <select
                value={secondaryTimezone}
                onChange={(e) => handleSecondaryChange(e.target.value)}
                className="col-span-2 px-3 py-1.5 rounded border border-zinc-300 bg-white text-zinc-800 text-xs"
              >
                {POPULAR_TIMEZONES.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Label"
                value={secondaryLabel}
                onChange={(e) => setSecondaryLabel(e.target.value)}
                className="px-2 py-1.5 rounded border border-zinc-300 bg-white text-zinc-800 font-bold uppercase text-center"
              />
            </div>
          </div>

          {/* Working Hours */}
          <div className="p-3 bg-[#f8f8f2] rounded-lg border border-zinc-200">
            <label className="block text-[11px] font-semibold text-zinc-700 mb-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Core Working Hours Window
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-zinc-500">Start (Hour)</span>
                <input
                  type="number"
                  min={0}
                  max={23}
                  value={workingHoursStart}
                  onChange={(e) => setWorkingHoursStart(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded border border-zinc-300 bg-white text-zinc-800"
                />
              </div>
              <div>
                <span className="text-[10px] text-zinc-500">End (Hour)</span>
                <input
                  type="number"
                  min={0}
                  max={23}
                  value={workingHoursEnd}
                  onChange={(e) => setWorkingHoursEnd(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded border border-zinc-300 bg-white text-zinc-800"
                />
              </div>
            </div>
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
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
