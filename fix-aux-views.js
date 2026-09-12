const fs = require('fs');
let s = fs.readFileSync('src/app/page.tsx', 'utf8');

s = s.replace(
  /<div className="p-6 max-w-6xl/g,
  '<div className="p-3 sm:p-6 max-w-6xl'
);
s = s.replace(
  /<div className="p-6 max-w-5xl/g,
  '<div className="p-3 sm:p-6 max-w-5xl'
);
s = s.replace(
  /rounded-\[48px\] p-8/g,
  'rounded-[32px] md:rounded-[48px] p-4 sm:p-6 md:p-8'
);

fs.writeFileSync('src/app/page.tsx', s);
console.log("Done");
