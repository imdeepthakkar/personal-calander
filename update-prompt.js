const fs = require('fs');
let s = fs.readFileSync('src/components/DailyBriefModal.tsx', 'utf8');

const oldPrompt = "const prompt = `Act as a highly intelligent, concise personal assistant. Summarize my day for ${displayDate.toLocaleDateString()}. Make it conversational but highly professional and extremely brief (max 3 sentences).\\n\\nMeetings:\\n${eventsStr || 'None'}\\n\\nCritical Tasks:\\n${todosStr || 'None'}`;";

const newPrompt = `const currentHour = new Date().getHours();
        let timeOfDay = 'Night';
        if (currentHour >= 5 && currentHour < 12) timeOfDay = 'Morning';
        else if (currentHour >= 12 && currentHour < 17) timeOfDay = 'Afternoon';
        else if (currentHour >= 17 && currentHour < 22) timeOfDay = 'Evening';

        const prompt = \`Act as an energetic, highly intelligent, and motivating personal assistant. It is currently \${timeOfDay}. Summarize my schedule for \${displayDate.toLocaleDateString()} with enthusiasm! Greet me appropriately ("Good \${timeOfDay}") and make the briefing highly appealing, upbeat, and concise (max 3 sentences).\\n\\nMeetings:\\n\${eventsStr || 'None'}\\n\\nCritical Tasks:\\n\${todosStr || 'None'}\`;`;

if(s.includes(oldPrompt)) {
    s = s.replace(oldPrompt, newPrompt);
    fs.writeFileSync('src/components/DailyBriefModal.tsx', s);
    console.log("Done");
} else {
    console.log("old prompt not found");
}
