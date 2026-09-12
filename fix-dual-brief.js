const fs = require('fs');

let m = fs.readFileSync('src/components/DailyBriefModal.tsx', 'utf8');

if (!m.includes('useState')) {
  m = m.replace("import React from 'react';", "import React, { useState, useEffect } from 'react';");
}

const oldContentRegex = /\{\/\* Content \*\/\}[\s\S]*?\{\/\* Footer \*\/\}/;

const newContent = `{/* Content */}
        <div className="p-8 flex flex-col gap-6 bg-white/40 max-h-[60vh] overflow-y-auto">
          {settings.aiApiKey ? (
            <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-clayPressed rounded-[32px] p-6 relative min-h-[160px]">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-[#A78BFA] animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[#A78BFA]">Gemini Summary Agent</span>
              </div>
              <p className="text-sm font-bold text-clay-foreground leading-relaxed whitespace-pre-wrap font-dm-sans">
                {isLoadingAI ? "Analyzing schedule..." : (aiError || displayedText)}
                {!isTypingComplete && !aiError && !isLoadingAI && (
                  <span className="inline-block w-2 h-4 ml-1 bg-clay-accent animate-pulse" />
                )}
              </p>
            </div>
          ) : (
            <>
              {/* Static Meetings Section */}
              <div>
                <h4 className="text-xs font-black text-clay-muted uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-clay-sky" /> Today's Schedule
                </h4>
                {todaysEvents.length === 0 ? (
                  <div className="p-4 rounded-[24px] bg-white/50 border border-white/50 shadow-sm text-sm font-bold text-clay-muted/70 text-center">
                    Your schedule is clear!
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {todaysEvents.map((event) => {
                      const dual = formatDualTime(
                        event.startTime,
                        settings.primaryTimezone,
                        settings.primaryLabel,
                        settings.secondaryTimezone,
                        settings.secondaryLabel
                      );
                      return (
                        <div key={event.id} className="p-3 rounded-[20px] bg-white border border-white/40 shadow-sm flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-2 h-8 rounded-full"
                              style={{ backgroundColor: event.calendarColor }}
                            />
                            <div>
                              <p className="text-sm font-bold text-clay-foreground line-clamp-1">{event.title}</p>
                              <p className="text-[10px] font-bold text-clay-muted uppercase tracking-wider">
                                {dual.time1} • {event.calendarName}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Static Tasks Section */}
              <div>
                <h4 className="text-xs font-black text-clay-muted uppercase tracking-wider mb-3 flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-clay-accent" /> Critical Action Items
                </h4>
                {todaysTodos.length === 0 ? (
                  <div className="p-4 rounded-[24px] bg-white/50 border border-white/50 shadow-sm text-sm font-bold text-clay-muted/70 text-center">
                    No pressing tasks for today!
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {todaysTodos.map((task) => (
                      <div key={task.id} className="p-3 rounded-[20px] bg-[#EFEBF5]/50 border border-white/40 shadow-sm flex flex-col justify-center">
                        <p className="text-sm font-bold text-clay-foreground flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full border-2 border-clay-muted/30" />
                          {task.title}
                        </p>
                        {task.priority === 'urgent' && (
                          <span className="ml-6 mt-1 self-start text-[9px] font-black uppercase tracking-widest text-red-500 bg-red-500/10 px-2 py-0.5 rounded-lg">
                            Urgent Priority
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}`;

const handleCopyRegex = /const handleCopy = \(\) => \{[\s\S]*?\};\n/;

const newLogic = `
  const [displayedText, setDisplayedText] = useState('');
  const [fullText, setFullText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiError, setAiError] = useState('');

  useEffect(() => {
    if (!isOpen || !settings.aiApiKey) return;
    
    const fetchSummary = async () => {
      setIsLoadingAI(true);
      setAiError('');
      setDisplayedText('');
      setFullText('');
      setIsTypingComplete(false);
      
      try {
        const eventsStr = todaysEvents.map(e => \`- \${e.startTime.split('T')[1].substring(0,5)}: \${e.title}\`).join('\\n');
        const todosStr = todaysTodos.map(t => \`- \${t.title} (\${t.priority})\`).join('\\n');
        
        const prompt = \`Act as a highly intelligent, concise personal assistant. Summarize my day for \${displayDate.toLocaleDateString()}. Make it conversational but highly professional and extremely brief (max 3 sentences). \\n\\nMeetings:\\n\${eventsStr || 'None'}\\n\\nCritical Tasks:\\n\${todosStr || 'None'}\`;
        
        const res = await fetch(\`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=\${settings.aiApiKey}\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        });
        
        if (!res.ok) throw new Error('Failed to fetch from Gemini');
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No summary generated.';
        
        setFullText(text);
      } catch (err) {
        setAiError('Failed to generate summary. Check your API key.');
      } finally {
        setIsLoadingAI(false);
      }
    };
    
    fetchSummary();
  }, [isOpen, dateKey, settings.aiApiKey]); // We intentionally do not include events/todos in dep array to prevent re-fetching while modal is open

  useEffect(() => {
    if (!fullText || isTypingComplete || !settings.aiApiKey) return;
    
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        setIsTypingComplete(true);
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [fullText]);

  const handleCopy = () => {
    let textToCopy = '';
    if (settings.aiApiKey && fullText) {
      textToCopy = fullText;
    } else {
      textToCopy = \`✨ Daily Briefing - \${todayString}\\n\\n🗓️ Meetings:\\n\${
        todaysEvents.length > 0
          ? todaysEvents.map((e) => \`- \${e.startTime.split('T')[1].substring(0, 5)}: \${e.title}\`).join('\\n')
          : '- No meetings today!'
      }\\n\\n✅ Priority Tasks:\\n\${
        todaysTodos.length > 0
          ? todaysTodos.map((t) => \`- [ ] \${t.title} (\${t.priority.toUpperCase()})\`).join('\\n')
          : '- No urgent tasks pending!'
      }\`;
    }
    navigator.clipboard.writeText(textToCopy);
    alert('Briefing copied to clipboard!');
  };
`;

m = m.replace(oldContentRegex, newContent);
m = m.replace(handleCopyRegex, newLogic);

fs.writeFileSync('src/components/DailyBriefModal.tsx', m);
