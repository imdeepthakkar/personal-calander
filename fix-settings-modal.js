const fs = require('fs');
let s = fs.readFileSync('src/components/SettingsModal.tsx', 'utf8');

// 1. Add state for aiApiKey
s = s.replace(
  'const [workingHoursEnd, setWorkingHoursEnd] = useState(settings.workingHoursEnd);',
  'const [workingHoursEnd, setWorkingHoursEnd] = useState(settings.workingHoursEnd);\n  const [aiApiKey, setAiApiKey] = useState(settings.aiApiKey || "");'
);

// 2. Add aiApiKey to the saved payload
s = s.replace(
  'workingHoursEnd,\n    });',
  'workingHoursEnd,\n      aiApiKey,\n    });'
);

// 3. Add the UI block
const uiBlock = `          <div className="p-5 bg-white/50 rounded-[24px] border border-white/50 shadow-sm">
            <label className="block text-xs font-black text-clay-muted uppercase tracking-wider mb-3 flex items-center gap-2">
              <Settings className="w-4 h-4" /> Gemini AI Key (Optional)
            </label>
            <input
              type="password"
              placeholder="Paste Google Gemini API Key here"
              value={aiApiKey}
              onChange={(e) => setAiApiKey(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-[#EFEBF5] border-none text-clay-foreground text-sm font-bold shadow-clayPressed focus:ring-4 focus:ring-clay-accent/20 focus:bg-white transition-all"
            />
            <p className="text-[10px] text-clay-muted font-bold mt-2 leading-tight">
              If provided, the Daily Briefing will use Gemini to generate a truly dynamic summary. Your key is stored securely in your browser's local database and never sent to our servers.
            </p>
          </div>

          <div className="pt-2">`;

s = s.replace('          <div className="pt-2">', uiBlock);

fs.writeFileSync('src/components/SettingsModal.tsx', s);
