# Advanced Forms Capabilities: capability matrix (Ema)

Form: "Advanced enquiry". Sheet `/forms-poc/advanced-form`, page `/forms-poc/advanced` (a new, separate form; Forms A and B unchanged)
Test data only (Test User, test.user@example.com, 9876543210, Test Company Ltd, 12 Test Street…)

Status key: **Pass (local)** = tested in a browser with the branch code against the local sheet; **Pass (live)** = re-tested on the forms-poc branch preview after the upload and push; **Fail**; **Blocked**; **Not started**.

"How Ema did it": **Sheet only** = Ema wrote sheet rows using features the block already had. **Sheet + Ema code** = the block could not do it, so Ema extended the block (opt-in columns, same branch).

| # | Requirement | Ema-generated configuration | How Ema did it | Expected behaviour | Actual tested behaviour (11 Nov local run) | Status | Manual intervention | Evidence | Limitations |
|---|---|---|---|---|---|---|---|---|---|
| 1.1 | Full name required; letters, spaces, hyphens, apostrophes | `required=true`, `pattern=[A-Za-z]+(?:[ '’\-][A-Za-z]+)*`, `error=Use letters only…` | Sheet + Ema code (pattern, error) | Rejects digits/symbols with a helpful message | "John3" and "J@ne Doe" were rejected with the custom message; "Mary-Jane O'Neil" was accepted; empty gives "Please enter Full name." | Pass (live) | None | F02, G02 | Latin letters only (no accented names such as "José") |
| 1.2 | Email required, valid format | `type=email` + `pattern=[^@\s]+@[^@\s]+\.[A-Za-z]{2,}`, custom error | Sheet + Ema code | Rejects malformed addresses | "bad", "name@example" and "name@@example.com" were rejected; "name@example.com" was accepted | Pass (live) | None | F02 | The browser alone accepts "name@example"; the extra pattern closes that gap |
| 1.3 | Phone required, exactly 10 digits, nothing silently removed | `type=tel`, `pattern=[0-9]{10}`, `help` text, custom error | Sheet + Ema code | Rejects letters, wrong lengths, spaces; explains the rule | "12345", "abcdefghij", "98765432101" and "98765 43210" were rejected with "Enter exactly 10 digits…"; the typed value was **kept as typed**; "9876543210" was accepted | Pass (live) | None | F04 | No country codes |
| 1.4 | Address required; normal address characters | `required=true`, `pattern=[A-Za-z0-9 ,.'#\/\-]+`, custom error | Sheet + Ema code | Error when empty or for odd characters | Empty gives "Please enter Street address."; "12 Test <Street>" was rejected; "12 Test Street, Block-B, Apt. 4" was accepted | Pass (live) | None | — | Also allows ' # / (common in addresses), beyond the minimum list |
| 1.5 | Block submission; field-specific messages | Inline error under every invalid field, `aria-invalid`, `aria-describedby` | Ema code (opt-in) | All invalid fields show their own message | Empty Next showed 4 separate messages at once; focus moved to the first invalid field | Pass (live) | None | F02 | — |
| 2.1 | Three steps: Personal / Address / Review | `step` rows: "Personal details", "Address details", "Review and submit" | Sheet + Ema code (step) | One step visible at a time | 3 steps; only step 1 visible at the start | Pass (live) | None | F01 | — |
| 2.2 | Next / Previous | Auto-generated buttons | Ema code | Next validates; Previous goes back | Next was blocked while step 1 was invalid; Previous worked | Pass (live) | None | F02, F03 | — |
| 2.3 | Values kept when going back | Same form, steps only hidden | Ema code | No data loss | Back to step 1: name, phone, company and Business choice intact; step 2 values intact going forward | Pass (live) | None | — | — |
| 2.4 | Show progress | "Step N of 3: title" (announced to screen readers) | Ema code | Progress visible and updated | "Step 1 of 3: Personal details" → "Step 2 of 3…" → "Step 3 of 3…" | Pass (live) | None | F01, F03 | — |
| 2.5 | Review step shows entered data | `review` row | Sheet + Ema code | All entered values listed | 10 label/value pairs listed; an empty optional field shows "—" | Pass (live) | None | F03, G04 | Read-only; editing means going Previous |
| 2.6 | No accidental submit before the final step | Submit only in step 3; submit ignored on earlier steps | Ema code | Enter in steps 1–2 doesn't submit | Enter in Full name (step 1) and City (step 2): no step change, no submission | Pass (live) | None | — | Enter does **not** advance (by design, as requested) |
| 2.7 | Keyboard navigation | Native buttons and fields | Ema code | Tab reaches Next; Enter/Space activates it | Tab from Job title focused "Next"; Enter moved to step 2; focus moved to Street address | Pass (local) | None | — | Screen-reader test with a real reader: Not started |
| 3.1 | Enquiry type Personal / Business | `type=radio`, `options=Personal, Business`, required | Sheet only | Required choice | "Please choose Enquiry type." when empty | Pass (live) | None | F02 | — |
| 3.2 | Business → show Company (required) + Job title | `conditional=enquirytype-business` on both rows | **Sheet only** (the block already supports a `conditional` column) | Fields appear; Company required | Both appeared; Next was blocked with "Please enter Company name."; Job title optional | Pass (live) | None | F04, G03 | The condition format `enquirytype-business` isn't author-friendly |
| 3.3 | Personal → hide them; hidden fields don't block | Same | Sheet only | Hidden and not required | Hidden; Next proceeded with Company empty; the review omits them | Pass (live) | None | — | — |
| 3.4 | Reset after submit restores hidden state | Conditional re-applied on reset | Ema code (bug fix found in testing) | After submit, Business fields hidden again | Initially **failed** (fields stayed visible after reset); fixed; retest passed | Pass (live) | None | F05 | — |
| — | Submit on the final step | No submit link (demo) | Existing | "Demo only" notice, reset to step 1 | "Thank you. Demo only: your entry was not saved."; back to step 1, cleared | Pass (live) | None | F05, G05 | Not connected to OneDrive (same method as Form A if wanted) |
| — | Mobile 375 px | Existing CSS | — | No sideways scrolling | No horizontal overflow; inputs 327 px wide | Pass (local) | None | F06 | — |
| — | Regression: Forms A and B | Opt-in only | — | Unchanged | A: no inline errors, still has its OneDrive link, empty/bad-email focus OK (not sent). B: unchanged; demo notice | Pass (live) | None | — | — |

Live re-test on 11 Nov on https://forms-poc--bv-poc-wknd-aln--araji-adobe.aem.page/forms-poc/advanced after the user approved the DA upload + preview and pushed with Sync: every row marked **Pass (live)** passed again (evidence G01–G05). Rows 2.7 (Tab to Next) and Mobile were tested locally only. Manual intervention needed overall: 1 approval (DA upload + preview) and 1 Sync push by the user. Note: Sync also pushed `.hlxignore` (the extra `catalog/` line, origin unknown).

## Test 4 (optional; not implemented, awaiting approval)

| Capability | Current block | Effort |
|---|---|---|
| Calculated fields | Not supported | Ema code (small–medium) |
| Dynamic dropdowns | Supported: `options` can be a URL to another sheet (in the code, Untested) | Sheet only |
| Custom validation messages | Done in Test 1 (`error` column) | — |
| Submission confirmation (**approved, built**) | The block followed a `confirmation` row **only after a real send**, so it did nothing in demo mode (finding). Ema added an opt-in 3-line change (commit 95ba1a6) so demo mode also redirects; added the row `confirmation → /forms-poc/advanced-thank-you` and a new page `advanced-thank-you` (DA update approved; sheet 16/16 rows match; preview 200) | Sheet + Ema code. Local test: valid entry → redirected to /forms-poc/advanced-thank-you. Form B regression unchanged. **Pass (local)**; the live test needs a Sync push |
| Responsive layout | Checked at 375 px (see above) | — |
| Accessibility | aria-invalid, aria-describedby, aria-live progress, focus management, keyboard: done; a real screen-reader and WCAG audit: Not started | Manual testing |
