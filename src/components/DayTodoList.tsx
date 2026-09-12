'use client';

import React, { useState } from 'react';
import { CheckCircle2, Circle, Plus, Trash2, Tag, Flag } from 'lucide-react';
import { ToDoItem } from '@/types/calendar';

interface DayTodoListProps {
  dateKey: string;
  todos: ToDoItem[];
  onToggleTodo: (todoId: string) => void;
  onAddTodo: (newTodo: Omit<ToDoItem, 'id'>) => void;
  onDeleteTodo: (todoId: string) => void;
}

export const DayTodoList: React.FC<DayTodoListProps> = ({
  dateKey,
  todos,
  onToggleTodo,
  onAddTodo,
  onDeleteTodo,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTodo({
      title: newTitle.trim(),
      dueDate: dateKey,
      completed: false,
      priority,
      source: 'local',
      tags: ['Daily'],
    });
    setNewTitle('');
  };

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'urgent':
        return 'bg-red-500/10 text-red-600 font-bold';
      case 'high':
        return 'bg-amber-500/10 text-amber-600 font-bold';
      case 'medium':
        return 'bg-clay-sky/10 text-clay-sky font-bold';
      default:
        return 'bg-zinc-100 text-clay-muted border-zinc-200';
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Add Todo input */}
      <form onSubmit={handleAdd} className="flex flex-col gap-2 bg-white/50 p-4 rounded-[24px] border border-white/50 shadow-sm">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Add new task or action item..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="flex-1 bg-[#EFEBF5] px-4 py-3 text-sm font-bold rounded-2xl border-none shadow-clayPressed focus:ring-4 focus:ring-clay-accent/20 focus:bg-white text-clay-foreground transition-all"
          />
          <button
            type="submit"
            disabled={!newTitle.trim()}
            className="px-4 py-3 bg-gradient-to-br from-[#A78BFA] to-clay-accent text-white font-black rounded-2xl shadow-clayButton hover:shadow-clayButtonHover active:scale-95 transition-all disabled:opacity-50"
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>

        <div className="flex items-center justify-between text-[11px] text-clay-muted px-1 font-bold tracking-wider mt-2">
          <span className="flex items-center gap-1">
            <Flag className="w-3 h-3 text-clay-muted" /> Priority:
          </span>
          <div className="flex items-center gap-1">
            {(['low', 'medium', 'high', 'urgent'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`px-2 py-0.5 rounded text-[10px] uppercase font-semibold transition-colors ${
                  priority === p
                    ? 'bg-clay-foreground text-white shadow-clayButton'
                    : 'bg-[#EFEBF5] text-clay-muted hover:bg-white shadow-clayPressed'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </form>

      {/* Todo list */}
      <div className="flex flex-col gap-1.5 max-h-60 overflow-y-auto pr-1">
        {todos.length === 0 ? (
          <div className="text-center py-6 text-xs text-clay-muted/70">
            No tasks scheduled for this day yet.
          </div>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className={`flex items-start justify-between p-2 rounded-lg border transition-all ${
                todo.completed
                  ? 'bg-zinc-100/70 border-zinc-200 text-zinc-400'
                  : 'bg-white border-zinc-200 hover:border-zinc-300 text-clay-foreground shadow-2xs'
              }`}
            >
              <div className="flex items-start gap-2 flex-1 min-w-0">
                <button
                  type="button"
                  onClick={() => onToggleTodo(todo.id)}
                  className="mt-0.5 text-zinc-400 hover:text-clay-accent transition-colors"
                >
                  {todo.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-clay-success" />
                  ) : (
                    <Circle className="w-4 h-4" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-xs font-medium leading-snug break-words ${
                      todo.completed ? 'line-through text-zinc-400' : ''
                    }`}
                  >
                    {todo.title}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded border uppercase font-bold tracking-wider ${getPriorityBadge(
                        todo.priority
                      )}`}
                    >
                      {todo.priority}
                    </span>
                    {todo.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded bg-zinc-100 text-clay-muted border border-zinc-200"
                      >
                        <Tag className="w-2.5 h-2.5" />
                        {tag}
                      </span>
                    ))}
                    {todo.dueTime && (
                      <span className="text-[10px] text-clay-muted font-mono">
                        @{todo.dueTime}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onDeleteTodo(todo.id)}
                className="ml-2 text-zinc-400 hover:text-red-500 transition-colors p-1"
                title="Delete task"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
