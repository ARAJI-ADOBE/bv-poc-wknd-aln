// Turns the speaker notes of an unzipped .pptx into speaking-script.md
// Usage: node notes2md.js <unzipped-pptx-dir> <out.md>
const fs = require('fs');
const path = require('path');

const [dir, outFile] = process.argv.slice(2);
const dec = (s) => s.replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const num = (f) => parseInt(f.match(/\d+/)[0], 10);
const texts = (x) => [...x.matchAll(/<a:t>([^<]*)<\/a:t>/g)].map((m) => dec(m[1]));
const LABELS = /^(SAY|CLICK \/ DEMONSTRATE|AUDIENCE SHOULD OBSERVE|HOW TO EXPLAIN THE FINDINGS|EVIDENCE LABELS|TRANSITION|LIKELY QUESTIONS AND ANSWERS):/gm;

let out = '# Speaking script: Forms on EDS, DA by hand vs Ema\n\nPresenter: ALAN RAJI MANI (araji@adobe.com) · about 23 minutes (including a 3-minute live demo) plus Q&A · generated from the speaker notes in Forms-POC-DA-vs-Ema.pptx\n';
const slides = fs.readdirSync(path.join(dir, 'ppt/slides')).filter((f) => /^slide\d+\.xml$/.test(f)).sort((a, b) => num(a) - num(b));
slides.forEach((f) => {
  const i = num(f);
  const t = texts(fs.readFileSync(path.join(dir, 'ppt/slides', f), 'utf8'));
  // the title is the first longer text that isn't an all-caps section label
  const title = t.find((s) => s.length > 12 && s !== s.toUpperCase()) || t[0];
  const nf = path.join(dir, `ppt/notesSlides/notesSlide${i}.xml`);
  let notes = '';
  if (fs.existsSync(nf)) {
    notes = fs.readFileSync(nf, 'utf8').split('</a:p>').map((p) => texts(p).join('')).filter((l) => l && !/^\d+$/.test(l)).join('\n');
  }
  notes = notes.replace(LABELS, '**$1:**').replace(/^(TIME: .*)$/gm, '*$1*');
  out += `\n## Slide ${i}: ${title}\n\n${notes}\n`;
});
fs.writeFileSync(outFile, out);
console.log(slides.length, 'slides');
