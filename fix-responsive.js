const fs = require('fs');
let s = fs.readFileSync('src/components/DailyBriefModal.tsx', 'utf8');

// Container
s = s.replace(
  'rounded-[48px] shadow-clayCard',
  'rounded-[32px] md:rounded-[48px] shadow-clayCard'
);

// Header
s = s.replace(
  'px-8 py-6 border-b',
  'px-5 py-4 md:px-8 md:py-6 border-b'
);

// Content
s = s.replace(
  'p-8 flex flex-col gap-6',
  'p-5 md:p-8 flex flex-col gap-5 md:gap-6'
);

// AI Box
s = s.replace(
  'rounded-[32px] p-6 relative',
  'rounded-[24px] md:rounded-[32px] p-5 md:p-6 relative'
);

// Footer
s = s.replace(
  'p-6 bg-white/50 border-t',
  'p-5 md:p-6 bg-white/50 border-t'
);

fs.writeFileSync('src/components/DailyBriefModal.tsx', s);
console.log("Done");
