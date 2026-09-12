const fs = require('fs');
let s = fs.readFileSync('src/components/DailyBriefModal.tsx', 'utf8');
// Try gemini-2.0-flash which is widely available
s = s.replace(
  'gemini-1.5-flash-latest:generateContent',
  'gemini-2.0-flash:generateContent'
);
fs.writeFileSync('src/components/DailyBriefModal.tsx', s);
console.log('Done');
