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
  const [boardTitle, setBoardTitle] = useState(settings.boardTitle || 'PERSONAL CALENDAR');
  const [primaryTimezone, setPrimaryTimezone] = useState(settings.primaryTimezone);
  const [primaryLabel, setPrimaryLabel] = useState(settings.primaryLabel);
  const [secondaryTimezone, setSecondaryTimezone] = useState(settings.secondaryTimezone);
  const [secondaryLabel, setSecondaryLabel] = useState(settings.secondaryLabel);
  const [workingHoursStart, setWorkingHoursStart] = useState(settings.workingHoursStart || 9);
  const [workingHoursEnd, setWorkingHoursEnd] = useState(settings.workingHoursEnd || 18);
  const [aiApiKey, setAiApiKey] = useState(settings.aiApiKey || "");

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
      boardTitle: boardTitle.trim() || 'PERSONAL CALENDAR',
      primaryTimezone,
      primaryLabel: primaryLabel.trim() || 'LOCAL',
      secondaryTimezone,
      secondaryLabel: secondaryLabel.trim() || 'REMOTE',
      workingHoursStart: Number(workingHoursStart),
      workingHoursEnd: Number(workingHoursEnd),
      aiApiKey: aiApiKey.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-clay-foreground/10 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white/70 backdrop-blur-xl rounded-[36px] shadow-clayCard max-w-md scale-90 w-full overflow-hidden border border-white/40 animate-in fade-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/40 bg-white/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-[#EFEBF5] shadow-clayPressed text-clay-accent">
              <Settings className="w-5 h-5" />
            </div>
            <h3 
              className="text-xl font-black text-clay-foreground"
              style={{ fontFamily: 'var(--font-nunito)' }}
            >
              Board Configuration
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white shadow-clayButton hover:shadow-clayButtonHover hover:-translate-y-1 active:scale-95 active:shadow-clayPressed text-clay-muted hover:text-clay-foreground transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 flex flex-col gap-4 text-xs text-sm bg-white/40">
          <div>
            <label className="block text-xs font-black text-clay-muted uppercase tracking-wider mb-2 flex items-center gap-2">
              <Type className="w-4 h-4" /> Dashboard Board Title
            </label>
            <input
              type="text"
              required
              value={boardTitle}
              onChange={(e) => setBoardTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-[#EFEBF5] border-none focus:ring-4 focus:ring-clay-accent/20 focus:bg-white text-clay-foreground uppercase font-black text-lg shadow-clayPressed transition-all"
            />
          </div>

          <div className="p-5 bg-white/50 rounded-[24px] border border-white/50 shadow-sm">
            <label className="block text-xs font-black text-clay-success uppercase tracking-wider mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4" /> Primary Timezone (Left Pill & Green Badge)
            </label>
            <div className="grid grid-cols-3 gap-3">
              <select
                value={primaryTimezone}
                onChange={(e) => handlePrimaryChange(e.target.value)}
                className="col-span-2 px-4 py-3 rounded-2xl bg-[#EFEBF5] border-none text-clay-foreground text-sm font-bold shadow-clayPressed focus:ring-4 focus:ring-clay-success/20 focus:bg-white transition-all"
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
                className="px-3 py-3 rounded-2xl bg-[#EFEBF5] border-none text-clay-foreground font-black uppercase text-center shadow-clayPressed focus:ring-4 focus:ring-clay-success/20 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="p-5 bg-white/50 rounded-[24px] border border-white/50 shadow-sm">
            <label className="block text-xs font-black text-clay-sky uppercase tracking-wider mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4" /> Secondary Timezone (Right Pill & Blue Badge)
            </label>
            <div className="grid grid-cols-3 gap-3">
              <select
                value={secondaryTimezone}
                onChange={(e) => handleSecondaryChange(e.target.value)}
                className="col-span-2 px-4 py-3 rounded-2xl bg-[#EFEBF5] border-none text-clay-foreground text-sm font-bold shadow-clayPressed focus:ring-4 focus:ring-clay-sky/20 focus:bg-white transition-all"
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
                className="px-3 py-3 rounded-2xl bg-[#EFEBF5] border-none text-clay-foreground font-black uppercase text-center shadow-clayPressed focus:ring-4 focus:ring-clay-sky/20 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="p-5 bg-white/50 rounded-[24px] border border-white/50 shadow-sm">
            <label className="block text-xs font-black text-clay-muted uppercase tracking-wider mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Core Working Hours Window
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-bold text-clay-muted mb-2 block">Start (Hour)</span>
                <input
                  type="number"
                  min={0}
                  max={23}
                  value={workingHoursStart}
                  onChange={(e) => setWorkingHoursStart(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl bg-[#EFEBF5] border-none text-clay-foreground text-sm font-black text-center shadow-clayPressed focus:ring-4 focus:ring-clay-accent/20 focus:bg-white transition-all"
                />
              </div>
              <div>
                <span className="text-xs font-bold text-clay-muted mb-2 block">End (Hour)</span>
                <input
                  type="number"
                  min={0}
                  max={23}
                  value={workingHoursEnd}
                  onChange={(e) => setWorkingHoursEnd(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl bg-[#EFEBF5] border-none text-clay-foreground text-sm font-black text-center shadow-clayPressed focus:ring-4 focus:ring-clay-accent/20 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          <div className="p-5 bg-white/50 rounded-[24px] border border-white/50 shadow-sm">
            <label className="block text-xs font-black text-clay-muted uppercase tracking-wider mb-3 flex items-center gap-2">
              <Settings className="w-4 h-4" /> Gemini AI Key (Optional)
            </label>
            <input
              type="password"
              placeholder="Paste Google Gemini API Key here"
              value={aiApiKey}
              onChange={(e) => setAiApiKey(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-[#EFEBF5] border-none text-clay-foreground text-sm font-bold shadow-clayPressed focus:ring-4 focus:ring-clay-accent/20 focus:bg-white transition-all"
            />
            <p className="text-[10px] text-clay-muted font-bold mt-2 leading-tight">
              If provided, the Daily Briefing will use Gemini to generate a truly dynamic summary. Your key is stored securely in your browser's local database and never sent to our servers.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 rounded-[20px] bg-gradient-to-br from-[#A78BFA] to-clay-accent text-white font-black tracking-widest uppercase shadow-clayButton hover:shadow-clayButtonHover hover:-translate-y-1 active:scale-95 active:shadow-clayPressed transition-all"
              style={{ fontFamily: 'var(--font-nunito)' }}
            >
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

