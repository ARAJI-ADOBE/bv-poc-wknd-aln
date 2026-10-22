const PptxGenJS = require('pptxgenjs');

const EV = '/backups/ARAJI-ADOBE/bv-poc-wknd-aln/repo/testing/scheduler/evidence/';
const OUT = '/backups/ARAJI-ADOBE/bv-poc-wknd-aln/repo/testing/scheduler/Scheduled-Publishing-EDS-v5.pptx';

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
pptx.title = 'Scheduled Publishing in Edge Delivery Services';
pptx.subject = 'EDS scheduled publishing: manual, Ema and Experience Workspace, tested 19–22 Oct 2026';

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

const URL = {
  prev: 'https://main--bv-poc-wknd-aln--araji-adobe.aem.page/us/en/scheduled-publish-test',
  live: 'https://main--bv-poc-wknd-aln--araji-adobe.aem.live/us/en/scheduled-publish-test',
  config: 'https://da.live/config#/araji-adobe/bv-poc-wknd-aln/',
  sched: 'https://da.live/apps/scheduler  (enter /araji-adobe/bv-poc-wknd-aln/)',
  edit: 'https://da.live/edit#/araji-adobe/bv-poc-wknd-aln/us/en/scheduled-publish-test',
  cron: 'https://da.live/sheet#/araji-adobe/bv-poc-wknd-aln/.helix/crontab',
  beer: 'https://main--bv-poc-wknd-aln--araji-adobe.aem.live/us/en/adventures/beervana-portland',
  media: 'https://main--bv-poc-wknd-aln--araji-adobe.aem.live/us/en/media_171704bfe62ecbfe053083487fe19f22094048810.png',
  frag: 'https://main--bv-poc-wknd-aln--araji-adobe.aem.live/us/en/sched-frag-page',
  pdf: 'https://da.live/media#/araji-adobe/bv-poc-wknd-aln/us/en/expiry-test.pdf',
};

// ---------------------------------------------------------------- 1 Title
{
  n += 1;
  const s = pptx.addSlide();
  s.background = { color: 'FFFFFF' };
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.22, h: 7.5, fill: { color: RED }, line: { color: RED } });
  s.addImage({ path: EV + 'adobe-logo.png', x: 0.8, y: 0.6, w: 2.07, h: 0.5, altText: 'Adobe' });
  s.addText('EDS  ·  Experience Workspace  ·  EMA', { x: 0.8, y: 1.75, w: 11, h: 0.4, fontFace: FONT, fontSize: 14, bold: true, color: RED, charSpacing: 1 });
  s.addText('Scheduled Publishing in Edge Delivery Services', { x: 0.8, y: 2.2, w: 11.5, h: 1.1, fontFace: FONT, fontSize: 38, bold: true, color: DARK });
  s.addText('Manual, Ema-assisted and Experience Workspace approaches, tested on a live sandbox', { x: 0.8, y: 3.3, w: 11.5, h: 0.5, fontFace: FONT, fontSize: 18, color: GREY });
  s.addText('We enabled, ran and verified scheduled publishing on bv-poc-wknd-aln, compared Ema with Experience Workspace, and tested fragment, asset and expiry behaviour requested by the team.', { x: 0.8, y: 4.0, w: 11, h: 0.8, fontFace: FONT, fontSize: 14, color: DARK });
  s.addText([
    { text: 'ALAN RAJI MANI', options: { bold: true, breakLine: true } },
    { text: 'araji@adobe.com  ·  23 Oct 2026', options: { color: GREY } },
  ], { x: 0.8, y: 5.2, w: 11, h: 0.8, fontFace: FONT, fontSize: 14, color: DARK });
  footer(s);
  s.addNotes(notes({
    say: 'Good morning everyone. Today I\'ll walk you through scheduled publishing in Edge Delivery Services: what it is, why marketers need it, how we did it manually, how Ema did it, and what happened when we tried the same task with Experience Workspace. After that I\'ll cover the three additional investigations Abhishek and Mohit asked for: what happens to assets when a page is unpublished, whether fragments and assets are published with a scheduled page, and whether assets can be unpublished based on expiry metadata. Everything I show was tested on our sandbox site, bv-poc-wknd-aln, between 19 and 22 October. Wherever something is only documented or not yet tested, I\'ll say so explicitly.',
    explain: 'Set expectations: green "Tested" means we proved it on the site; blue "Documented" means Adobe\'s docs say it; amber "Limitation" is an observed constraint; grey "Unknown" means not tested yet.',
    transition: '"Let\'s start with what scheduling actually means in EDS."',
    time: '0:30',
  }));
}

// ---------------------------------------------------------------- 2 Explain scheduling
{
  const s = base('1 · Explain scheduling', 'How publishing and scheduling work in EDS');
  box(s, 'Editor\nda.live', 0.7, 1.85, 2.4, 1.0, DARK);
  arrow(s, 3.15, 2.35, 4.35); s.addText('Preview', { x: 3.1, y: 1.9, w: 1.3, h: 0.3, fontFace: FONT, fontSize: 11, color: GREY, align: 'center' });
  box(s, 'Preview site\n.aem.page', 4.4, 1.85, 2.4, 1.0, '505050');
  arrow(s, 6.85, 2.35, 8.05); s.addText('Publish', { x: 6.8, y: 1.9, w: 1.3, h: 0.3, fontFace: FONT, fontSize: 11, color: GREY, align: 'center' });
  box(s, 'Live site\n.aem.live', 8.1, 1.85, 2.4, 1.0, RED);
  s.addText([
    { text: 'Publishing = copying the PREVIEW version to live.  ', options: { bold: true } },
    { text: 'Scheduling = doing that copy automatically at a chosen time.', options: {} },
  ], { x: 0.7, y: 3.0, w: 12, h: 0.4, fontFace: FONT, fontSize: 14, color: DARK });
  table(s, [
    ['', 'Editor "Schedule Publish"', 'Schedule sheet (crontab)'],
    ['Used by', 'Authors, inside the editor', 'Admins and automation (Ema)'],
    ['Where', 'Prepare menu → Schedule Publish', '/.helix/crontab sheet: "when" + "command" rows'],
    ['Time', "Author's browser time zone, to the minute", 'UTC, runs on 5-minute ticks'],
    ['Status on our site', T('Tested 22 Oct'), T('Tested 19 Oct')],
  ], { y: 3.55, colW: [2.2, 5.05, 5.05], fontSize: 12 });
  live(s, `${URL.prev}   →   ${URL.live}`);
  s.addNotes(notes({
    say: 'In Edge Delivery Services an author edits content in the editor, da.live. Clicking Preview creates a draft version on the .aem.page address. Clicking Publish copies that preview to the .aem.live address, which is what the public sees. Scheduled publishing simply automates that second step: it copies preview to live at a time you choose, so nobody has to be online at go-live.',
    click: 'Open the preview URL of /us/en/scheduled-publish-test, then the live URL. Point at the host names in the address bar.',
    observe: 'The same page served from two hosts: .aem.page (preview) and .aem.live (live).',
    explain: 'There are two independent schedulers on the same site. The editor\'s Schedule Publish is the author-facing one we enabled for the manual test. The schedule sheet, called the crontab, is an admin sheet of "when" and "command" rows; that is what Ema used on 19 October. Both were proven on our site.',
    labels: 'Tested: both mechanisms. Documented: preview/publish model (aem.live docs).',
    transition: '"So why does the business need this?"',
    qa: 'Q: Are the two schedulers the same thing?\nA: No. Our crontab tests on 19 October ran while the editor scheduler wasn\'t even registered for the site.\n\nQ: Which one should authors use?\nA: The editor one for single pages; the sheet for bulk publishing and scheduled unpublishing, which the editor dialog doesn\'t offer.',
    time: '1:00',
  }));
}

// ---------------------------------------------------------------- 3 Business use case
{
  const s = base('2 · Business use case', 'Why marketers need scheduled publishing');
  s.addText('Content must go live at a precise moment, often outside working hours or in another time zone, without someone clicking Publish.', { x: 0.5, y: 1.55, w: 12.3, h: 0.5, fontFace: FONT, fontSize: 15, color: DARK });
  const tiles = [
    ['Campaign or product launch', 'Go live at an exact time'],
    ['Embargoed announcement', 'Publish when the embargo lifts'],
    ['Global launch', 'Target another time zone'],
    ['Time-limited promotion', 'Go live, then come down'],
  ];
  tiles.forEach((t, i) => {
    const x = 0.5 + i * 3.1;
    s.addShape(pptx.ShapeType.roundRect, { x, y: 2.15, w: 2.9, h: 1.35, fill: { color: LIGHT }, line: { color: RED, width: 1.25 }, rectRadius: 0.08 });
    s.addText([{ text: `${i + 1}. ${t[0]}`, options: { bold: true, breakLine: true, color: DARK } }, { text: t[1], options: { color: GREY } }], { x: x + 0.1, y: 2.15, w: 2.7, h: 1.35, fontFace: FONT, fontSize: 13, align: 'center', valign: 'middle' });
  });
  s.addText('Illustrative scenarios', { x: 0.5, y: 3.52, w: 12.3, h: 0.25, fontFace: FONT, fontSize: 9, italic: true, color: GREY });
  table(s, [
    ['Marketer requirement', 'How it is covered', 'Evidence'],
    ['Pick a date and time in the UI', 'Editor Schedule Publish', T('Tested')],
    ['Change or cancel the plan', 'Reschedule in the dialog; Delete in the scheduler list', T('Tested')],
    ['Many pages at once', 'Schedule sheet multi-command row (via Ema); Snapshots', { text: 'Tested · Snapshots documented', color: GREEN, bold: true }],
    ['Take content down on time', 'Schedule sheet "unpublish" command (via Ema)', T('Tested')],
    ['Proof that it happened', 'Admin audit log + page status', T('Tested')],
  ], { y: 3.85, colW: [3.6, 5.6, 3.1], fontSize: 12 });
  s.addNotes(notes({
    say: 'The business problem is simple: content has to appear, and sometimes disappear, at an exact moment. Think of a product launch at midnight, an embargoed press release, a launch timed for another market, or a promotion that must end on time. Without scheduling, someone has to be online to click Publish. These four scenarios are illustrative, but every requirement in the table maps to something we actually tested.',
    explain: 'Point out that "take content down on time" is only covered by the schedule sheet, which Ema used. The editor dialog we tested offers no scheduled unpublish.',
    labels: 'Scenarios: illustrative. Requirements table: Tested, except Snapshots (Documented).',
    transition: '"Let\'s look at the manual way first, without Ema."',
    qa: 'Q: Can an author schedule an unpublish in the UI?\nA: Not in the editor dialog we tested. Scheduled unpublish worked through the schedule sheet.\n\nQ: What are Snapshots?\nA: Adobe\'s documented way to publish a set of pages and resources together after review. We did not test scheduling a snapshot.',
    time: '1:00',
  }));
}

// ---------------------------------------------------------------- 4 Manual setup
{
  const s = base('3 · Manual scheduled publishing', 'Setup: two switches to enable Schedule Publish');
  bullets(s, [
    { text: 'Before: no site config existed, and the menu item was absent', bold: true },
    { text: 'Tested, 22 Oct', sub: true, color: GREEN },
    { text: 'Switch 1: site config → "prepare" tab → row title = Schedule Publish', bold: true },
    { text: 'path, icon and ref left empty (Adobe-provided plugin). Tested', sub: true, color: GREEN },
    { text: 'Switch 2: da.live/apps/scheduler → /araji-adobe/bv-poc-wknd-aln/ → Register site', bold: true },
    { text: 'No "success" message; the empty queue appears. The audit log shows an admin API key created. Tested', sub: true, color: GREEN },
    { text: 'Reference (link, not duplicated):', bold: true },
    { text: 'aem.live/docs/ew/administering/schedule-publish', sub: true, color: BLUE },
    { text: 'demo.bbird.live/demo-docs/usecases/how-to-schedule-publish', sub: true, color: BLUE },
  ], { w: 5.6, fontSize: 13 });
  img(s, 'M0-site-config-empty.jpg', 6.3, 1.55, 3.15, 2.1, 957, 1347, 'Site config before setup (empty)');
  img(s, '03-config-prepare-row.jpg', 9.7, 1.55, 3.15, 2.1, 1269, 981, 'Switch 1: "prepare" row added');
  img(s, '04-scheduler-not-registered.jpg', 6.3, 4.05, 3.15, 2.1, 936, 497, 'Scheduler app: site not registered');
  img(s, 'M2b-scheduler-registered.jpg', 9.7, 4.05, 3.15, 2.1, 1265, 1303, 'Switch 2: site registered (empty queue)');
  live(s, `${URL.config}   ·   ${URL.sched}`);
  s.addNotes(notes({
    say: 'Schedule Publish is off by default. When we started, the site had no configuration at all and the editor had no Schedule Publish option. Enabling it took two switches. First, one row in the site configuration: a "prepare" tab with a row titled Schedule Publish. That makes the menu item appear. Second, registering the site in Adobe\'s scheduler app, so the background service actually runs jobs for us.',
    click: 'Open the site config and show the "prepare" tab with the row. Then open the scheduler app, enter /araji-adobe/bv-poc-wknd-aln/ and click Load schedules.',
    observe: 'A one-row configuration, and the scheduler app showing the site\'s queue.',
    explain: 'Two observations not in the docs: registration shows no success message, it simply switches to the queue view; and the audit log shows that registering created an admin API key for the site.',
    labels: 'Tested: before state, config row, registration. Documented: setup steps (link to the references, don\'t repeat them).',
    transition: '"With that in place, scheduling a page takes four clicks."',
    qa: 'Q: Site or org level?\nA: We used site level so only this site is affected. The docs allow either.\n\nQ: Can it be limited to some users?\nA: The docs mention the "ref" column for that. We left it empty and didn\'t test it.\n\nQ: How do you unregister?\nA: Not documented. Unknown.',
    time: '1:00',
  }));
}

// ---------------------------------------------------------------- 5 Manual scheduling a page
{
  const s = base('3 · Manual scheduled publishing', 'Scheduling a page, and proof of auto-preview');
  box(s, 'Open page', 0.5, 1.65, 1.45, 0.6, DARK, 'FFFFFF', 11);
  arrow(s, 1.98, 1.95, 2.18);
  box(s, 'Prepare (icon)', 2.2, 1.65, 1.45, 0.6, DARK, 'FFFFFF', 11);
  arrow(s, 3.68, 1.95, 3.88);
  box(s, 'Schedule Publish', 3.9, 1.65, 1.45, 0.6, DARK, 'FFFFFF', 11);
  arrow(s, 5.38, 1.95, 5.58);
  box(s, 'Set time → Schedule', 5.6, 1.65, 1.6, 0.6, RED, 'FFFFFF', 11);
  table(s, [
    ['Test page (never previewed)', 'Before scheduling', 'Right after'],
    ['Preview', NO('none (404)'), T('created 11:50:58 IST')],
    ['Live', 'none', 'none (correct)'],
  ], { x: 0.5, y: 2.55, w: 6.7, colW: [2.5, 2.1, 2.1], fontSize: 12 });
  bullets(s, [
    { text: 'Scheduling previews the page automatically', bold: true },
    { text: 'Documented, and Tested', sub: true, color: GREEN },
    { text: 'Rescheduling previews it again', sub: true, color: GREEN },
    { text: 'Dialog uses the browser time zone: "Schedule (Asia/Calcutta)"', bold: true },
    { text: 'Tested; not in the docs', sub: true, color: GREEN },
    { text: 'The Prepare button is an icon with no "Prepare" label', bold: true },
  ], { y: 3.75, w: 6.7, h: 2.8, fontSize: 13 });
  img(s, 'M3-prepare-menu-schedule-publish.jpg', 7.45, 1.6, 2.6, 4.6, 1268, 1307, 'Prepare menu with Schedule Publish');
  img(s, 'M5-schedule-dialog-asia-calcutta.jpg', 10.25, 1.6, 2.6, 4.6, 1274, 1300, 'Schedule dialog with browser time zone');
  live(s, `${URL.edit}   (open the Prepare icon only; don't schedule)`);
  s.addNotes(notes({
    say: 'Scheduling itself is four clicks: open the page, click the Prepare icon, choose Schedule Publish, set the time and click Schedule. Note the Prepare button is just an icon with no label, so people looking for the word "Prepare" won\'t find it. The docs claim that scheduling previews the page automatically. We tested that with a brand-new page that had never been previewed. The moment we clicked Schedule, a preview appeared.',
    click: 'Open the editor for /us/en/scheduled-publish-test, click the Prepare icon and show the menu. Optionally open Schedule Publish to show the dialog, then close it with X. Don\'t click Schedule.',
    observe: 'The menu with Preflight, Unpublish and Schedule Publish; the dialog label "Schedule (Asia/Calcutta)" and the "Scheduled by… Reschedule?" text on a page that is already scheduled.',
    explain: 'The auto-preview is important: you don\'t have to preview before the first schedule. The time zone comes from the author\'s browser, which matters for global teams.',
    labels: 'Tested: auto-preview, re-preview on reschedule, browser time zone. Documented: auto-preview claim.',
    transition: '"So what actually went live?"',
    qa: 'Q: Do I need to preview before scheduling?\nA: Not for the first schedule; it previews for you. But if you edit afterwards, see the next slide.\n\nQ: What if authors are in different time zones?\nA: The dialog uses each author\'s browser time zone and shows its name, so check that label.',
    time: '1:00',
  }));
}

// ---------------------------------------------------------------- 6 Manual results
{
  const s = base('3 · Manual scheduled publishing', 'Verified results, and the key insight');
  table(s, [
    ['Time (IST, 22 Oct)', 'What happened', 'Evidence'],
    ['12:00:08', 'Page published by the system account helix@adobe.com', T('Audit log')],
    ['12:00', 'Live = V1 only. The V2 edit made after scheduling, not previewed, did NOT go live', T('Figures 7–8')],
    ['12:25 → 12:30:07', 'Rescheduled: nothing at the old time; live at the new time', T('Audit log')],
    ['12:40 / 12:45', 'Deleted in the scheduler list (no confirmation): page never went live', T('Figures 10–11')],
  ], { y: 1.55, colW: [2.0, 9.0, 1.3], fontSize: 12 });
  s.addShape(pptx.ShapeType.roundRect, { x: 0.5, y: 3.75, w: 4.3, h: 1.5, fill: { color: 'FDECEA' }, line: { color: RED, width: 1.25 }, rectRadius: 0.08 });
  s.addText([
    { text: 'KEY INSIGHT', options: { bold: true, color: RED, breakLine: true } },
    { text: 'The scheduler publishes the PREVIEW, not later edits. Edit, then preview again, before go-live.', options: { bold: true, color: DARK } },
  ], { x: 0.65, y: 3.75, w: 4.0, h: 1.5, fontFace: FONT, fontSize: 13, valign: 'middle' });
  bullets(s, [
    { text: 'No cancel inside the dialog (only Schedule / X)', color: AMBER, bold: true },
    { text: 'No scheduled unpublish in the dialog', color: AMBER, bold: true },
  ], { y: 5.4, w: 4.3, h: 1.1, fontSize: 11 });
  img(s, '11b-editor-shows-v1-and-v2.jpg', 5.1, 3.7, 3.7, 2.6, 895, 724, 'Editor: V1 + V2 (V2 not previewed)');
  img(s, '11-live-page-after-publish.jpg', 9.05, 3.7, 3.8, 2.6, 934, 442, 'Live page: V1 only');
  live(s, URL.live);
  s.addNotes(notes({
    say: 'Here is what we verified. The page went live 8 seconds after the scheduled minute, published by Adobe\'s system account. Then the key insight, which you can see in Figures 7 and 8: after scheduling, we added a V2 line in the editor without previewing it. At go-live, the live page showed only V1. The scheduler copies whatever is in preview; it doesn\'t re-preview the editor content. So the rule for authors is: edit, preview again, then let the schedule run.',
    click: 'Open the live test page. It now shows V1 and V2, because the later reschedule test re-previewed it.',
    observe: 'Figure 7: the editor with two lines. Figure 8: the live page with only one.',
    explain: 'The docs say scheduled publishing uses "the content as it exists at the time of the scheduled publish". Our test clarifies that this means the PREVIEWED content at that time, not the editor content.',
    labels: 'Tested: publish run, preview-only content, reschedule, delete. Limitation: no cancel inside the dialog; no scheduled unpublish in the dialog.',
    transition: '"We also checked the queue, rescheduling and cancelling."',
    qa: 'Q: Why does the doc say "content as it exists at publish time"?\nA: It means the previewed content at that time. We proved that editor-only changes don\'t go live.\n\nQ: How precise is it?\nA: Runs were 7–8 seconds after the minute (12:00:08, 12:30:07).',
    time: '1:00',
  }));
}

// ---------------------------------------------------------------- 6b Queue, reschedule, cancel
{
  const s = base('3 · Manual scheduled publishing', 'Verified: queue, reschedule and cancel');
  bullets(s, [
    { text: 'Queue (scheduler app): Type, Item, "Publishes on" with time zone and countdown, Requested by, Open / Delete', bold: true },
    { text: 'Figure 9: "Oct 22, 2026, 12:30 PM GMT+5:30 · in 7m · araji@adobe.com". Tested', sub: true, color: GREEN },
    { text: 'Reschedule: reopen the dialog (old time prefilled) → re-preview → only the new time runs', bold: true },
    { text: 'Cancel: Delete in the list, with no confirmation prompt → entry gone → page never went live', bold: true },
  ], { y: 1.55, h: 1.7, fontSize: 13 });
  img(s, '10-scheduler-list-pending.jpg', 0.5, 3.3, 3.95, 2.95, 935, 615, 'Queue with the pending job');
  img(s, '13-scheduler-list-after-delete.jpg', 4.68, 3.3, 3.95, 2.95, 941, 548, 'Queue empty after Delete');
  img(s, '14-live-still-404-after-cancel.jpg', 8.86, 3.3, 3.95, 2.95, 1275, 1143, 'Cancelled page still not live (404)');
  live(s, URL.sched);
  s.addNotes(notes({
    say: 'The scheduler app is the central queue. It shows each scheduled item, when it will publish including the time zone and a countdown, and who requested it. To reschedule, you reopen the dialog on the page; the old time is prefilled, and only the new time runs. To cancel, you click Delete in the list. There\'s no confirmation prompt, the entry disappears, and the page never went live.',
    click: 'Open the scheduler app and click Load schedules. The queue is empty now, since all jobs ran or were deleted.',
    observe: 'The queue columns and the Open / Delete actions.',
    explain: 'Cancel lives only in the scheduler list, not in the page dialog. Be careful in a live demo: Delete has no confirmation.',
    labels: 'Tested: queue view (Figure 9), reschedule, delete (Figures 10 and 11).',
    transition: '"Now the same use case, done with Ema."',
    qa: 'Q: Can a Delete be undone?\nA: There\'s no confirmation and no undo that we saw; you would schedule again.\n\nQ: Does the queue show crontab jobs?\nA: Unknown. When we checked, the crontab only held past rows.',
    time: '0:30',
  }));
}

// ---------------------------------------------------------------- 7 Ema flow
{
  const s = base('4 · Ema-assisted scheduled publishing', 'How Ema scheduled the pages (19 Oct)');
  const steps = [['Discover', 'read-only: 28 pages, status, found the crontab'], ['Plan', 'timed test plan, IST + UTC'], ['Approve', 'user approves every change'], ['Write', 'crontab rows via DA API'], ['Activate', 'preview the sheet'], ['Verify', 'status + audit-log polling'], ['Report', 'evidence workbook']];
  steps.forEach((st, i) => {
    const x = 0.5 + i * 1.78;
    box(s, st[0], x, 1.7, 1.55, 0.6, i === 2 ? RED : DARK, 'FFFFFF', 12);
    s.addText(st[1], { x: x - 0.05, y: 2.35, w: 1.65, h: 0.7, fontFace: FONT, fontSize: 10, color: GREY, align: 'center', valign: 'top' });
    if (i < steps.length - 1) arrow(s, x + 1.56, 2.0, x + 1.77);
  });
  bullets(s, [
    { text: 'Interaction flow: reconstructed from the 19 Oct test log (the original prompt was not retained)', bold: true },
    { text: '20 recorded user entries (plan approval, page choices, per-task approvals, "wait for check") and 24 recorded Ema actions', sub: true },
    { text: 'Ema never published directly: every go-live came from the scheduler', bold: true },
    { text: 'Audit log: only sheet previews (user account) and system indexing entries; no direct publish calls. Tested', sub: true, color: GREEN },
    { text: 'Mechanism: schedule sheet /.helix/crontab (UTC, 5-minute ticks), not the editor plugin', bold: true },
  ], { y: 3.25, w: 7.4, h: 3.2, fontSize: 13 });
  img(s, 'E1-crontab-sheet.jpg', 8.3, 3.2, 4.55, 3.05, 1272, 982, 'Schedule sheet with Ema\'s 5 rows');
  live(s, `${URL.cron}`);
  s.addNotes(notes({
    say: 'On 19 October Ema handled the same use case through the site\'s schedule sheet. It started read-only: it listed all 28 pages, checked which were unpublished, and worked out on its own that the site schedules through a crontab sheet. It proposed a timed plan, and it only changed anything after I approved. Then it wrote the rows, activated them by previewing the sheet, and checked every result itself by polling page status and Adobe\'s audit log. It also produced an evidence workbook.',
    click: 'Open the crontab sheet and show the five rows: when (UTC) and command.',
    observe: 'Plain-language rows such as "at 10:30 am on the 19th day of October in 2026 | publish /us/en/adventures/beervana-portland".',
    explain: 'Be transparent: we don\'t have the exact prompt text; the 19 October chat wasn\'t retained. This flow is reconstructed from Ema\'s own test log, which records 20 user entries and 24 Ema actions.',
    labels: 'Tested: flow and results (workbook + audit log). Reconstructed: interaction flow.',
    transition: '"And here are the results."',
    qa: 'Q: Can we see the prompt?\nA: It wasn\'t retained. The workbook records every approval and choice instead.\n\nQ: Why the crontab and not the editor plugin?\nA: On 19 October the editor plugin wasn\'t enabled yet. Ema found the mechanism that was available.',
    time: '1:00',
  }));
}

// ---------------------------------------------------------------- 8 Ema results
{
  const s = base('4 · Ema-assisted scheduled publishing', 'Results: 5 of 5 tasks passed');
  table(s, [
    ['Test', 'Page(s)', 'Plan (IST, 19 Oct)', 'Result'],
    ['1 · Publish', 'adventures/beervana-portland', '16:00', T('Live 16:00:04')],
    ['2 · Schedule, then cancel', 'adventures/napa-wine-tasting', '16:10 → row removed', T('Never published')],
    ['3 · Reschedule', 'adventures/tahoe-skiing', '16:10 → 16:20', T('Live 16:20:04 only')],
    ['4 · Bulk (4 pages, 1 row)', '4 × magazine pages', '16:25', T('All 4 live 16:25:04–06')],
    ['5 · Publish + unpublish', 'magazine/arctic-surfing', '16:25 / 16:40', T('Live 16:25, removed 16:40')],
  ], { y: 1.65, colW: [2.8, 3.6, 2.6, 3.3], fontSize: 13 });
  bullets(s, [
    { text: 'Verified twice: Ema\'s evidence workbook AND Adobe\'s audit log (17 entries, re-checked 22 Oct)', bold: true },
    { text: 'Live content was identical to preview for all 7 publishes (workbook)', sub: true },
    { text: 'Two capabilities the editor dialog doesn\'t offer: bulk publishing and scheduled unpublish', bold: true, color: GREEN },
  ], { y: 4.55, h: 1.9, fontSize: 13 });
  live(s, URL.beer);
  s.addNotes(notes({
    say: 'All five tasks passed. A single publish, a cancellation, a reschedule, a bulk publish of four pages from one row, and a publish followed by a scheduled unpublish. Every run happened 4 to 6 seconds after its five-minute tick. And we verified it twice: Ema\'s own workbook, and independently, Adobe\'s audit log and page status, which I re-checked on 22 October.',
    click: 'Open the beervana-portland live page.',
    observe: 'A page that went live purely from a schedule row.',
    explain: 'Bulk and scheduled unpublish are things the editor dialog can\'t do, which is Ema\'s main functional advantage in this test.',
    labels: 'Tested: all five tasks.',
    transition: '"So what does Ema really add, and where are its limits?"',
    qa: 'Q: How do we know Ema didn\'t just publish directly?\nA: The audit log shows only sheet previews and system indexing entries; there are no direct publish calls.\n\nQ: Are the pages still live?\nA: Yes, except napa-wine-tasting (cancelled) and arctic-surfing (unpublished), as planned.',
    time: '0:45',
  }));
}

// ---------------------------------------------------------------- 9 Ema value & limits
{
  const s = base('5 · Ema\'s added value and limitations', 'Manual vs Ema: what changes, what doesn\'t');
  table(s, [
    ['', 'Manual (editor Schedule Publish)', 'Ema (schedule sheet)'],
    ['Setup', 'Config row + site registration', 'None in the UI; Ema found and created the sheet'],
    ['Bulk publishing', 'One page per dialog', T('Many pages per instruction')],
    ['Scheduled unpublish', NO('Not offered'), T('Yes')],
    ['Auto-preview', T('Yes'), L('No: publishes the existing preview')],
    ['Queue view', T('Scheduler app'), L('Only the sheet itself')],
    ['Time handling', 'Browser time zone, to the minute', 'UTC, 5-minute ticks'],
    ['Audit trail', T('Explicit scheduled-publish entries'), L('Side effects only; logged as the user account')],
    ['Verification', 'Human checks', T('Ema polls status + audit log, writes evidence')],
  ], { y: 1.6, colW: [2.4, 4.6, 5.3], fontSize: 12 });
  bullets(s, [
    { text: 'Still needs the user: approvals (20 recorded entries) and staying in the session while Ema verifies (it can\'t monitor between turns)', color: AMBER, bold: true },
    { text: 'Risk: one syntax error in the shared sheet disables every job in it (Ema workbook)', color: AMBER, bold: true },
    { text: 'No efficiency metrics claimed: the 74-minute test window was driven by the schedule times', color: GREY },
  ], { y: 5.25, h: 1.35, fontSize: 12 });
  s.addNotes(notes({
    say: 'Comparing the two: Ema removes the setup and the mechanics, and adds bulk publishing and scheduled unpublishing. But it doesn\'t remove the human: I approved every change, and I had to stay in the session while it verified, because it can\'t wake up between messages. Its scheduling method also doesn\'t auto-preview, there\'s no queue view, and in the audit log its actions appear under my account, so you can\'t tell Ema from me.',
    explain: 'Be careful not to claim speed: the 74-minute window on 19 October was set by the scheduled times, not by Ema\'s performance. The recorded facts are 20 user entries and 24 Ema actions.',
    labels: 'Tested: all rows. Limitation: no auto-preview, no queue, attribution, in-session monitoring, shared-sheet risk.',
    transition: '"We then asked Experience Workspace to do the same task."',
    qa: 'Q: Is Ema faster than doing it manually?\nA: We didn\'t measure that. For a single page, the editor is a few clicks; Ema\'s value is bulk, unpublish and built-in verification.\n\nQ: Who is accountable for Ema\'s changes?\nA: In the log they appear under the approving user\'s account, which is why the approval gates matter.',
    time: '1:00',
  }));
}

// ---------------------------------------------------------------- 10 Workspace what happened
{
  const s = base('6 · Experience Workspace findings', 'What we asked, what happened (22 Oct)');
  bullets(s, [
    { text: 'Same 5-task superprompt on 8 equivalent pages; hints included; 4 user messages', bold: true },
    { text: 'Pre-check ("no changes yet") re-previewed all 8 pages, twice: 6:03 and 6:07 PM IST', color: AMBER },
    { text: 'Read the schedule sheet after errors and listed Ema\'s 5 rows correctly' },
    { text: '"I cannot schedule a publish action": no real-time clock', bold: true },
    { text: 'Given an exact time (6:45 PM IST): sheet read/write errors, then "cannot read or write"', bold: true },
    { text: 'Fallback advice: a past date (14 Jul 2025) and a wrong activation step; claimed the scheduler app can create schedules', color: AMBER },
    { text: 'Outcome: no schedule created, no page published', bold: true, color: RED },
    { text: 'Verified with Adobe\'s audit log and page status; the user\'s own incomplete sheet row (never activated) is noted in the appendix', sub: true, color: GREY },
  ], { w: 7.3, fontSize: 13 });
  img(s, 'W-03-cannot-schedule-no-clock.jpg', 7.95, 1.55, 2.35, 4.95, 385, 1047, 'Experience Workspace: "I cannot schedule"');
  img(s, 'W-04-cannot-write-sheet-wrong-date.jpg', 10.5, 1.55, 2.35, 4.95, 388, 849, 'Experience Workspace: sheet errors and a past date');
  s.addNotes(notes({
    say: 'Mohit asked whether Experience Workspace could do the same thing, so I gave Experience Workspace the same five-task prompt, on eight equivalent pages, including hints about how scheduling works on this site. It didn\'t complete the task. It told us it has no real-time clock, so it couldn\'t calculate the times. When I gave it an exact time, 6:45 PM IST, it failed with errors reading and writing the schedule sheet. Its fallback advice also contained a past date and a wrong activation step. In the end, no schedule was created and no page was published.',
    click: 'If the Experience Workspace chat is still open, scroll to the "I cannot schedule a publish action" answer. Otherwise use Figures 13 and 14.',
    observe: 'Experience Workspace itself stating the limitation, and the Bad Request errors.',
    explain: 'Be precise: this was unsuccessful in our environment. Experience Workspace reported tool limitations (no clock, sheet read/write errors). We are not claiming Workspace can never schedule. Also mention: during its "no changes" pre-check it actually re-previewed all eight pages twice; harmless (preview only), but an unrequested change.',
    labels: 'Tested: all findings (screenshots + audit log). Not claimed: general unsupported status.',
    transition: '"Here\'s how it compares with Ema side by side."',
    qa: 'Q: So Workspace can\'t schedule?\nA: In our environment, with the tools it had on 22 October, it couldn\'t. We didn\'t test other configurations.\n\nQ: Did it break anything?\nA: No. It re-previewed eight pages; nothing went live. I added an incomplete row to the sheet myself while trying its fallback; it was never activated and I\'ve since removed it.\n\nQ: Was it given an advantage?\nA: Yes, the prompt included hints Ema didn\'t have, and it still didn\'t complete it.',
    time: '1:00',
  }));
}

// ---------------------------------------------------------------- 11 Ema vs Workspace
{
  const s = base('6 · Experience Workspace findings', 'Ema vs Experience Workspace');
  table(s, [
    ['', 'Ema (19 Oct)', 'Experience Workspace (22 Oct)'],
    ['Schedules created', T('5 / 5 tasks'), NO('0')],
    ['Pages published / unpublished on time', T('7 / 7 + 1 unpublish'), NO('None')],
    ['User messages', '20 recorded entries', '4'],
    ['Found the mechanism', T('By itself'), 'Given hints; read the sheet, couldn\'t write it'],
    ['Verified results', T('Status + audit log'), NO('Not reached')],
    ['Errors', '1 retry, 1 trimmed output', L('6 × Bad Request; contradictory answers')],
    ['Unrequested changes', 'None recorded', L('8 pages re-previewed twice')],
    ['Advice quality', '—', L('Past date; wrong activation step; scheduler-app claim contradicts docs')],
  ], { y: 1.6, colW: [3.6, 3.9, 4.8], fontSize: 13 });
  s.addText('Characterisation: unsuccessful in our environment. Experience Workspace reported tool limitations (no time access, schedule-sheet read/write errors). Not shown to be unsupported in general.', { x: 0.5, y: 5.75, w: 12.3, h: 0.7, fontFace: FONT, fontSize: 13, bold: true, color: DARK });
  s.addNotes(notes({
    say: 'Side by side: Ema completed all five tasks and proved it. Experience Workspace created no schedule. It needed fewer messages, four, but that\'s because it stopped early. It also produced six Bad Request errors, contradicted itself about reading the sheet, and made one unrequested change.',
    explain: 'Don\'t over-interpret "4 messages vs 20": Ema\'s 20 include approvals and verification waits for five tasks that completed; Experience Workspace\'s 4 ended without a schedule.',
    labels: 'Tested: both columns. Limitation: Experience Workspace in our environment.',
    transition: '"Beyond the core demo, Abhishek and Mohit asked for three additional investigations."',
    qa: 'Q: Would Experience Workspace work with a clock tool?\nA: Possibly, but even with an exact time it failed on sheet access, so that alone wouldn\'t fix it. It\'s worth re-testing when the tools change.',
    time: '0:45',
  }));
}

// ---------------------------------------------------------------- 12 7A
{
  const s = base('7 · Additional Investigations and Findings', '7A · Unpublishing a page: what happens to its assets');
  s.addText('Test: new page with a new image → scheduled publish → Unpublish from the editor (22 Oct)', { x: 0.5, y: 1.55, w: 12.3, h: 0.35, fontFace: FONT, fontSize: 13, color: GREY });
  table(s, [
    ['What', 'After the page was unpublished', 'Evidence'],
    ['Page on the live site', 'Gone (404)', T('Tested')],
    ['Page in preview', 'Also gone: the editor\'s Unpublish removes preview and live', T('Tested (audit log)')],
    ['The image (media_1717…png)', 'Still served: full 5.2 MB original, also under other paths', L('Tested')],
    ['Sitemap', 'A page unpublished by schedule is removed (arctic-surfing, Ema test 5)', T('Tested')],
    ['Removing the image', 'No option found in the editor', U('Unknown')],
  ], { y: 1.95, w: 8.0, colW: [2.5, 4.3, 1.2], fontSize: 12 });
  bullets(s, [
    { text: 'Images are stored permanently, keyed by their content; unpublishing a page doesn\'t touch them', bold: true },
    { text: 'Side finding: the sitemap still uses the old site host (edscapstoneajay) in every URL', color: AMBER },
  ], { y: 4.9, w: 8.0, h: 1.5, fontSize: 12 });
  img(s, 'B5a-page-unpublished-404.jpg', 8.75, 1.6, 4.1, 2.2, 1273, 1135, 'Page not found after Unpublish');
  img(s, 'B5b-image-still-live-after-unpublish.jpg', 8.75, 4.1, 4.1, 2.2, 1271, 1078, 'The page\'s image still loads');
  live(s, URL.media);
  s.addNotes(notes({
    say: 'First additional investigation: what happens to assets when a page is unpublished. We created a page with a brand-new image, published it on schedule, then clicked Unpublish in the editor. The page disappeared from live, and also from preview, since the editor\'s Unpublish removes both. But the image did not disappear. Its address still loads the full original file, and it even loads under other folder paths.',
    click: 'Open the image URL. It still loads.',
    observe: 'An image from a page that no longer exists.',
    explain: 'EDS stores images in a permanent, content-addressed media store shared by preview and live. Unpublishing removes the page, not the media. The address is long and practically unguessable, but anyone who has it can still open it. On sitemaps: a page unpublished by schedule was removed from the sitemap. Our 22 October test pages were never in the sitemap because the index only covers adventures and magazine pages. Side note: the sitemap still points at the old site host, which needs a config fix.',
    labels: 'Tested: unpublish behaviour, sitemap removal. Limitation: image persists. Unknown: image removal.',
    transition: '"Second: when a page is scheduled, do its fragments and assets go with it?"',
    qa: 'Q: Is this a security issue?\nA: It\'s an embargo consideration: don\'t place sensitive images on previewed pages before launch. The URLs are unguessable but shareable.\n\nQ: Can we delete the image?\nA: We found no option in the editor. Other routes weren\'t tested.',
    time: '1:00',
  }));
}

// ---------------------------------------------------------------- 13 7B
{
  const s = base('7 · Additional Investigations and Findings', '7B · Fragment and asset publishing dependencies');
  table(s, [
    ['Resource', 'Published with the scheduled page?', 'Evidence'],
    ['EDS fragment', NO('No: needs its own preview and publish'), T('Figures 17–18')],
    ['Image inside the page', T('Yes, automatically'), T('Tested')],
    ['Image before the page goes live', L('Already reachable on live after preview'), T('Tested')],
  ], { y: 1.6, w: 7.3, colW: [2.3, 3.8, 1.2], fontSize: 12 });
  bullets(s, [
    { text: 'Page live before its fragment: visitors see the raw fragment URL as a yellow button linking to a 404', bold: true },
    { text: 'Fragment published later: the page fixes itself, no republish needed', color: GREEN },
    { text: 'Browsers that saw the broken version may keep it for up to 2 hours (cached 404)', color: AMBER },
    { text: 'No dependency detection or warning in preview, the dialog or the log', color: AMBER },
    { text: 'Bundle option: Snapshots (documented); scheduling a snapshot not tested', color: BLUE },
    { text: 'Scope: EDS document fragments only; AEM Content Fragments aren\'t integrated in this project', sub: true, color: GREY },
  ], { y: 3.15, w: 7.3, h: 3.4, fontSize: 12 });
  img(s, 'A3-preview-fragment-not-loaded.jpg', 7.95, 1.55, 4.9, 1.45, 1912, 920, 'Preview: fragment not loaded');
  img(s, 'A5-live-broken-fragment-cta.jpg', 7.95, 3.35, 4.9, 1.45, 1919, 1048, 'Live: page published before its fragment');
  img(s, 'A10b-live-incognito-fixed.jpg', 7.95, 5.15, 4.9, 1.15, 934, 448, 'Live: fixed once the fragment was published');
  live(s, URL.frag);
  s.addNotes(notes({
    say: 'Second: dependencies. We created a fragment and a page that uses it, and scheduled only the page. Neither preview nor scheduling noticed the fragment. The page went live without it, and visitors saw the raw fragment address as a yellow call-to-action button that leads to a 404. In preview it was a plain blue link, so the live site actually looked worse than what the author saw. When we then scheduled the fragment on its own, the page fixed itself without being republished, because fragments are fetched by the browser when the page loads. Images behaved differently: they\'re inside the page, so they went live with it.',
    click: 'Open the live fragment page. It now shows "Fragment test FRAG-V1" correctly.',
    observe: 'The fixed page (as in Figure 19); contrast it with the yellow button in Figure 18.',
    explain: 'EDS doesn\'t do dependency management. Content inside a page travels with it; anything referenced, like a fragment, has its own lifecycle. If several items must go live together, Snapshots are the documented bundle mechanism. We didn\'t test scheduling a snapshot.',
    labels: 'Tested: fragment and image tests. Documented: Snapshots. Unknown: snapshot scheduling. Out of scope: AEM Content Fragments.',
    transition: '"Finally, Abhishek\'s question: can an asset be unpublished based on its expiry metadata?"',
    qa: 'Q: What about AEM Content Fragments?\nA: This project has no AEM Content Fragment integration, so we tested EDS document fragments only.\n\nQ: Why the 2-hour delay?\nA: The fragment\'s earlier 404 response is cacheable for 7,200 seconds, so a browser that saw it may keep it. Our second check showed it refreshed sooner.\n\nQ: How do we avoid this?\nA: Publish or schedule fragments before, or at the same time as, the pages that use them.',
    time: '1:15',
  }));
}

// ---------------------------------------------------------------- 14 7C
{
  const s = base('7 · Additional Investigations and Findings', '7C · Asset expiry and scheduled unpublishing');
  const c = [['Expiry metadata', 'A label: "valid until …". No effect by itself.'], ['Publication status', 'What the system records as published / unpublished.'], ['Public availability', 'Does the URL still load? Can differ (see 7A).']];
  c.forEach((t, i) => {
    const x = 0.5 + i * 2.5;
    s.addShape(pptx.ShapeType.roundRect, { x, y: 1.6, w: 2.35, h: 1.15, fill: { color: LIGHT }, line: { color: i === 2 ? RED : LINE, width: 1 }, rectRadius: 0.06 });
    s.addText([{ text: t[0], options: { bold: true, breakLine: true, color: DARK } }, { text: t[1], options: { color: GREY, fontSize: 10 } }], { x: x + 0.08, y: 1.6, w: 2.2, h: 1.15, fontFace: FONT, fontSize: 12, align: 'center', valign: 'middle' });
  });
  table(s, [
    ['Question', 'Answer', 'Status'],
    ['Expiry metadata on EDS assets?', 'None (images or PDFs)', D('Documented + checked')],
    ['Unpublish images?', 'Not possible', T('Tested')],
    ['PDFs publish / unpublish?', 'Yes: own Preview / Publish / Prepare', T('Tested')],
    ['Editor options for PDFs', 'Schedule Publish + immediate Unpublish; no scheduled unpublish', T('Tested')],
    ['Time-based scheduled unpublish', 'Schedule sheet "unpublish" command', { text: 'Tested for a page (Ema test 5); PDF not tested', color: GREEN, bold: true }],
    ['Metadata-based unpublish', 'Not native: needs automation (Ema/script → schedule sheet)', D('Documented')],
    ['AEM Assets "Off Time"', 'Withdraws AEM-delivered assets; site isn\'t connected to AEM Assets', D('Documented, not tested')],
  ], { y: 2.95, w: 7.6, colW: [2.4, 3.4, 1.8], fontSize: 11 });
  img(s, 'X1b-pdf-media-viewer.jpg', 8.35, 1.6, 4.5, 2.25, 1273, 917, 'PDF with its own Preview / Publish');
  img(s, 'X1c-pdf-prepare-menu.jpg', 8.35, 4.2, 4.5, 2.1, 1278, 1136, 'PDF Prepare menu (no scheduled unpublish)');
  live(s, URL.pdf);
  s.addNotes(notes({
    say: 'Abhishek\'s question was: can I schedule an unpublish of an asset based on metadata? First, three things that sound alike: expiry metadata is just a label; publication status is what the system records; and availability is whether the URL still loads. In 7A we saw those can disagree. In EDS, assets carry no expiry metadata. Images can\'t be unpublished at all. PDFs can, since they have their own Preview and Publish buttons, but the editor only lets you schedule a publish for them. Its Unpublish option works immediately, not on a schedule. EDS can unpublish on a schedule by time, through the schedule sheet\'s unpublish command; we proved that for a page. So the answer is: by time, yes; by metadata, not natively. Something has to read the expiry date and turn it into a scheduled unpublish, for example Ema with approval, or a script.',
    click: 'Open the PDF in the editor\'s media viewer and point at Preview / Publish and the Prepare icon.',
    observe: 'A PDF with its own publish controls, unlike an image.',
    explain: 'AEM Assets has its own documented Off Time feature that withdraws assets from AEM delivery, but this site doesn\'t deliver assets from AEM, so it doesn\'t apply here and we didn\'t test it. The PDF unpublish run itself was not executed; that remains to validate.',
    labels: 'Tested: image unpublish, PDF controls, page unpublish via the sheet. Documented: no metadata-driven unpublishing; AEM Off Time. Still to validate: PDF scheduled unpublish; AEM Assets path.',
    transition: '"Let me bring it all together."',
    qa: 'Q: So can Abhishek do it?\nA: For PDFs, yes by time, using the schedule sheet. For metadata-driven expiry he needs automation that writes those rows. For images, no.\n\nQ: Would AEM Assets solve it?\nA: Off Time is documented for AEM-delivered assets. The site would first need to use assets from AEM; not tested here.',
    time: '1:00',
  }));
}

// ---------------------------------------------------------------- 15 Conclusion
{
  const s = base('Conclusion', 'Verified findings and recommendations');
  s.addText('Verified (Tested)', { x: 0.5, y: 1.55, w: 6, h: 0.35, fontFace: FONT, fontSize: 14, bold: true, color: GREEN });
  bullets(s, [
    'Two switches enable Schedule Publish (config row + registration)',
    'Scheduling auto-previews; the run publishes the preview, not later edits',
    'Reschedule and cancel work; runs within ~8 s of the minute',
    'Ema: 5/5 tasks including bulk publish and scheduled unpublish',
    'Experience Workspace: no schedule created in our environment',
    'Fragments are not carried with a page; images are',
    'Images remain reachable after their page is unpublished',
  ], { y: 1.9, w: 6.0, h: 3.0, fontSize: 12 });
  s.addText('Recommendations', { x: 6.8, y: 1.55, w: 6, h: 0.35, fontFace: FONT, fontSize: 14, bold: true, color: RED });
  bullets(s, [
    '1. Authors: edit → preview → (re)schedule',
    '2. Publish or schedule fragments before their pages',
    '3. Use the schedule sheet (or Ema) for bulk and unpublish; Snapshots for coordinated launches',
    '4. Keep embargoed images off previewed pages',
    '5. Treat expiry as a process: register → automation → scheduled unpublish',
  ], { x: 6.8, y: 1.9, w: 6.0, h: 3.0, fontSize: 12 });
  s.addText([
    { text: 'References:  ', options: { bold: true, color: DARK } },
    { text: 'aem.live/docs/ew/administering/schedule-publish · demo.bbird.live/demo-docs/usecases/how-to-schedule-publish · aem.live/docs/scheduling · aem.live/docs/snapshots-reviews · aem.live/docs/media', options: { color: BLUE } },
  ], { x: 0.5, y: 5.2, w: 12.3, h: 0.7, fontFace: FONT, fontSize: 11 });
  s.addNotes(notes({
    say: 'To summarise. Everything on the left we proved on the site. Scheduling is easy to enable and reliable, it auto-previews, but it publishes the preview, so authors must preview again after editing. Ema completed every task, including bulk and unpublish, with approvals. Experience Workspace didn\'t complete the task in our environment. Fragments need their own publishing, images travel with the page but outlive it. My five recommendations are on the right.',
    transition: '"I\'m happy to take questions. The full test logs are in the appendix."',
    qa: 'Q: What would you do next?\nA: Run the PDF scheduled-unpublish test, test scheduling a snapshot, fix the sitemap host, and re-test Experience Workspace when its tools change.',
    time: '1:00',
  }));
}

// ---------------------------------------------------------------- 16 Q&A
{
  const s = base('', 'Questions?');
  s.addText([
    { text: 'ALAN RAJI MANI', options: { bold: true, fontSize: 22, breakLine: true } },
    { text: 'araji@adobe.com', options: { fontSize: 16, color: BLUE, breakLine: true } },
    { text: ' ', options: { breakLine: true } },
    { text: 'Full test logs, configuration and the capability register are in the appendix.', options: { fontSize: 14, color: GREY } },
  ], { x: 0.5, y: 2.4, w: 12.3, h: 2.5, fontFace: FONT, color: DARK });
  s.addNotes(notes({
    say: 'Thank you. Happy to take questions.',
    explain: 'Use the appendix to answer detail questions: A2 manual log, A3 Ema log, A4 Workspace log, A5–A7 additional investigations, A8 capability register, A9 open items.',
    qa: 'Q: Where is the evidence?\nA: Appendix plus the evidence folder: screenshots, Ema\'s workbook and the audit-log references.\n\nQ: Can other teams reuse this?\nA: Yes. The appendix is written as a reusable reference: environment, steps, results and the capability register.',
    time: '1:15',
  }));
}

// ---------------------------------------------------------------- Appendix
function appendixSlide(code, title, rows, colW, fontSize, notesText) {
  const s = base(`Appendix ${code}`, title);
  table(s, rows, { y: 1.6, colW, fontSize: fontSize || 10 });
  s.addNotes(`Reference slide, not presented. ${notesText || ''}`);
  return s;
}

appendixSlide('A1', 'Environment and key links', [
  ['Item', 'Value'],
  ['Org / site / branch', 'araji-adobe / bv-poc-wknd-aln / main; content source: Document Authoring'],
  ['Preview / live', 'main--bv-poc-wknd-aln--araji-adobe.aem.page · …aem.live (home page /us/en)'],
  ['Site config', 'da.live/config#/araji-adobe/bv-poc-wknd-aln/ ("prepare" tab: title = Schedule Publish)'],
  ['Scheduler app', 'da.live/apps/scheduler → /araji-adobe/bv-poc-wknd-aln/ (registered 22 Oct)'],
  ['Schedule sheet', '/.helix/crontab (DA sheet; activated by preview; UTC; 5-minute ticks)'],
  ['Code', 'github.com/araji-adobe/bv-poc-wknd-aln'],
  ['Evidence', 'testing/scheduler/: demo-progress.md, scheduler-test-log-2026-10-19.xlsx, evidence/ screenshots'],
], [3.0, 9.3], 12);

appendixSlide('A2', 'Manual test log (22 Oct, IST)', [
  ['Step', 'Test', 'Result'],
  ['1', 'Is Schedule Publish enabled?', 'No: site and org config absent'],
  ['2', 'Add "prepare" row', 'Pass: config saved and read back'],
  ['3', 'Load / register in the scheduler app', '"Not registered" → registered; empty queue; API key created'],
  ['4', 'Prepare menu', 'Pass: icon-only; Preflight, Unpublish, Schedule Publish'],
  ['5', 'Never-previewed page, then schedule for 12:00', 'Auto-preview 11:50:56; "Schedule (Asia/Calcutta)"'],
  ['6', 'Edit V2 after scheduling, no preview', 'Published 12:00:08 by helix@adobe.com; live = V1 only'],
  ['7', 'Schedule 12:25, reschedule to 12:30', 'Re-preview each time; nothing at 12:25; live V1 + V2 at 12:30:07'],
  ['8', 'New page for 12:45; Delete in the list', 'No confirmation; deleted-scheduled-publish 12:40:07; still 404'],
], [1.4, 4.9, 6.0], 11);

appendixSlide('A3', 'Ema test log (19 Oct) and schedule-sheet format', [
  ['Item', 'Detail'],
  ['Format', '"when" e.g. "at 10:30 am on the 19th day of October in 2026" (UTC) · "command" e.g. "publish /path" / "unpublish /path"; several commands per cell, separated by line breaks'],
  ['Activation', 'Preview /.helix/crontab.json (5 activations, all HTTP 200)'],
  ['Tests 1–5', 'Publish 16:00:04 · cancel (never live) · reschedule 16:20:04 · bulk 4/4 16:25:04–06 · publish 16:25 + unpublish 16:40'],
  ['Limitations', 'Sheet must be created · 5-minute UTC ticks · no API to list queued jobs'],
  ['Limitations (cont.)', 'Ema can\'t monitor between turns · one syntax error disables all · no parse feedback on activation'],
  ['Observations', 'Runs not attributed in the audit log · ~1 min log lag · unpublish time only via the indexer entry'],
  ['Interactions', '20 user entries, 24 Ema entries; window 15:32–16:46 IST (≈74 min, set by the schedule)'],
], [2.0, 10.3], 11);

appendixSlide('A4', 'Experience Workspace test log (22 Oct)', [
  ['Step', 'Observation'],
  ['1', 'content_preview ×8 in the "no changes" pre-check re-previewed all 8 pages twice (12:33 and 12:37 UTC)'],
  ['2', 'content_read Bad Request ×3, then read the 5 crontab rows correctly; promised append-only'],
  ['3', '"No real-time clock"; "I cannot schedule a publish action"; scheduler-app option contradicts the docs'],
  ['4', 'Exact time 6:45 PM IST: Bad Request ×3; "cannot read or write" the sheet (contradicts step 2)'],
  ['5', 'Fallback row dated 14 Jul 2025 (past); "open the .aem.page URL to activate" (activation requires Preview)'],
  ['6', 'No schedule created, no page published; crontab preview unchanged since 19 Oct'],
  ['7', 'Row 6 (6:47 PM, empty command) added manually by the user while trying the fallback; never activated; since removed'],
  ['Prompt', '5-task superprompt mirroring Ema\'s tests 1–5 on 8 adventure pages, REFERENCE hints kept; 4 user messages'],
], [1.4, 10.9], 11);

appendixSlide('A5', '7B: fragment test log (22 Oct, IST)', [
  ['Step', 'Action', 'Result'],
  ['1', 'Fragment "FRAG-V1" + page "PAGE-A1" linking to it', 'Both unpreviewed, not live'],
  ['2', 'Preview the page only', 'Fragment not previewed; raw link shown'],
  ['3', 'Schedule the page (7:36 PM)', 'Page live 7:36:04; fragment 404; yellow CTA to a 404; console 404'],
  ['4', 'Schedule the fragment alone (8:16 PM)', 'Auto-preview: preview fixed, live still broken'],
  ['5', 'Fragment live 8:16:12', 'Page fixed without republish'],
  ['6', 'Browser cache', '404 cached (max-age 7200); forced refresh fixed it'],
  ['7', 'Normal + incognito windows', 'Both showed the fragment'],
], [1.4, 4.9, 6.0], 11);

appendixSlide('A6', '7A / 7B: image test log and sitemap evidence', [
  ['Step', 'Action', 'Result'],
  ['1', 'New image in a new page (rick copy.png)', 'Stored beside the doc in a hidden folder; private (401)'],
  ['2', 'Schedule without manual preview', 'Auto-preview copied it to the media bus (media_1717…png)'],
  ['3', 'Image on live before the page publishes', 'Reachable: 200 on aem.live while the page is 404'],
  ['4', 'Scheduled run 8:56 PM', 'Page live with the image loaded'],
  ['5', 'Unpublish from the editor', 'Preview + live deleted; image still 200 (5.2 MB), any path'],
  ['Sitemap', '19 Oct scheduled pages', 'Added; arctic-surfing removed after its scheduled unpublish'],
  ['Sitemap', 'Config', 'Origin still the old host (edscapstoneajay); index covers adventures/magazine only'],
], [1.4, 4.9, 6.0], 11);

appendixSlide('A7', '7C: expiry tests and mechanisms', [
  ['Item', 'Detail', 'Status'],
  ['1', 'Test PDF (EXPIRY-PDF-V1, "Created by ALAN RAJI MANI") uploaded to /us/en/expiry-test.pdf', 'Tested'],
  ['2', 'Opens in the DA media viewer with Prepare / Preview / Publish', 'Tested'],
  ['3', 'Preview works (byte-identical); Prepare menu: Preflight, Unpublish (immediate), Schedule Publish; no scheduled unpublish', 'Tested'],
  ['Not run', 'Scheduled unpublish of the PDF via the sheet; page link after unpublish', 'To validate'],
  ['EDS docs', 'Media bus immutable; PDF/SVG follow the preview/publish lifecycle; crontab is time-based only', 'Documented'],
  ['AEM Assets', '"Off Time" withdraws assets from delivery; Unpublish Later', 'Documented'],
  ['Governance', 'Ema DA/admin writes required a typed user request; preview calls stayed blocked', 'Tested'],
], [1.6, 8.6, 2.1], 11);

appendixSlide('A8', 'Capability register', [
  ['Capability', 'Status'],
  ['Editor Schedule Publish (enable, schedule, reschedule, delete)', 'Tested'],
  ['Auto-preview on schedule / reschedule', 'Tested'],
  ['Publishes preview, not later editor changes', 'Tested'],
  ['Crontab publish, cancel, reschedule, bulk, unpublish', 'Tested (Ema)'],
  ['Fragment carried with page / image carried with page', 'Tested: No / Yes'],
  ['Image removal after unpublish', 'Unknown'],
  ['Snapshot bundle publishing / scheduling a snapshot', 'Documented / Unknown'],
  ['Scheduled unpublish in editor dialog / metadata-based unpublish', 'Not available / Not native'],
  ['AEM Assets Off Time · Experience Workspace scheduling', 'Documented, not tested · Unsuccessful in our environment'],
], [8.3, 4.0], 11);

appendixSlide('A9', 'Open items and sandbox state', [
  ['Item', 'State / action'],
  ['Test pages', 'scheduled-publish-test (live), scheduled-cancel-test (preview), sched-frag-page + fragment (live), sched-asset-page (unpublished), expiry-test.pdf (preview), expiry-test-page (not previewed)'],
  ['Schedule sheet', '5 past Ema rows (row 6 removed by the user, 22 Oct): clear before real use'],
  ['Experience Workspace side effect', '8 adventure pages re-previewed (no live change)'],
  ['Sitemap', 'Update the origin to the correct host'],
  ['To validate', 'PDF scheduled unpublish · snapshot scheduling · AEM Assets integration · Experience Workspace re-test'],
], [2.6, 9.7], 11);

{
  const TEST = { 'M0-site-config-empty.jpg': 'A2 · 1', '03-config-prepare-row.jpg': 'A2 · 2', '04-scheduler-not-registered.jpg': 'A2 · 3', 'M2b-scheduler-registered.jpg': 'A2 · 3',
    'M3-prepare-menu-schedule-publish.jpg': 'A2 · 4', 'M5-schedule-dialog-asia-calcutta.jpg': 'A2 · 5', '11b-editor-shows-v1-and-v2.jpg': 'A2 · 6', '11-live-page-after-publish.jpg': 'A2 · 6',
    '10-scheduler-list-pending.jpg': 'A2 · 7', '13-scheduler-list-after-delete.jpg': 'A2 · 8', '14-live-still-404-after-cancel.jpg': 'A2 · 8', 'E1-crontab-sheet.jpg': 'A3 · Tests 1–5',
    'W-03-cannot-schedule-no-clock.jpg': 'A4 · 3', 'W-04-cannot-write-sheet-wrong-date.jpg': 'A4 · 4–5', 'B5a-page-unpublished-404.jpg': 'A6 · 5', 'B5b-image-still-live-after-unpublish.jpg': 'A6 · 5',
    'A3-preview-fragment-not-loaded.jpg': 'A5 · 2', 'A5-live-broken-fragment-cta.jpg': 'A5 · 3', 'A10b-live-incognito-fixed.jpg': 'A5 · 7', 'X1b-pdf-media-viewer.jpg': 'A7 · 2', 'X1c-pdf-prepare-menu.jpg': 'A7 · 3' };
  const s = base('Appendix A10', 'Figure index: screenshots to evidence files and tests');
  const half = Math.ceil(FIGS.length / 2);
  const mk = (list) => [['Fig.', 'Slide', 'Shows', 'Log · step']].concat(list.map((f) => [String(f.fig), String(f.slide), f.caption, TEST[f.file] || '']));
  table(s, mk(FIGS.slice(0, half)), { x: 0.5, y: 1.6, w: 6.05, colW: [0.5, 0.55, 3.8, 1.2], fontSize: 9 });
  table(s, mk(FIGS.slice(half)), { x: 6.8, y: 1.6, w: 6.05, colW: [0.5, 0.55, 3.8, 1.2], fontSize: 9 });
  s.addText('Evidence files: testing/scheduler/evidence/ · "Log · step" points to the appendix test logs A2–A7', { x: 0.5, y: 6.6, w: 12.3, h: 0.3, fontFace: FONT, fontSize: 9, color: GREY });
  s.addNotes('Reference slide, not presented. Maps every figure in the deck to the test it evidences.');
}

pptx.writeFile({ fileName: OUT }).then((f) => console.log('written', f));
