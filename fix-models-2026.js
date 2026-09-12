const fs = require('fs');
let s = fs.readFileSync('src/components/DailyBriefModal.tsx', 'utf8');

s = s.replace(
  "const models = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-flash-8b'];",
  "const models = ['gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-3.0-flash'];"
);

fs.writeFileSync('src/components/DailyBriefModal.tsx', s);
console.log('Done');
