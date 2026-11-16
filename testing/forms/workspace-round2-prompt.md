# Experience Workspace: Round 2 (guided)

The same requirements as Round 1, plus the sheet format our form block reads. This is the information Ema found by reading the code. Round 1 files are kept as evidence; Round 2 uses new names.

---
Thank you. Round 1 showed that this site's form block uses DIFFERENT column names from the ones you used. Please build the same form again as two NEW files, using exactly the format below. Keep /forms-poc/ws-advanced-form and /forms-poc/ws-advanced unchanged.

RULES (same as before)
- Create ONLY: sheet /forms-poc/ws2-advanced-form and page /forms-poc/ws2-advanced (same page structure as ws-advanced, linking to /forms-poc/ws2-advanced-form.json).
- Do NOT read /forms-poc/advanced-form, /forms-poc/advanced or /forms-poc/advanced-thank-you. Do NOT change any other file. NEVER publish.
- Tell me exactly what you will create and wait for "approved". Ask before previewing (preview the page AND the sheet).

SHEET FORMAT THIS SITE'S FORM BLOCK READS (lowercase column names)
field | label | type | placeholder | options | required | pattern | error | help | conditional
- required: true or empty
- pattern: an HTML input pattern. It is matched against the WHOLE value automatically, so do NOT add ^ or $. Inside [ ], escape a hyphen as \-
- error: the message shown under the field when the value doesn't match the pattern (an empty required field automatically gets "Please enter <label>.")
- help: hint text shown with the field
- conditional: show the row only when another field has a value. Format: <other field name in lowercase>-<value in lowercase>, e.g. enquirytype-business. A hidden field is never required.
- Special row types (put the title in label):
  - type = step: starts a new step; every row after it belongs to that step until the next step row. Next/Previous buttons and "Step N of M" progress are added automatically.
  - type = review: shows a read-only summary of all answers (put it in the last step)
  - type = submit: the submit button (shown only in the last step)

REQUIREMENTS: exactly the same as Round 1 (Test 1 validation, Test 2 three steps with a review, Test 3 Personal/Business conditional fields). Use test data only, and don't add rules the requirements don't ask for.

WHEN DONE, report the exact rows you created.
---
