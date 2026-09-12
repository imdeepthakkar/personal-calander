const fs = require('fs');
let s = fs.readFileSync('src/components/SettingsModal.tsx', 'utf8');

// Add state for aiApiKey
s = s.replace(
  'const [workingHoursEnd, setWorkingHoursEnd] = useState(settings.workingHoursEnd || 18);',
  'const [workingHoursEnd, setWorkingHoursEnd] = useState(settings.workingHoursEnd || 18);\n  const [aiApiKey, setAiApiKey] = useState(settings.aiApiKey || "");'
);

fs.writeFileSync('src/components/SettingsModal.tsx', s);
