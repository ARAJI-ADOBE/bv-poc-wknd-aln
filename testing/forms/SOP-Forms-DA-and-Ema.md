# SOP: Build and test a form on Edge Delivery Services (DA.live by hand, with Ema, or with Experience Workspace)

Author: ALAN RAJI MANI (araji@adobe.com) · Version 1.1 · 16 Nov 2026 (adds Part C: Experience Workspace, and the extended sheet format)
Site used: araji-adobe/bv-poc-wknd-aln · Code branch: `forms-poc`

Official references (linked, not copied):
- Forms on EDS: https://www.aem.live/developer/forms
- Forms Submission Service: https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/edge-delivery/build-forms/forms-submission-service

Evidence labels used below: **Tested** (proved on our site), **Documented** (Adobe docs), **Limitation** (observed constraint), **Unknown** (not tested).

---

## 0. Before you start

| Check | How | Expected |
|---|---|---|
| The site has a form block | Open `https://<branch>--bv-poc-wknd-aln--araji-adobe.aem.page/blocks/form/form.js` | HTTP 200. Today it exists only on `forms-poc` (**Tested**). |
| You can edit DA | Open `https://da.live/#/araji-adobe/bv-poc-wknd-aln` | Folder list shows nav, footer, us, forms-poc |
| Experience Workspace (Part C only) | Open DA.live and check that you can open Experience Workspace | It answers in chat. Note: it says it can publish, so every prompt must say "never publish" |
| Licence | Ask your Adobe contact | Adobe docs say an AEM Forms licence is required (**Documented**) |
| Shared environment rule | n/a | Never change existing pages, config or `main` without permission. Preview only. |

Terms:
- **Sheet**: a DA spreadsheet. Each row is one form field.
- **Preview**: makes content readable on the test site (`aem.page`). It is not public. **Publish** (`aem.live`) is public, so don't use it here.
- **Block**: a table on a page whose top cell names a piece of site code (here, `form`).
- **Branch**: a separate copy of the site code. Its preview address starts with the branch name.

---

## Part A: Build a form by hand in DA.live

| # | Where | Do exactly this | Expected result | Screenshot |
|---|---|---|---|---|
| A1 | DA folder list | **+ New** → **Folder** → type `forms-poc` → Create (skip if it already exists) | The folder appears | A01 |
| A2 | Inside the folder | **+ New** → **Sheet** → name it `contact-form` | An empty grid opens | A02 |
| A3 | Sheet, row 1 | Type in A1–F1, in **lowercase**: `field`, `label`, `type`, `placeholder`, `options`, `required` | 6 headers | A03 |
| A4 | Sheet, rows 2+ | One row per field (see the field-type table below). Last row: `submit` / button text / `submit` | Rows filled in | A04 |
| A5 | Sheet | **Wait 5 seconds**, then reload the page (F5) and check that the rows are still there | Rows persist. **Limitation:** our first round of rows was lost because it never saved. | A04b |
| A6 | Sheet | Top right: **Preview** (NOT Publish) | A new tab shows `…/contact-form.json` with `"data":[…]` | A05 |
| A7 | Folder | **+ New** → **Page** (DA says "Page", not "Document") → name it `contact` | An empty editor opens | A06 |
| A8 | Page editor | Insert a table (block). DA inserts a table headed `columns` | A table appears | A07 |
| A9 | Table header | Double-click `columns` and type `form` | The header reads `form` | A08 |
| A10 | First empty cell | Type `/forms-poc/contact-form.json`, select it, press Ctrl/Cmd + K, enter the same path, press Enter. Leave the second cell empty (or put a submit address there, see Part E) | The text becomes a link | A09 |
| A11 | Page | Paper-plane button → **Preview** (NOT Publish) | The `main` preview shows **no form** until the block is merged to main (**Tested**) | A10 |
| A12 | Browser | Open `https://forms-poc--bv-poc-wknd-aln--araji-adobe.aem.page/forms-poc/contact` | The form renders | A11 |

### Field types supported by the form block (Tested on our site)

| `type` | Shows | `options` column |
|---|---|---|
| `text` | One-line box | — |
| `email` | One-line box with email check | — |
| `number` | Number box | — |
| `date` | Date picker | — |
| `textarea` | Large text box | — |
| `select` | Dropdown (`placeholder` becomes a disabled first choice) | Comma-separated choices in ONE cell |
| `radio` | Radio buttons | Comma-separated choices |
| `checkbox` | Checkbox(es) | Comma-separated choices (one choice = a single consent box) |
| `submit` | Button | — |

`required` = `true` (lowercase) makes a field mandatory. The `field` column becomes the internal name; keep it to letters, with no spaces.

### Extended sheet format (advanced forms, `forms-poc` branch only)

Ema added these to the block on 11 Nov. They are opt-in, so Forms A and B are unchanged. All were **Tested** live on `/forms-poc/advanced` except where marked. Column names must be exactly these, in lowercase. **The block silently ignores any other column name** (see Part C).

| Column or row type | What to put in it | Example |
|---|---|---|
| `pattern` column | An HTML input pattern. It always matches the WHOLE value, so don't add `^` or `$`. Inside `[ ]`, write a hyphen as `\-` | `[0-9]{10}` |
| `error` column | The message shown under the field when the pattern doesn't match. An empty required field gets "Please enter <label>." automatically | `Enter exactly 10 digits, no spaces.` |
| `help` column | Hint text shown with the field | `10 digits, e.g. 9876543210` |
| `conditional` column | Show this row only when another field has a given value: `<other field name>-<value>`, both lowercase. A hidden field never blocks the form | `enquirytype-business` |
| `type` = `step` | Starts a new step (title in `label`). Every row below belongs to it until the next step row. Next/Previous and "Step N of M" are added automatically | label `Personal details` |
| `type` = `review` | A read-only summary of all answers. Put it in the last step | label `Please check your details` |
| `type` = `confirmation` | The page to open after sending (path in `label`). **Tested locally only** | label `/forms-poc/advanced-thank-you` |

Required + conditional: if a field must be filled in **when it is shown** (e.g. Company for Business), set `required=true` **and** `conditional`. Hidden fields are skipped automatically. Leaving `required` empty makes the field optional even when it is shown (finding W3).

Known limits: the condition format isn't author-friendly (L1); `[A-Za-z]` rejects accented names such as "José" (L2).

---

## Part B: Build a form with Ema

| # | Who | Do exactly this | Expected result |
|---|---|---|---|
| B1 | Author | Ask Ema in plain words: the business use case, the fields, the field types, and the folder (e.g. "Create an adventure booking request form in /forms-poc with …") | Ema proposes the fields |
| B2 | Ema | Generates the sheet and page in the local workspace and test-renders them with the branch code | Ema reports a field-by-field render result |
| B3 | Author | Approve the upload. The question names the exact items and says nothing is published | Ema uploads the 2 new items to DA |
| B4 | Ema | Checks the DA copy against the local copy (row by row), then previews both items | "8 of 8 rows match", preview 200 (**Tested**) |
| B5 | Author | Open the branch page and the DA sheet; take screenshots | Same structure as a hand-built form |

If Ema reports **401 / not authorised** after a restart (**Limitation**, Tested twice):
1. Settings → LLM Permissions → toggle "Allow LLM to use my Adobe credentials…" off and on again. For DA this worked immediately.
2. If GitHub pushes fail ("could not read Username"), push yourself: workspace panel → **Sync** → **Code** → check that the branch is `forms-poc` → Push. Don't stage `content/` files.
3. Never paste a token into the chat.

---

## Part C: Build a form with Experience Workspace

Experience Workspace is the assistant inside DA.live. It works on **content only**: it can create and change DA sheets and pages and preview them, but it **cannot read or change code** (self-reported on 11 Nov, W01). So it can't see which columns the form block reads. It can only use the block's features if you tell it the exact format. Full results: `workspace-capability-matrix.md`; exact prompts: `workspace-round1-prompt.md` and `workspace-round2-prompt.md`.

What we found (**Tested** on 11 Nov, same advanced requirements as Ema):

| Round | What we gave it | Result |
|---|---|---|
| 1 (blind) | The requirements only | 2 pass, 3 partial, 5 fail. It guessed the columns (`validation`, `errorMessage`, `showIf`, a `step` column), and the block silently ignored them: one long page, no rules, Business fields always visible |
| 2 (guided) | The requirements + the extended sheet format (Part A) | 9 pass, 2 partial, 1 fail. Steps, rules, messages and review all worked |

| # | Who | Do exactly this | Expected result | Screenshot |
|---|---|---|---|---|
| C1 | Author | Check that the form block exists on the branch you will test on (section 0). Experience Workspace can't add or change the block | `form.js` returns 200 on the branch | — |
| C2 | Author | Open Experience Workspace in DA.live and paste the prompt below, filled in. **Always include the sheet format**, even for a simple form | It proposes a plan listing the exact new items | H10 |
| C3 | Author | Read the plan. It must list ONLY the new sheet and page you asked for. If it mentions any other file, or publishing, say no and correct it | Plan matches your request | — |
| C4 | Author | Reply `approved` | It creates the sheet and page, then asks before previewing | — |
| C5 | Author | **Before** you approve the preview, open the new sheet in DA and check every row against the checklist below | Every column name is in the format table; no extra rules | H10b |
| C6 | Author | Fix any wrong rows yourself in DA (wait 5 s, reload, check they saved), or ask it to fix them. Then approve the preview of the page **and** the sheet | Both previewed. Nothing is published | — |
| C7 | Author | Run T1–T4 (Part D), plus a test of each rule and condition, on the branch preview | All pass | H11–H14 |
| C8 | Author | In DA, check that no other file changed (look at the modified dates in `/forms-poc`) | Only the 2 new items are new or changed | — |

It did C2–C4 and C6 safely in both rounds: it waited for "approved", asked before previewing and never published (**Tested**). But it **does not test its own output** (**Tested**), so C5, C7 and C8 are always the author's job.

### Row checklist (C5)

- [ ] Column names are only `field`, `label`, `type`, `placeholder`, `options`, `required`, `pattern`, `error`, `help`, `conditional` (lowercase). Anything else (`validation`, `errorMessage`, `showIf`, `mandatory`…) is ignored without a warning (W1).
- [ ] Steps are `type=step` **rows**, not a step column, and there is a `review` row in the last step if you asked for one.
- [ ] A field that must be filled in when it is shown has `required=true` as well as `conditional` (W3).
- [ ] Every `select` has a `placeholder`, so the visitor must actively choose (W4).
- [ ] No rule you didn't ask for. In both rounds it added a US ZIP rule nobody requested, and in Round 2 its syntax was invalid, so the browser silently ignored it (W2). Delete such rows or cells.
- [ ] Patterns have no `^` or `$`. Open the browser console on the page: "Invalid regular expression" or "Invalid escape" means a broken pattern.

### Prompt template (fill in the `< >` parts)

```
Please ACTUALLY create the content, not just describe it.

SITE AND RULES
- Site: araji-adobe / bv-poc-wknd-aln. Folder: /forms-poc
- Create ONLY: sheet /forms-poc/<name>-form and page /forms-poc/<name>.
  The page has a heading, a short description and a "form" block whose
  first cell links to /forms-poc/<name>-form.json.
- Do NOT change, delete or move any other file. NEVER publish.
- Tell me exactly what you will create and wait for "approved".
  Ask before previewing, then preview the page AND the sheet.
- Use test data only. Do not add rules I don't ask for.

SHEET FORMAT THIS SITE'S FORM BLOCK READS (lowercase column names, use no others)
field | label | type | placeholder | options | required | pattern | error | help | conditional
<paste the "Extended sheet format" rules from Part A>

REQUIREMENTS
<the business use case, each field, its type, required or not, its rule
 and error message, the steps and any conditions>

WHEN DONE, report the exact rows you created.
```

---

## Part D: Test every form (T1–T4) before you demo or publish

Run these on the **branch preview** address, in a normal browser window.

| # | Do | Pass when |
|---|---|---|
| T1 | Click the submit button with everything empty | You stay on the page, the cursor jumps to the first required field, and the web address does NOT change |
| T2 | Type `not-an-email` in the email field and submit | It stops at Email |
| T3 | Leave a required radio or checkbox empty and submit | It stops at that group |
| T4 | Fill everything in correctly and submit | Without a submit address: "Thank you. Demo only: your entry was not saved." With a submit address: the confirmation behaviour |

If T1 reloads the page and the address gains `?name=&email=…`, the branch is missing fix D1 (commit `4d600dd`, "validate and show a demo notice when no submit URL is set"). Don't demo until the fix is present.

---

## Part E: Saving submissions to OneDrive without AEM Forms (Tested for Form A)

| # | Where | Do exactly this | Expected |
|---|---|---|---|
| D1 | make.powerautomate.com | **+ Create** → **Instant cloud flow** → search `HTTP` → select **When an HTTP request is received** → **Create** | The flow editor opens with a box named "manual". No Premium/upgrade message. |
| D2 | OneDrive | New **Excel workbook** `wknd-contact-submissions`; row 1 = `submittedAt`, `name`, `email`, `topic`, `message` (use the form's `field` names); select the headers → **Insert → Table** → "My table has headers" | A table with filter arrows (ours was named Table2, which is fine) |
| D3 | Flow: "manual" box | **Who can trigger** = **Anyone**; paste a Request Body JSON Schema: an object `data` with one string property per field | No red error; "URL will be generated after save" |
| D4 | Flow | **+** → **Add an action** → Excel Online (Business) **Add a row into a table** → OneDrive for Business / OneDrive / the file / the table → **Advanced parameters → Show all** | The column boxes appear |
| D5 | Column boxes | Clear each box, click **fx**, enter `utcNow()` for submittedAt and `triggerBody()?['data']?['<field>']` for the others → **Add** | Each box shows a coloured chip, not plain text |
| D6 | Flow | **Save**, then open "manual" and copy the **HTTP URL** (don't paste it into chats) | A long `https://…powerplatform.com…` address |
| D7 | DA page | Right-hand cell of the `form` table: type `Submit to OneDrive`, select it, Ctrl/Cmd + K, paste the URL, Enter; then **Preview** the page | A link in cell 2 |
| D8 | Branch page | Fill in the form and send | "Thank you. Your entry was received." and a new row in Excel within seconds |

Tested on 5 Nov: the CORS preflight returns 204 with `access-control-allow-origin: *`, and sending returns 202. **Limitations:** the flow address is visible in the page source, so anyone can post rows (no spam protection), and the HTTP trigger is a Microsoft **Premium** feature.

### Adobe's own route (not used)

The Forms Submission Service (**Documented**) needs:
1. The repository on Adobe's allowlist (process not documented, so ask the AEM Forms team).
2. The **Adaptive Forms Block**, not the simple form block used here.
3. An Excel (SharePoint/OneDrive) or Google Sheet with a tab named exactly `incoming`, with column headers matching the `field` names, shared with `forms@adobe.com` as editor ("Anyone with the link can edit").
4. A submit endpoint with a form `{id}`.

DA is not a listed submission target. Status: **Unknown** until the allowlist is confirmed.

---

## Part F: Go-live checklist

1. Run T1–T4 on every form on the branch preview. For forms made by Experience Workspace, also re-check the rows against the Part C checklist.
2. Open a PR from `forms-poc` to `main` and include a `https://forms-poc--…aem.page/forms-poc/contact` preview link (PRs without one are rejected).
3. After the merge, check that the `main` preview shows the forms.
4. Publish the `/forms-poc` sheets and pages through the normal (scheduled) publish process. Sheets must be published as well as pages, or the live form can't load its fields.
5. Re-run T1–T4 on `aem.live`.

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| The page shows no form | No form block in this branch's code, or the sheet isn't previewed | Use the forms-poc branch address; preview the sheet |
| The form disappears completely | The link in the block points to a missing or unpreviewed sheet | Check that `…/<sheet>.json` opens; fix the link |
| Fields are missing or wrong | Header misspelled or not lowercase | Fix row 1, then preview the sheet again |
| Rows vanished after typing | DA didn't save before you left | Reload; retype; wait 5 s |
| Ema says 401 | Session restarted; permission not active | Settings → LLM Permissions (toggle off/on) |
| The form looks right but rules, steps or show/hide do nothing | Wrong column names (e.g. Experience Workspace's `validation`, `errorMessage`, `showIf`); the block ignores them silently | Rename the columns to the Part A format; preview the sheet again |
| A pattern is ignored; the console says "Invalid escape" | Broken pattern syntax (e.g. `\-` outside `[ ]`) | Fix or delete the pattern; no `^`/`$` |
| A conditional field can be left empty | `required` is empty on that row | Set `required=true`; hidden fields are skipped anyway |
| A chat attachment arrives as text | The chat converts .pptx files | Share the template another way; use the Adobe default style |
