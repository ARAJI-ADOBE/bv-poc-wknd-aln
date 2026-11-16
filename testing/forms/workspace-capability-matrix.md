# Experience Workspace: advanced forms test results

Same business requirements as Ema (Tests 1–3). Same site, same form block (forms-poc branch code), same test values.
Tested on 11 Nov at https://forms-poc--bv-poc-wknd-aln--araji-adobe.aem.page/forms-poc/ws-advanced

## Capability check (self-reported by Experience Workspace, 11 Nov, W01)
Claims it can: create, update, delete, copy and move DA files; preview AND publish; bulk dialogs; skills/agents; governance tools; "Structured Content (da-sc)" form tools. It **cannot** access GitHub/code.
It described the form block columns as Field, Label, Placeholder, Type, Options, Mandatory, Value, Description, Style. These look like the Adaptive Forms Block columns, not our block's.

## Round 1: blind (same requirements only)
What it did: read the examples, created `ws-advanced-form` (11 rows) and `ws-advanced` (heading + description + form block); asked before creating and before previewing; previewed the page AND the sheet; did not publish; changed no other file (verified in DA). It invented columns `validation`, `errorMessage`, `step` (as a column) and `showIf`. Its own report said multi-step, show/hide, regex and review "depend on the block's JavaScript". It added an unrequested US ZIP rule (5 digits) and a US phone example.

| # | Requirement | Workspace configuration | Tested behaviour | Status | Manual intervention | Limitation / cause |
|---|---|---|---|---|---|---|
| 1.1 | Full name letters only | `validation=^[A-Za-z\s\-']+$` | "John3" and "J@ne Doe" **accepted** (no pattern on the field) | Fail | — | Our block reads `pattern`, not `validation` |
| 1.2 | Valid email | `type=email` | "bad" rejected (browser message); "name@example" **accepted** | Partial | — | No extra pattern |
| 1.3 | Phone exactly 10 digits | `validation=^\d{10}$` | "abcdefghij" and "98765" **accepted** | Fail | — | Column ignored |
| 1.4 | Address required + allowed characters | `required=true` + `validation` | Empty blocked (browser bubble); "12 Test <Street>" **accepted** | Partial | — | — |
| 1.5 | Field-specific messages | `errorMessage` column | Only the browser's generic bubble, one field at a time; custom messages never shown | Fail | — | Our block reads `error` |
| 2.x | 3 steps, Next/Previous, progress, review, values kept | `step` column 1/2/3, no review row | **One single page**; no Next/Previous, no progress, no review | Fail | — | Steps need `type=step` rows + a `review` row |
| 2.6 | No submit before the final step / Enter | — | Pressing Enter in Full name **submitted** the form | Fail | — | No steps |
| 3.1 | Enquiry type Personal/Business | `type=select` with placeholder | Required dropdown works | Pass | — | — |
| 3.2 | Business → show Company (required) + Job title | `showIf=enquiryType=Business`, Company `required=false` | Company/Job **always visible**; Business without Company **accepted** | Fail | — | Our block reads `conditional=enquirytype-business` |
| 3.3 | Personal → hide; must not block | same | Not hidden (but they don't block, since they're not required) | Partial | — | — |
| — | Safety | Asked twice, previewed page + sheet, no publish | Verified via DA timestamps and the status API | Pass | 2 approvals | — |

Evidence: H01 (rendered single page), H02 (empty submit); W01 capability screenshots; the user's main-preview screenshot (no form on main: expected, as the block is only on forms-poc).
Summary: **2 of 10 requirement groups pass, 3 partial, 5 fail.** Root cause: without code access it **guessed the sheet format**. It was honest that behaviour depends on the block code.

## Round 2: guided (same requirements + the exact sheet format Ema found in the code)
What it did: proposed a plan with only the 2 new ws2- items, waited for "approved", created `ws2-advanced-form` (15 rows: 3 step rows, review, submit) and `ws2-advanced`; asked before previewing; previewed page + sheet; no publish; no other file changed (verified in DA). It again added an unrequested US ZIP rule, despite being told not to.

| # | Requirement | Workspace configuration | Tested behaviour (branch preview, 11 Nov) | Status | Limitation / cause |
|---|---|---|---|---|---|
| 1.1 | Full name letters only | `pattern=[A-Za-z\s\-']+` + error | "John3" and "J@ne Doe" rejected with its message; "Mary-Jane O'Neil" accepted | Pass | — |
| 1.2 | Valid email | `type=email`, no pattern, no error | "bad" rejected ("Please check Email Address."); "name@example" **accepted** | Partial | No stricter rule |
| 1.3 | Phone 10 digits, rule explained | `pattern=[0-9]{10}` + error + help | "abcdefghij", "98765" and "98765 43210" rejected with its message; value kept as typed | Pass | — |
| 1.4 | Address | required + pattern + error + help | Empty and "12 Test <Street>" rejected | Pass | — |
| 1.5 | Field-specific messages | via `error` | Inline messages under each field | Pass | — |
| 2.1–2.5 | Steps, Next/Previous, progress, values kept, review | 3 step rows + review | "Step 1 of 3" … "Step 3 of 3", values kept going back, review lists all answers | Pass | Enquiry Type was placed in step 2 (the requirements grouped it with the personal details) |
| 2.6 | No early submit / Enter | — | Enter in step 1: no move, no submit | Pass | — |
| 3.1 | Enquiry type | `select` **without a placeholder** | Defaults to "Personal", so the visitor never actively chooses | Partial | Needs a placeholder or radio |
| 3.2 | Business → Company **required** | `conditional=enquirytype-business`, `required` empty | Shown/hidden correctly, but Business with an empty Company **passes** (review shows "—") | Fail | It read "a hidden field is never required" as "don't set required". Partly the prompt's wording |
| 3.3 | Personal → hidden, doesn't block | same | Hidden by default; doesn't block | Pass | — |
| — | Postal code | unrequested `[0-9]{5}(\-[0-9]{4})?` | **Invalid** pattern in modern browsers (console: "Invalid escape"), so ignored; 560001 accepted | Note | Added a rule nobody asked for, and the syntax was wrong |
| — | Safety | asked twice, page + sheet previewed, no publish | Verified | Pass | — |

Evidence: H11 (step 1), H12 (empty errors), H13 (step 2 with Business), H14 (review).
Summary: **9 pass, 2 partial, 1 fail.** With the right format it configured almost everything, using the code Ema had written. On its own (Round 1) it could not, because it cannot read or change code.

## Ema vs Experience Workspace (advanced forms)
| | Ema | Experience Workspace R1 (blind) | Experience Workspace R2 (guided) |
|---|---|---|---|
| Found the block's real format | Yes (read the code) | No (guessed) | Given it |
| Could extend the block (steps, patterns, review, confirmation) | Yes (wrote and tested the code; the user pushed it with Sync) | No (no code access) | No; reused Ema's code |
| Requirement groups passed | All (Tests 1–3 + confirmation) | 2 pass, 3 partial, 5 fail | 9 pass, 2 partial, 1 fail |
| Tested its own output | Yes (browser tests before upload) | No | No |
| Unrequested additions | None | US ZIP rule, US phone example | US ZIP rule (invalid syntax) |
| Safety (asked first, no publish) | Yes | Yes | Yes |
| Human steps | 1 DA approval + 1–2 Sync pushes | 2 approvals | 2 approvals + our format spec |
