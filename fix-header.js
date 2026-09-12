const fs = require('fs');
let s = fs.readFileSync('src/components/Header.tsx', 'utf8');

s = s.replace(
  'className="text-4xl font-black tracking-tight text-clay-foreground uppercase mb-2 select-none"',
  'className="text-3xl md:text-4xl font-black tracking-tight text-clay-foreground uppercase mb-2 select-none"'
);

s = s.replace(
  'className="text-2xl font-bold text-clay-foreground tracking-tight min-w-[200px] text-center"',
  'className="text-xl md:text-2xl font-bold text-clay-foreground tracking-tight min-w-[140px] sm:min-w-[160px] md:min-w-[200px] text-center"'
);

s = s.replace(
  'px-4 py-2.5 rounded-[16px] text-sm',
  'px-3 sm:px-4 py-2.5 rounded-[16px] text-xs sm:text-sm'
);

fs.writeFileSync('src/components/Header.tsx', s);
console.log("Done");
