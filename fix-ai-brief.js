const fs = require('fs');

let m = fs.readFileSync('src/components/DailyBriefModal.tsx', 'utf8');

// We need to add useState and useEffect to imports if not there.
if (!m.includes('useEffect')) {
  m = m.replace("import React from 'react';", "import React, { useState, useEffect } from 'react';");
}

// We completely replace the Content section of the modal!
const oldRegex = /\{\/\* Content \*\/\}[\s\S]*?\{\/\* Footer \*\/\}/;

const newContent = `{/* Content */}
        <div className="p-8 flex flex-col gap-6 bg-white/40 max-h-[60vh] overflow-y-auto">
          
          {/* AI Typewriter Output */}
          <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-clayPressed rounded-[32px] p-6 relative min-h-[160px]">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#A78BFA] animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#A78BFA]">AI Summary Agent</span>
            </div>
            
            <p className="text-sm font-bold text-clay-foreground leading-relaxed whitespace-pre-wrap font-dm-sans">
              {displayedText}
              {!isTypingComplete && (
                <span className="inline-block w-2 h-4 ml-1 bg-clay-accent animate-pulse" />
              )}
            </p>
          </div>
          
        </div>

        {/* Footer */}`;

// Now we need to inject the logic!
const logicRegex = /const handleCopy = \(\) => \{[\s\S]*?\}\;\n/;

const newLogic = `
  const [displayedText, setDisplayedText] = useState('');
  const [fullText, setFullText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setDisplayedText('');
      setFullText('');
      setIsTypingComplete(false);
      return;
    }

    // Generate the smart AI text
    const hour = new Date().getHours();
    let greeting = 'Good evening';
    if (hour < 12) greeting = 'Good morning';
    else if (hour < 17) greeting = 'Good afternoon';

    const meetingCount = todaysEvents.length;
    let scheduleVibe = 'light';
    if (meetingCount > 4) scheduleVibe = 'heavy';
    else if (meetingCount > 2) scheduleVibe = 'steady';

    let text = \`\${greeting}! Looking at your schedule for \${displayDate.toLocaleDateString('en-US', { weekday: 'long' })}, \`;

    if (meetingCount === 0) {
      text += 'your calendar is completely clear! ';
    } else {
      text += \`you have a \${scheduleVibe} day ahead with \${meetingCount} meeting\${meetingCount === 1 ? '' : 's'} scheduled. \`;
      
      // Get first meeting
      const firstMeeting = todaysEvents[0];
      const firstTime = firstMeeting.startTime.split('T')[1].substring(0, 5);
      text += \`Your day kicks off with "\${firstMeeting.title}" at \${firstTime}. \`;
    }

    const taskCount = todaysTodos.length;
    if (taskCount === 0) {
      text += '\\n\\nOn the task front, you have no urgent action items. Take it easy!';
    } else {
      text += \`\\n\\nOn the task front, you have \${taskCount} critical action item\${taskCount === 1 ? '' : 's'} pending. \`;
      const topTask = todaysTodos.find(t => t.priority === 'urgent') || todaysTodos[0];
      text += \`Make sure to prioritize "\${topTask.title}".\`;
    }
    
    text += '\\n\\nHave a productive day! ✨';

    setFullText(text);
    setDisplayedText('');
    setIsTypingComplete(false);
  }, [isOpen, dateKey, events, todos]);

  useEffect(() => {
    if (!fullText || isTypingComplete) return;
    
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        setIsTypingComplete(true);
        clearInterval(interval);
      }
    }, 25); // Typing speed

    return () => clearInterval(interval);
  }, [fullText]);

  const handleCopy = () => {
    navigator.clipboard.writeText(fullText);
    alert('AI Briefing copied to clipboard!');
  };
`;

m = m.replace(oldRegex, newContent);
m = m.replace(logicRegex, newLogic);

fs.writeFileSync('src/components/DailyBriefModal.tsx', m);
