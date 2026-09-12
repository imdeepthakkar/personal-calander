const fs = require('fs');
let s = fs.readFileSync('src/components/CalendarGrid.tsx', 'utf8');

s = s.replace(
  'rounded-[48px] p-4 sm:p-6',
  'rounded-[32px] md:rounded-[48px] p-2 sm:p-4 md:p-6'
);

s = s.replace(
  'text-[11px] font-black text-clay-muted/50 tracking-widest',
  'text-[9px] sm:text-[11px] font-black text-clay-muted/50 tracking-widest'
);

s = s.replace(
  'text-[11px] font-black text-clay-muted tracking-widest',
  'text-[9px] sm:text-[11px] font-black text-clay-muted tracking-widest'
);

s = s.replace(
  'gap-2 sm:gap-3',
  'gap-1 sm:gap-2 md:gap-3'
);

fs.writeFileSync('src/components/CalendarGrid.tsx', s);
console.log("Done");
