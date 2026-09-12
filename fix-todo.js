const fs = require('fs');
let page = fs.readFileSync('src/app/page.tsx', 'utf8');

// The items inside To-Do Hub
page = page.replace(/className="p-2.5 rounded-lg border border-zinc-200 bg-\[#fafaf7\] flex items-start justify-between"/g, 
  'className="p-4 rounded-[20px] shadow-clayCard border border-white/40 bg-white flex items-start justify-between"');

page = page.replace(/className="text-zinc-400 hover:text-blue-600 mt-0.5"/g, 'className="text-clay-muted hover:text-clay-accent mt-0.5 transition-colors"');
page = page.replace(/<p className="text-xs font-semibold text-zinc-900">/g, '<p className="text-sm font-bold text-clay-foreground">');
page = page.replace(/className="flex items-center gap-1.5 mt-1 text-\[10px\] text-zinc-500"/g, 'className="flex items-center gap-2 mt-1 text-[11px] font-bold text-clay-muted tracking-wider"');
page = page.replace(/className="uppercase px-1.5 rounded bg-zinc-200 text-zinc-700 font-bold"/g, 'className="uppercase px-2 py-0.5 rounded-[8px] bg-[#EFEBF5] text-clay-muted shadow-clayPressed"');
page = page.replace(/className="text-zinc-400 hover:text-red-500 p-1"/g, 'className="text-clay-muted hover:text-red-500 p-1 transition-colors"');

// Fix Completed wrapper that was broken earlier
page = page.replace(/<div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-xs">/g, '<div className="bg-[#EFEBF5]/50 p-6 rounded-[32px] border border-white/50 shadow-clayPressed">');
page = page.replace(/<h3 className="font-bold text-xs uppercase tracking-wider text-zinc-700 mb-3">/g, '<h3 className="font-bold text-xs uppercase tracking-wider text-clay-muted mb-4 flex items-center justify-between">');
page = page.replace(/<h3 className="font-bold text-xs uppercase tracking-wider text-zinc-700 mb-3 flex items-center justify-between">/g, '<h3 className="font-bold text-xs uppercase tracking-wider text-clay-muted mb-4 flex items-center justify-between">');

page = page.replace(/className="text-emerald-600 mt-0.5"/g, 'className="text-clay-success mt-0.5"');
page = page.replace(/className="text-xs font-semibold text-zinc-700 line-through"/g, 'className="text-sm font-bold text-clay-muted line-through"');
page = page.replace(/<span className="text-\[10px\] text-zinc-400">Completed<\/span>/g, '<span className="text-[11px] font-bold text-clay-muted/60 tracking-wider">COMPLETED</span>');

// Add "Add To-Do" input to the pending section
const pendingTitleRegex = /<h3 className="font-bold text-xs uppercase tracking-wider text-clay-muted mb-4 flex items-center justify-between">\s*<span>Pending Tasks \(\{todos\.filter\(\(t\) => !t\.completed\)\.length\}\)<\/span>\s*<\/h3>/;

if (page.match(pendingTitleRegex)) {
  page = page.replace(pendingTitleRegex, `<h3 className="font-bold text-xs uppercase tracking-wider text-clay-muted mb-4 flex items-center justify-between">
                  <span>Pending Tasks ({todos.filter((t) => !t.completed).length})</span>
                </h3>
                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Add new task..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                          handleAddTodo({
                            title: e.currentTarget.value.trim(),
                            dueDate: new Date().toISOString().split('T')[0],
                            completed: false,
                            priority: 'medium',
                            source: 'local',
                            tags: ['Master Hub'],
                          });
                          e.currentTarget.value = '';
                        }
                      }}
                      className="flex-1 bg-white px-4 py-3 text-sm font-bold rounded-2xl border-none shadow-clayCard focus:ring-4 focus:ring-clay-accent/20 focus:bg-white text-clay-foreground transition-all placeholder:text-clay-muted/50"
                    />
                    <button
                      onClick={() => {
                        const input = document.querySelector('input[placeholder="Add new task..."]') as HTMLInputElement;
                        if (input && input.value.trim()) {
                          handleAddTodo({
                            title: input.value.trim(),
                            dueDate: new Date().toISOString().split('T')[0],
                            completed: false,
                            priority: 'medium',
                            source: 'local',
                            tags: ['Master Hub'],
                          });
                          input.value = '';
                        }
                      }}
                      className="px-4 py-3 bg-gradient-to-br from-[#A78BFA] to-clay-accent text-white font-black rounded-2xl shadow-clayButton hover:shadow-clayButtonHover active:scale-95 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>`);
}

// ensure Plus is imported in page.tsx if not
if (!page.includes('Plus,')) {
    page = page.replace(/import {([^}]+)} from 'lucide-react';/, "import { $1, Plus } from 'lucide-react';");
}

fs.writeFileSync('src/app/page.tsx', page);
