const fs = require('fs');
let s = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

// Add onOpenBrief to Props
s = s.replace(
  'onOpenSettings: () => void;',
  'onOpenSettings: () => void;\n  onOpenBrief: () => void;'
);
s = s.replace(
  'onOpenSettings,\n  primaryLabel,',
  'onOpenSettings,\n  onOpenBrief,\n  primaryLabel,'
);

// Add Sparkles to lucide-react import
s = s.replace(
  'import {',
  'import {\n  Sparkles,'
);

// Add the button next to the PlusCircle button (or below it)
const btnReplacement = `        {/* Quick Add Event / Task Button */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onOpenBrief}
            className="w-12 h-12 rounded-[20px] bg-gradient-to-br from-[#0EA5E9] to-[#38BDF8] text-white flex items-center justify-center shadow-clayButton hover:shadow-clayButtonHover hover:-translate-y-1 active:scale-[0.92] active:shadow-clayPressed transition-all"
            title="Generate Daily Brief"
          >
            <Sparkles className="w-5 h-5" />
          </button>
          <button
            onClick={onOpenNewEvent}
            className="w-12 h-12 rounded-[20px] bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] text-white flex items-center justify-center shadow-clayButton hover:shadow-clayButtonHover hover:-translate-y-1 active:scale-[0.92] active:shadow-clayPressed transition-all"
            title="Create New Event or Task"
          >
            <PlusCircle className="w-6 h-6" />
          </button>
        </div>`;

s = s.replace(/\{\/\* Quick Add Event \/ Task Button \*\/\}[\s\S]*?<\/button>/, btnReplacement);

fs.writeFileSync('src/components/Sidebar.tsx', s);
