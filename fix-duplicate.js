const fs = require('fs');
let p = fs.readFileSync('src/app/page.tsx', 'utf8');

// The todos view section appears to be duplicated.
// Find the FIRST occurrence of the todos view section start
const todoViewStart = '{/* View 3: All Tasks & To-Do Board */}';
const firstIdx = p.indexOf(todoViewStart);
const secondIdx = p.indexOf(todoViewStart, firstIdx + 1);

if (secondIdx === -1) {
  console.log('No duplicate found — already clean!');
  process.exit(0);
}

console.log(`Found duplicate at index ${firstIdx} and ${secondIdx}`);

// Find the </main> that comes after the first occurrence
const mainCloseAfterFirst = p.indexOf('</main>', firstIdx);
const mainCloseAfterSecond = p.indexOf('</main>', secondIdx);

console.log(`First </main> at ${mainCloseAfterFirst}, Second </main> at ${mainCloseAfterSecond}`);

// Remove everything from secondIdx to mainCloseAfterSecond (keeping the </main> from first one)
// i.e. remove the duplicate block
const cleaned = p.slice(0, secondIdx) + p.slice(mainCloseAfterSecond);
fs.writeFileSync('src/app/page.tsx', cleaned);
console.log('Done! Removed duplicate todos view.');
