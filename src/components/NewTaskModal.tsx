'use client';

import React, { useState } from 'react';
import { X, Calendar as CalendarIcon, Type, User } from 'lucide-react';
import { ToDoItem, UserSettings } from '@/types/calendar';

interface NewTaskModalProps {
  isOpen: boolean;
  settings: UserSettings;
  onClose: () => void;
  onAddTask: (newTask: Omit<ToDoItem, 'id'>) => void;
}

export const NewTaskModal: React.FC<NewTaskModalProps> = ({
  isOpen,
  settings,
  onClose,
  onAddTask,
}) => {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [assignee, setAssignee] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      dueDate,
      completed: false,
      priority,
      source: 'local',
      tags: assignee.trim() ? [`Assignee: ${assignee.trim()}`] : ['Master Hub'],
    });

    setTitle('');
    setAssignee('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-clay-foreground/10 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white/70 backdrop-blur-xl rounded-[48px] shadow-clayCard max-w-md w-full overflow-hidden border border-white/40 animate-in fade-in zoom-in-95 duration-300 scale-95">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/40 bg-white/40">
          <h3 
            className="text-xl font-black text-clay-foreground"
            style={{ fontFamily: 'var(--font-nunito)' }}
          >
            Create New Task
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white shadow-clayButton hover:shadow-clayButtonHover hover:-translate-y-1 active:scale-95 active:shadow-clayPressed text-clay-muted hover:text-clay-foreground transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-6 text-sm bg-white/40">
          <div>
            <label className="block text-xs font-black text-clay-muted uppercase tracking-wider mb-2 flex items-center gap-2">
              <Type className="w-4 h-4" /> Task Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Prepare Q3 presentation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl bg-[#EFEBF5] border-none focus:ring-4 focus:ring-clay-accent/20 focus:bg-white text-clay-foreground font-black text-sm shadow-clayPressed transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-clay-muted uppercase tracking-wider mb-2 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" /> Due Date
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-[#EFEBF5] border-none focus:ring-4 focus:ring-clay-accent/20 focus:bg-white text-clay-foreground font-black text-sm shadow-clayPressed transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-clay-muted uppercase tracking-wider mb-2 flex items-center gap-2">
                <User className="w-4 h-4" /> Assignee
              </label>
              <input
                type="text"
                placeholder="Optional"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-[#EFEBF5] border-none focus:ring-4 focus:ring-clay-accent/20 focus:bg-white text-clay-foreground font-black text-sm shadow-clayPressed transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-clay-muted uppercase tracking-wider mb-2">
              Priority Level
            </label>
            <div className="flex gap-2">
              {(['low', 'medium', 'high', 'urgent'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`flex-1 py-3 rounded-2xl text-[10px] sm:text-xs font-black uppercase transition-all duration-200 ${
                    priority === p
                      ? 'bg-clay-foreground text-white shadow-clayButton hover:-translate-y-1 active:scale-95'
                      : 'bg-[#EFEBF5] text-clay-muted shadow-clayPressed hover:bg-white hover:text-clay-foreground'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 rounded-[20px] bg-white text-clay-muted font-black tracking-widest uppercase shadow-clayButton hover:shadow-clayButtonHover hover:-translate-y-1 active:scale-95 active:shadow-clayPressed transition-all"
              style={{ fontFamily: 'var(--font-nunito)' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-4 rounded-[20px] bg-gradient-to-br from-[#A78BFA] to-clay-accent text-white font-black tracking-widest uppercase shadow-clayButton hover:shadow-clayButtonHover hover:-translate-y-1 active:scale-95 active:shadow-clayPressed transition-all"
              style={{ fontFamily: 'var(--font-nunito)' }}
            >
              Save Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
