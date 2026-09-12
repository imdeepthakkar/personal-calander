const fs = require('fs');

// 1. types/calendar.ts
let t = fs.readFileSync('src/types/calendar.ts', 'utf8');
if (!t.includes('aiApiKey')) {
  t = t.replace(
    'useDemoData: boolean;',
    'useDemoData: boolean;\n  aiApiKey?: string;'
  );
  fs.writeFileSync('src/types/calendar.ts', t);
}

// 2. mockData.ts
let m = fs.readFileSync('src/lib/mockData.ts', 'utf8');
if (!m.includes('aiApiKey')) {
  m = m.replace(
    'useDemoData: false,',
    'useDemoData: false,\n  aiApiKey: "",'
  );
  fs.writeFileSync('src/lib/mockData.ts', m);
}
