const fs = require('fs');
let s = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

// Update sidebar classes for mobile (bottom nav) vs desktop (left nav)
const oldSidebarTag = 'aside className="w-16 sm:w-20 m-4 bg-white/70 shadow-clayCard backdrop-blur-xl border border-white/40 flex flex-col items-center py-6 justify-between h-[calc(100dvh-32px)] rounded-[32px] sticky top-4 z-20 select-none overflow-y-auto no-scrollbar transition-all duration-300"';
const newSidebarTag = 'aside className="fixed bottom-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-xl border-t border-white/40 flex flex-row items-center justify-between px-4 sm:px-6 z-50 md:relative md:w-20 md:m-4 md:bg-white/70 md:shadow-clayCard md:border md:flex-col md:py-6 md:h-[calc(100dvh-32px)] md:rounded-[32px] md:sticky md:top-4 select-none overflow-x-auto overflow-y-hidden md:overflow-y-auto md:overflow-x-hidden no-scrollbar transition-all duration-300"';

s = s.replace(oldSidebarTag, newSidebarTag);

// Let's also adjust the flex layout inside the sidebar
s = s.replace(
  '<div className="flex flex-col items-center gap-6">',
  '<div className="flex flex-row md:flex-col items-center gap-2 sm:gap-4 md:gap-6">'
);

s = s.replace(
  '<div className="flex flex-col items-center gap-4">',
  '<div className="flex flex-row md:flex-col items-center gap-1 sm:gap-2 md:gap-4">'
);

s = s.replace(
  '<div className="mt-8 flex flex-col items-center gap-3">',
  '<div className="ml-auto md:ml-0 md:mt-8 flex flex-row md:flex-col items-center gap-2 md:gap-3">'
);

fs.writeFileSync('src/components/Sidebar.tsx', s);
console.log("Done Sidebar");

let p = fs.readFileSync('src/app/page.tsx', 'utf8');
p = p.replace(
  '<div className="flex min-h-screen',
  '<div className="flex flex-col md:flex-row min-h-screen'
);
p = p.replace(
  '<main className="flex-1 flex flex-col min-w-0 pb-16">',
  '<main className="flex-1 flex flex-col min-w-0 pb-24 md:pb-16 w-full">'
);
fs.writeFileSync('src/app/page.tsx', p);
console.log("Done page.tsx");
