const fs = require('fs');
let s = fs.readFileSync('src/components/DailyBriefModal.tsx', 'utf8');

// Go back to v1beta (correct for Gemini API) and use verified model names
s = s.replace(
  "const models = ['gemini-2.0-flash-lite', 'gemini-1.5-flash', 'gemini-1.5-pro'];",
  "const models = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-flash-8b'];"
);
s = s.replace(
  /`https:\/\/generativelanguage\.googleapis\.com\/v1\/models\/\$\{model\}:generateContent/g,
  '`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent'
);

fs.writeFileSync('src/components/DailyBriefModal.tsx', s);
console.log('Done');
