const fs = require('fs');
let s = fs.readFileSync('src/components/DailyBriefModal.tsx', 'utf8');

// Try all three known model names in order with fallback
const oldFetch = `const res = await fetch(
          \`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=\${settings.aiApiKey}\`,`;

const newFetch = `// Try models in priority order
        const modelsToTry = ['gemini-1.5-flash', 'gemini-1.0-pro', 'gemini-pro'];
        let res: Response | null = null;
        let lastErr = '';
        for (const model of modelsToTry) {
          try {
            const attempt = await fetch(
              \`https://generativelanguage.googleapis.com/v1beta/models/\${model}:generateContent?key=\${settings.aiApiKey}\`,`;

const marker = 'const res = await fetch(\n          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${settings.aiApiKey}`,';

const idx = s.indexOf(marker);
console.log('Found at:', idx);
