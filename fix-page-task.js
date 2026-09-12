const fs = require('fs');
let page = fs.readFileSync('src/app/page.tsx', 'utf8');

// Import NewTaskModal
if (!page.includes('NewTaskModal')) {
    page = page.replace(
        "import { NewEventModal } from '@/components/NewEventModal';",
        "import { NewEventModal } from '@/components/NewEventModal';\nimport { NewTaskModal } from '@/components/NewTaskModal';"
    );
}

// Add state
if (!page.includes('isNewTaskModalOpen')) {
    page = page.replace(
        'const [settingsModalOpen, setSettingsModalOpen] = useState<boolean>(false);',
        'const [settingsModalOpen, setSettingsModalOpen] = useState<boolean>(false);\n  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState<boolean>(false);'
    );
}

// Remove the inline block I added earlier
const inlineBlockRegex = /<div className="mb-4">\s*<div className="flex items-center gap-2">[\s\S]*?<\/div>\s*<\/div>/;
page = page.replace(inlineBlockRegex, '');

// Add the 'Add New Task' button to the header of the To-Do Hub
const headerRegex = /<button\s*onClick=\{\(\) => setCurrentView\('matrix'\)\}\s*className="px-4 py-2 rounded-2xl bg-white shadow-clayButton hover:shadow-clayButtonHover hover:-translate-y-1 active:scale-95 active:shadow-clayPressed text-sm font-bold text-clay-foreground transition-all"\s*>\s*Back to Matrix View\s*<\/button>/;

const newHeader = `<div className="flex gap-3">
                  <button
                    onClick={() => setIsNewTaskModalOpen(true)}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-br from-[#A78BFA] to-clay-accent shadow-clayButton hover:shadow-clayButtonHover hover:-translate-y-1 active:scale-95 text-sm font-black text-white transition-all flex items-center gap-2 tracking-wide"
                  >
                    <Plus className="w-4 h-4" /> Add Task
                  </button>
                  <button
                    onClick={() => setCurrentView('matrix')}
                    className="px-6 py-3 rounded-2xl bg-white shadow-clayButton hover:shadow-clayButtonHover hover:-translate-y-1 active:scale-95 active:shadow-clayPressed text-sm font-black text-clay-foreground transition-all tracking-wide"
                  >
                    Matrix View
                  </button>
                </div>`;
page = page.replace(headerRegex, newHeader);

// Add the modal component at the end of the return statement before the final closing tag
const modalJSX = `
      <NewTaskModal
        isOpen={isNewTaskModalOpen}
        settings={settings}
        onClose={() => setIsNewTaskModalOpen(false)}
        onAddTask={handleAddTodo}
      />
`;
page = page.replace('<SettingsModal', modalJSX + '\n      <SettingsModal');

fs.writeFileSync('src/app/page.tsx', page);
