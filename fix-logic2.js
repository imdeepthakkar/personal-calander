const fs = require('fs');
let m = fs.readFileSync('src/components/DailyBriefModal.tsx', 'utf8');

const oldLogicStr = m.substring(
  m.indexOf('const handleCopy = () => {'),
  m.indexOf('return (')
);

const newLogic = `const [displayedText, setDisplayedText] = useState('');
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
  }, [isOpen, dateKey, settings.aiApiKey]); 

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
  }, [fullText, isTypingComplete, settings.aiApiKey]);

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

m = m.replace(oldLogicStr, newLogic);
fs.writeFileSync('src/components/DailyBriefModal.tsx', m);
