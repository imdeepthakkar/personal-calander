const fs = require('fs');
let s = fs.readFileSync('src/components/SettingsModal.tsx', 'utf8');

// Replace the closing of the save payload to inject aiApiKey
// Using indexOf + slice to avoid regex/CRLF issues
const marker = 'workingHoursEnd: Number(workingHoursEnd),';
const idx = s.indexOf(marker);
if (idx === -1) { console.error('marker not found'); process.exit(1); }

// Insert aiApiKey line after workingHoursEnd line
const insertAfter = idx + marker.length;
s = s.slice(0, insertAfter) + '\n      aiApiKey: aiApiKey.trim(),' + s.slice(insertAfter);

fs.writeFileSync('src/components/SettingsModal.tsx', s);
console.log('Done! aiApiKey injected at index', insertAfter);
