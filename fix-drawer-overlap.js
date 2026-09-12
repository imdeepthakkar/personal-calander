const fs = require('fs');
let s = fs.readFileSync('src/components/DayDetailDrawer.tsx', 'utf8');

s = s.replace(
  'fixed top-4 right-4 bottom-4 left-4',
  'fixed top-4 right-4 bottom-24 md:bottom-4 left-4'
);

fs.writeFileSync('src/components/DayDetailDrawer.tsx', s);
console.log("Done");
