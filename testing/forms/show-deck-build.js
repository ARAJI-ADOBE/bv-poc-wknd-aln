// Builds the show-and-tell deck: DA by hand → Ema → Experience Workspace.
// Every slide has clickable OPEN links; nothing has to be built live.
// Rebuild: npm i --prefix /tmp/deckbuild pptxgenjs@3, then
//   NODE_PATH=/tmp/deckbuild/node_modules node show-deck-build.js
const path = require('path');
const PptxGenJS = require('pptxgenjs');

const EV = path.join(__dirname, 'evidence') + path.sep;
const OUT = path.join(__dirname, 'Forms-Show-and-Tell.pptx');

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
pptx.title = 'Forms on Edge Delivery Services: show and tell';
pptx.subject = 'DA by hand, Ema, and Experience Workspace on bv-poc-wknd-aln';

const W = 13.33;
let n = 0;

// ---------------------------------------------------------------- links
const BR = 'https://forms-poc--bv-poc-wknd-aln--araji-adobe.aem.page/forms-poc';
const DA = 'araji-adobe/bv-poc-wknd-aln/forms-poc';
const GH = 'https://github.com/ARAJI-ADOBE/bv-poc-wknd-aln/blob/main/testing/forms';
const U = {
  daFolder: `https://da.live/#/${DA}`,
  daContactSheet: `https://da.live/sheet#/${DA}/contact-form`,
  daBookingSheet: `https://da.live/sheet#/${DA}/booking-form`,
  daBookingPage: `https://da.live/edit#/${DA}/booking`,
  daAdvSheet: `https://da.live/sheet#/${DA}/advanced-form`,
  daWs1Sheet: `https://da.live/sheet#/${DA}/ws-advanced-form`,
  daWs2Sheet: `https://da.live/sheet#/${DA}/ws2-advanced-form`,
  contact: `${BR}/contact`,
  contactJson: `${BR}/contact-form.json`,
  booking: `${BR}/booking`,
  bookingJson: `${BR}/booking-form.json`,
  adv: `${BR}/advanced`,
  advJson: `${BR}/advanced-form.json`,
  thanks: `${BR}/advanced-thank-you`,
  ws1: `${BR}/ws-advanced`,
  ws1Json: `${BR}/ws-advanced-form.json`,
  ws2: `${BR}/ws2-advanced`,
  ws2Json: `${BR}/ws2-advanced-form.json`,
  code: 'https://github.com/ARAJI-ADOBE/bv-poc-wknd-aln/blob/forms-poc/blocks/form/form.js',
  sop: `${GH}/SOP-Forms-DA-and-Ema.md`,
  advMatrix: `${GH}/advanced-capability-matrix.md`,
  wsMatrix: `${GH}/workspace-capability-matrix.md`,
  ws1Prompt: `${GH}/workspace-round1-prompt.md`,
  ws2Prompt: `${GH}/workspace-round2-prompt.md`,
  log: `${GH}/forms-progress.md`,
  fullDeck: `${GH}/Forms-POC-DA-vs-Ema.pptx`,
  docForms: 'https://www.aem.live/developer/forms',
};

// ---------------------------------------------------------------- helpers
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
  const runs = items.map((it) => {
    const t = typeof it === 'string' ? { text: it } : it;
    return { text: t.text, options: { bullet: t.sub ? { indent: 18 } : { code: '25A0', indent: 14 }, indentLevel: t.sub ? 1 : 0, bold: !!t.bold, color: t.color || DARK, fontSize: t.size || opt.fontSize || 14, breakLine: true, paraSpaceAfter: 5 } };
  });
  s.addText(runs, { x: opt.x ?? 0.5, y: opt.y ?? 1.6, w: opt.w ?? 12.3, h: opt.h ?? 4.6, fontFace: FONT, valign: 'top', color: DARK });
}

function table(s, rows, opt = {}) {
  const fs = opt.fontSize || 11;
  const data = rows.map((r, i) => r.map((c) => {
    const cell = typeof c === 'string' ? { text: c } : c;
    const o = { fontFace: FONT, fontSize: fs, color: DARK, valign: 'middle', margin: [3, 5, 3, 5], border: { type: 'solid', pt: 0.5, color: LINE } };
    if (i === 0 && !opt.noHead) Object.assign(o, { bold: true, color: 'FFFFFF', fill: { color: opt.headColor || RED } });
    else if (i % 2 === 0) o.fill = { color: LIGHT };
    if (cell.color) o.color = cell.color;
    if (cell.bold) o.bold = true;
    if (cell.mono) o.fontFace = 'Courier New';
    return { text: cell.text, options: o };
  }));
  s.addTable(data, { x: opt.x ?? 0.5, y: opt.y ?? 1.65, w: opt.w ?? 12.3, colW: opt.colW, autoPage: false });
}

let fig = 0;
function img(s, file, x, y, maxW, maxH, pxW, pxH, caption) {
  const r = Math.min(maxW / pxW, maxH / pxH);
  const w = pxW * r; const h = pxH * r;
  const ox = x + (maxW - w) / 2;
  fig += 1;
  const cap = `Figure ${fig}: ${caption}`;
  s.addImage({ path: EV + file, x: ox, y, w, h, altText: cap });
  s.addShape(pptx.ShapeType.rect, { x: ox, y, w, h, fill: { type: 'none' }, line: { color: LINE, width: 0.75 } });
  s.addText(cap, { x, y: y + h + 0.03, w: maxW, h: 0.28, fontFace: FONT, fontSize: 9, italic: true, color: GREY, align: 'center' });
}

function box(s, text, x, y, w, h, fill, color = 'FFFFFF', fs = 12) {
  s.addShape(pptx.ShapeType.roundRect, { x, y, w, h, fill: { color: fill }, line: { color: fill }, rectRadius: 0.08 });
  s.addText(text, { x, y, w, h, fontFace: FONT, fontSize: fs, bold: true, color, align: 'center', valign: 'middle' });
}

function arrow(s, x1, y, x2) {
  s.addShape(pptx.ShapeType.line, { x: x1, y, w: x2 - x1, h: 0, line: { color: GREY, width: 1.5, endArrowType: 'triangle' } });
}

// clickable "OPEN" bar at the bottom of a slide: [label, url] pairs
function open(s, links, y = 6.55) {
  const runs = [{ text: 'OPEN  ', options: { bold: true, color: RED } }];
  links.forEach(([label, url], i) => {
    if (i) runs.push({ text: '   ·   ', options: { color: GREY } });
    runs.push({ text: label, options: { color: BLUE, underline: { style: 'sng' }, hyperlink: { url, tooltip: url } } });
  });
  s.addShape(pptx.ShapeType.rect, { x: 0.5, y: y - 0.04, w: 12.3, h: 0.42, fill: { color: 'EEF4FD' }, line: { color: 'EEF4FD' } });
  s.addText(runs, { x: 0.6, y, w: 12.1, h: 0.34, fontFace: FONT, fontSize: 12, valign: 'middle' });
}

const G = (t) => ({ text: t, color: GREEN, bold: true });
const A = (t) => ({ text: t, color: AMBER, bold: true });
const R = (t) => ({ text: t, color: RED, bold: true });
const N = (t) => ({ text: t, color: GREY, bold: true });

const notes = (o) => [
  `SAY:\n${o.say}`,
  o.show ? `SHOW (just open and point, nothing to type):\n${o.show}` : null,
  o.observe ? `AUDIENCE SHOULD SEE:\n${o.observe}` : null,
  o.careful ? `CAREFUL:\n${o.careful}` : null,
  o.labels ? `EVIDENCE LABELS:\n${o.labels}` : null,
  o.qa ? `LIKELY QUESTIONS AND ANSWERS:\n${o.qa}` : null,
  o.transition ? `TRANSITION:\n${o.transition}` : null,
  o.time ? `TIME: ${o.time}` : null,
].filter(Boolean).join('\n\n');

function divider(num, title, sub) {
  n += 1;
  const s = pptx.addSlide();
  s.background = { color: DARK };
  s.addText(`PART ${num}`, { x: 0.8, y: 2.3, w: 11, h: 0.5, fontFace: FONT, fontSize: 18, bold: true, color: RED, charSpacing: 2 });
  s.addText(title, { x: 0.8, y: 2.85, w: 11.5, h: 1.0, fontFace: FONT, fontSize: 40, bold: true, color: 'FFFFFF' });
  s.addText(sub, { x: 0.8, y: 3.9, w: 11.5, h: 0.8, fontFace: FONT, fontSize: 18, color: 'D0D0D0' });
  s.addText(FOOTER, { x: 0.5, y: 7.05, w: 8, h: 0.3, fontFace: FONT, fontSize: 9, color: 'A0A0A0' });
  return s;
}

// ================================================================ 1 Title
{
  n += 1;
  const s = pptx.addSlide();
  s.background = { color: 'FFFFFF' };
  s.addImage({ path: EV + 'adobe-logo.png', x: 0.6, y: 0.6, w: 1.66, h: 0.4, altText: 'Adobe' });
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.22, h: 7.5, fill: { color: RED }, line: { color: RED } });
  s.addText('Forms on Edge Delivery Services', { x: 0.6, y: 2.0, w: 12, h: 0.9, fontFace: FONT, fontSize: 40, bold: true, color: DARK });
  s.addText('Show and tell: by hand in DA.live, with Ema, and tested with Experience Workspace', { x: 0.6, y: 2.95, w: 12, h: 0.6, fontFace: FONT, fontSize: 20, color: GREY });
  s.addText('ALAN RAJI MANI · araji@adobe.com · Forms POC, 4–16 Nov 2026 · site bv-poc-wknd-aln (forms-poc branch, preview only)', { x: 0.6, y: 4.1, w: 12, h: 0.4, fontFace: FONT, fontSize: 13, color: DARK });
  s.addText('Every slide has an OPEN bar: click a link to show the real page. Nothing is built live.', { x: 0.6, y: 4.6, w: 12, h: 0.4, fontFace: FONT, fontSize: 13, italic: true, color: BLUE });
  s.addText(FOOTER, { x: 0.6, y: 7.05, w: 8, h: 0.3, fontFace: FONT, fontSize: 9, color: GREY });
  s.addNotes(notes({
    say: 'Today I will show you how a form is made on Edge Delivery Services, three ways. First by hand in DA.live, then with Ema, the Experience Modernization Agent, and finally how Experience Workspace, the assistant inside DA.live, did with the same requirements. Everything I show is already built and tested, so I will open the real pages rather than build anything live.',
    careful: 'Before the session: log in to DA.live in the same browser, so the DA links open straight away. Open the links once to warm them up.',
    time: '0:30',
  }));
}

// ================================================================ 2 The idea
{
  const s = base('The idea', 'A form is just a sheet, a page and a block');
  box(s, 'SHEET\none row per field', 0.8, 1.9, 3.2, 1.2, BLUE, 'FFFFFF', 15);
  arrow(s, 4.1, 2.5, 4.9);
  box(s, 'PAGE\na "form" block that links the sheet', 5.0, 1.9, 3.3, 1.2, RED, 'FFFFFF', 15);
  arrow(s, 8.4, 2.5, 9.2);
  box(s, 'WEBSITE\nthe form block code draws the form', 9.3, 1.9, 3.3, 1.2, DARK, 'FFFFFF', 15);
  bullets(s, [
    'Authors only write content: a sheet and a page in DA.live. No HTML, no form builder.',
    'The sheet\'s columns decide what appears: field, label, type, placeholder, options, required.',
    'The form block is site code. On our site it exists only on the forms-poc branch, so every link today uses the branch preview.',
    'Preview only: nothing in this POC was published, and main and the live site are unchanged by the forms work.',
  ], { y: 3.5, h: 2.8, fontSize: 15 });
  open(s, [['DA folder /forms-poc', U.daFolder], ['A sheet as the website reads it (JSON)', U.contactJson], ['Adobe docs: forms', U.docForms]]);
  s.addNotes(notes({
    say: 'Before the three ways, one idea. Every form is two pieces of content: a sheet, where each row is one field, and a page with a small table called the form block, which points at the sheet. The site code then turns that into a working form. So the question for each approach is simply: who writes the sheet and the page, and can they change the code?',
    show: 'Click "DA folder /forms-poc": point at the pairs, contact-form and contact, booking-form and booking, and so on. Then click the JSON link: "this is exactly what the website reads".',
    observe: 'Each form is a sheet plus a page with the same name.',
    labels: 'Tested: all links open (checked 16 Nov). Documented: forms on EDS (aem.live).',
    transition: 'Let us start with the manual way.',
    time: '1:00',
  }));
}

// ================================================================ Part 1 divider
{
  const s = divider(1, 'By hand in DA.live', 'Form A: a contact form, typed by the author. About 35 minutes and 10 steps.');
  s.addNotes(notes({ say: 'Part one: building a form by hand in DA.live. This is Form A, a simple contact form that I typed myself.', time: '0:10' }));
}

// ================================================================ DA step 1: sheet
{
  const s = base('Part 1 · DA by hand', 'Step 1: a sheet with one row per field');
  table(s, [
    ['field', 'label', 'type', 'placeholder', 'options', 'required'],
    ['name', 'Full Name', 'text', 'your full name', '', 'true'],
    ['email', 'Email', 'email', 'you@example.com', '', 'true'],
    ['topic', 'Topic', 'select', 'Choose a topic', 'General questions, Adventure info, Partnership, Feedback', 'true'],
    ['message', 'Message', 'textarea', 'How can we help', '', 'true'],
    ['submit', 'Send Message', 'submit', '', '', ''],
  ], { colW: [1.3, 1.7, 1.2, 2.0, 4.9, 1.2], fontSize: 12, headColor: BLUE });
  bullets(s, [
    'In DA: + New → Sheet → contact-form, then type the 6 lowercase headers and one row per field.',
    'Row 1 must be exactly these names in lowercase, otherwise the field is ignored.',
    { text: 'Lesson: our first round of typing was lost because DA had not saved it. Wait a few seconds and reload before you leave.', color: AMBER },
    'Then Preview the sheet (not Publish), so the website can read it.',
  ], { y: 4.05, h: 2.3, fontSize: 14 });
  open(s, [['Form A sheet in DA', U.daContactSheet], ['Same sheet as JSON', U.contactJson]]);
  s.addNotes(notes({
    say: 'Step one is a sheet. Six columns, all lowercase: the internal field name, the label people see, the type, a placeholder, options for dropdowns, and whether it is required. One row per field, and a last row for the button. This is exactly Form A as it is in DA today.',
    show: 'Click "Form A sheet in DA" and point at row 1 and the topic row with its options. Then click "Same sheet as JSON" to show what the website reads after Preview.',
    observe: 'A normal spreadsheet; the JSON has the same rows.',
    labels: 'Tested: rows are the real contact-form sheet (read 16 Nov). Limitation: the lost first save.',
    transition: 'The sheet alone shows nothing. It needs a page.',
    time: '1:30',
  }));
}

// ================================================================ DA step 2: page + block
{
  const s = base('Part 1 · DA by hand', 'Step 2: a page with a "form" block that links the sheet');
  img(s, 'A07-da-contact-page-block-table.jpg', 0.5, 1.65, 5.4, 4.3, 1883, 1411, 'DA inserts a table called "columns"');
  s.addText('Rename the header to form, then link the sheet:', { x: 6.3, y: 1.65, w: 6.5, h: 0.4, fontFace: FONT, fontSize: 14, bold: true, color: DARK });
  table(s, [
    [{ text: 'form', bold: true }, ''],
    [{ text: '/forms-poc/contact-form.json', mono: true, color: BLUE }, { text: '(optional) where to send entries', color: GREY }],
  ], { x: 6.3, y: 2.15, w: 6.5, colW: [3.5, 3.0], fontSize: 12, noHead: true });
  bullets(s, [
    'DA says "Page", not "Document", and its new table is always called "columns". Both confused us at first.',
    'Cell 1: a link to the sheet. Cell 2: a submit address. Form A sends to Excel in OneDrive through Power Automate.',
    'Preview the page. The form appears only on the forms-poc branch address, because that is where the block code is.',
  ], { x: 6.3, y: 3.3, w: 6.5, h: 3.0, fontSize: 13 });
  open(s, [['A finished page in DA (booking)', U.daBookingPage], ['Form B sheet in DA', U.daBookingSheet]]);
  s.addNotes(notes({
    say: 'Step two is a page. In DA you insert a table, which DA always calls "columns", and you rename it to "form". The first cell links to the sheet. The second cell is optional: it is where entries are sent. For Form A I connected it to an Excel table in OneDrive through Power Automate, without an AEM Forms licence.',
    show: 'Click "A finished page in DA (booking)": point at the form table and the link in cell 1. It has the same structure as Form A.',
    careful: 'Open the booking page here, not the contact page. The contact page shows the Power Automate address in cell 2, and anyone with that address can add rows to the Excel sheet.',
    labels: 'Tested: block table and link (A07); OneDrive saving tested 5 Nov.',
    transition: 'And this is the result.',
    time: '1:30',
  }));
}

// ================================================================ DA result
{
  const s = base('Part 1 · DA by hand', 'The result: Form A on the website');
  img(s, 'E01-formA-contact-rendered.png', 0.5, 1.65, 6.0, 3.4, 1280, 552, 'Form A as visitors see it');
  img(s, 'E01-formA-contact-empty-submit-error.png', 6.8, 1.65, 6.0, 3.4, 1280, 552, 'Sending it empty: stops at the first required field');
  bullets(s, [
    'Four fields and a button, all required, exactly as typed in the sheet.',
    'Our test (T1–T4): empty send, bad email and empty choices are all blocked. The web address never changes.',
    'Hands-on: about 35 minutes and 10 steps, with 5 small typing slips (cosmetic) and one lost save.',
  ], { y: 4.85, h: 1.6, fontSize: 13 });
  open(s, [['Form A live (branch preview)', U.contact]]);
  s.addNotes(notes({
    say: 'Here is Form A on the website. Everything comes from the sheet: labels, placeholders, the dropdown options, and the required fields. It took me about 35 minutes and ten steps. It works, but it is slow, and small typing slips creep in.',
    show: 'Click "Form A live" and scroll. Optional: click Send Message with everything empty to show the browser stopping at Full Name.',
    careful: 'Do NOT send a filled-in entry on Form A: it really writes a row to the OneDrive Excel sheet.',
    labels: 'Tested: T1–T4 on 5 Nov (E01).',
    transition: 'Now the same job with Ema.',
    time: '1:30',
  }));
}

// ================================================================ Part 2 divider
{
  const s = divider(2, 'With Ema', 'Form B from one request in about 4 minutes, then an advanced form from plain business rules.');
  s.addNotes(notes({ say: 'Part two: Ema, the Experience Modernization Agent. First a normal form, then an advanced one.', time: '0:10' }));
}

// ================================================================ Ema Form B
{
  const s = base('Part 2 · Ema', 'Form B: one plain request, about 4 minutes, 2 approvals');
  img(s, 'E02-formB-booking-rendered.png', 0.5, 1.65, 6.0, 3.6, 1280, 724, 'Form B: 7 field types, all from one request');
  img(s, 'E03-formB-sheet-json.png', 6.8, 1.65, 6.0, 3.6, 1280, 900, 'The sheet Ema wrote, as the website reads it');
  bullets(s, [
    'I asked in plain words: an adventure booking form with these fields. Ema wrote the sheet and page and tested them in a browser first.',
    'It asked before uploading to DA, then checked DA row by row ("8 of 8 rows match") and previewed. It never publishes.',
    'In its own testing it found a real bug (D1: an empty send leaked the typed values into the web address) and fixed it for both forms.',
  ], { y: 5.25, h: 1.25, fontSize: 12 });
  open(s, [['Form B live', U.booking], ['Form B sheet in DA', U.daBookingSheet], ['Sheet JSON', U.bookingJson]]);
  s.addNotes(notes({
    say: 'For Form B I simply described an adventure booking form to Ema. In about four minutes it wrote the sheet and the page, tested them in a browser, asked me before uploading, then checked the DA copy row by row and previewed it. Same sheet format as Form A, same block. And while testing, it found a real bug in the standard block, where an empty send put the visitor\'s details in the web address, and fixed it.',
    show: 'Click "Form B live" and scroll through the 7 field types. Then "Form B sheet in DA": "the same kind of sheet I typed by hand, written by Ema".',
    observe: 'Same structure as Form A, more field types, no slips.',
    labels: 'Tested: 4 min + 2 approvals (5 Nov log); D1 fixed and retested.',
    transition: 'A booking form is easy. So we gave Ema real business requirements.',
    time: '1:30',
  }));
}

// ================================================================ Ema advanced
{
  const s = base('Part 2 · Ema', 'Advanced form: business rules in, a working 3-step form out');
  img(s, 'G02-live-advanced-empty-errors.png', 0.5, 1.65, 4.0, 2.4, 1280, 641, 'Rules with clear messages');
  img(s, 'G03-live-business-company-required.png', 4.67, 1.65, 4.0, 2.4, 1280, 776, 'Business shows Company (required)');
  img(s, 'G04-live-review.png', 8.83, 1.65, 4.0, 2.4, 1280, 451, 'Review step before sending');
  table(s, [
    ['Requirement', 'What Ema did', 'Result'],
    ['Field rules: letters-only name, 10-digit phone, address characters, own messages', 'Sheet rows + extended the block (pattern, error, help columns)', G('Pass (live)')],
    ['3 steps, Next/Previous, progress, values kept, review, no early send', 'Step and review rows + block code', G('Pass (live)')],
    ['Business → Company (required) + Job title; Personal hides them', 'Sheet only: the block already had a conditional column', G('Pass (live)')],
    ['Thank-you page after sending', 'One confirmation row + a 3-line code change', G('Pass (live)')],
  ], { y: 4.4, colW: [5.2, 5.0, 2.1], fontSize: 11 });
  open(s, [['Advanced form live', U.adv], ['Its sheet in DA', U.daAdvSheet], ['Thank-you page', U.thanks]]);
  s.addNotes(notes({
    say: 'Then the real test: plain business requirements. Strict field rules with friendly messages, three steps with a review, and fields that only appear for business enquiries. Some of that the block could not do. Ema read the block code, added the missing features as opt-in columns, so Forms A and B did not change, and tested everything before and after upload.',
    show: 'Click "Advanced form live": point at "Step 1 of 3" and the Next button. Optional, no typing: click Next with everything empty to show the messages. Then "Its sheet in DA": point at the step rows and the pattern and error columns.',
    observe: 'A multi-step form that is still just a sheet; the rules are visible as columns.',
    labels: 'Tested: every row Pass (live) on 11 Nov (advanced-capability-matrix.md, G01–G06). Thank-you page: Pass (live), G06.',
    qa: 'Q: Does extending the block break other forms? A: No. The new columns are opt-in; Forms A and B were regression-tested unchanged.',
    transition: 'Why could Ema do this? Because it can see the code.',
    time: '2:00',
  }));
}

// ================================================================ Ema: what made the difference
{
  const s = base('Part 2 · Ema', 'What made the difference: Ema can read, extend and test the code');
  box(s, 'Reads the code', 0.5, 1.7, 3.95, 0.55, RED);
  bullets(s, ['Found the exact sheet format the block reads, instead of guessing', 'Spotted what the block could not do yet'], { x: 0.5, y: 2.35, w: 3.95, h: 2.4, fontSize: 13 });
  box(s, 'Extends the block', 4.69, 1.7, 3.95, 0.55, RED);
  bullets(s, ['Added steps, review, field rules, messages and a thank-you page', 'Opt-in, on a branch: main and the live site untouched'], { x: 4.69, y: 2.35, w: 3.95, h: 2.4, fontSize: 13 });
  box(s, 'Tests its own work', 8.88, 1.7, 3.95, 0.55, RED);
  bullets(s, ['Browser tests before upload, row check after', 'Found and fixed 2 bugs itself (D1 and D2)'], { x: 8.88, y: 2.35, w: 3.95, h: 2.4, fontSize: 13 });
  s.addText('Human effort: 1 request, 1–2 approvals, and a Sync push for code changes.', { x: 0.5, y: 4.9, w: 12.3, h: 0.4, fontFace: FONT, fontSize: 14, bold: true, color: DARK });
  s.addText('Limits seen: lost DA and GitHub access after a session restart (fixed in Settings); code is pushed by the user with Sync.', { x: 0.5, y: 5.35, w: 12.3, h: 0.4, fontFace: FONT, fontSize: 12, color: AMBER, bold: true });
  open(s, [['The block code (forms-poc)', U.code], ['Ema test results', U.advMatrix], ['SOP: sheet format', U.sop]]);
  s.addNotes(notes({
    say: 'Three things made the difference. Ema reads the code, so it knows the exact format the block understands. It can extend the block when something is missing, safely on a branch. And it tests its own work. My part was one request, a couple of approvals, and pushing the code with Sync. The one thing to watch is access: after a restart it lost DA and GitHub access until I switched it back on in Settings.',
    show: 'Optional: click "The block code" to show it is real code on the branch. Click "SOP: sheet format" to show the documented format that anyone can now reuse.',
    labels: 'Tested: from forms-progress.md and advanced-capability-matrix.md. Limitation: access after restarts.',
    transition: 'Now the same requirements for an assistant that cannot see the code.',
    time: '1:00',
  }));
}

// ================================================================ Part 3 divider
{
  const s = divider(3, 'Testing with Experience Workspace', 'The same advanced requirements, given to the assistant inside DA.live. Two rounds: blind, then guided.');
  s.addNotes(notes({ say: 'Part three: Experience Workspace, the assistant inside DA.live. We gave it exactly the same advanced requirements as Ema.', time: '0:10' }));
}

// ================================================================ Workspace: how we tested
{
  const s = base('Part 3 · Experience Workspace', 'How we tested it: same requirements, two rounds, new files only');
  table(s, [
    ['', 'Round 1: blind', 'Round 2: guided'],
    ['What it got', 'The same business requirements Ema got, and the site', 'The same requirements + the exact sheet format Ema found in the code'],
    ['What it made', 'ws-advanced-form + ws-advanced', 'ws2-advanced-form + ws2-advanced'],
    ['Rules for it', 'Create only 2 new items · wait for "approved" · ask before preview · never publish', 'Same'],
  ], { colW: [2.0, 5.15, 5.15], fontSize: 13 });
  bullets(s, [
    'What it says it can do (its own answer): create, change, copy and move DA content; preview and publish; DA tools. It cannot see or change code.',
    'We then ran the same tests we ran on Ema\'s form, on the branch preview.',
  ], { y: 4.0, h: 2.2, fontSize: 14 });
  open(s, [['Round 1 prompt', U.ws1Prompt], ['Round 2 prompt', U.ws2Prompt], ['Full results', U.wsMatrix]]);
  s.addNotes(notes({
    say: 'We ran two rounds. In round one it got only the business requirements, exactly what Ema got. In round two we also gave it the sheet format that Ema had found by reading the code. Each round created new files only, and it had clear rules: wait for approval, ask before preview, never publish. Its own description: it can do a lot with content, including preview and publish, but it cannot see or change code.',
    show: 'Optional: click "Round 1 prompt" to show the exact wording, so the audience sees it was a fair test.',
    labels: 'Tested: both rounds on 11 Nov. Self-reported: its capability list.',
    transition: 'Round one first.',
    time: '1:00',
  }));
}

// ================================================================ Workspace round 1
{
  const s = base('Part 3 · Experience Workspace', 'Round 1 (blind): it guessed the format, and the block ignored it');
  img(s, 'H01-ws-form-rendered.png', 0.5, 1.6, 4.4, 4.6, 1280, 1137, 'Round 1: one long page, no steps');
  table(s, [
    ['It wrote this column', 'The block reads', 'What happened'],
    [{ text: 'validation', mono: true }, { text: 'pattern', mono: true }, '"John3" and a 5-digit phone were accepted'],
    [{ text: 'errorMessage', mono: true }, { text: 'error', mono: true }, 'Only the browser\'s generic bubble'],
    [{ text: 'step (column)', mono: true }, { text: 'type = step (rows)', mono: true }, 'One long page; Enter sent the form'],
    [{ text: 'showIf', mono: true }, { text: 'conditional', mono: true }, 'Company and Job title always visible'],
  ], { x: 5.2, y: 1.65, w: 7.6, colW: [2.2, 2.2, 3.2], fontSize: 12 });
  s.addText([
    { text: 'Result: ', options: { bold: true } },
    { text: '2 pass · 3 partial · 5 fail', options: { bold: true, color: RED } },
  ], { x: 5.2, y: 4.25, w: 7.6, h: 0.4, fontFace: FONT, fontSize: 16, color: DARK });
  bullets(s, [
    'The form looked fine, but none of the rules worked, and nothing warned anyone.',
    'To its credit it was honest: it said steps and rules "depend on the block\'s JavaScript".',
    'It also added a US ZIP code rule that nobody asked for.',
  ], { x: 5.2, y: 4.7, w: 7.6, h: 1.7, fontSize: 13 });
  open(s, [['Round 1 form live', U.ws1], ['Its sheet in DA', U.daWs1Sheet], ['Its sheet as JSON', U.ws1Json]]);
  s.addNotes(notes({
    say: 'Without code access it had to guess the column names. Its guesses were sensible, validation, errorMessage, showIf, but they are not what our block reads, so the block silently ignored them. The form looks fine, but the rules do nothing. Two of ten requirement groups passed. To be fair, it told us itself that this behaviour depends on code.',
    show: 'Click "Round 1 form live" and scroll: one long page, no steps. Then "Its sheet in DA": point at the column headers validation, errorMessage, step, showIf.',
    observe: 'The page looks like a normal form; the difference only shows in the column names and in testing.',
    labels: 'Tested: 11 Nov (workspace-capability-matrix.md, H01, H02).',
    qa: 'Q: Is that the assistant\'s fault? A: Mostly not. It cannot see the code, so the format has to be written down for it. That is now in the SOP.',
    transition: 'So in round two we gave it the format.',
    time: '1:30',
  }));
}

// ================================================================ Workspace round 2
{
  const s = base('Part 3 · Experience Workspace', 'Round 2 (guided): given the format, it got close to Ema');
  img(s, 'H11-ws2-step1.png', 0.5, 1.6, 4.0, 2.2, 1280, 588, 'Steps and progress');
  img(s, 'H13-ws2-step2-business-errors.png', 4.67, 1.6, 4.0, 2.2, 1280, 1103, 'Business fields appear');
  img(s, 'H14-ws2-review.png', 8.83, 1.6, 4.0, 2.2, 1280, 647, 'Review step');
  s.addText([
    { text: 'Result: ', options: { bold: true } },
    { text: '9 pass · 2 partial · 1 fail', options: { bold: true, color: GREEN } },
  ], { x: 0.5, y: 4.2, w: 12.3, h: 0.4, fontFace: FONT, fontSize: 16, color: DARK });
  table(s, [
    ['Still wrong', 'Why it matters'],
    ['Company name not required for Business (it left "required" empty)', 'A business enquiry can arrive with no company. Partly our wording.'],
    ['Enquiry type dropdown with no placeholder', 'It defaults to "Personal", so the visitor never really chooses'],
    ['US ZIP rule again, after being told not to, with broken syntax', 'Unrequested, and the browser silently ignores it'],
  ], { y: 4.65, colW: [6.5, 5.8], fontSize: 11 });
  open(s, [['Round 2 form live', U.ws2], ['Its sheet in DA', U.daWs2Sheet], ['Full results', U.wsMatrix]]);
  s.addNotes(notes({
    say: 'With the right format it built fifteen correct rows: three steps, field rules with messages, the conditional business fields and a review. Nine passes. But note why it worked: it reused the code Ema had written. It still left Company Name optional for business enquiries, and it added the ZIP code rule again, this time with syntax the browser rejects.',
    show: 'Click "Round 2 form live": point at "Step 1 of 3" and Next. Then "Its sheet in DA": the same columns as Ema\'s sheet.',
    observe: 'Round 2 looks and behaves like Ema\'s form, apart from the three items in the table.',
    labels: 'Tested: 11 Nov (H11–H14).',
    transition: 'What was it like to work with?',
    time: '1:30',
  }));
}

// ================================================================ Workspace experience
{
  const s = base('Part 3 · Experience Workspace', 'What it was like to work with');
  box(s, 'Good', 0.5, 1.6, 6.0, 0.5, GREEN);
  bullets(s, [
    'Proposed a plan and waited for "approved" before creating anything',
    'Asked again before previewing, and never published',
    'Changed no other file (we checked in DA)',
    'Honest about what depends on code',
  ], { x: 0.5, y: 2.2, w: 6.0, h: 3.0, fontSize: 14 });
  box(s, 'Watch out', 6.8, 1.6, 6.0, 0.5, AMBER);
  bullets(s, [
    'Without the format it guesses, and wrong columns fail silently',
    'Adds rules nobody asked for',
    'Does not test its own work: all checks were ours',
    'Cannot add new behaviour, because it has no code access',
  ], { x: 6.8, y: 2.2, w: 6.0, h: 3.0, fontSize: 14 });
  s.addText('Now in the SOP (Part C): the sheet format, a row checklist for checking its work, and a ready-made prompt.', { x: 0.5, y: 5.45, w: 12.3, h: 0.6, fontFace: FONT, fontSize: 14, bold: true, color: DARK });
  open(s, [['SOP with the Experience Workspace part', U.sop]]);
  s.addNotes(notes({
    say: 'Working with it was safe and polite: it always asked first, never published, and touched nothing else. The risk is silent failure. If it does not know the format, the form looks right but does not behave. So I have added a part to the SOP with the exact format, a checklist for reviewing its rows, and a prompt you can copy.',
    show: 'Optional: click the SOP link and scroll to "Part C: Build a form with Experience Workspace".',
    labels: 'Tested: behaviour in both rounds. Hands-on time: not recorded.',
    transition: 'All three side by side.',
    time: '1:00',
  }));
}

// ================================================================ Side by side + recommendation
{
  const s = base('Summary', 'Three ways side by side, and when to use which');
  table(s, [
    ['', 'DA by hand', 'Ema', 'Experience Workspace'],
    ['Time for a normal form', 'About 35 min, 10 steps', 'About 4 min + 2 approvals', N('Not recorded')],
    ['Can change the block code', N('n/a'), G('Yes'), R('No')],
    ['Advanced requirements', N('Not attempted'), G('All passed'), A('Blind 2 pass · guided 9 pass')],
    ['Tests its own work', 'The author checks', G('Yes'), R('No')],
    ['Asks first, never publishes', N('n/a'), G('Yes'), G('Yes')],
    ['Use it for', 'Small edits; authors who own the form', 'New or advanced forms; extending the block', 'Content changes once the format is documented'],
  ], { colW: [2.6, 3.0, 3.3, 3.4], fontSize: 12 });
  s.addText('Best together: Ema extends the block once and documents the format → authors or Experience Workspace build forms in DA → the author previews and tests → publish through the normal process.', { x: 0.5, y: 5.2, w: 12.3, h: 0.9, fontFace: FONT, fontSize: 15, bold: true, color: DARK });
  open(s, [['Full POC deck (25 slides)', U.fullDeck], ['Progress log', U.log]]);
  s.addNotes(notes({
    say: 'Side by side: by hand is slow but needs nothing extra. Ema is fastest and is the only one that can change the code, which is why it handled every advanced requirement. Experience Workspace is safe for content, but it depends on someone writing down the format. My recommendation is to use them together: Ema builds and documents the block once, then authors or Experience Workspace create forms with that format, and the author always previews and tests before anything is published.',
    labels: 'Tested: from forms-progress.md and both capability matrices. Unknown: Experience Workspace hands-on time.',
    qa: 'Q: Can we go live? A: Not yet. The block is still on a branch and needs a normal pull request, and saving entries in production needs either the Power Automate route with spam protection or an AEM Forms licence.',
    transition: 'Every link is on the last slide.',
    time: '1:30',
  }));
}

// ================================================================ All links
{
  const s = base('Links', 'Everything to open and show');
  const link = (label, url) => ({ text: label, options: { color: BLUE, underline: { style: 'sng' }, hyperlink: { url, tooltip: url } } });
  const col = (x, title, items) => {
    s.addText(title, { x, y: 1.6, w: 4.0, h: 0.4, fontFace: FONT, fontSize: 14, bold: true, color: RED });
    const runs = [];
    items.forEach(([label, url]) => {
      runs.push({ ...link(label, url), options: { ...link(label, url).options, breakLine: true, bullet: { code: '25A0', indent: 12 }, paraSpaceAfter: 6 } });
    });
    s.addText(runs, { x, y: 2.05, w: 4.0, h: 4.4, fontFace: FONT, fontSize: 12, valign: 'top' });
  };
  col(0.5, 'Part 1 · DA by hand', [
    ['DA folder /forms-poc', U.daFolder],
    ['Form A sheet in DA', U.daContactSheet],
    ['Form A sheet as JSON', U.contactJson],
    ['Form A live (do not send real data)', U.contact],
    ['A page with the form block (booking)', U.daBookingPage],
  ]);
  col(4.67, 'Part 2 · Ema', [
    ['Form B live', U.booking],
    ['Form B sheet in DA', U.daBookingSheet],
    ['Advanced form live', U.adv],
    ['Advanced sheet in DA', U.daAdvSheet],
    ['Thank-you page', U.thanks],
    ['Block code (forms-poc)', U.code],
    ['Ema test results', U.advMatrix],
  ]);
  col(8.83, 'Part 3 · Experience Workspace', [
    ['Round 1 form live', U.ws1],
    ['Round 1 sheet in DA', U.daWs1Sheet],
    ['Round 2 form live', U.ws2],
    ['Round 2 sheet in DA', U.daWs2Sheet],
    ['Round 1 and 2 prompts', U.ws2Prompt],
    ['Workspace test results', U.wsMatrix],
    ['SOP (Part C)', U.sop],
  ]);
  s.addText('DA links need you to be logged in to DA.live. All website links are the forms-poc branch preview: nothing here is published.', { x: 0.5, y: 6.5, w: 12.3, h: 0.4, fontFace: FONT, fontSize: 11, italic: true, color: GREY });
  s.addNotes(notes({
    say: 'All links are here, grouped by part, if anyone wants to look again after the session. Questions?',
    time: '0:30 + Q&A',
  }));
}

pptx.writeFile({ fileName: OUT }).then((f) => console.log('written', f, n, 'slides'));
