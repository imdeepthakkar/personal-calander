const fs = require('fs');

let m = fs.readFileSync('src/components/DailyBriefModal.tsx', 'utf8');

m = m.replace('settings: UserSettings;', 'settings: UserSettings;\n  dateKey?: string;');
m = m.replace('settings,\n})', 'settings,\n  dateKey,\n})');

const dateLogic = `
  const todayString = dateKey || '2026-09-12';
  const [year, month, day] = todayString.split('-');
  const displayDate = new Date(Number(year), Number(month) - 1, Number(day));
`;

m = m.replace(
  "  // Use today's date for the brief\n  const todayDate = new Date(2026, 8, 12); // Using the static reference date from page.tsx for consistency\n  const todayString = todayDate.toISOString().split('T')[0];",
  dateLogic
);
m = m.replace("todayDate.toLocaleDateString", "displayDate.toLocaleDateString");

fs.writeFileSync('src/components/DailyBriefModal.tsx', m);

let p = fs.readFileSync('src/app/page.tsx', 'utf8');
p = p.replace(
  '<DailyBriefModal\n        isOpen={briefModalOpen}',
  '<DailyBriefModal\n        dateKey={selectedDateKey}\n        isOpen={briefModalOpen}'
);
fs.writeFileSync('src/app/page.tsx', p);
