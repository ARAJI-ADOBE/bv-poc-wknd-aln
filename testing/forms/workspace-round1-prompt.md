# Experience Workspace: advanced forms test, Round 1 (blind)

These are the same business requirements Ema received on 11 Nov (Tests 1–3), with the site context only.
It is told not to read Ema's advanced form, to keep the test blind. Forms A and B, which existed before Ema's advanced work, may be read.

---
I want you to build an advanced test form on our Edge Delivery Services site, using the site's existing "form" block. Please ACTUALLY create the content, not just describe it.

SITE AND RULES
- Site: araji-adobe / bv-poc-wknd-aln (Document Authoring). Folder: /forms-poc
- Create ONLY these two NEW items: a sheet /forms-poc/ws-advanced-form and a page /forms-poc/ws-advanced that shows the form using the site's "form" block.
- You may READ /forms-poc/contact-form and /forms-poc/booking-form as examples. Do NOT read, change or copy /forms-poc/advanced-form, /forms-poc/advanced or /forms-poc/advanced-thank-you.
- Do NOT change, delete or move any other file. NEVER publish anything to live.
- Before you create anything, tell me exactly what you will create and wait for my "approved". After creating, ask before you preview.
- Use test data only.

TEST 1: FIELD VALIDATION
1. Full Name: required; accept letters, spaces, hyphens and apostrophes; reject numbers and unsupported special characters; show a helpful error for invalid input.
2. Email Address: required; must follow a valid email format such as name@example.com; reject malformed addresses; show an appropriate error message.
3. Phone Number: required; exactly 10 digits; reject letters and incorrect lengths; do not silently remove invalid input without explaining the rule.
4. Address: required; accept letters, numbers, spaces, commas, hyphens and periods; show an error when empty.
5. Submit: prevent submission when required fields are invalid; show field-specific validation messages.

TEST 2: MULTI-STEP FORM
Step 1, Personal details: Full Name, Email, Phone Number
Step 2, Address details: Street Address, City, State, Postal Code
Step 3, Review and submit: show the entered information for review, then a final Submit button
Requirements: Next and Previous buttons; validate required fields before Next; keep entered values when going back; show the current step or progress; prevent submission before the final step; support keyboard navigation; do not make Enter advance the form.

TEST 3: CONDITIONAL FIELDS
Add an Enquiry Type field with the options Personal and Business.
If Business: show Company Name (required) and Job Title.
If Personal: hide the business fields, and make sure hidden fields don't block progress or submission.

WHEN DONE, report:
(a) the exact sheet columns and rows you created, (b) which requirements you believe are met by configuration alone, (c) which you could NOT implement and why.
---
