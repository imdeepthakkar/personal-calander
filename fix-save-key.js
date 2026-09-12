const fs = require('fs');
let s = fs.readFileSync('src/components/SettingsModal.tsx', 'utf8');

// The save payload is missing aiApiKey — just add it before the closing
s = s.replace(
  'workingHoursEnd: Number(workingHoursEnd),\n    });',
  'workingHoursEnd: Number(workingHoursEnd),\n      aiApiKey: aiApiKey.trim(),\n    });'
);

fs.writeFileSync('src/components/SettingsModal.tsx', s);
console.log('Done');
