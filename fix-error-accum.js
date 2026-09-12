const fs = require('fs');
let s = fs.readFileSync('src/components/DailyBriefModal.tsx', 'utf8');

s = s.replace(
  'lastError = (errData as any).error?.message || `Model ${model} failed (${res.status})`;',
  'const msg = (errData as any).error?.message || `Model ${model} failed (${res.status})`;\n          lastError += `[${model}: ${msg}] `;'
);

fs.writeFileSync('src/components/DailyBriefModal.tsx', s);
