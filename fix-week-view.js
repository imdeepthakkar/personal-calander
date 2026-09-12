const fs = require('fs');
let p = fs.readFileSync('src/app/page.tsx', 'utf8');

const weekStart = `        {/* View 2: Week Dual-Timeline View */}`;
const weekEnd = `        {/* View 3: All Tasks & To-Do Board */}`;

const weekStartIdx = p.indexOf(weekStart);
const weekEndIdx = p.indexOf(weekEnd);

if (weekStartIdx === -1 || weekEndIdx === -1) {
  console.error('Could not find week view markers');
  process.exit(1);
}

const correctWeekView = `        {/* View 2: Week Dual-Timeline View */}
        {currentView === 'week' && (
          <div className="p-6 max-w-6xl mx-auto w-full relative z-10">
            <div className="bg-white/60 backdrop-blur-xl shadow-clayCard border border-white/40 rounded-[48px] p-8">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/50">
                <div>
                  <h2 
                    className="text-3xl font-black text-clay-foreground"
                    style={{ fontFamily: 'var(--font-nunito)' }}
                  >
                    Week Timeline
                  </h2>
                  <p className="text-sm font-medium text-clay-muted mt-1">
                    Daily commitments and scheduled events
                  </p>
                </div>
                <button
                  onClick={() => setCurrentView('matrix')}
                  className="px-4 py-2 rounded-2xl bg-white shadow-clayButton hover:shadow-clayButtonHover hover:-translate-y-1 active:scale-95 active:shadow-clayPressed text-sm font-bold text-clay-foreground transition-all"
                >
                  Back to Matrix View
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {monthDays
                .filter((d) => d.isCurrentMonth && d.dayNumber >= 6 && d.dayNumber <= 12)
                .map((day) => (
                  <div
                    key={day.dateKey}
                    onClick={() => {
                      setSelectedDateKey(day.dateKey);
                      setDrawerOpen(true);
                    }}
                    className={\`p-3 rounded-xl border transition-all cursor-pointer \${
                      day.isToday
                        ? 'border-blue-500 bg-blue-50/50 shadow'
                        : 'border-zinc-200 bg-white hover:border-zinc-300'
                    }\`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-zinc-800">
                        {new Intl.DateTimeFormat('en-US', { weekday: 'short', day: 'numeric' }).format(day.date)}
                      </span>
                      <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700">
                        {day.totalCount}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      {day.events.slice(0, 3).map((e) => (
                        <div
                          key={e.id}
                          className="p-1.5 rounded text-[11px] font-medium truncate"
                          style={{
                            backgroundColor: \`\${e.calendarColor}15\`,
                            color: e.calendarColor,
                          }}
                        >
                          {e.title}
                        </div>
                      ))}
                      {day.events.length > 3 && (
                        <span className="text-[10px] text-zinc-400">
                          +{day.events.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
          </div>
        )}

        `;

p = p.slice(0, weekStartIdx) + correctWeekView + p.slice(weekEndIdx);
fs.writeFileSync('src/app/page.tsx', p);
console.log('Done!');
