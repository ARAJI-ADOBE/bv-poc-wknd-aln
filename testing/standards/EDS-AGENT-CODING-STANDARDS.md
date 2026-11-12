# EDS Coding Standards and AI Agent Development Guidelines

> **Purpose:** the single source of truth for building on **Adobe Experience Manager Edge Delivery Services (EDS)**, also known as aem.live, Franklin or Helix.
> **Audience:** any AI coding agent (and human developer) working on any EDS project.
> **How to use:** load this file at the start of every session. Treat every **MUST / MUST NOT** as a hard rule. **SHOULD** means "do this unless you have, and state, a good reason". If a project's own `AGENTS.md`, `CLAUDE.md`, `README` or lint config conflicts with this file, the **project file wins** for that project. Note the conflict in your report.

Version 1.0 · Sources: aem.live developer documentation (Adobe), the AEM Boilerplate and Block Collection conventions, and proven team practice. Each rule is tagged:
- **[Adobe]**: documented by Adobe on aem.live
- **[Practice]**: team convention, not an Adobe requirement

---

## 0. Agent operating contract (read first)

You MUST follow this workflow for **every** task, however small:

1. **Understand the request.** Restate the goal in one or two sentences. If a requirement is ambiguous **and** the answer changes what you build, ask **one** precise question before coding. Otherwise pick the conventional default and state it.
2. **Inspect before you write.**
   - Read the project's `AGENTS.md` / `README` / lint configs, `scripts/scripts.js`, `styles/styles.css` (and any token file), and the block folder you'll touch.
   - Look at the **real markup** the block receives: `curl http://localhost:3000/<path>.plain.html` (or the `.aem.page` preview), **not** what you imagine the content to be. [Adobe][Practice]
   - Check for an existing block, utility or token before creating a new one (reuse first).
3. **Design the content model first** (section 3) for any new block or structural change.
4. **Implement** following sections 4–10.
5. **Validate** with the self-check protocol (section 13). You MUST NOT deliver code that fails lint or that you haven't run.
6. **Report** in the format in section 14, including what you did **not** verify.

Non-negotiable behaviours:
- **Never claim something works unless you ran it.** Label claims **Tested** (you ran it), **Documented** (official docs), **Assumed** (not verified) or **Unknown**.
- **Keep the change minimal.** Touch only what the task needs. No drive-by refactors, reformatting or reordering of CSS properties in a functional change. [Adobe]
- **Ask before acting on anything outward-facing or hard to reverse:** publishing content, merging to `main`, deleting files, changing CMS content, changing shared configuration, force-pushing.
- **Never paste, store or echo secrets** (tokens, keys, signed URLs). Treat signed webhook URLs as secrets in chat and logs.

---

## 1. Platform facts the agent must respect

| Fact | Consequence for code |
|---|---|
| Content is authored in documents or sheets (DA.live, SharePoint, Google Drive or Universal Editor). The server renders it to **semantic HTML**. [Adobe] | Code decorates **existing** markup. It never re-creates canonical content client-side. |
| `scripts/aem.js` is the vendored Adobe library. [Adobe] | **MUST NOT edit `aem.js`.** Put extensions in `scripts/scripts.js` or `scripts/utils.js`. |
| No build step. Code is served as-is from GitHub, block by block, over HTTP/2. [Adobe] | **MUST NOT** add bundlers, transpilers, TypeScript, Sass, Tailwind or minification. **devDependencies only** (lint, test). |
| **Merging to `main` deploys to production.** Content publishes separately. [Adobe] | Work on feature branches. Never push to `main` directly. |
| Every branch has a preview: `https://{branch}--{repo}--{owner}.aem.page/{path}`. [Adobe] | Test on the branch preview. Put that link in every PR. |
| **Every committed file is publicly served.** [Practice] | Hide non-site files (notes, test reports, scripts) in `.hlxignore`. Never commit secrets. |
| `buildAutoBlocks` (in `scripts.js`) may rewrite content **before** blocks run. [Practice] | Check auto-blocking when markup looks different from the document. |
| Older projects may have `fstab.yaml`, `helix-query.yaml`, `paths.json`. Newer projects use the configuration service. [Adobe] | Don't add or depend on retired config files unless the project still uses them. |
| Two authoring models: **document-based** (DA/SharePoint/Google) and **Universal Editor / xwalk** (component models in `component-*.json`, `moveInstrumentation`). | Identify the model first. In xwalk projects, keep the model JSON and instrumentation in sync with the block code. |

---

## 2. Project structure and naming

```
/blocks/<block-name>/<block-name>.js     ES module, default export decorate(block)
/blocks/<block-name>/<block-name>.css    styles scoped to .<block-name>
/scripts/aem.js                          vendored, never edit
/scripts/scripts.js                      project bootstrap (eager/lazy/delayed, auto blocks)
/scripts/delayed.js                      delayed phase (martech, third parties)
/scripts/utils.js (optional)             shared helpers for several blocks
/styles/styles.css                       global styles and design tokens (:root)
/styles/fonts.css, lazy-styles.css       fonts and below-the-fold global CSS
/icons/*.svg                             icons used via :icon-name: in content
/head.html                               minimal; no third-party scripts
```

Naming rules:
- **Block names:** lowercase kebab-case, the same for the folder, file and CSS class (`hero-banner` → `blocks/hero-banner/hero-banner.js`, `.hero-banner`). [Adobe]
- **Variants:** authored as `Block Name (variant)`; they become extra classes (`.cards.horizontal`). Prefer **variants over new blocks** when the content model is the same.
- **CSS classes inside a block:** prefix with the block name (`.cards-card`, `.cards-image`). Unprefixed classes only for intentionally shared or inherited styles. [Adobe]
- **CSS custom properties:** global tokens unprefixed (`--text-color`); block-private ones prefixed (`--cards-gap`). [Adobe]
- **JS:** `camelCase` for functions and variables, `UPPER_SNAKE_CASE` for module constants, descriptive verbs (`buildSlide`, `decorateLinks`). Files kebab-case.
- **Do not namespace** with design-system or vendor names unless the project requires it. [Adobe]
- Cross-block imports: only shared modules in `/scripts/` and the standard `fragment` block. **MUST NOT** import one block's internals into another. [Practice]

---

## 3. Content first and content modelling

Rules:
- **Start with content.** Before code, write the sample content (document or sheet) the author will use. Get it reviewed with people who support authors. [Adobe]
- **Prefer default content** (headings, paragraphs, lists, images, links, buttons). Create a block only when default content can't express the need. [Adobe]
- **Never nest blocks.** [Adobe] Use fragments or sections instead.
- **Sections** (`---`) group content. **Section Metadata** (`style` → section classes) handles background or layout variations. [Adobe]
- **Page metadata** (the `metadata` block) holds title, description, image, template and theme.
- **Keep block tables simple:** few columns (ideally ≤ 3), one item per row, and a predictable order. Authors should never need hidden codes, IDs or HTML.
- **Authors omit and add cells.** The model and code MUST tolerate missing, empty, extra or re-ordered optional cells.
- **Structured or repeating data** (form fields, lists of options, locations) belongs in a **sheet**, served as JSON (`/path.json`, `{ data: [...] }`).
- **Client-side rendering** is only for non-canonical content (lists of other pages, search, apps). Everything canonical is server-rendered. [Adobe]
- Self-contained application-like features (forms, calculators, search apps) are **widgets**, not content blocks. Treat them as such in design and performance planning. [Adobe]
- **Don't change an existing content model silently.** Changing a model breaks published content. Propose it, keep backward compatibility, or provide a migration note. [Adobe]

Decision table:
| Need | Use |
|---|---|
| Text, images, CTA | Default content |
| Visual or layout variation of a section | Section Metadata `style` |
| Reusable component with its own structure | Block (+ variants) |
| Same content on many pages | Fragment |
| Pattern detectable from content (e.g. a YouTube link → embed) | Auto block in `buildAutoBlocks` |
| Repeating structured data | Sheet (JSON) |
| App-like feature | Widget / block that loads its app lazily |

---

## 4. JavaScript standards

### 4.1 Block skeleton (document-based projects)

```js
import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Decorates the <block-name> block.
 * Expected content: one row per item; cell 1 = image (optional), cell 2 = text.
 * @param {HTMLElement} block The block element
 */
export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return; // nothing authored: leave the block empty, don't throw

  const list = document.createElement('ul');
  rows.forEach((row) => {
    const [imageCell, textCell] = [...row.children];
    const li = document.createElement('li');
    li.className = 'block-name-item';

    const picture = imageCell?.querySelector('picture');
    if (picture) li.append(picture);

    if (textCell && textCell.textContent.trim()) {
      const body = document.createElement('div');
      body.className = 'block-name-body';
      body.append(...textCell.childNodes); // move authored nodes, don't rebuild them
      li.append(body);
    }
    list.append(li);
  });

  list.querySelectorAll('picture > img').forEach((img) => {
    img.closest('picture').replaceWith(
      createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]),
    );
  });

  block.replaceChildren(list);
}
```

Optional chaining (`?.`) is fine in modern projects. If the project lint config forbids it, use explicit checks.

### 4.2 Rules
- **MUST** `export default function decorate(block)` (it may be `async`). No side effects at import time beyond constant definitions. [Adobe]
- **Defensive by default:** every cell or element lookup MAY return `null`. Never assume a fixed number of rows or cells. Never throw on missing optional content.
- **Reuse authored DOM.** Move existing nodes (`append(...cell.childNodes)`) instead of rebuilding HTML from text. This keeps links, formatting, instrumentation and accessibility.
- **Security:** MUST NOT inject author or user data, or fetched data, with `innerHTML`, `outerHTML`, `insertAdjacentHTML` or `document.write`. Use `textContent`, `createElement`, `append`. `innerHTML` only for static, hard-coded templates without interpolation.
- **No inline styles** for layout or visual state (`el.style.x = …`). Toggle classes or ARIA/data attributes and style them in CSS. Allowed exception: dynamic values that only JS can know (e.g. a computed offset), set as a **CSS custom property** (`el.style.setProperty('--carousel-offset', …)`).
- **No hard-coded user-facing text** in code. Labels come from content, block config, placeholders (`placeholders.json`) or metadata. If a UI string is unavoidable (e.g. "Next"), centralise it in one constant and note it as a localisation gap. [Adobe]
- **Use the platform:** `aem.js` helpers (`createOptimizedPicture`, `readBlockConfig`, `loadScript`, `loadCSS`, `getMetadata`, `toClassName`, `toCamelCase`, `decorateIcons`, `buildBlock`, `decorateBlock`, `loadBlock`) before writing your own.
- **No frameworks** (React, Vue, jQuery, lodash…) for block UI. Vanilla JS and the platform. A dependency needs explicit team approval. [Adobe]
- **Third-party libraries:** load only inside the block that needs them via `loadScript()`. For heavy libraries, load when the block is near the viewport (IntersectionObserver) or on interaction. **Never** in `head.html`. [Adobe]
- **Events:** prefer event delegation on the block. Clean up observers and listeners you create on elements you remove. Use `{ passive: true }` for scroll and touch listeners.
- **Async:** `await` what you need, never block rendering, and handle rejected promises (section 6).
- **Fetches:** relative URLs for same-site JSON (`new URL(path, window.location.origin)`). Check `resp.ok`. Validate the response shape (`data` array) before use.
- **Browser support:** only features supported by browsers that support dynamic `import()`. No polyfills unless required. [Adobe]
- **Readable over clever:** small pure functions, early returns, no deep nesting (> 3 levels means refactor). JSDoc on exported functions and on non-obvious helpers. Comment the **why**, not the what.
- **No dead code, `console.log` or commented-out code** in deliverables. `console.error`/`warn` only in real error paths, with an `// eslint-disable-next-line no-console` where lint requires it.
- **Universal Editor / xwalk projects:** when moving or replacing authored elements, preserve instrumentation (`moveInstrumentation(from, to)`), and keep `component-models.json`, `component-definition.json` and `component-filters.json` in sync with the block.

### 4.3 Global scripts
- `scripts.js` phases: **eager** (LCP only), **lazy** (header, footer, the rest of the blocks, lazy styles), **delayed** (`delayed.js`, ≥ 3 s after load: analytics, chat, tag managers). [Adobe]
- Add project logic via small functions called from the right phase. Don't put block-specific logic in `scripts.js`.
- `head.html` stays minimal: no inline scripts or styles, no marketing tags. [Adobe]

---

## 5. CSS standards

### 5.1 Scoping and structure
- **Every selector in a block's CSS MUST start with the block class** (`.cards …`). No bare element selectors (`h2 {}`) and no global side effects. [Adobe]
- `.<block>-wrapper` and `.<block>-container` belong to the **section/wrapper**. Style them only on purpose, and never as a substitute for the block itself. [Practice]
- **Mobile first:** base rules without a media query describe mobile. Add `min-width` queries for larger screens. [Adobe]
- **Breakpoints:** `600px`, `900px`, `1200px`, **min-width only**. Never mix min-width and max-width. Use the media-query range syntax the project already uses (e.g. `@media (width >= 900px)`). [Adobe]
- **No `!important`.** Fix specificity instead. [Adobe]
- **Low specificity, simple selectors:** at most about 3 levels. No IDs for styling. If a selector gets complex, add a class in JS. [Adobe]
- **Style states with ARIA/data attributes:** `[aria-expanded='true']`, `[aria-hidden='true']`, `[aria-current]`, `[aria-invalid='true']`, `[data-state]`. [Adobe]
- **Context-aware:** inherit colour and background from the section (`color: inherit`, `currentcolor`) so blocks work in dark and light sections. [Adobe]
- **No preprocessors or frameworks.** Use modern CSS: custom properties, `clamp()`, grid, flex, `gap`, `aspect-ratio`, `:is()`, `:where()`, logical properties, and nesting only if the project lint allows it. [Adobe]
- **Lint-clean** with the project Stylelint config (usually `stylelint-config-standard`). Don't disable rules to get it passing.

### 5.2 Design tokens (tokenisation)
- **MUST use tokens** (CSS custom properties defined in `:root` in `styles/styles.css` or a project token file) for **colours, font families, font sizes, line heights, spacing, radii, shadows, z-index layers, transition durations, and header/nav height**. [Practice]
- **MUST NOT hard-code** hex, rgb or hsl colours, font names, or repeated size values inside block CSS.
- **Missing token?** Add it to the global token file (shared value) or as a block-prefixed custom property at the top of the block CSS (private value). Never inline a magic number.
- **Token naming:** semantic, not literal (`--text-color`, `--link-hover-color`, `--spacing-m`, `--heading-font-size-l`). Not `--red` or `--16px`.
- **Responsive tokens:** change token values inside breakpoint media queries in the global file, so blocks don't each need their own media queries for type scale.

Example:

```css
/* styles/styles.css */
:root {
  --text-color: #1d1d1d;
  --background-color: #fff;
  --link-color: #035fe6;
  --body-font-family: 'Source Sans Pro', 'Source Sans Pro Fallback', sans-serif;
  --body-font-size-m: 1.125rem;
  --spacing-s: 0.5rem;
  --spacing-m: 1rem;
  --spacing-l: 2rem;
  --radius-s: 4px;
  --nav-height: 4rem;
}

/* blocks/cards/cards.css */
.cards {
  --cards-gap: var(--spacing-m);
}

.cards > ul {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--cards-gap);
  padding: 0;
  list-style: none;
}

.cards .cards-image {
  aspect-ratio: 4 / 3;
  overflow: hidden;
}

@media (width >= 900px) {
  .cards > ul {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### 5.3 Units and sizing
| Use | Unit |
|---|---|
| Font sizes, spacing, layout widths | `rem` (global rhythm), `em` (relative to the component), `%`, `fr`, `ch`, `clamp()`, via tokens |
| Line height | unitless (e.g. `1.5`) |
| Borders, outlines, hairlines, small radii | `px` allowed (e.g. `1px`) |
| Media-query breakpoints | `px` (600/900/1200) |
| Viewport-based sizing | `vw`/`vh`/`dvh` sparingly, always with a `min()`/`max()`/`clamp()` safety |

- **No hard-coded heights** (`height: 420px`) on content containers. Let content define height. When space must be reserved:
  - media → `aspect-ratio`
  - minimum visual size → `min-height` with a token or `rem`
  - header → `var(--nav-height)`
- **No fixed widths** that break small screens. Use `max-width` plus `width: 100%`, or grid/flex.
- **Prevent layout shift (CLS):** reserve space for images and embeds (`aspect-ratio`, intrinsic `width`/`height` attributes), and don't insert content above existing content after load.
- **Avoid negative-margin hacks and absolute positioning for layout.** Use grid or flex. Use absolute positioning only for overlays and decorations.
- **z-index:** only from tokens or a documented small scale. Never `9999`.

---

## 6. Error handling and resilience
- A block failure **MUST NOT break the page.** Wrap risky work (fetch, JSON parse, third-party init) in `try/catch`. On failure, log a clear `console.error` with context and leave the authored content visible, or remove only the broken block's wrapper if the content is meaningless without it.
- **Validate inputs:** check `resp.ok`, content type, and the data shape (`Array.isArray(json.data)`) before using them.
- **Timeouts and fallbacks:** for third-party or network-dependent features, show a sensible fallback (static content, a link) when loading fails.
- **No silent data loss:** never strip or rewrite user input without telling the user why (e.g. show a validation message rather than deleting characters).
- **Forms and inputs:** client-side validation is for UX only. Never trust it for security. Show field-level messages (`aria-invalid`, `aria-describedby`), keep entered values on error, and don't put user data in URLs.
- **No uncaught promise rejections.** Every `async` path either handles errors or is awaited inside a `try`.

---

## 7. Performance (Lighthouse 100 is the bar)
- **Keep PageSpeed Insights at 100** (mobile and desktop) on the branch preview. PRs that drop the score are not acceptable. [Adobe]
- **Three-phase loading (E-L-D):** [Adobe]
  - Eager: only what's needed for LCP (first section, LCP image)
  - Lazy: everything else from the same origin
  - Delayed: third parties and martech
- **LCP image:** the first image above the fold loads eagerly. All other images lazy-load (`createOptimizedPicture(..., eager=false)`). Use `width` breakpoints sensible for the layout.
- **Don't add render-blocking resources:** no CSS or JS in `head.html`, no web fonts beyond the project's font strategy (fallback fonts with size-adjust).
- **Keep blocks small;** split heavy features. Load optional heavy code on interaction or visibility.
- **No minification step** (there's no benefit in EDS). [Adobe]
- **Avoid layout thrashing:** batch DOM reads and writes; use `requestAnimationFrame` for animations; use CSS transitions over JS animations; respect `prefers-reduced-motion`.
- **Don't fetch on every page** what isn't needed there. Cache JSON in memory when several blocks use it.

---

## 8. Accessibility (WCAG 2.2 AA as the target)
- **Semantic HTML first:** `button` for actions, `a` for navigation, `nav`, `ul/li`, `dl`, `fieldset/legend`, headings in a logical order (don't skip levels to get a style). [Adobe: blocks must be accessible]
- **Keyboard:** everything interactive is reachable and operable with Tab, Shift+Tab, Enter and Space (and Esc for overlays). Focus order follows visual order. No keyboard traps.
- **Visible focus:** never remove outlines without an equally visible replacement (`:focus-visible`).
- **ARIA only when HTML can't do it**, and keep ARIA states in sync (`aria-expanded`, `aria-controls`, `aria-selected`, `aria-hidden`, `aria-live` for dynamic messages).
- **Images:** meaningful images need alt text from content. Decorative images get `alt=""`.
- **Colour contrast:** ≥ 4.5:1 for text, ≥ 3:1 for UI components and large text. Never use colour alone to convey state.
- **Forms:** every input has a label; errors are text, linked via `aria-describedby`, and announced.
- **Motion:** honour `prefers-reduced-motion`. Carousels need pause controls and no forced auto-advance.
- **Touch targets:** at least about 44×44 CSS px on mobile (express in `rem`).

---

## 9. SEO and content integrity
- Don't hide or duplicate canonical content for SEO tricks. Keep headings meaningful (one `h1` per page, usually authored).
- Links stay real `<a href>`s (crawlable). No JS-only navigation.
- Keep the page metadata (title, description, `og:` image) authored. Don't overwrite it in JS.
- Use `loading`/`fetchpriority` sensibly. Don't lazy-load the LCP image.

---

## 10. Internationalisation and reusability
- **No hard-coded copy, dates, currencies or locale-specific formats** in code. Use content, placeholders and `Intl` APIs.
- **Make blocks reusable across pages and sites:** configuration via authored content or variants, not code forks.
- **Shared helpers** go in `/scripts/utils.js` only when used by **two or more** blocks. Don't create abstractions for single use.
- **Document the content model** at the top of the block JS (expected rows and cells, variants, optional parts) and, if the project has one, in the block library or docs.

---

## 11. Security
- No secrets, tokens or signed URLs in code, content, commit messages or logs. The repository is usually **public**. [Adobe recommends public repos]
- Sanitise or avoid HTML injection (section 4.2). Never `eval`, `new Function`, or inline event-handler strings.
- Third-party scripts: only from approved vendors, loaded in the delayed phase, with integrity and fallbacks where possible.
- Form endpoints and webhooks that are publicly reachable need spam and abuse protection on the server side. Client-side checks are not security.

---

## 12. Git, PR and release workflow
- **Branch per change** (`feat/<block>-<topic>`, `fix/<block>-<issue>`), short-lived. Small, focused PRs. Use trunk-based development. [Adobe]
- **Never push or merge to `main` without approval.** Merging to main deploys to production. [Adobe]
- **Commit messages:** Conventional Commits (`feat(cards): add horizontal variant`), with the why in the body.
- **Every PR MUST include:**
  1. A summary of the change and why.
  2. **Test URLs on the branch preview** (`https://{branch}--{repo}--{owner}.aem.page/{path}`) showing every page where the changed block appears. [Adobe]
  3. Lint passing.
  4. PageSpeed Insights green (ideally 100) for those URLs. [Adobe]
  5. Notes on content-model changes and author impact.
- **Draft PRs** for work in progress. Don't push into other people's branches uninvited. Merge only your own PRs, or when the author agrees. [Adobe]
- **Don't change lint configuration** to make code pass. [Adobe]
- **Hide non-site files** with `.hlxignore`. Keep docs and test artefacts out of the served tree.

---

## 13. Mandatory self-validation protocol (run before every delivery)

You MUST complete every applicable step and report the results. If a step can't be run in your environment, say so explicitly. Don't skip it silently.

**A. Static checks**
- [ ] `npm run lint` (ESLint + Stylelint) passes with **zero** errors, and no new warnings in touched files.
- [ ] No edits to `scripts/aem.js`; no new runtime dependencies; no build step added.
- [ ] Every block selector is scoped to `.<block-name>`; no `!important`; breakpoints are 600/900/1200 `min-width` only.
- [ ] No hard-coded colours, fonts or repeated sizes (tokens used); no fixed heights on content containers; `px` only for borders and breakpoints.
- [ ] No `innerHTML` with dynamic data; no inline styles except CSS custom properties; no `console.log`; no dead code.
- [ ] No hard-coded user-facing copy (or documented as a localisation gap).

**B. Runtime checks** (local dev server `npx -y @adobe/aem-cli up` → `http://localhost:3000`, or the branch `.aem.page` preview)
- [ ] The page renders with **real authored content**, including edge cases: missing optional cells, extra cells, empty block, very long text, many items, one item.
- [ ] **No console errors**, no failed network requests caused by the change.
- [ ] Mobile (≈ 375 px), tablet (≈ 768 px) and desktop (≥ 1200 px) layouts are correct; no horizontal scroll.
- [ ] No visible layout shift when images or async content load.
- [ ] Keyboard-only walk-through works; focus is visible; screen-reader names and states make sense (spot-check with the accessibility tree).
- [ ] Every interactive state has been tested (open/close, next/previous, error/success, empty/loading).

**C. Regression checks**
- [ ] Other pages using the same block or shared code still render correctly (list them).
- [ ] Existing content structures still work (backward compatibility). If not, a migration note is included.

**D. Performance**
- [ ] The LCP element is unaffected or improved; heavy code is lazy or delayed; images are optimised.
- [ ] PageSpeed Insights on the branch preview is green, or the reason it couldn't be run is stated.

**E. Fix loop**
- If any check fails: fix it, re-run **all** affected checks, and only then report. Never deliver known failures without explicitly listing them as open issues.

---

## 14. Delivery report format

Every delivery ends with:

```
## Summary
<what changed and why, 2–4 lines>

## Files changed
- blocks/<name>/<name>.js: <purpose>
- blocks/<name>/<name>.css: <purpose>

## Content model
<rows/cells/variants expected; author impact; migration notes if any>

## Validation
| Check | Result | Evidence |
|---|---|---|
| Lint | Pass | npm run lint, 0 errors |
| Render with real content | Tested | <URL> |
| Edge cases (missing cells, empty) | Tested | <what was tried> |
| Mobile / tablet / desktop | Tested | 375 / 768 / 1280 |
| Keyboard + focus | Tested | <notes> |
| Console errors | None | |
| Regression pages | Tested | <URLs> |
| PageSpeed Insights | <score> / Not run (reason) | |

## Not verified / assumptions
- <anything not tested, with the reason>

## Next steps (if any)
```

---

## 15. Forbidden list (quick reference)

MUST NOT:
- Edit `scripts/aem.js`, or add build tools, frameworks or minification.
- Push or merge to `main`, publish content, or change shared config **without approval**.
- Use `!important`, unscoped selectors, `max-width` media queries mixed with `min-width`, or non-standard breakpoints without justification.
- Hard-code colours, fonts, repeated sizes, heights of content containers, or user-facing copy.
- Inject dynamic content with `innerHTML` / `insertAdjacentHTML`.
- Load third-party scripts in `head.html` or in the eager phase.
- Nest blocks, or change an existing content model silently.
- Change lint rules to make code pass.
- Commit secrets, signed URLs or personal data; put user input in URLs.
- Claim a feature works without having run it.

---

## 16. Definition of Done

A task is done only when **all** of these are true:
1. The requirement is implemented with the minimal necessary change.
2. The content model is documented, author-friendly and backward compatible (or migration documented).
3. All section 13 checks pass, or each exception is explicitly listed and accepted.
4. The code follows sections 2–11 (naming, JS, CSS, tokens, units, errors, performance, a11y, SEO, i18n, security).
5. A branch preview URL demonstrates the change, and the delivery report (section 14) is complete and honest.

---

## 17. Project-specific overrides (fill in per project)

```
Project:               <name>
Repo / owner:          <owner>/<repo>
Authoring model:       DA.live | SharePoint | Google Drive | Universal Editor (xwalk)
Preview URL pattern:   https://{branch}--<repo>--<owner>.aem.page
Token file:            styles/styles.css (:root) | styles/brand.css | …
Breakpoints override:  (none) | <values + reason>
Approved dependencies: (none) | <list>
Lint commands:         npm run lint
Who approves merges:   <name/role>
Content publishing:    preview only by the agent | <rule>
Other rules:           <e.g. PR must link a preview URL; .hlxignore paths; naming prefixes>
```

> If anything in this section conflicts with the rest of the document, this section wins for this project. Report the conflict once in your first delivery.

---

## References (official)
- Development collaboration and good practices: https://www.aem.live/docs/dev-collab-and-good-practices
- Keeping Lighthouse at 100 (E-L-D loading): https://www.aem.live/developer/keeping-it-100
- Markup, sections, blocks and auto-blocking: https://www.aem.live/developer/markup-sections-blocks
- Content modelling (David's Model): https://www.aem.live/docs/davidsmodel
- Block Collection and principles: https://www.aem.live/developer/block-collection
- AEM Boilerplate: https://github.com/adobe/aem-boilerplate
- AEM Block Collection: https://github.com/adobe/aem-block-collection
