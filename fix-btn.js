const fs = require('fs');
let p = fs.readFileSync('src/app/page.tsx', 'utf8');

// The exact string to replace in View 3
const oldBtn = `<button
                  onClick={() => setCurrentView('matrix')}
                  className="px-4 py-2 rounded-2xl bg-white shadow-clayButton hover:shadow-clayButtonHover hover:-translate-y-1 active:scale-95 active:shadow-clayPressed text-sm font-bold text-clay-foreground transition-all"
                >
                  Back to Matrix View
                </button>`;

const newBtns = `<div className="flex gap-3">
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
                </div>`;

p = p.replace(oldBtn, newBtns);
fs.writeFileSync('src/app/page.tsx', p);
