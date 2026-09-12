const fs = require('fs');
let p = fs.readFileSync('src/app/page.tsx', 'utf8');

// Import DailyBriefModal
if (!p.includes('DailyBriefModal')) {
    p = p.replace(
        "import { NewEventModal } from '@/components/NewEventModal';",
        "import { NewEventModal } from '@/components/NewEventModal';\nimport { DailyBriefModal } from '@/components/DailyBriefModal';"
    );
}

// Add state
if (!p.includes('briefModalOpen')) {
    p = p.replace(
        'const [newEventModalOpen, setNewEventModalOpen] = useState<boolean>(false);',
        'const [newEventModalOpen, setNewEventModalOpen] = useState<boolean>(false);\n  const [briefModalOpen, setBriefModalOpen] = useState<boolean>(false);'
    );
}

// Add to Sidebar
p = p.replace(
    'onOpenSettings={() => setSettingsModalOpen(true)}',
    'onOpenSettings={() => setSettingsModalOpen(true)}\n            onOpenBrief={() => setBriefModalOpen(true)}'
);

// Add Modal Component
const modalStr = `      <DailyBriefModal
        isOpen={briefModalOpen}
        onClose={() => setBriefModalOpen(false)}
        events={events}
        todos={todos}
        settings={settings}
      />
`;
p = p.replace('<NewEventModal', modalStr + '\n      <NewEventModal');

fs.writeFileSync('src/app/page.tsx', p);
