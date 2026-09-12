const fs = require('fs');

let tdl = fs.readFileSync('src/components/DayTodoList.tsx', 'utf8');
tdl = tdl.replace('bg-[#f4f4ec] p-2.5 rounded-lg border border-[#e0e0d6]', 'bg-white/50 p-4 rounded-[24px] border border-white/50 shadow-sm');
tdl = tdl.replace('bg-white px-3 py-1.5 text-xs rounded border border-zinc-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-zinc-800', 'bg-[#EFEBF5] px-4 py-3 text-sm font-bold rounded-2xl border-none shadow-clayPressed focus:ring-4 focus:ring-clay-accent/20 focus:bg-white text-clay-foreground transition-all');
tdl = tdl.replace('px-3 py-1.5 bg-[#2563eb] hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded flex items-center gap-1 transition-colors', 'px-4 py-3 bg-gradient-to-br from-[#A78BFA] to-clay-accent text-white font-black rounded-2xl shadow-clayButton hover:shadow-clayButtonHover active:scale-95 transition-all disabled:opacity-50');
tdl = tdl.replace('text-zinc-600 px-1', 'text-clay-muted px-1 font-bold tracking-wider mt-2');
tdl = tdl.replace('text-zinc-500', 'text-clay-muted');
tdl = tdl.replace("bg-zinc-800 text-white", "bg-clay-foreground text-white shadow-clayButton");
tdl = tdl.replace("bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-100", "bg-[#EFEBF5] text-clay-muted hover:bg-white shadow-clayPressed");
tdl = tdl.replace('text-zinc-400', 'text-clay-muted/70');
tdl = tdl.replace(/bg-white p-2.5 rounded-lg border border-zinc-200/g, 'bg-white p-4 rounded-[20px] shadow-clayCard border border-white/40');
tdl = tdl.replace(/text-zinc-800/g, 'text-clay-foreground');
tdl = tdl.replace(/text-zinc-500/g, 'text-clay-muted');
tdl = tdl.replace(/text-zinc-600/g, 'text-clay-muted');
tdl = tdl.replace(/text-zinc-700/g, 'text-clay-muted');
tdl = tdl.replace('hover:text-blue-600', 'hover:text-clay-accent');
tdl = tdl.replace('text-emerald-600', 'text-clay-success');
tdl = tdl.replace('bg-emerald-100 text-emerald-800 border-emerald-200', 'bg-clay-success/10 text-clay-success border border-clay-success/20 font-bold');
tdl = tdl.replace('bg-amber-100 text-amber-800 border-amber-200', 'bg-amber-500/10 text-amber-600 border border-amber-500/20 font-bold');
tdl = tdl.replace('bg-indigo-100 text-indigo-800 border-indigo-200', 'bg-indigo-500/10 text-indigo-600 border border-indigo-500/20 font-bold');
tdl = tdl.replace('bg-zinc-100 text-zinc-600 border-zinc-200', 'bg-[#EFEBF5] text-clay-muted font-bold');
tdl = tdl.replace("bg-red-100 text-red-700 border-red-200", "bg-red-500/10 text-red-600 font-bold");
tdl = tdl.replace("bg-amber-100 text-amber-700 border-amber-200", "bg-amber-500/10 text-amber-600 font-bold");
tdl = tdl.replace("bg-blue-100 text-blue-700 border-blue-200", "bg-clay-sky/10 text-clay-sky font-bold");

fs.writeFileSync('src/components/DayTodoList.tsx', tdl);

let bab = fs.readFileSync('src/components/BottomAlertBar.tsx', 'utf8');
bab = bab.replace('bg-[#18181b] text-white', 'bg-white/80 backdrop-blur-xl border-t border-white/40 shadow-clayCard');
bab = bab.replace('text-zinc-400', 'text-clay-muted font-black tracking-widest');
bab = bab.replace(/text-zinc-300/g, 'text-clay-foreground font-bold');
bab = bab.replace(/text-zinc-500/g, 'text-clay-muted');
bab = bab.replace('bg-zinc-800 hover:bg-zinc-700', 'bg-white shadow-clayButton hover:-translate-y-1 active:scale-95 text-clay-foreground font-bold');
bab = bab.replace('bg-blue-600 hover:bg-blue-500', 'bg-gradient-to-br from-[#A78BFA] to-clay-accent text-white shadow-clayButton hover:-translate-y-1 active:scale-95 font-bold');
bab = bab.replace('border-l border-zinc-700/50', 'border-l border-white/50');
bab = bab.replace('bg-amber-500', 'bg-gradient-to-br from-amber-400 to-amber-600 shadow-sm text-white');
bab = bab.replace('border-r border-zinc-700/50', 'border-r border-white/50');
bab = bab.replace('bg-emerald-500', 'bg-clay-success shadow-sm text-white');

fs.writeFileSync('src/components/BottomAlertBar.tsx', bab);
