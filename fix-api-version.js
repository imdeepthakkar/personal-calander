const fs = require('fs');
let s = fs.readFileSync('src/components/DailyBriefModal.tsx', 'utf8');

// Fix: change v1beta to v1 AND update the model list to include newer names
s = s.replace(
  "const models = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'];",
  "const models = ['gemini-2.0-flash-lite', 'gemini-1.5-flash', 'gemini-1.5-pro'];"
);
s = s.replace(
  /`https:\/\/generativelanguage\.googleapis\.com\/v1beta\/models\/\$\{model\}:generateContent/g,
  '`https://generativelanguage.googleapis.com/v1/models/${model}:generateContent'
);

fs.writeFileSync('src/components/DailyBriefModal.tsx', s);
console.log('Done');
