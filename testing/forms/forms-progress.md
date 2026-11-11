# Forms POC: progress log

Author: ALAN RAJI MANI (araji@adobe.com)
Site: araji-adobe/bv-poc-wknd-aln (content in DA, code on GitHub)
Code branch: `forms-poc` (not merged to main; preview only)
Started: 4 Nov, 3:38 (user's local time). 24-hour target.

Labels: Documented / Tested / Unsupported / Unknown

## Steps

| # | Step | Who | Result | Evidence |
|---|---|---|---|---|
| 0 | Identify the environment | Ema | Tested: DA content source, GitHub code, no form block | config + DA list |
| 1 | Add the official form block on branch `forms-poc` | Ema | Tested: `/blocks/form/form.js` served on the branch preview (first push failed with a GitHub 500, the retry worked) | branch preview 200 |
| 2 | Create the DA folder `forms-poc` | User | Tested | A01-da-forms-poc-folder.png |
| 3 | Create the sheet `contact-form` | User | Tested | A02-da-contact-form-sheet-empty.png |
| 4 | Type the header row | User | Tested: 6 headers correct | A03-da-contact-form-headers.png |
| 5 | Type 5 field rows | User | Tested on the 2nd attempt. The 1st attempt didn't save. | A04-da-contact-form-fields.png, A04b |
| 6 | Preview the sheet | User | Tested: JSON served on the main and forms-poc previews | A05-contact-form-json-preview.png |
| 7 | Create the page `contact` (DA menu says "Page", not "Document") | User | Tested | A06-da-contact-page-empty.png |
| 8–9 | Insert a block table (DA's default name is "columns") and rename it to `form` | User | Tested | A07, A08-da-contact-page-form-block.png |
| 10 | Link the sheet in the block (`/forms-poc/contact-form.json`, a relative path accepted by DA) | User | Tested | A09-da-contact-page-form-link.png |
| 11 | Preview the page; render it on the forms-poc branch | User + Ema | Tested: 4 fields + button render on the branch; all 4 are required and the empty form fails validation; the main preview shows no form (no block on main) | A10, A11 |
| 11b | Submission | — | Not configured: there's no submit link, so the button has no submit target | — |
| 12 | Decide on saving entries | User | Documented blocker. The Forms Submission Service (Experience League) needs the repo on an Adobe allowlist (process undocumented), the Adaptive Forms Block (not the simple form block), an `incoming` sheet shared with forms@adobe.com as "Anyone with the link can edit", and a form `{id}` (source undocumented). The user chose to stop and document it. | Experience League: forms-submission-service |
| 13 | Form B: Ema generates the "Adventure Booking Request" sheet (8 rows: text, email, select, date, number, radio, checkbox, submit) and page | Ema | Tested in the browser: all 7 field types render with the forms-poc block code, all are required, the empty form is invalid. Ema timer started at 10:07 UTC (3:37 pm IST) | local files in content/forms-poc/ |
| 14 | Upload Form B to DA and preview it (user approved) | Ema | Tested: DA returned 201 for both items; the DA sheet rows match the local file exactly (8/8); preview returned 200 for both; the branch page renders all fields. Finished at 10:10 UTC, so about 4 min of Ema work plus 2 user approval clicks | B01/B02 screenshots (user) |
| 5b | Ema lost DA access (401) after the session restart; fixed by re-enabling Settings → LLM Permissions | User | Tested | A04c-settings-llm-permissions-on.png |

| 15 | Screenshots of Form B (branch page + DA sheet) | User | Done | B01, B02 |
| 16 | Template: the chat attachment arrived as plain text, and it was the old scheduler deck, not "Adobe EDS_usecase.pptx". The user chose the Adobe default style | User | Limitation | — |
| 17 | Deliverables: `Forms-POC-DA-vs-Ema.pptx` (14 slides with speaker notes), `SOP-Forms-DA-and-Ema.md`, `speaking-script.md`, `deck-build.js` (rebuild with pptxgenjs), and evidence E01–E03 captured by Ema on the branch preview | Ema | Done 10:42 UTC | testing/forms/ |

| 18 | Saving to OneDrive without AEM Forms: the forms-excat add-on has no saving feature (it converts HTML forms to sheets); the Experience League local SDK page needs AEM Forms CS provisioning, so it was rejected. Route chosen: Microsoft Power Automate | Ema | Documented | — |
| 19 | Power Automate: the Premium "When an HTTP request is received" trigger was available on the user's account (environment "Adobe (Personal Productivity)"); "Who can trigger" = Anyone was allowed; flow saved | User | Tested | C01, C02, C04, C06 |
| 20 | Excel `wknd-contact-submissions.xlsx` in OneDrive, table Table2 (submittedAt, name, email, topic, message); action "Add a row into a table" with utcNow() + triggerBody()?['data']?[…] | User | Tested | C03, C05b |
| 21 | Flow URL put in Form A's 2nd block cell, typed by the user in DA (kept out of chat) | User | Tested (read from DA) | C07 |
| 22 | Ema's server test (12:37 UTC): CORS preflight 204 with allow-origin *; POST 202; the row appeared in Excel | Ema + User | Tested | C08-excel-test-row.png |
| 23 | Code: thank-you / error message after sending (commit aef1c18) | Ema | Pushed by the user with Sync; live on the branch at 12:50 UTC. Sync also pushed all 15 untracked testing/forms files plus .agents/settings.json to the public repo (no flow signature in them) | C09 |
| 24 | Live website test: Form A previewed in DA, real entry sent from the branch page | User | Tested: "Thank you. Your entry was received."; row 3 appeared in Excel | C10, C11 |
| 25 | Deck updated: OneDrive saving + content-model slide (15 slides); SOP Part D added; script regenerated | Ema | Done 12:58 UTC | testing/forms/ |

| 26 | 11 Nov. Advanced forms extension: a new separate form (user choice). Ema generated sheet `advanced-form` (15 rows: 3 steps, review, pattern/error columns, conditional Business fields) and page `advanced`; extended the block with opt-in pattern, error, step and review (commit 28b5d8e, local); tested locally (see advanced-capability-matrix.md) | Ema | Pass (local) | F01–F06 |
| 27 | Upload + preview of advanced-form and advanced (user approved) | Ema | Tested: DA 201 ×2, rows 15/15 match, preview 200 ×2, the served sheet keeps the patterns intact. The code push is still pending, so the branch preview has old code | — |

## Defects found

- D1 (Tested, 10:15 UTC): with no submit link in the block, form.js never attaches its submit handler. Clicking the button on an empty form gives no validation messages; the page reloads with `?name=&email=&message=`, so typed values (e.g. email) would end up in the URL. Affects both forms. The earlier "empty form is invalid" result was only `checkValidity()`, not what the visitor sees.
  - Fix (user approved, branch only): commits 4d600dd and 26d5e95. The block always validates; with no submit URL it shows "Thank you. Demo only: your entry was not saved." and resets the form (select placeholders restored).
  - Tested on the local preview, both forms. Form A: empty submit keeps the URL and focuses Full Name; a bad email focuses Email; valid input shows the notice. Form B: empty submit focuses Full name; then it stops at Experience level, then Consent; valid input shows the notice and the Adventure dropdown resets to "Choose an adventure".
  - Push blocked at 10:16 UTC (no GitHub credentials after the session restart), so the branch preview still has the old code.
  - The user pushed with Sync → Code (Ema's own git push had no credentials, even with the toggle on). Sync also committed this log as 1bdca40.
  - Retested at 10:33 UTC on the real branch previews (`forms-poc--…aem.page/forms-poc/contact` and `/booking`): all of the above pass. D1 closed.
- Note: the local preview's nav/footer links point to another site (edscapstoneajay). Demo from the branch preview, not the local one.

## Form A (manual DA) observations for the comparison

- Manual typing gave small text differences from the spec: "Full Name", "your full name", "General questions", "How can we help", "Send Message". All are cosmetic; the field names, types and required values are exact.
- The first round of typing was lost (no DA save happened). This is a DA authoring risk to mention in the comparison.
