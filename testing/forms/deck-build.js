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
pptx.title = 'FORMS POC - DA vs EMA';
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
  s.addText('FORMS POC - DA vs EMA', { x: 0.6, y: 2.3, w: 12, h: 0.9, fontFace: FONT, fontSize: 40, bold: true, color: DARK });
  s.addText('Two working forms, built two ways: by hand in DA.live and with Ema. Same block, same site, same tests.', { x: 0.6, y: 3.2, w: 11.5, h: 0.6, fontFace: FONT, fontSize: 18, color: GREY });
  s.addShape(pptx.ShapeType.rect, { x: 0.6, y: 4.05, w: 1.2, h: 0.06, fill: { color: RED }, line: { color: RED } });
  s.addText([
    { text: 'ALAN RAJI MANI', options: { bold: true, breakLine: true } },
    { text: 'araji@adobe.com  ·  11 Nov 2026', options: { color: GREY } },
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
  const s = base('Goal', 'What we set out to prove');
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
    ['Form block', 'Adobe Block Collection "form" block, plus small fixes (see slide 10)', T('Tested')],
    ['DA content', '/forms-poc: contact-form (sheet), contact (page), booking-form (sheet), booking (page)', T('Tested')],
    ['Publishing', 'Preview only (aem.page). Nothing published to aem.live.', T('Tested')],
    ['Saving entries', 'Form A → Microsoft Power Automate → Excel table in OneDrive (no AEM Forms)', T('Tested')],
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
    transition: 'Next, the content model behind it.',
    time: '1:15',
  }));
}

// ---------------------------------------------------------------- 4b Content model
{
  const s = base('Content model', 'Content modelling in EDS, and the model our forms use');
  table(s, [
    ['Piece', 'What the author does', 'In our POC'],
    ['Default content', 'Normal headings, text, images, links (no table)', '—'],
    ['Block', 'A table; the top cell names the block, the rows below hold its content', 'form table: cell 1 = sheet link, cell 2 = submit address'],
    ['Section', 'Split the page with ---; a Section Metadata table can style it', '—'],
    ['Page metadata', 'A metadata table: title, description, image', '—'],
    ['Sheet', 'Rows of structured, repeating data, served as JSON', '6 lowercase columns: field · label · type · placeholder · options · required'],
  ], { colW: [2.0, 5.2, 5.1], fontSize: 11 });
  bullets(s, [
    'Prefer default content; use a block only when it adds real value',
    'Keep blocks simple: few columns, no blocks inside blocks',
    'Easy for authors: no hidden codes; the code handles missing or extra cells',
    { text: 'Same model for Form A and Form B, so a hand-built form and an Ema-built form behave identically', bold: true },
  ], { y: 4.55, h: 1.9, fontSize: 12 });
  s.addText('Adobe: https://www.aem.live/docs/davidsmodel  ·  https://www.aem.live/developer/markup-sections-blocks', { x: 0.5, y: 6.62, w: 12.3, h: 0.3, fontFace: FONT, fontSize: 9, color: BLUE });
  s.addNotes(notes({
    say: 'Content modelling means deciding how authors structure content so the site can turn it into the right design. EDS has five pieces: default content, blocks, sections, page metadata and sheets. Our forms use one block with two cells, a link to the field sheet and an optional submit address, plus a six-column sheet. Ema and the hand-built form follow the same model, which is why they behave the same.',
    labels: 'Documented: aem.live content-modelling guidance (David\'s Model). Tested: our form model.',
    transition: 'Here is Form A, built by hand.',
    time: '1:00',
  }));
}

// ---------------------------------------------------------------- 5 Form A
{
  const s = base('Form A · DA.live by hand', 'Contact WKND: built by hand in 10 author steps');
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
  const s = base('Form B · Ema', 'Adventure Booking Request: 1 request, 2 approvals');
  bullets(s, [
    'Ema read the site\'s real adventure list and chose 6 WKND trips for the dropdown',
    'Generated the sheet (8 rows, 7 field types) and the page with the same structure as Form A',
    'Test-rendered it in a browser before anything was uploaded',
    { text: 'Author approval 1: upload 2 new items to DA /forms-poc and preview them', bold: true },
    'Checked the uploaded sheet against the local copy: 8 of 8 rows match',
    'Previewed both items and checked the branch page renders',
    { text: 'Author approval 2: code fix on the branch (slide 10)', bold: true },
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
    ['T4', 'Fill every field correctly and send', T('Pass: "Thank you. Your entry was received."; row added in Excel'), T('Pass: same; the dropdown resets')],
    ['—', 'Typed values appear in the web address', T('No'), T('No')],
    ['—', 'Entry saved anywhere', T('Yes: OneDrive Excel via Power Automate (slide 11)'), L('Not connected yet: "Demo only" notice')],
  ], { colW: [0.6, 3.8, 3.95, 3.95], fontSize: 11 });
  img(s, 'E02-formB-booking-demo-notice.png', 7.6, 4.95, 5.2, 1.45, 1280, 784, 'T4: demo notice after a valid entry');
  s.addText('Retested 5 Nov on the forms-poc branch; Form A live save tested at 6:20 pm IST. Green = Tested pass, amber = Limitation.', { x: 0.5, y: 5.0, w: 6.8, h: 0.6, fontFace: FONT, fontSize: 11, color: GREY });
  s.addNotes(notes({
    say: 'Both forms pass all the tests that apply to them. Empty submissions are blocked, a bad email is caught, unchecked radios and checkboxes are caught, and a valid entry shows a clear demo message. Form A entries are saved to OneDrive; Form B is not connected yet. Slide eleven shows how Form A saves to OneDrive.',
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
    ['Saving entries', 'Connected (Power Automate → OneDrive)', 'Same method, not connected in the POC', 'DA (only one tested)'],
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
    ['F6', 'Sync → Code pushed every untracked file (deck, evidence) to the public repo', 'Confidential file public', L('Review what Sync stages; the owner decides on clean-up')],
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
  const s = base('Saving entries', 'Saving to OneDrive without AEM Forms: Power Automate');
  box(s, 'Form A\n(Send Message)', 0.6, 1.75, 2.6, 1.0, RED);
  arrow(s, 3.25, 2.25, 3.85);
  box(s, 'Power Automate\n"When an HTTP request\nis received" (Premium)', 3.9, 1.75, 3.0, 1.0, DARK, 'FFFFFF', 11);
  arrow(s, 6.95, 2.25, 7.55);
  box(s, 'Excel Online\n"Add a row into a table"', 7.6, 1.75, 2.8, 1.0, DARK, 'FFFFFF', 11);
  arrow(s, 10.45, 2.25, 11.05);
  box(s, 'OneDrive\nwknd-contact-\nsubmissions.xlsx', 11.1, 1.75, 1.75, 1.0, BLUE, 'FFFFFF', 10);
  table(s, [
    ['Check', 'Result'],
    ['Premium HTTP trigger available on our Microsoft account; "Who can trigger" = Anyone allowed', T('Tested')],
    ['Browser permission (CORS): preflight 204, allow-origin *; sending returns 202', T('Tested')],
    ['Ema test entry and a live website entry both arrived as rows in Excel', T('Tested')],
    ['No code change for sending: the flow address goes in the 2nd cell of the form block table', T('Tested')],
    ['Adobe route (Forms Submission Service) needs an AEM Forms licence, allowlist and Adaptive Forms Block', D('Documented: not used')],
    ['Risks: anyone with the address can post rows (no spam protection); depends on a Microsoft Premium licence', L('Limitation')],
  ], { y: 3.0, colW: [9.6, 2.7], fontSize: 11 });
  s.addText(`Adobe docs: ${URL.docSubmit}`, { x: 0.5, y: 6.62, w: 12.3, h: 0.3, fontFace: FONT, fontSize: 9, color: BLUE });
  s.addNotes(notes({
    say: 'We wanted entries saved in OneDrive without paying for AEM Forms. Adobe\'s own submission service needs an AEM Forms licence. Instead, the form sends each entry to a Microsoft Power Automate flow, which adds a row to an Excel table in OneDrive. The form block already supports a submit address, so sending needed no code change, only the address in the second cell of the block table. Both my test entry and a live entry from the website arrived in Excel.',
    click: 'Show the flow in make.powerautomate.com (trigger + Add a row into a table), its Run history, then the Excel file wknd-contact-submissions with its rows.',
    explain: 'This is fine for a POC. For production, add spam protection and choose between Power Automate Premium and AEM Forms.',
    labels: 'Tested: trigger, CORS, 202, rows in Excel. Documented: AEM Forms requirements. Limitation: open endpoint, Microsoft Premium.',
    qa: 'Q: Is the address secret? A: No. It is in the page source, so anyone could post to it. That is why production needs spam protection or a server-side relay.',
    transition: 'Next: how far can Ema go with advanced forms?',
    time: '1:30',
  }));
}

// ---------------------------------------------------------------- 10b Advanced forms: summary
{
  const s = base('Advanced Forms Capabilities', 'Can Ema build advanced forms from business requirements?');
  table(s, [
    ['Test', 'Requirement (plain language)', 'How Ema did it', 'Result'],
    ['1 Validation', 'Name: letters, spaces, - and \'. Email: name@example.com. Phone: exactly 10 digits. Address required. A message under each field.', 'Sheet + Ema code (new pattern and error columns)', T('Pass (live)')],
    ['2 Multi-step', '3 steps (Personal / Address / Review), Next and Previous, progress, values kept, submit only at the end, Enter does not advance', 'Sheet + Ema code (new step and review rows)', T('Pass (live)')],
    ['3 Conditional', 'Business shows Company (required) and Job title; Personal hides them and they do not block', 'Sheet only: the block already supported it', T('Pass (live)')],
    ['Bug found', 'After submit, the Business fields stayed visible on the cleared form', 'Ema code fix, retested', T('Fixed')],
    ['Regression', 'Forms A and B unchanged (new features are opt-in per sheet)', '—', T('Pass (live)')],
  ], { colW: [1.6, 5.9, 3.0, 1.8], fontSize: 11 });
  bullets(s, [
    { text: 'Manual intervention: 1 approval (DA upload + preview) and 1 Sync push by the author. No hand-typed rows or fixes.', bold: true },
    'Finding: the free form block covers required, email and conditional fields. Format rules, custom messages and steps needed a code extension, which Ema wrote, tested and kept opt-in.',
    'Test data only (Test User, test.user@example.com, 9876543210).',
  ], { y: 4.9, h: 1.6, fontSize: 12 });
  legend(s);
  s.addNotes(notes({
    say: 'We then asked whether Ema can turn plain business requirements into an advanced form. It covered validation rules, a three-step wizard and fields that appear only for business enquiries. All three passed on the live branch preview. Conditional fields worked with sheet rows alone. Format rules, field messages and steps needed the form block to be extended. Ema wrote that code, tested it and made it opt-in, so the earlier forms did not change. Testing also found one bug, which was fixed and retested.',
    labels: 'Tested: every row on the forms-poc branch preview on 11 Nov (G01 to G05).',
    transition: 'Here is the requirement-by-requirement matrix.',
    time: '1:30',
  }));
}

// ---------------------------------------------------------------- 10c Advanced forms: matrix
{
  const s = base('Advanced Forms Capabilities', 'Capability matrix');
  table(s, [
    ['Requirement', 'Ema configuration', 'Tested behaviour', 'Status', 'Manual', 'Limitation'],
    ['Full name rule', 'pattern + error', '"John3", "J@ne Doe" rejected; "Mary-Jane O\'Neil" OK', T('Pass'), 'None', 'A–Z letters only'],
    ['Email format', 'type email + pattern', '"name@example" rejected (the browser alone accepts it)', T('Pass'), 'None', '—'],
    ['Phone: 10 digits', 'type tel + pattern + help', 'Letters, 5 digits, 11 digits, spaces rejected; value kept as typed', T('Pass'), 'None', 'No country code'],
    ['Address', 'required + pattern', 'Empty and "<…>" rejected', T('Pass'), 'None', 'Also allows \' # /'],
    ['Field messages', 'inline errors (opt-in)', '4 messages at once; focus on the first', T('Pass'), 'None', '—'],
    ['Steps + progress', 'step rows', '"Step 1 of 3" … "Step 3 of 3"', T('Pass'), 'None', '—'],
    ['Next validates / Previous keeps', 'built-in', 'Blocked while invalid; values kept both ways', T('Pass'), 'None', '—'],
    ['Review step', 'review row', 'All answers listed; hidden fields left out', T('Pass'), 'None', 'Read-only'],
    ['No early submit / Enter', 'submit only in step 3', 'Enter in steps 1–2: no move, no submit', T('Pass'), 'None', 'Enter does not advance'],
    ['Keyboard', 'native buttons', 'Tab to Next, Enter moves on', T('Pass (local)'), 'None', 'Screen reader not tested'],
    ['Business / Personal', 'conditional column', 'Company required only for Business', T('Pass'), 'None', 'Condition syntax'],
    ['Mobile 375 px', 'existing CSS', 'No sideways scroll', T('Pass (local)'), 'None', '—'],
  ], { colW: [2.0, 1.9, 4.0, 1.1, 0.8, 2.5], fontSize: 9 });
  s.addText('Full matrix with evidence: testing/forms/advanced-capability-matrix.md', { x: 0.5, y: 6.62, w: 12.3, h: 0.3, fontFace: FONT, fontSize: 9, color: GREY });
  s.addNotes(notes({
    say: 'This is the requirement-by-requirement view. Every rule was tested with good and bad test values. For example, a phone number with a space is rejected and the message explains the rule, but what the user typed is left untouched. Two rows were tested locally only: keyboard and mobile. A real screen-reader check is still open.',
    labels: 'Pass = tested live on the branch preview. Pass (local) = tested in the browser with the branch code before the upload.',
    transition: 'And this is what a visitor sees.',
    time: '1:30',
  }));
}

// ---------------------------------------------------------------- 10d Advanced forms: screenshots + test 4
{
  const s = base('Advanced Forms Capabilities', 'What the visitor sees, and what comes next');
  img(s, 'G02-live-advanced-empty-errors.png', 0.5, 1.6, 6.0, 2.6, 1280, 641, 'Step 1: a message under every missing field');
  img(s, 'G04-live-review.png', 6.8, 1.6, 6.0, 2.6, 1280, 451, 'Step 3: review of all answers before submitting');
  table(s, [
    ['Optional (Test 4)', 'Current status', 'Needs'],
    ['Calculated fields', U('Not supported'), 'Ema code'],
    ['Dynamic dropdowns', U('In the block (options from another sheet), untested'), 'Sheet only'],
    ['Submission confirmation', T('Pass (live): Submit opens /forms-poc/advanced-thank-you'), 'Sheet row + 3 lines of Ema code'],
    ['Accessibility audit', U('ARIA + focus done; screen reader not tested'), 'Manual test'],
  ], { y: 4.75, colW: [3.0, 6.3, 3.0], fontSize: 10 });
  s.addNotes(notes({
    say: 'On the left, step one with an error under every missing field. On the right, the review step just before submitting. Of the optional extras, the confirmation page was approved and built. The block only followed a confirmation row after a real send, so Ema added a three-line opt-in change, and Submit now opens a thank-you page. Calculated fields and dynamic dropdowns were not built.',
    click: 'Live: https://forms-poc--bv-poc-wknd-aln--araji-adobe.aem.page/forms-poc/advanced',
    transition: 'Next: the same tests with Experience Workspace.',
    time: '1:00',
  }));
}

// ---------------------------------------------------------------- 10e Experience Workspace: what it is + approach
{
  const s = base('Ema vs Experience Workspace', 'Same advanced requirements, given to Experience Workspace');
  table(s, [
    ['Experience Workspace capability (its own answer, 11 Nov)', 'Our test result'],
    ['Create / update DA sheets and pages', T('Tested: created 2 sheets + 2 pages correctly')],
    ['Preview and publish', T('Tested: asked first; previewed page and sheet; never published')],
    ['Read or change code (GitHub)', NO('No, by its own statement: cannot extend the form block')],
    ['Knows the EDS form block columns', NO('No: described different column names (Mandatory, Value, Description…)')],
  ], { colW: [6.6, 5.7], fontSize: 12 });
  table(s, [
    ['Round', 'What it was given', 'Files (new names only)'],
    ['1 · Blind', 'Exactly the same business requirements as Ema', '/forms-poc/ws-advanced-form + ws-advanced'],
    ['2 · Guided', 'Same requirements + the sheet format Ema found by reading the code', '/forms-poc/ws2-advanced-form + ws2-advanced'],
  ], { y: 4.15, colW: [1.6, 6.4, 4.3], fontSize: 12 });
  s.addText('Same site, same form block code, same test values, same checks as Ema\'s advanced form.', { x: 0.5, y: 5.75, w: 12.3, h: 0.4, fontFace: FONT, fontSize: 12, bold: true, color: DARK });
  legend(s);
  s.addNotes(notes({
    say: 'We repeated the advanced tests with Experience Workspace, the assistant inside DA.live. First we asked what it can do. It can create and update content and can preview and publish, but it cannot read or change code. It also described form columns that our block does not use. We ran two rounds: blind, with exactly the requirements Ema got, and guided, with the sheet format Ema had found in the code. Each round used new file names, so nothing else was touched.',
    labels: 'Its capability list is self-reported; the right-hand column is what we tested.',
    transition: 'Here is what happened.',
    time: '1:00',
  }));
}

// ---------------------------------------------------------------- 10f Experience Workspace: results
{
  const s = base('Ema vs Experience Workspace', 'Results: Ema vs Experience Workspace, blind and guided');
  table(s, [
    ['Requirement', 'Ema', 'Workspace blind', 'Workspace guided'],
    ['Name letters only', T('Pass'), NO('Fail: "John3" accepted'), T('Pass')],
    ['Email format', T('Pass'), L('Partial'), L('Partial: "name@example" accepted')],
    ['Phone exactly 10 digits', T('Pass'), NO('Fail: "98765" accepted'), T('Pass')],
    ['Address', T('Pass'), L('Partial'), T('Pass')],
    ['Field-specific messages', T('Pass'), NO('Fail: browser bubble only'), T('Pass')],
    ['3 steps, progress, Next / Previous, review', T('Pass'), NO('Fail: one single page'), T('Pass')],
    ['No submit before the last step (Enter)', T('Pass'), NO('Fail: Enter submitted'), T('Pass')],
    ['Business → Company required', T('Pass'), NO('Fail: always visible'), NO('Fail: shown, never required')],
    ['Personal → hidden, doesn\'t block', T('Pass'), L('Partial: never hidden'), T('Pass')],
    ['Unrequested rules', T('None'), L('US ZIP rule'), L('US ZIP rule, invalid syntax')],
    ['Safety (asked first, no publish)', T('Pass'), T('Pass'), T('Pass')],
    ['Summary', T('All pass'), NO('2 pass · 3 partial · 5 fail'), L('9 pass · 2 partial · 1 fail')],
  ], { colW: [3.6, 1.6, 3.4, 3.7], fontSize: 10 });
  s.addNotes(notes({
    say: 'Blind, Experience Workspace guessed the sheet format, so most advanced behaviour failed: no steps, no rules applied, business fields always visible. Guided, with the right format, it got close to Ema, but only because it reused the code Ema had written. Two things it still missed: it did not make Company Name required for Business, which was partly our prompt wording, and it added a US ZIP rule nobody asked for, with syntax the browser rejects.',
    explain: 'The difference is code access. Ema read the block code to learn the format, extended it and tested its own work. Experience Workspace works on content only.',
    labels: 'Tested on the forms-poc branch preview on 11 Nov with the same values as Ema\'s form (evidence H01–H02, H11–H14).',
    transition: 'What the guided form looks like.',
    time: '1:30',
  }));
}

// ---------------------------------------------------------------- 10g Experience Workspace: screenshots + takeaway
{
  const s = base('Ema vs Experience Workspace', 'What it built, and when to use which');
  img(s, 'H01-ws-form-rendered.png', 0.5, 1.6, 3.6, 3.1, 1280, 1137, 'Blind: one page, no steps');
  img(s, 'H12-ws2-empty-errors.png', 4.4, 1.6, 4.1, 3.1, 1280, 672, 'Guided: steps + field messages');
  img(s, 'H14-ws2-review.png', 8.8, 1.6, 4.0, 3.1, 1280, 647, 'Guided: review step');
  bullets(s, [
    { text: 'Experience Workspace: good for content work in DA (create and update sheets and pages, preview) with safe approvals.', bold: true },
    'It cannot read or change code, so it cannot discover or extend what the form block supports.',
    { text: 'Ema: reads the code, extends the block, tests its own output, so it handles requirements the block did not support yet.', bold: true },
    'Best together: Ema builds or extends the block once and documents the sheet format; then authors or Experience Workspace create forms with that format.',
  ], { y: 5.05, h: 1.55, fontSize: 11 });
  s.addNotes(notes({
    say: 'On the left, the blind result: a single long page. In the middle and on the right, the guided result: proper steps, field messages and a review. My takeaway: Experience Workspace is a good content assistant, but advanced form behaviour lives in code, and that is where Ema made the difference. The best set-up is Ema extending the block once, then authors or Experience Workspace reusing the documented format.',
    click: 'Optional live: /forms-poc/ws-advanced (blind) and /forms-poc/ws2-advanced (guided) on the forms-poc branch.',
    transition: 'So when should you use which approach?',
    time: '1:00',
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
  const s = base('Live demo', 'End-to-end demo flow');
  table(s, [
    ['#', 'Open', 'Show and say'],
    ['1', 'da.live → bv-poc-wknd-aln → forms-poc', 'One folder: 3 sheets (the fields) + 4 pages. "Every form is a sheet plus a page."'],
    ['2', 'contact-form sheet', 'The 6 lowercase columns: field, label, type, placeholder, options, required. "Form A, typed by hand."'],
    ['3', 'contact page in DA', 'The form block table: cell 1 = sheet link, cell 2 = Power Automate address'],
    ['4', `${BR}/forms-poc/contact`, 'Send empty (focus jumps to Full Name), then a real test entry → "Thank you. Your entry was received."'],
    ['5', 'make.powerautomate.com → My flows → the contact flow', 'Trigger "When an HTTP request is received" (Who can trigger: Anyone, JSON schema) → "Add a row into a table" (Excel, Table2, utcNow() + form fields)'],
    ['6', 'Same flow → Run history', 'A new Succeeded run for the entry just sent from step 4'],
    ['7', 'Excel: wknd-contact-submissions (OneDrive)', 'The new row appears: saved without AEM Forms'],
    ['8', `${BR}/forms-poc/booking`, 'Form B by Ema: 7 field types from one request'],
    ['9', `${BR}/forms-poc/advanced`, 'Type John3 → letters-only message; phone 98765 → 10-digit rule; Business → Company required; Personal → hidden'],
    ['10', 'advanced: Next / Previous / review', 'Step 1 of 3 → 2 → Previous keeps values → review lists all answers'],
    ['11', 'Submit enquiry', 'Opens the thank-you page (confirmation row)'],
    ['12', URL.gh, 'All code on the forms-poc branch; main and the live site untouched'],
  ], { colW: [0.45, 4.6, 7.25], fontSize: 9 });
  s.addText('Test data only (Test User, test.user@example.com, 9876543210). Backup if the network fails: figures on slides 6–8, 11 and 14.', { x: 0.5, y: 6.62, w: 12.3, h: 0.3, fontFace: FONT, fontSize: 10, color: GREY });
  s.addNotes(notes({
    say: 'Let me show the whole journey, from the DA folder to the saved entry and the advanced form. Everything is preview only on the forms-poc branch, with test data.',
    click: 'Open the tabs in this order. Prepare all of them before the session. On Form A use test data only, because it really writes a row to OneDrive.',
    observe: 'Forms are sheets plus a page; Form A sends to a Power Automate flow, which writes to Excel; the advanced form validates, branches and steps; Submit opens the thank-you page.',
    time: '6:00',
  }));
}

// ---------------------------------------------------------------- 13 Next steps
{
  const s = base('Next steps', 'From POC to production');
  table(s, [
    ['#', 'Action', 'Owner'],
    ['1', 'Choose the production saving route: Power Automate (add spam protection) or AEM Forms (licence)', 'Alan + team'],
    ['1b', 'Connect Form B to its own flow and Excel table (same steps as Form A)', 'Author'],
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
