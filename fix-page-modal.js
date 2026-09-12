const fs = require('fs');
let p = fs.readFileSync('src/app/page.tsx', 'utf8');

// Replace the misaligned DailyBriefModal block + comment cleanly
const old = `      {/* New Event Modal */}\r\n            <DailyBriefModal\r\n        dateKey={selectedDateKey}\r\n        isOpen={briefModalOpen}\r\n        onClose={() => setBriefModalOpen(false)}\r\n        events={events}\r\n        todos={todos}\r\n        settings={settings}\r\n      />\r\n\r\n      <NewEventModal`;

const replacement = `      {/* Daily Brief Modal */}\r\n      <DailyBriefModal\r\n        dateKey={selectedDateKey}\r\n        isOpen={briefModalOpen}\r\n        onClose={() => setBriefModalOpen(false)}\r\n        events={events}\r\n        todos={todos}\r\n        settings={settings}\r\n      />\r\n\r\n      {/* New Event Modal */}\r\n      <NewEventModal`;

if (p.includes(old)) {
  p = p.replace(old, replacement);
  fs.writeFileSync('src/app/page.tsx', p);
  console.log('Done!');
} else {
  // Fallback — try with LF only
  const old2 = old.replace(/\r\n/g, '\n');
  const rep2 = replacement.replace(/\r\n/g, '\n');
  if (p.includes(old2)) {
    p = p.replace(old2, rep2);
    fs.writeFileSync('src/app/page.tsx', p);
    console.log('Done with LF!');
  } else {
    console.error('Pattern not found!');
    console.log(JSON.stringify(p.substring(p.indexOf('DailyBriefModal') - 20, p.indexOf('DailyBriefModal') + 200)));
  }
}
