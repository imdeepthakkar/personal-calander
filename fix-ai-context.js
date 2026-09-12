const fs = require('fs');
let s = fs.readFileSync('src/components/DailyBriefModal.tsx', 'utf8');

const oldPromptBlock = `        const prompt = \`Act as an energetic, highly intelligent, and motivating personal assistant. It is currently \${timeOfDay}. Summarize my schedule for \${displayDate.toLocaleDateString()} with enthusiasm! Greet me appropriately ("Good \${timeOfDay}") and make the briefing highly appealing, upbeat, and concise (max 3 sentences).\\n\\nMeetings:\\n\${eventsStr || 'None'}\\n\\nCritical Tasks:\\n\${todosStr || 'None'}\`;`;

const newPromptBlock = `        const prompt = \`Act as an energetic, highly intelligent, and motivating personal assistant. It is currently \${timeOfDay} on \${new Date().toLocaleDateString()}. I am asking you to summarize my schedule for the date: \${displayDate.toLocaleDateString()}. Summarize this specific schedule with enthusiasm! Greet me appropriately ("Good \${timeOfDay}") and make the briefing highly appealing, upbeat, and concise (max 3 sentences).\\n\\nMeetings on \${displayDate.toLocaleDateString()}:\\n\${eventsStr || 'None'}\\n\\nCritical Tasks on \${displayDate.toLocaleDateString()}:\\n\${todosStr || 'None'}\`;`;

s = s.replace(oldPromptBlock, newPromptBlock);
fs.writeFileSync('src/components/DailyBriefModal.tsx', s);
console.log("Done");
