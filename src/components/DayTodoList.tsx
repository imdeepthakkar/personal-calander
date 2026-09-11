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
        return 'bg-red-100 text-red-700 border-red-200';
      case 'high':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'medium':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-zinc-100 text-zinc-600 border-zinc-200';
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Add Todo input */}
      <form onSubmit={handleAdd} className="flex flex-col gap-2 bg-[#f4f4ec] p-2.5 rounded-lg border border-[#e0e0d6]">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Add new task or action item..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="flex-1 bg-white px-3 py-1.5 text-xs rounded border border-zinc-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-zinc-800"
          />
          <button
            type="submit"
            disabled={!newTitle.trim()}
            className="px-3 py-1.5 bg-[#2563eb] hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>

        <div className="flex items-center justify-between text-[11px] text-zinc-600 px-1">
          <span className="flex items-center gap-1">
            <Flag className="w-3 h-3 text-zinc-500" /> Priority:
          </span>
          <div className="flex items-center gap-1">
            {(['low', 'medium', 'high', 'urgent'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`px-2 py-0.5 rounded text-[10px] uppercase font-semibold transition-colors ${
                  priority === p
                    ? 'bg-zinc-800 text-white'
                    : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-100'
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
          <div className="text-center py-6 text-xs text-zinc-400">
            No tasks scheduled for this day yet.
          </div>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className={`flex items-start justify-between p-2 rounded-lg border transition-all ${
                todo.completed
                  ? 'bg-zinc-100/70 border-zinc-200 text-zinc-400'
                  : 'bg-white border-zinc-200 hover:border-zinc-300 text-zinc-800 shadow-2xs'
              }`}
            >
              <div className="flex items-start gap-2 flex-1 min-w-0">
                <button
                  type="button"
                  onClick={() => onToggleTodo(todo.id)}
                  className="mt-0.5 text-zinc-400 hover:text-blue-600 transition-colors"
                >
                  {todo.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
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
                        className="flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200"
                      >
                        <Tag className="w-2.5 h-2.5" />
                        {tag}
                      </span>
                    ))}
                    {todo.dueTime && (
                      <span className="text-[10px] text-zinc-500 font-mono">
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
