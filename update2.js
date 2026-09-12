const fs = require('fs');

let bab = fs.readFileSync('src/components/BottomAlertBar.tsx', 'utf8');

// Replace the old beige wrapper
bab = bab.replace('bg-[#faebd7] border-t border-[#e2d5c1]', 'bg-white/70 backdrop-blur-xl border-t border-white/40 shadow-clayCard');

// Replace text colors
bab = bab.replace('text-amber-900', 'text-clay-foreground');
bab = bab.replace('hover:text-amber-950', 'hover:text-clay-accent');
bab = bab.replace('text-amber-700 animate-pulse', 'text-clay-accent animate-pulse');
bab = bab.replace('bg-[#201c34] text-white', 'bg-gradient-to-br from-[#A78BFA] to-clay-accent text-white shadow-clayButton');
bab = bab.replace('bg-[#fbf9f4]', 'bg-white/60 backdrop-blur-xl');
bab = bab.replace('border-[#e2d5c1]', 'border-white/40');
bab = bab.replace('bg-[#f4efe8]', 'bg-white');
bab = bab.replace('border-[#e6ded5]', 'border-white/50');
bab = bab.replace('text-zinc-900', 'text-clay-foreground');
bab = bab.replace('text-amber-600', 'text-clay-accent');
bab = bab.replace(/text-zinc-500/g, 'text-clay-muted');
bab = bab.replace(/text-zinc-400/g, 'text-clay-muted');
bab = bab.replace('border-l border-[#e2d5c1]', 'border-l border-white/40');
bab = bab.replace('text-zinc-700', 'text-clay-muted');
bab = bab.replace('hover:bg-zinc-200', 'hover:bg-[#EFEBF5]');
bab = bab.replace('hover:bg-zinc-100', 'hover:bg-white shadow-clayButton');

// Convert some buttons
bab = bab.replace('bg-white hover:bg-zinc-50', 'bg-white shadow-clayButton hover:shadow-clayButtonHover hover:-translate-y-1 active:scale-95');

fs.writeFileSync('src/components/BottomAlertBar.tsx', bab);
