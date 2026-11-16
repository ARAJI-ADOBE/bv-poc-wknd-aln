# Speaking script: Forms on Edge Delivery Services, show and tell

Presenter: ALAN RAJI MANI (araji@adobe.com) · about 18 minutes plus Q&A · nothing is built live: open the links on each slide · generated from the speaker notes in Forms-Show-and-Tell.pptx

## Slide 1: Forms on Edge Delivery Services

**SAY:**
Today I will show you how a form is made on Edge Delivery Services, three ways. First by hand in DA.live, then with Ema, the Experience Modernization Agent, and finally how Experience Workspace, the assistant inside DA.live, did with the same requirements. Everything I show is already built and tested, so I will open the real pages rather than build anything live.

CAREFUL:
Before the session: log in to DA.live in the same browser, so the DA links open straight away. Open the links once to warm them up.

*TIME: 0:30*

## Slide 2: A form is just a sheet, a page and a block

**SAY:**
Before the three ways, one idea. Every form is two pieces of content: a sheet, where each row is one field, and a page with a small table called the form block, which points at the sheet. The site code then turns that into a working form. So the question for each approach is simply: who writes the sheet and the page, and can they change the code?

SHOW (just open and point, nothing to type):
Click "DA folder /forms-poc": point at the pairs, contact-form and contact, booking-form and booking, and so on. Then click the JSON link: "this is exactly what the website reads".

AUDIENCE SHOULD SEE:
Each form is a sheet plus a page with the same name.

**EVIDENCE LABELS:**
Tested: all links open (checked 16 Nov). Documented: forms on EDS (aem.live).

**TRANSITION:**
Let us start with the manual way.

*TIME: 1:00*

## Slide 3: By hand in DA.live

**SAY:**
Part one: building a form by hand in DA.live. This is Form A, a simple contact form that I typed myself.

*TIME: 0:10*

## Slide 4: Step 1: a sheet with one row per field

**SAY:**
Step one is a sheet. Six columns, all lowercase: the internal field name, the label people see, the type, a placeholder, options for dropdowns, and whether it is required. One row per field, and a last row for the button. This is exactly Form A as it is in DA today.

SHOW (just open and point, nothing to type):
Click "Form A sheet in DA" and point at row 1 and the topic row with its options. Then click "Same sheet as JSON" to show what the website reads after Preview.

AUDIENCE SHOULD SEE:
A normal spreadsheet; the JSON has the same rows.

**EVIDENCE LABELS:**
Tested: rows are the real contact-form sheet (read 16 Nov). Limitation: the lost first save.

**TRANSITION:**
The sheet alone shows nothing. It needs a page.

*TIME: 1:30*

## Slide 5: Step 2: a page with a "form" block that links the sheet

**SAY:**
Step two is a page. In DA you insert a table, which DA always calls "columns", and you rename it to "form". The first cell links to the sheet. The second cell is optional: it is where entries are sent. For Form A I connected it to an Excel table in OneDrive through Power Automate, without an AEM Forms licence.

SHOW (just open and point, nothing to type):
Click "A finished page in DA (booking)": point at the form table and the link in cell 1. It has the same structure as Form A.

CAREFUL:
Open the booking page here, not the contact page. The contact page shows the Power Automate address in cell 2, and anyone with that address can add rows to the Excel sheet.

**EVIDENCE LABELS:**
Tested: block table and link (A07); OneDrive saving tested 5 Nov.

**TRANSITION:**
And this is the result.

*TIME: 1:30*

## Slide 6: The result: Form A on the website

**SAY:**
Here is Form A on the website. Everything comes from the sheet: labels, placeholders, the dropdown options, and the required fields. It took me about 35 minutes and ten steps. It works, but it is slow, and small typing slips creep in.

SHOW (just open and point, nothing to type):
Click "Form A live" and scroll. Optional: click Send Message with everything empty to show the browser stopping at Full Name.

CAREFUL:
Do NOT send a filled-in entry on Form A: it really writes a row to the OneDrive Excel sheet.

**EVIDENCE LABELS:**
Tested: T1–T4 on 5 Nov (E01).

**TRANSITION:**
Now the same job with Ema.

*TIME: 1:30*

## Slide 7: Form B from one request in about 4 minutes, then an advanced form from plain business rules.

**SAY:**
Part two: Ema, the Experience Modernization Agent. First a normal form, then an advanced one.

*TIME: 0:10*

## Slide 8: Form B: one plain request, about 4 minutes, 2 approvals

**SAY:**
For Form B I simply described an adventure booking form to Ema. In about four minutes it wrote the sheet and the page, tested them in a browser, asked me before uploading, then checked the DA copy row by row and previewed it. Same sheet format as Form A, same block. And while testing, it found a real bug in the standard block, where an empty send put the visitor's details in the web address, and fixed it.

SHOW (just open and point, nothing to type):
Click "Form B live" and scroll through the 7 field types. Then "Form B sheet in DA": "the same kind of sheet I typed by hand, written by Ema".

AUDIENCE SHOULD SEE:
Same structure as Form A, more field types, no slips.

**EVIDENCE LABELS:**
Tested: 4 min + 2 approvals (5 Nov log); D1 fixed and retested.

**TRANSITION:**
A booking form is easy. So we gave Ema real business requirements.

*TIME: 1:30*

## Slide 9: Advanced form: business rules in, a working 3-step form out

**SAY:**
Then the real test: plain business requirements. Strict field rules with friendly messages, three steps with a review, and fields that only appear for business enquiries. Some of that the block could not do. Ema read the block code, added the missing features as opt-in columns, so Forms A and B did not change, and tested everything before and after upload.

SHOW (just open and point, nothing to type):
Click "Advanced form live": point at "Step 1 of 3" and the Next button. Optional, no typing: click Next with everything empty to show the messages. Then "Its sheet in DA": point at the step rows and the pattern and error columns.

AUDIENCE SHOULD SEE:
A multi-step form that is still just a sheet; the rules are visible as columns.

**EVIDENCE LABELS:**
Tested: every row Pass (live) on 11 Nov (advanced-capability-matrix.md, G01–G06). Thank-you page: Pass (live), G06.

**LIKELY QUESTIONS AND ANSWERS:**
Q: Does extending the block break other forms? A: No. The new columns are opt-in; Forms A and B were regression-tested unchanged.

**TRANSITION:**
Why could Ema do this? Because it can see the code.

*TIME: 2:00*

## Slide 10: What made the difference: Ema can read, extend and test the code

**SAY:**
Three things made the difference. Ema reads the code, so it knows the exact format the block understands. It can extend the block when something is missing, safely on a branch. And it tests its own work. My part was one request, a couple of approvals, and pushing the code with Sync. The one thing to watch is access: after a restart it lost DA and GitHub access until I switched it back on in Settings.

SHOW (just open and point, nothing to type):
Optional: click "The block code" to show it is real code on the branch. Click "SOP: sheet format" to show the documented format that anyone can now reuse.

**EVIDENCE LABELS:**
Tested: from forms-progress.md and advanced-capability-matrix.md. Limitation: access after restarts.

**TRANSITION:**
Now the same requirements for an assistant that cannot see the code.

*TIME: 1:00*

## Slide 11: Testing with Experience Workspace

**SAY:**
Part three: Experience Workspace, the assistant inside DA.live. We gave it exactly the same advanced requirements as Ema.

*TIME: 0:10*

## Slide 12: How we tested it: same requirements, two rounds, new files only

**SAY:**
We ran two rounds. In round one it got only the business requirements, exactly what Ema got. In round two we also gave it the sheet format that Ema had found by reading the code. Each round created new files only, and it had clear rules: wait for approval, ask before preview, never publish. Its own description: it can do a lot with content, including preview and publish, but it cannot see or change code.

SHOW (just open and point, nothing to type):
Optional: click "Round 1 prompt" to show the exact wording, so the audience sees it was a fair test.

**EVIDENCE LABELS:**
Tested: both rounds on 11 Nov. Self-reported: its capability list.

**TRANSITION:**
Round one first.

*TIME: 1:00*

## Slide 13: Round 1 (blind): it guessed the format, and the block ignored it

**SAY:**
Without code access it had to guess the column names. Its guesses were sensible, validation, errorMessage, showIf, but they are not what our block reads, so the block silently ignored them. The form looks fine, but the rules do nothing. Two of ten requirement groups passed. To be fair, it told us itself that this behaviour depends on code.

SHOW (just open and point, nothing to type):
Click "Round 1 form live" and scroll: one long page, no steps. Then "Its sheet in DA": point at the column headers validation, errorMessage, step, showIf.

AUDIENCE SHOULD SEE:
The page looks like a normal form; the difference only shows in the column names and in testing.

**EVIDENCE LABELS:**
Tested: 11 Nov (workspace-capability-matrix.md, H01, H02).

**LIKELY QUESTIONS AND ANSWERS:**
Q: Is that the assistant's fault? A: Mostly not. It cannot see the code, so the format has to be written down for it. That is now in the SOP.

**TRANSITION:**
So in round two we gave it the format.

*TIME: 1:30*

## Slide 14: Round 2 (guided): given the format, it got close to Ema

**SAY:**
With the right format it built fifteen correct rows: three steps, field rules with messages, the conditional business fields and a review. Nine passes. But note why it worked: it reused the code Ema had written. It still left Company Name optional for business enquiries, and it added the ZIP code rule again, this time with syntax the browser rejects.

SHOW (just open and point, nothing to type):
Click "Round 2 form live": point at "Step 1 of 3" and Next. Then "Its sheet in DA": the same columns as Ema's sheet.

AUDIENCE SHOULD SEE:
Round 2 looks and behaves like Ema's form, apart from the three items in the table.

**EVIDENCE LABELS:**
Tested: 11 Nov (H11–H14).

**TRANSITION:**
What was it like to work with?

*TIME: 1:30*

## Slide 15: What it was like to work with

**SAY:**
Working with it was safe and polite: it always asked first, never published, and touched nothing else. The risk is silent failure. If it does not know the format, the form looks right but does not behave. So I have added a part to the SOP with the exact format, a checklist for reviewing its rows, and a prompt you can copy.

SHOW (just open and point, nothing to type):
Optional: click the SOP link and scroll to "Part C: Build a form with Experience Workspace".

**EVIDENCE LABELS:**
Tested: behaviour in both rounds. Hands-on time: not recorded.

**TRANSITION:**
All three side by side.

*TIME: 1:00*

## Slide 16: Three ways side by side, and when to use which

**SAY:**
Side by side: by hand is slow but needs nothing extra. Ema is fastest and is the only one that can change the code, which is why it handled every advanced requirement. Experience Workspace is safe for content, but it depends on someone writing down the format. My recommendation is to use them together: Ema builds and documents the block once, then authors or Experience Workspace create forms with that format, and the author always previews and tests before anything is published.

**EVIDENCE LABELS:**
Tested: from forms-progress.md and both capability matrices. Unknown: Experience Workspace hands-on time.

**LIKELY QUESTIONS AND ANSWERS:**
Q: Can we go live? A: Not yet. The block is still on a branch and needs a normal pull request, and saving entries in production needs either the Power Automate route with spam protection or an AEM Forms licence.

**TRANSITION:**
Every link is on the last slide.

*TIME: 1:30*

## Slide 17: Everything to open and show

**SAY:**
All links are here, grouped by part, if anyone wants to look again after the session. Questions?

*TIME: 0:30 + Q&A*
