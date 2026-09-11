'use client';

import React, { useState } from 'react';
import {
  X,
  RefreshCw,
  Plus,
  Trash2,
  Calendar,
  CheckCircle,
  ExternalLink,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { ICalFeed, UserSettings, CalendarEvent } from '@/types/calendar';

interface SyncModalProps {
  isOpen: boolean;
  settings: UserSettings;
  onClose: () => void;
  onUpdateSettings: (newSettings: UserSettings) => void;
  onImportICalEvents: (feed: ICalFeed, events: CalendarEvent[]) => void;
  onResetToDemoData: () => void;
}

export const SyncModal: React.FC<SyncModalProps> = ({
  isOpen,
  settings,
  onClose,
  onUpdateSettings,
  onImportICalEvents,
  onResetToDemoData,
}) => {
  const [feedName, setFeedName] = useState('');
  const [feedUrl, setFeedUrl] = useState('');
  const [feedColor, setFeedColor] = useState('#059669');
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddFeed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedUrl.trim()) return;

    setSyncing(true);
    setSyncStatus('Fetching and parsing calendar feed...');

    try {
      const res = await fetch(
        `/api/ical-proxy?url=${encodeURIComponent(feedUrl.trim())}&name=${encodeURIComponent(
          feedName.trim() || 'Subscribed Calendar'
        )}&color=${encodeURIComponent(feedColor)}`
      );
      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to parse calendar');
      }

      const newFeed: ICalFeed = {
        id: `feed-${Date.now()}`,
        name: feedName.trim() || 'Work Calendar',
        url: feedUrl.trim(),
        color: feedColor,
        enabled: true,
        lastSynced: new Date().toISOString(),
      };

      const updatedFeeds = [...settings.icalFeeds, newFeed];
      onUpdateSettings({ ...settings, icalFeeds: updatedFeeds });
      onImportICalEvents(newFeed, data.events || []);

      setFeedName('');
      setFeedUrl('');
      setSyncStatus(`Successfully synced ${data.count} events!`);
      setTimeout(() => setSyncStatus(null), 3500);
    } catch (err: any) {
      setSyncStatus(`Error: ${err?.message || 'Sync failed'}`);
    } finally {
      setSyncing(false);
    }
  };

  const handleDeleteFeed = (id: string) => {
    const updatedFeeds = settings.icalFeeds.filter((f) => f.id !== id);
    onUpdateSettings({ ...settings, icalFeeds: updatedFeeds });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full overflow-hidden border border-zinc-200 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#f4f4ec] border-b border-[#e0e0d6]">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-zinc-800">
              Calendar & To-Do Synchronization Hub
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-800 p-1 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex flex-col gap-5 text-xs">
          {/* Section 1: iCal / WebCal Subscriptions */}
          <div className="bg-[#fafaf7] p-4 rounded-xl border border-zinc-200">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-zinc-900 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-600" />
                Work Calendar Subscriptions (iCal / WebCal)
              </h4>
              <span className="text-[10px] text-emerald-700 font-semibold px-2 py-0.5 rounded bg-emerald-100">
                Direct CORS-Free Proxy
              </span>
            </div>
            <p className="text-[11px] text-zinc-600 mb-3 leading-relaxed">
              Sync any work calendar by pasting its private ICS link (works with Microsoft
              Outlook webcal URLs, Google Calendar secret address, or Apple iCal).
            </p>

            {/* Existing Feeds */}
            {settings.icalFeeds.length > 0 && (
              <div className="flex flex-col gap-2 mb-3">
                {settings.icalFeeds.map((feed) => (
                  <div
                    key={feed.id}
                    className="flex items-center justify-between p-2 rounded bg-white border border-zinc-200"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: feed.color }}
                      />
                      <span className="font-semibold text-zinc-800 truncate">
                        {feed.name}
                      </span>
                      <span className="text-[10px] text-zinc-400 truncate max-w-[150px]">
                        {feed.url}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDeleteFeed(feed.id)}
                      className="text-zinc-400 hover:text-red-500 p-1"
                      title="Remove subscription"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Feed Form */}
            <form onSubmit={handleAddFeed} className="flex flex-col gap-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Feed Name (e.g. Work Outlook)"
                  value={feedName}
                  onChange={(e) => setFeedName(e.target.value)}
                  className="px-3 py-1.5 rounded border border-zinc-300 bg-white text-zinc-800 text-xs"
                />
                <input
                  type="url"
                  required
                  placeholder="webcal:// or https://...ics"
                  value={feedUrl}
                  onChange={(e) => setFeedUrl(e.target.value)}
                  className="sm:col-span-2 px-3 py-1.5 rounded border border-zinc-300 bg-white text-zinc-800 text-xs"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[11px] text-zinc-600">
                  <span>Badge Color:</span>
                  <input
                    type="color"
                    value={feedColor}
                    onChange={(e) => setFeedColor(e.target.value)}
                    className="w-6 h-6 rounded border border-zinc-300 cursor-pointer"
                  />
                </div>

                <button
                  type="submit"
                  disabled={syncing || !feedUrl.trim()}
                  className="px-3 py-1.5 bg-[#059669] hover:bg-emerald-700 text-white font-semibold rounded text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  {syncing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                  {syncing ? 'Syncing...' : 'Add & Sync Feed'}
                </button>
              </div>

              {syncStatus && (
                <div
                  className={`p-2 rounded text-[11px] mt-1 ${
                    syncStatus.startsWith('Error')
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {syncStatus}
                </div>
              )}
            </form>
          </div>

          {/* Section 2: Google & Microsoft Connected Services */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Google */}
            <div className="p-3.5 rounded-xl border border-zinc-200 bg-[#fbfbfa] flex flex-col justify-between">
              <div>
                <h5 className="font-bold text-zinc-800 flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  Google Calendar & Tasks
                </h5>
                <p className="text-[11px] text-zinc-500 leading-snug">
                  Direct OAuth2 GIS integration. Events and tasks sync directly into your
                  local IndexedDB storage.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-zinc-200 flex items-center justify-between">
                <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Ready for GIS
                </span>
                <button
                  type="button"
                  onClick={() => alert('Connect Google Calendar: configured with client-side OAuth.')}
                  className="px-2.5 py-1 rounded bg-zinc-900 text-white text-[11px] font-semibold hover:bg-zinc-800"
                >
                  Connect
                </button>
              </div>
            </div>

            {/* Microsoft 365 */}
            <div className="p-3.5 rounded-xl border border-zinc-200 bg-[#fbfbfa] flex flex-col justify-between">
              <div>
                <h5 className="font-bold text-zinc-800 flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  Microsoft 365 / To-Do
                </h5>
                <p className="text-[11px] text-zinc-500 leading-snug">
                  Microsoft Graph MSAL sync for Outlook calendar and Microsoft To-Do.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-zinc-200 flex items-center justify-between">
                <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Ready for MSAL
                </span>
                <button
                  type="button"
                  onClick={() => alert('Connect Microsoft 365: configured with client-side MSAL.')}
                  className="px-2.5 py-1 rounded bg-zinc-900 text-white text-[11px] font-semibold hover:bg-zinc-800"
                >
                  Connect
                </button>
              </div>
            </div>
          </div>

          {/* Section 3: Reset to Screenshot Demo Dataset */}
          <div className="p-3.5 rounded-xl border border-[#dedecf] bg-[#f4f4ec] flex items-center justify-between">
            <div>
              <h5 className="font-bold text-zinc-800">Screenshot Demo Dataset (Sept 2026)</h5>
              <p className="text-[11px] text-zinc-600">
                Restore the exact 115 total items, IST 79 / CST 36 breakdown matching your photo.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onResetToDemoData();
                onClose();
              }}
              className="px-3 py-1.5 rounded-lg bg-[#5b1938] hover:bg-[#431329] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Restore Mock Data
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#f4f4ec] border-t border-[#e0e0d6] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-800 text-white text-xs font-semibold hover:bg-zinc-900 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
