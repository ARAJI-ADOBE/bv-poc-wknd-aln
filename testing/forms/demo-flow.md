# Demo flow: DA forms → Ema → OneDrive → advanced form (about 6 min)

Open these tabs BEFORE you start. Use test data only.

| # | Tab / URL | Do | Say |
|---|---|---|---|
| 1 | https://da.live/#/araji-adobe/bv-poc-wknd-aln/forms-poc | Show the folder | "Every form is a sheet (the fields) plus a page (where it shows)." |
| 2 | Click **contact-form** | Point at row 1 | "Form A, typed by hand: 6 lowercase columns, one row per field." |
| 3 | Open the **contact** page | Point at the `form` table | "Cell 1 links the sheet. Cell 2 is the Power Automate address that saves entries." |
| 4 | https://forms-poc--bv-poc-wknd-aln--araji-adobe.aem.page/forms-poc/contact | Click **Send Message** empty, then fill in: Test User / test.user@example.com / Feedback / "Demo entry" → Send | "Empty is blocked. A valid entry: 'Thank you. Your entry was received.'" |
| 5 | Excel **wknd-contact-submissions** (OneDrive) | Press F5 | "The new row: saved to OneDrive with no AEM Forms licence." |
| 6 | https://forms-poc--bv-poc-wknd-aln--araji-adobe.aem.page/forms-poc/booking | Scroll | "Form B: Ema built 7 field types from one request in about 4 minutes." |
| 7 | https://forms-poc--bv-poc-wknd-aln--araji-adobe.aem.page/forms-poc/advanced | Type `John3` → Next; fix to `Test User`; phone `98765` → Next; fix to `9876543210`; choose **Business** → Next (Company required); choose **Personal** (fields hide) | "Ema turned plain business rules into validation and conditional fields." |
| 8 | Same form | Next → Step 2: Next empty (4 messages) → fill 12 Test Street / Testville / Test State / 560001 → **Previous** (values kept) → Next → Next | "3 steps, progress, values kept, a review before submitting." |
| 9 | Step 3 | **Submit enquiry** | "Opens the thank-you page, set by one sheet row." |
| 10 | https://github.com/ARAJI-ADOBE/bv-poc-wknd-aln/tree/forms-poc | Show blocks/form | "All code is on a branch. Main and the live site are untouched." |

If something fails live: say "this was tested earlier today" and show slides 6–8, 11 and 14.
