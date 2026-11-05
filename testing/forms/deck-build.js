const PptxGenJS = require('pptxgenjs');

const EV = '/backups/ARAJI-ADOBE/bv-poc-wknd-aln/repo/testing/forms/evidence/';
const OUT = '/backups/ARAJI-ADOBE/bv-poc-wknd-aln/repo/testing/forms/Forms-POC-DA-vs-Ema.pptx';

const RED = 'EB1000';
const DARK = '2C2C2C';
const GREY = '6E6E6E';
const LIGHT = 'F5F5F5';
const LINE = 'D9D9D9';
const GREEN = '2D9D78';
const AMBER = 'E68619';
const BLUE = '1473E6';
const FONT = 'Arial';
const FOOTER = '© 2026 Adobe. All Rights Reserved. Adobe Confidential.';

const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE'; // 13.33 x 7.5 in
pptx.author = 'ALAN RAJI MANI';
pptx.company = 'Adobe';
pptx.title = 'Forms on Edge Delivery Services: DA by hand vs Ema';
pptx.subject = 'Forms POC on bv-poc-wknd-aln, tested 4–5 Nov 2026';

const W = 13.33;
let n = 0;

function footer(s) {
  s.addText(FOOTER, { x: 0.5, y: 7.05, w: 8, h: 0.3, fontFace: FONT, fontSize: 9, color: GREY });
  s.addText(String(n), { x: W - 1.0, y: 7.05, w: 0.5, h: 0.3, fontFace: FONT, fontSize: 9, color: GREY, align: 'right' });
}

function base(section, title) {
  n += 1;
  const s = pptx.addSlide();
  s.background = { color: 'FFFFFF' };
  s.addImage({ path: EV + 'adobe-logo.png', x: W - 1.75, y: 0.32, w: 1.24, h: 0.3, altText: 'Adobe' });
  if (section) s.addText(section.toUpperCase(), { x: 0.5, y: 0.3, w: 10, h: 0.3, fontFace: FONT, fontSize: 11, bold: true, color: RED, charSpacing: 1 });
  s.addText(title, { x: 0.5, y: 0.62, w: 11.2, h: 0.7, fontFace: FONT, fontSize: 26, bold: true, color: DARK, valign: 'middle' });
  s.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.36, w: 1.2, h: 0.06, fill: { color: RED }, line: { color: RED } });
  footer(s);
  return s;
}

function bullets(s, items, opt = {}) {
  const runs = [];
  items.forEach((it) => {
    const t = typeof it === 'string' ? { text: it } : it;
    runs.push({ text: t.text, options: { bullet: t.sub ? { indent: 18 } : { code: '25A0', indent: 14 }, indentLevel: t.sub ? 1 : 0, bold: !!t.bold, color: t.color || DARK, fontSize: t.size || opt.fontSize || 14, breakLine: true, paraSpaceAfter: 4 } });
  });
  s.addText(runs, { x: opt.x ?? 0.5, y: opt.y ?? 1.6, w: opt.w ?? 12.3, h: opt.h ?? 5.2, fontFace: FONT, valign: 'top', color: DARK });
}

function table(s, rows, opt = {}) {
  const fs = opt.fontSize || 11;
  const data = rows.map((r, i) => r.map((c) => {
    const cell = typeof c === 'string' ? { text: c } : c;
    const o = { fontFace: FONT, fontSize: fs, color: DARK, valign: 'middle', margin: [3, 5, 3, 5], border: { type: 'solid', pt: 0.5, color: LINE } };
    if (i === 0) Object.assign(o, { bold: true, color: 'FFFFFF', fill: { color: RED } });
    else if (i % 2 === 0) o.fill = { color: LIGHT };
    if (cell.color) o.color = cell.color;
    if (cell.bold) o.bold = true;
    return { text: cell.text, options: o };
  }));
  s.addTable(data, { x: opt.x ?? 0.5, y: opt.y ?? 1.65, w: opt.w ?? 12.3, colW: opt.colW, autoPage: false });
}

const FIGS = [];
function img(s, file, x, y, maxW, maxH, pxW, pxH, caption) {
  if (caption) { FIGS.push({ fig: FIGS.length + 1, file, caption, slide: n }); caption = `Figure ${FIGS.length}: ${caption}`; }
  const r = Math.min(maxW / pxW, maxH / pxH);
  const w = pxW * r; const h = pxH * r;
  const ox = x + (maxW - w) / 2;
  s.addImage({ path: EV + file, x: ox, y, w, h, altText: caption || 'Screenshot' });
  s.addShape(pptx.ShapeType.rect, { x: ox, y, w, h, fill: { type: 'none' }, line: { color: LINE, width: 0.75 } });
  if (caption) s.addText(caption, { x, y: y + h + 0.03, w: maxW, h: 0.28, fontFace: FONT, fontSize: 9, italic: true, color: GREY, align: 'center' });
}

function placeholder(s, id, label, x, y, w, h) {
  s.addShape(pptx.ShapeType.rect, { x, y, w, h, fill: { color: 'FAFAFA' }, line: { color: 'B3B3B3', width: 1, dashType: 'dash' } });
  s.addText([
    { text: 'SCREENSHOT NEEDED', options: { bold: true, fontSize: 10, color: RED, breakLine: true } },
    { text: id, options: { bold: true, fontSize: 11, color: DARK, breakLine: true } },
    { text: label, options: { fontSize: 10, color: GREY } },
  ], { x, y, w, h, fontFace: FONT, align: 'center', valign: 'middle' });
}

function live(s, text) {
  s.addText([{ text: 'LIVE  ', options: { bold: true, color: RED } }, { text, options: { color: BLUE } }], { x: 0.5, y: 6.62, w: 12.3, h: 0.32, fontFace: FONT, fontSize: 11 });
}

function box(s, text, x, y, w, h, fill, color = 'FFFFFF', fs = 12) {
  s.addShape(pptx.ShapeType.roundRect, { x, y, w, h, fill: { color: fill }, line: { color: fill }, rectRadius: 0.08 });
  s.addText(text, { x, y, w, h, fontFace: FONT, fontSize: fs, bold: true, color, align: 'center', valign: 'middle' });
}

function arrow(s, x1, y, x2) {
  s.addShape(pptx.ShapeType.line, { x: x1, y, w: x2 - x1, h: 0, line: { color: GREY, width: 1.5, endArrowType: 'triangle' } });
}

function legend(s) {
  s.addText([
    { text: 'Tested', options: { bold: true, color: GREEN } }, { text: ' = proved on our site   ', options: { color: GREY } },
    { text: 'Documented', options: { bold: true, color: BLUE } }, { text: ' = Adobe docs   ', options: { color: GREY } },
    { text: 'Limitation', options: { bold: true, color: AMBER } }, { text: ' = observed constraint   ', options: { color: GREY } },
    { text: 'Unknown', options: { bold: true, color: GREY } }, { text: ' = not tested', options: { color: GREY } },
  ], { x: 0.5, y: 6.68, w: 12.3, h: 0.3, fontFace: FONT, fontSize: 9 });
}

const T = (t) => ({ text: t, color: GREEN, bold: true });
const D = (t) => ({ text: t, color: BLUE, bold: true });
const L = (t) => ({ text: t, color: AMBER, bold: true });
const U = (t) => ({ text: t, color: GREY, bold: true });
const NO = (t) => ({ text: t, color: RED, bold: true });

const notes = (o) => [
  `SAY:\n${o.say}`,
  o.click ? `CLICK / DEMONSTRATE:\n${o.click}` : null,
  o.observe ? `AUDIENCE SHOULD OBSERVE:\n${o.observe}` : null,
  o.explain ? `HOW TO EXPLAIN THE FINDINGS:\n${o.explain}` : null,
  o.labels ? `EVIDENCE LABELS:\n${o.labels}` : null,
  o.transition ? `TRANSITION:\n${o.transition}` : null,
  o.qa ? `LIKELY QUESTIONS AND ANSWERS:\n${o.qa}` : null,
  o.time ? `TIME: ${o.time}` : null,
].filter(Boolean).join('\n\n');


const BR = 'https://forms-poc--bv-poc-wknd-aln--araji-adobe.aem.page';
const URL = {
  a: `${BR}/forms-poc/contact`,
  b: `${BR}/forms-poc/booking`,
  aj: `${BR}/forms-poc/contact-form.json`,
  bj: `${BR}/forms-poc/booking-form.json`,
  da: 'https://da.live/#/araji-adobe/bv-poc-wknd-aln/forms-poc',
  gh: 'https://github.com/ARAJI-ADOBE/bv-poc-wknd-aln/tree/forms-poc',
  docForms: 'https://www.aem.live/developer/forms',
  docSubmit: 'https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/edge-delivery/build-forms/forms-submission-service',
};

// ---------------------------------------------------------------- 1 Title
{
  n += 1;
  const s = pptx.addSlide();
  s.background = { color: 'FFFFFF' };
  s.addImage({ path: EV + 'adobe-logo.png', x: 0.6, y: 0.6, w: 1.66, h: 0.4, altText: 'Adobe' });
  s.addText('EDS  ·  DA.LIVE  ·  EMA', { x: 0.6, y: 1.9, w: 12, h: 0.35, fontFace: FONT, fontSize: 13, bold: true, color: RED, charSpacing: 1 });
  s.addText('Forms on Edge Delivery Services', { x: 0.6, y: 2.3, w: 12, h: 0.9, fontFace: FONT, fontSize: 40, bold: true, color: DARK });
  s.addText('Two working forms, built two ways: by hand in DA.live and with Ema. Same block, same site, same tests.', { x: 0.6, y: 3.2, w: 11.5, h: 0.6, fontFace: FONT, fontSize: 18, color: GREY });
  s.addShape(pptx.ShapeType.rect, { x: 0.6, y: 4.05, w: 1.2, h: 0.06, fill: { color: RED }, line: { color: RED } });
  s.addText([
    { text: 'ALAN RAJI MANI', options: { bold: true, breakLine: true } },
    { text: 'araji@adobe.com  ·  5 Nov 2026', options: { color: GREY } },
  ], { x: 0.6, y: 4.3, w: 8, h: 0.8, fontFace: FONT, fontSize: 14, color: DARK });
  footer(s);
  s.addNotes(notes({
    say: 'Over the last day I built two forms on our Edge Delivery Services sandbox. I built one by hand in DA.live and had Ema, the Experience Modernization Agent, build the other. They solve different business problems, but they run on the same form block and the same site and went through the same four tests, so the comparison is fair. Everything I show is labelled Tested, Documented, Limitation or Unknown.',
    transition: 'First, what we set out to prove.',
    time: '0:30',
  }));
}

// ---------------------------------------------------------------- 2 Goal
{
  const s = base('Goal', 'What we set out to prove in 24 hours');
  table(s, [
    ['', 'Form A: Contact WKND', 'Form B: Adventure Booking Request'],
    ['Business use case', 'General enquiries: questions, partnerships, feedback', 'A visitor requests a specific trip on a specific date'],
    ['Built with', 'DA.live, by hand (document-based authoring)', 'Ema, from one prompt, with author approval'],
    ['Fields', '4: name, email, topic (dropdown), message', '7: name, email, adventure, start date, group size, experience level, consent'],
    ['Field types', 'text, email, select, textarea', 'text, email, select, date, number, radio, checkbox'],
    ['Page', '/forms-poc/contact', '/forms-poc/booking'],
  ], { colW: [2.6, 4.6, 5.1], fontSize: 12 });
  s.addText('Fair-test rules: same site · same form block · same branch · same browser · same four tests · same evidence labels', { x: 0.5, y: 4.9, w: 12.3, h: 0.4, fontFace: FONT, fontSize: 13, bold: true, color: DARK });
  bullets(s, [
    'Constraints: shared environment, so no changes to existing pages, configuration or main. Preview only, nothing published live.',
    'Out of scope (on purpose): styling, conditional logic, extra fields.',
  ], { y: 5.35, h: 1.2, fontSize: 12 });
  s.addNotes(notes({
    say: 'Form A is a simple contact form, the kind of thing an author types up. Form B is a booking request with seven field types, which gives Ema something harder. To keep it fair, both use the same block on the same branch and are tested the same way. This is a shared environment, so nothing existing was changed and nothing was published live.',
    transition: 'Here is the environment we worked in.',
    time: '1:00',
  }));
}

// ---------------------------------------------------------------- 3 Environment
{
  const s = base('Environment', 'Where everything lives');
  table(s, [
    ['Part', 'Value', 'Status'],
    ['EDS site', 'araji-adobe / bv-poc-wknd-aln (WKND sandbox)', T('Tested')],
    ['Content source', 'DA.live: content.da.live/araji-adobe/bv-poc-wknd-aln', T('Tested')],
    ['Code', 'GitHub ARAJI-ADOBE/bv-poc-wknd-aln, branch forms-poc (main untouched)', T('Tested')],
    ['Form block', 'Adobe Block Collection "form" block, plus one small fix (see slide 9)', T('Tested')],
    ['DA content', '/forms-poc: contact-form (sheet), contact (page), booking-form (sheet), booking (page)', T('Tested')],
    ['Publishing', 'Preview only (aem.page). Nothing published to aem.live.', T('Tested')],
    ['Licence', 'Adobe docs: "a valid AEM Forms license is required"', D('Documented')],
  ], { colW: [2.2, 8.4, 1.7], fontSize: 12 });
  legend(s);
  s.addNotes(notes({
    say: 'The site is our WKND sandbox. Content lives in DA.live and code in GitHub. All form code is on a separate branch called forms-poc, so main and the live site were never touched. Note the licence line: Adobe documents that EDS forms need an AEM Forms licence.',
    labels: 'Tested: every row except the licence, which is Documented (aem.live/developer/forms).',
    transition: 'How does a document-based form actually work?',
    time: '1:00',
  }));
}

// ---------------------------------------------------------------- 4 How it works
{
  const s = base('How it works', 'A document-based form in four pieces');
  box(s, '1  Sheet\n(the fields)', 0.6, 1.9, 2.6, 1.2, RED);
  arrow(s, 3.25, 2.5, 3.85);
  box(s, '2  Preview\n(sheet → JSON)', 3.9, 1.9, 2.6, 1.2, DARK);
  arrow(s, 6.55, 2.5, 7.15);
  box(s, '3  Page\n(form block table + link)', 7.2, 1.9, 2.6, 1.2, DARK);
  arrow(s, 9.85, 2.5, 10.45);
  box(s, '4  Form block code\n(builds the form)', 10.5, 1.9, 2.3, 1.2, BLUE);
  table(s, [
    ['Piece', 'What the author does', 'Plain-language meaning'],
    ['Sheet', 'One row per field: field, label, type, placeholder, options, required', 'A spreadsheet that describes the form'],
    ['Preview', 'Click Preview on the sheet', 'Turns the sheet into data the website can read (…/contact-form.json)'],
    ['Page', 'Insert a table, name it "form", link the sheet in the first cell', 'Tells the page "put a form here, using that sheet"'],
    ['Block code', 'Nothing (a developer adds it once)', 'Small piece of site code that draws the fields and checks the input'],
  ], { y: 3.5, colW: [1.8, 5.6, 4.9], fontSize: 12 });
  s.addText('Finding: a DA sheet works as the form definition. Adobe\'s forms page names SharePoint and Google Drive only.', { x: 0.5, y: 6.25, w: 12.3, h: 0.35, fontFace: FONT, fontSize: 12, bold: true, color: GREEN });
  s.addNotes(notes({
    say: 'There are four pieces. A sheet lists the fields. Preview turns it into data. A page holds a table called form that links to the sheet. Then the block code builds the form in the browser. The author only touches the first three, and the code is added once.',
    explain: 'Adobe\'s forms overview lists SharePoint and Google Drive for document-based forms. We tested that a DA.live sheet works the same way for the form definition.',
    labels: 'Tested: DA sheet as the form definition. Documented: the source list on aem.live.',
    transition: 'Here is Form A, built by hand.',
    time: '1:15',
  }));
}

// ---------------------------------------------------------------- 5 Form A
{
  const s = base('Form A · DA.live by hand', 'Contact WKND: 10 author steps, about 35 minutes');
  bullets(s, [
    'Create folder forms-poc',
    'Create sheet contact-form (the menu says "Sheet")',
    'Type 6 headers in lowercase: field · label · type · placeholder · options · required',
    'Type 5 field rows',
    'Preview the sheet: JSON served',
    'Create page contact (the menu says "Page", not "Document")',
    'Insert a block table. DA names it "columns" by default, so rename it to "form"',
    'Type the link /forms-poc/contact-form.json in the first cell',
    'Preview the page, then open it on the forms-poc branch',
    { text: 'Observed: the first round of typing the rows was not saved. 5 small text slips (cosmetic only).', color: AMBER, bold: true },
  ], { x: 0.5, y: 1.6, w: 5.9, h: 5.0, fontSize: 12 });
  img(s, 'E01-formA-contact-rendered.png', 6.6, 1.65, 6.2, 2.4, 1280, 552, 'Form A rendered on the forms-poc branch preview');
  img(s, 'A07-da-contact-page-block-table.jpg', 6.6, 4.4, 6.2, 2.0, 1883, 1411, 'DA inserts a block table named "columns"');
  live(s, URL.a);
  s.addNotes(notes({
    say: 'Form A took ten author steps and about thirty-five minutes of hands-on time. Two things caught us out. DA calls the item "Page", not "Document". The default table is called columns and has to be renamed to form. The first round of typing the rows never saved, so we lost it and retyped it.',
    click: `Open ${URL.a}`,
    observe: 'Four required fields and a Send Message button.',
    labels: 'Tested: every step, verified from DA after each step.',
    transition: 'Now the same job done by Ema, on a harder form.',
    time: '1:30',
  }));
}

// ---------------------------------------------------------------- 6 Form B
{
  const s = base('Form B · Ema', 'Adventure Booking Request: 1 prompt, 2 approvals, about 4 minutes');
  bullets(s, [
    'Ema read the site\'s real adventure list and chose 6 WKND trips for the dropdown',
    'Generated the sheet (8 rows, 7 field types) and the page with the same structure as Form A',
    'Test-rendered it in a browser before anything was uploaded',
    { text: 'Author approval 1: upload 2 new items to DA /forms-poc and preview them', bold: true },
    'Checked the uploaded sheet against the local copy: 8 of 8 rows match',
    'Previewed both items and checked the branch page renders',
    { text: 'Author approval 2: code fix on the branch (slide 9)', bold: true },
    { text: 'Limits: Ema lost DA and GitHub access after an overnight session restart. A person had to re-enable the permission and push the code with Sync.', color: AMBER, bold: true },
  ], { x: 0.5, y: 1.6, w: 5.9, h: 5.0, fontSize: 12 });
  img(s, 'E02-formB-booking-rendered.png', 6.6, 1.65, 6.2, 4.6, 1280, 724, 'Form B rendered on the forms-poc branch preview');
  live(s, URL.b);
  s.addNotes(notes({
    say: 'For Form B I gave Ema one request. It used the real adventure names from the site, generated the sheet and page, and test-rendered them before touching DA. It then asked me before uploading. The upload matched the local copy exactly. Hands-on time was about four minutes plus two approval clicks. Ema still needs a human: after the overnight restart it lost DA and GitHub access, and I had to push the code myself with the Sync button.',
    click: `Open ${URL.b}`,
    observe: 'Seven field types: dropdown, date picker, number, radio buttons and a consent checkbox.',
    labels: 'Tested: upload (201), row match 8 of 8, preview (200), render. Limitation: access lost after restart; code push needed Sync.',
    transition: 'Both forms then went through the same four tests.',
    time: '1:30',
  }));
}

// ---------------------------------------------------------------- 7 Tests
{
  const s = base('Test results', 'Same four tests, both forms, real branch preview');
  table(s, [
    ['#', 'Test', 'Form A: Contact', 'Form B: Booking'],
    ['T1', 'Click Send with everything empty', T('Pass: stays on page, focus on Full Name'), T('Pass: stays on page, focus on Full name')],
    ['T2', 'Enter an invalid email (not-an-email)', T('Pass: stops at Email'), U('n/a (the email check is the same code)')],
    ['T3', 'Leave a radio button / checkbox empty', U('n/a (no radio or checkbox)'), T('Pass: stops at Experience level, then Consent')],
    ['T4', 'Fill every field correctly and send', T('Pass: "Thank you. Demo only…", form clears'), T('Pass: same; the dropdown resets')],
    ['—', 'Typed values appear in the web address', T('No'), T('No')],
    ['—', 'Entry saved anywhere', L('No: saving is not set up (slide 10)'), L('No: saving is not set up (slide 10)')],
  ], { colW: [0.6, 3.8, 3.95, 3.95], fontSize: 11 });
  img(s, 'E02-formB-booking-demo-notice.png', 7.6, 4.95, 5.2, 1.45, 1280, 784, 'T4: demo notice after a valid entry');
  s.addText('Retested 5 Nov, 10:33 UTC, after the fix was live on forms-poc. Green = Tested pass, amber = Limitation.', { x: 0.5, y: 5.0, w: 6.8, h: 0.6, fontFace: FONT, fontSize: 11, color: GREY });
  s.addNotes(notes({
    say: 'Both forms pass all the tests that apply to them. Empty submissions are blocked, a bad email is caught, unchecked radios and checkboxes are caught, and a valid entry shows a clear demo message. No entry is saved anywhere yet. I will explain why on slide ten.',
    click: 'Live: click Send on the empty contact form, then fill the booking form and send.',
    observe: 'The cursor jumps to the first missing field. The thank-you message is labelled "Demo only".',
    labels: 'Tested: T1–T4 on both branch preview pages. Limitation: no saving.',
    transition: 'Here is the head-to-head comparison.',
    time: '1:30',
  }));
}

// ---------------------------------------------------------------- 8 Comparison
{
  const s = base('DA vs Ema', 'Head-to-head comparison');
  table(s, [
    ['Measure', 'Form A: DA by hand', 'Form B: Ema', 'Edge'],
    ['Hands-on time', 'About 35 min', 'About 4 min + 2 approvals', 'Ema'],
    ['Author steps', '10 UI steps', '1 request + 2 approvals', 'Ema'],
    ['Form complexity', '4 fields, 4 types', '7 fields, 7 types', 'Ema'],
    ['Typing slips / lost work', '5 cosmetic slips, 1 lost save', '0 (checked row by row)', 'Ema'],
    ['Verification', 'Author checks visually', 'Self-tests before upload, checks after upload', 'Ema'],
    ['Needs a human for', 'Everything', 'Approving DA writes, re-enabling access, pushing code (Sync)', 'Shared'],
    ['Learning value', 'Author learns how forms are built', 'Little, unless the author reads the output', 'DA'],
    ['Works without Ema access', 'Yes', 'No: blocked twice by lost access after a restart', 'DA'],
    ['Same block, same output', 'Yes', 'Yes', 'Equal'],
  ], { colW: [2.6, 3.4, 4.9, 1.4], fontSize: 11 });
  s.addNotes(notes({
    say: 'Ema was about eight times faster to hands-on completion and built a more complex form with no typing slips. DA is the more reliable path when the agent has no access, and it teaches the author how forms work. In both cases the output is the same block, so whichever way a form is built, it behaves the same for visitors.',
    explain: 'Times are hands-on minutes from the progress log, not elapsed time. Form A spans an overnight pause, which is excluded.',
    labels: 'Tested: all rows, from the progress log testing/forms/forms-progress.md.',
    transition: 'What went wrong, and what we fixed.',
    time: '1:30',
  }));
}

// ---------------------------------------------------------------- 9 Defects
{
  const s = base('Defects and findings', 'What broke and how we handled it');
  table(s, [
    ['ID', 'What happened', 'Impact', 'Resolution'],
    ['D1', 'With no submit address, the block skipped validation. Send reloaded the page and put typed values in the web address.', 'Privacy risk; no error messages', T('Fixed on forms-poc: always validate; show a demo notice. Retested.')],
    ['F1', 'The first round of typed sheet rows was not saved in DA', 'Lost author work', L('Wait a few seconds before leaving; reload to confirm')],
    ['F2', 'DA labels: "Page" (not Document); the default block table is "columns"', 'Author confusion', L('Covered in the SOP')],
    ['F3', 'Ema lost DA access (401) and GitHub access after an overnight restart', 'Ema blocked', L('Re-enable in Settings → LLM Permissions; push code with Sync')],
    ['F4', 'Chat attachments turn .pptx files into plain text', 'Corporate template could not be used', L('Deck uses the Adobe default style')],
    ['F5', 'The main preview shows no form: the block exists only on forms-poc', 'Expected', U('Merge forms-poc to main when approved')],
  ], { colW: [0.6, 5.3, 2.3, 4.1], fontSize: 11 });
  s.addNotes(notes({
    say: 'One real defect. With no submit address, the standard form block skipped its checks, so clicking Send reloaded the page with the visitor\'s details in the address bar. I approved a three-line fix on our branch: always validate, and show a clear demo message instead. Both forms were retested. The other items are process lessons, and they are all in the SOP.',
    labels: 'Tested: D1 before and after the fix. F1–F5 observed during the POC.',
    transition: 'Why is nothing saved yet?',
    time: '1:30',
  }));
}

// ---------------------------------------------------------------- 10 Submissions
{
  const s = base('Saving entries', 'Why submissions are not saved yet');
  table(s, [
    ['Adobe requirement (Forms Submission Service)', 'Our status'],
    ['Repository added to Adobe\'s allowlist', U('Unknown: no process documented')],
    ['Adaptive Forms Block (not the simple form block)', NO('Not installed')],
    ['Excel or Google Sheet with an "incoming" tab, shared with forms@adobe.com ("Anyone with the link can edit")', U('Unknown: corporate sharing policy')],
    ['Submit endpoint with a form {id}', U('Unknown: where the id comes from is not documented')],
    ['Targets: Google Sheets, SharePoint, OneDrive', D('Documented: DA is not listed')],
  ], { colW: [7.6, 4.7], fontSize: 12 });
  bullets(s, [
    'Decision (5 Nov): stop and document instead of spending 40 minutes on a likely block.',
    'Next step: confirm the allowlist process with the AEM Forms team, then trial the Adaptive Forms Block on a branch.',
  ], { y: 5.0, h: 1.4, fontSize: 13 });
  s.addText(`Source: ${URL.docSubmit}`, { x: 0.5, y: 6.62, w: 12.3, h: 0.3, fontFace: FONT, fontSize: 9, color: BLUE });
  s.addNotes(notes({
    say: 'Saving entries uses Adobe\'s Forms Submission Service. Its documentation needs an allowlisted repository, the larger Adaptive Forms Block, a shared spreadsheet and a form id. Some of that has no documented process. With limited time we chose to document it rather than spend forty minutes on a likely dead end. This is the main next step.',
    labels: 'Documented: the requirements (Experience League). Unknown: allowlist, sharing policy, form id.',
    qa: 'Q: Can DA store submissions? A: DA is not a documented target; the documented targets are Google Sheets, SharePoint and OneDrive.',
    transition: 'So when should you use which approach?',
    time: '1:15',
  }));
}

// ---------------------------------------------------------------- 11 Recommendation
{
  const s = base('Recommendation', 'When to use DA by hand, and when to use Ema');
  box(s, 'Use DA by hand', 0.5, 1.7, 6.0, 0.55, DARK);
  bullets(s, [
    'Small forms (up to about 5 fields), quick edits to labels or options',
    'Authors who need to own and understand the form',
    'When Ema has no DA or GitHub access',
  ], { x: 0.5, y: 2.35, w: 6.0, h: 2.2, fontSize: 13 });
  box(s, 'Use Ema', 6.8, 1.7, 6.0, 0.55, RED);
  bullets(s, [
    'New or larger forms, or many similar forms',
    'Fields that must match real site data (adventure names)',
    'When you want self-testing before upload and a row-by-row check after',
  ], { x: 6.8, y: 2.35, w: 6.0, h: 2.2, fontSize: 13 });
  s.addText('Best of both: Ema drafts → the author reviews the sheet in DA → the author previews → the author tests T1–T4 → publish via the normal process.', { x: 0.5, y: 4.9, w: 12.3, h: 0.8, fontFace: FONT, fontSize: 15, bold: true, color: DARK });
  s.addNotes(notes({
    say: 'My recommendation is to use both. Ema drafts the form fast and accurately. The author reviews the sheet in DA, previews it and runs the four tests. DA by hand stays the fallback for small changes and for times when the agent has no access.',
    transition: 'Let me show you both forms live.',
    time: '1:00',
  }));
}

// ---------------------------------------------------------------- 12 Demo
{
  const s = base('Live demo', 'Demo order (3 minutes)');
  table(s, [
    ['#', 'Open', 'Show'],
    ['1', URL.da, 'The forms-poc folder: 2 sheets + 2 pages'],
    ['2', URL.aj, 'Sheet → JSON: the data the form is built from'],
    ['3', URL.a, 'Form A: click Send empty (T1), then a bad email (T2)'],
    ['4', URL.b, 'Form B: fill it in and send (T4): demo notice'],
    ['5', URL.gh, 'Code branch: form block + fix, main untouched'],
  ], { colW: [0.5, 7.4, 4.4], fontSize: 11 });
  s.addText('Backup if the network fails: figures on slides 5–7 show the same states.', { x: 0.5, y: 5.6, w: 12.3, h: 0.4, fontFace: FONT, fontSize: 12, color: GREY });
  s.addNotes(notes({
    say: 'Five quick stops. The DA folder, the sheet as data, Form A failing validation, Form B succeeding, and the code branch.',
    click: 'Open each link in order, in a browser tab prepared before the session.',
    observe: 'Both forms come from sheets; the code is on a branch; nothing is live.',
    time: '3:00',
  }));
}

// ---------------------------------------------------------------- 13 Next steps
{
  const s = base('Next steps', 'From POC to production');
  table(s, [
    ['#', 'Action', 'Owner'],
    ['1', 'Confirm Forms licence and the allowlist process with the AEM Forms team', 'Alan'],
    ['2', 'Trial the Adaptive Forms Block + Submission Service on a new branch', 'Developer'],
    ['3', 'Review and merge forms-poc to main (needs a PR with a preview link)', 'Code owner'],
    ['4', 'Publish /forms-poc pages through the normal (scheduled) publish process', 'Author'],
    ['5', 'Add the SOP to the team wiki; reuse T1–T4 as the standard form test', 'Alan'],
  ], { colW: [0.5, 9.3, 2.5], fontSize: 13 });
  s.addNotes(notes({
    say: 'To go to production: confirm the licence and allowlist, trial the submission service, merge the branch through a normal pull request, and publish through our usual process. The SOP and the four tests are reusable for every future form.',
    transition: 'Questions.',
    time: '0:45',
  }));
}

// ---------------------------------------------------------------- 14 Sources
{
  const s = base('Appendix', 'Sources and evidence');
  bullets(s, [
    { text: 'Adobe documentation (linked, not copied)', bold: true },
    { text: URL.docForms, sub: true, color: BLUE },
    { text: URL.docSubmit, sub: true, color: BLUE },
    { text: 'Evidence in the repo (branch forms-poc)', bold: true },
    { text: 'testing/forms/forms-progress.md: step-by-step log with labels and times', sub: true },
    { text: 'testing/forms/evidence/: E01/E02 (rendered, empty submit, demo notice), E03 (sheet JSON), A07 (block table)', sub: true },
    { text: 'testing/forms/SOP-Forms-DA-and-Ema.md · testing/forms/speaking-script.md', sub: true },
    { text: 'Author-side screenshots (A01–A13, B01–B02) are kept by the presenter', sub: true },
  ], { fontSize: 13 });
  s.addNotes('Reference slide, not presented.');
}

pptx.writeFile({ fileName: OUT }).then((f) => console.log('written', f));
