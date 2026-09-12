const fs = require('fs');
let s = fs.readFileSync('src/components/DayDetailDrawer.tsx', 'utf8');

s = s.replace(
  'fixed top-4 right-4 bottom-4 w-full sm:w-[480px]',
  'fixed top-4 right-4 bottom-4 left-4 sm:left-auto w-[calc(100%-2rem)] sm:w-[480px]'
);

fs.writeFileSync('src/components/DayDetailDrawer.tsx', s);
console.log("Done");
