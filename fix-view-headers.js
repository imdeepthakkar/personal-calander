const fs = require('fs');
let s = fs.readFileSync('src/app/page.tsx', 'utf8');

s = s.replace(
  /<div className="flex items-center justify-between mb-8 pb-4 border-b border-white\/50">/g,
  '<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 pb-4 border-b border-white/50">'
);

fs.writeFileSync('src/app/page.tsx', s);
console.log("Done");
