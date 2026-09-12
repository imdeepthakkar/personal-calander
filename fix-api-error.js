const fs = require('fs');
let m = fs.readFileSync('src/components/DailyBriefModal.tsx', 'utf8');

const oldFetchBlock = `        const res = await fetch(\`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=\${settings.aiApiKey}\`, {
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
      }`;

const newFetchBlock = `        const res = await fetch(\`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=\${settings.aiApiKey}\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        });
        
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          console.error('Gemini API Error:', res.status, res.statusText, errData);
          throw new Error(errData.error?.message || 'Failed to fetch from Gemini');
        }
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No summary generated.';
        
        setFullText(text);
      } catch (err: any) {
        console.error("AI Error:", err);
        setAiError(err.message || 'Failed to generate summary. Check your API key.');
      }`;

m = m.replace(oldFetchBlock, newFetchBlock);
fs.writeFileSync('src/components/DailyBriefModal.tsx', m);
