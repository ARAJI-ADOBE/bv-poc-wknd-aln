# Speaking script: Forms on EDS, DA by hand vs Ema

Presenter: ALAN RAJI MANI (araji@adobe.com) · about 17 minutes (including a 3-minute live demo) plus Q&A · generated from the speaker notes in Forms-POC-DA-vs-Ema.pptx

## Slide 1: Forms on Edge Delivery Services (title)

**SAY:**
Over the last day I built two forms on our Edge Delivery Services sandbox. I built one by hand in DA.live and had Ema, the Experience Modernization Agent, build the other. They solve different business problems, but they run on the same form block and the same site and went through the same four tests, so the comparison is fair. Everything I show is labelled Tested, Documented, Limitation or Unknown.

**TRANSITION:**
First, what we set out to prove.

*TIME: 0:30*

## Slide 2: What we set out to prove in 24 hours

**SAY:**
Form A is a simple contact form, the kind of thing an author types up. Form B is a booking request with seven field types, which gives Ema something harder. To keep it fair, both use the same block on the same branch and are tested the same way. This is a shared environment, so nothing existing was changed and nothing was published live.

**TRANSITION:**
Here is the environment we worked in.

*TIME: 1:00*

## Slide 3: Where everything lives

**SAY:**
The site is our WKND sandbox. Content lives in DA.live and code in GitHub. All form code is on a separate branch called forms-poc, so main and the live site were never touched. Note the licence line: Adobe documents that EDS forms need an AEM Forms licence.

**EVIDENCE LABELS:**
Tested: every row except the licence, which is Documented (aem.live/developer/forms).

**TRANSITION:**
How does a document-based form actually work?

*TIME: 1:00*

## Slide 4: A document-based form in four pieces

**SAY:**
There are four pieces. A sheet lists the fields. Preview turns it into data. A page holds a table called form that links to the sheet. Then the block code builds the form in the browser. The author only touches the first three, and the code is added once.

**HOW TO EXPLAIN THE FINDINGS:**
Adobe's forms overview lists SharePoint and Google Drive for document-based forms. We tested that a DA.live sheet works the same way for the form definition.

**EVIDENCE LABELS:**
Tested: DA sheet as the form definition. Documented: the source list on aem.live.

**TRANSITION:**
Here is Form A, built by hand.

*TIME: 1:15*

## Slide 5: FORM A · DA.LIVE BY HAND

**SAY:**
Form A took ten author steps and about thirty-five minutes of hands-on time. Two things caught us out. DA calls the item "Page", not "Document". The default table is called columns and has to be renamed to form. The first round of typing the rows never saved, so we lost it and retyped it.

**CLICK / DEMONSTRATE:**
Open https://forms-poc--bv-poc-wknd-aln--araji-adobe.aem.page/forms-poc/contact

**AUDIENCE SHOULD OBSERVE:**
Four required fields and a Send Message button.

**EVIDENCE LABELS:**
Tested: every step, verified from DA after each step.

**TRANSITION:**
Now the same job done by Ema, on a harder form.

*TIME: 1:30*

## Slide 6: Adventure Booking Request: 1 prompt, 2 approvals, about 4 minutes

**SAY:**
For Form B I gave Ema one request. It used the real adventure names from the site, generated the sheet and page, and test-rendered them before touching DA. It then asked me before uploading. The upload matched the local copy exactly. Hands-on time was about four minutes plus two approval clicks. Ema still needs a human: after the overnight restart it lost DA and GitHub access, and I had to push the code myself with the Sync button.

**CLICK / DEMONSTRATE:**
Open https://forms-poc--bv-poc-wknd-aln--araji-adobe.aem.page/forms-poc/booking

**AUDIENCE SHOULD OBSERVE:**
Seven field types: dropdown, date picker, number, radio buttons and a consent checkbox.

**EVIDENCE LABELS:**
Tested: upload (201), row match 8 of 8, preview (200), render. Limitation: access lost after restart; code push needed Sync.

**TRANSITION:**
Both forms then went through the same four tests.

*TIME: 1:30*

## Slide 7: Same four tests, both forms, real branch preview

**SAY:**
Both forms pass all the tests that apply to them. Empty submissions are blocked, a bad email is caught, unchecked radios and checkboxes are caught, and a valid entry shows a clear demo message. No entry is saved anywhere yet. I will explain why on slide ten.

**CLICK / DEMONSTRATE:**
Live: click Send on the empty contact form, then fill the booking form and send.

**AUDIENCE SHOULD OBSERVE:**
The cursor jumps to the first missing field. The thank-you message is labelled "Demo only".

**EVIDENCE LABELS:**
Tested: T1–T4 on both branch preview pages. Limitation: no saving.

**TRANSITION:**
Here is the head-to-head comparison.

*TIME: 1:30*

## Slide 8: Head-to-head comparison

**SAY:**
Ema was about eight times faster to hands-on completion and built a more complex form with no typing slips. DA is the more reliable path when the agent has no access, and it teaches the author how forms work. In both cases the output is the same block, so whichever way a form is built, it behaves the same for visitors.

**HOW TO EXPLAIN THE FINDINGS:**
Times are hands-on minutes from the progress log, not elapsed time. Form A spans an overnight pause, which is excluded.

**EVIDENCE LABELS:**
Tested: all rows, from the progress log testing/forms/forms-progress.md.

**TRANSITION:**
What went wrong, and what we fixed.

*TIME: 1:30*

## Slide 9: What broke and how we handled it

**SAY:**
One real defect. With no submit address, the standard form block skipped its checks, so clicking Send reloaded the page with the visitor's details in the address bar. I approved a three-line fix on our branch: always validate, and show a clear demo message instead. Both forms were retested. The other items are process lessons, and they are all in the SOP.

**EVIDENCE LABELS:**
Tested: D1 before and after the fix. F1–F5 observed during the POC.

**TRANSITION:**
Why is nothing saved yet?

*TIME: 1:30*

## Slide 10: Why submissions are not saved yet

**SAY:**
Saving entries uses Adobe's Forms Submission Service. Its documentation needs an allowlisted repository, the larger Adaptive Forms Block, a shared spreadsheet and a form id. Some of that has no documented process. With limited time we chose to document it rather than spend forty minutes on a likely dead end. This is the main next step.

**EVIDENCE LABELS:**
Documented: the requirements (Experience League). Unknown: allowlist, sharing policy, form id.

**TRANSITION:**
So when should you use which approach?

**LIKELY QUESTIONS AND ANSWERS:**
Q: Can DA store submissions? A: DA is not a documented target; the documented targets are Google Sheets, SharePoint and OneDrive.

*TIME: 1:15*

## Slide 11: When to use DA by hand, and when to use Ema

**SAY:**
My recommendation is to use both. Ema drafts the form fast and accurately. The author reviews the sheet in DA, previews it and runs the four tests. DA by hand stays the fallback for small changes and for times when the agent has no access.

**TRANSITION:**
Let me show you both forms live.

*TIME: 1:00*

## Slide 12: Demo order (3 minutes)

**SAY:**
Five quick stops. The DA folder, the sheet as data, Form A failing validation, Form B succeeding, and the code branch.

**CLICK / DEMONSTRATE:**
Open each link in order, in a browser tab prepared before the session.

**AUDIENCE SHOULD OBSERVE:**
Both forms come from sheets; the code is on a branch; nothing is live.

*TIME: 3:00*

## Slide 13: From POC to production

**SAY:**
To go to production: confirm the licence and allowlist, trial the submission service, merge the branch through a normal pull request, and publish through our usual process. The SOP and the four tests are reusable for every future form.

**TRANSITION:**
Questions.

*TIME: 0:45*

## Slide 14: Sources and evidence

Reference slide, not presented.
