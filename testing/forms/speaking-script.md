# Speaking script: Forms on EDS, DA by hand vs Ema

Presenter: ALAN RAJI MANI (araji@adobe.com) · about 23 minutes (including a 3-minute live demo) plus Q&A · generated from the speaker notes in Forms-POC-DA-vs-Ema.pptx

## Slide 1: Forms on Edge Delivery Services

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
Next, the content model behind it.

*TIME: 1:15*

## Slide 5: Content modelling in EDS, and the model our forms use

**SAY:**
Content modelling means deciding how authors structure content so the site can turn it into the right design. EDS has five pieces: default content, blocks, sections, page metadata and sheets. Our forms use one block with two cells, a link to the field sheet and an optional submit address, plus a six-column sheet. Ema and the hand-built form follow the same model, which is why they behave the same.

**EVIDENCE LABELS:**
Documented: aem.live content-modelling guidance (David's Model). Tested: our form model.

**TRANSITION:**
Here is Form A, built by hand.

*TIME: 1:00*

## Slide 6: Contact WKND: 10 author steps, about 35 minutes

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

## Slide 7: Adventure Booking Request: 1 prompt, 2 approvals, about 4 minutes

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

## Slide 8: Same four tests, both forms, real branch preview

**SAY:**
Both forms pass all the tests that apply to them. Empty submissions are blocked, a bad email is caught, unchecked radios and checkboxes are caught, and a valid entry shows a clear demo message. Form A entries are saved to OneDrive; Form B is not connected yet. Slide eleven shows how Form A saves to OneDrive.

**CLICK / DEMONSTRATE:**
Live: click Send on the empty contact form, then fill the booking form and send.

**AUDIENCE SHOULD OBSERVE:**
The cursor jumps to the first missing field. The thank-you message is labelled "Demo only".

**EVIDENCE LABELS:**
Tested: T1–T4 on both branch preview pages. Limitation: no saving.

**TRANSITION:**
Here is the head-to-head comparison.

*TIME: 1:30*

## Slide 9: Head-to-head comparison

**SAY:**
Ema was about eight times faster to hands-on completion and built a more complex form with no typing slips. DA is the more reliable path when the agent has no access, and it teaches the author how forms work. In both cases the output is the same block, so whichever way a form is built, it behaves the same for visitors.

**HOW TO EXPLAIN THE FINDINGS:**
Times are hands-on minutes from the progress log, not elapsed time. Form A spans an overnight pause, which is excluded.

**EVIDENCE LABELS:**
Tested: all rows, from the progress log testing/forms/forms-progress.md.

**TRANSITION:**
What went wrong, and what we fixed.

*TIME: 1:30*

## Slide 10: What broke and how we handled it

**SAY:**
One real defect. With no submit address, the standard form block skipped its checks, so clicking Send reloaded the page with the visitor's details in the address bar. I approved a three-line fix on our branch: always validate, and show a clear demo message instead. Both forms were retested. The other items are process lessons, and they are all in the SOP.

**EVIDENCE LABELS:**
Tested: D1 before and after the fix. F1–F5 observed during the POC.

**TRANSITION:**
Why is nothing saved yet?

*TIME: 1:30*

## Slide 11: Saving to OneDrive without AEM Forms: Power Automate

**SAY:**
We wanted entries saved in OneDrive without paying for AEM Forms. Adobe's own submission service needs an AEM Forms licence. Instead, the form sends each entry to a Microsoft Power Automate flow, which adds a row to an Excel table in OneDrive. The form block already supports a submit address, so sending needed no code change, only the address in the second cell of the block table. Both my test entry and a live entry from the website arrived in Excel.

**CLICK / DEMONSTRATE:**
Show the Excel file wknd-contact-submissions with rows 2 and 3.

**HOW TO EXPLAIN THE FINDINGS:**
This is fine for a POC. For production, add spam protection and choose between Power Automate Premium and AEM Forms.

**EVIDENCE LABELS:**
Tested: trigger, CORS, 202, rows in Excel. Documented: AEM Forms requirements. Limitation: open endpoint, Microsoft Premium.

**TRANSITION:**
Next: how far can Ema go with advanced forms?

**LIKELY QUESTIONS AND ANSWERS:**
Q: Is the address secret? A: No. It is in the page source, so anyone could post to it. That is why production needs spam protection or a server-side relay.

*TIME: 1:30*

## Slide 12: Can Ema build advanced forms from business requirements?

**SAY:**
We then asked whether Ema can turn plain business requirements into an advanced form. It covered validation rules, a three-step wizard and fields that appear only for business enquiries. All three passed on the live branch preview. Conditional fields worked with sheet rows alone. Format rules, field messages and steps needed the form block to be extended. Ema wrote that code, tested it and made it opt-in, so the earlier forms did not change. Testing also found one bug, which was fixed and retested.

**EVIDENCE LABELS:**
Tested: every row on the forms-poc branch preview on 11 Nov (G01 to G05).

**TRANSITION:**
Here is the requirement-by-requirement matrix.

*TIME: 1:30*

## Slide 13: Capability matrix

**SAY:**
This is the requirement-by-requirement view. Every rule was tested with good and bad test values. For example, a phone number with a space is rejected and the message explains the rule, but what the user typed is left untouched. Two rows were tested locally only: keyboard and mobile. A real screen-reader check is still open.

**EVIDENCE LABELS:**
Pass = tested live on the branch preview. Pass (local) = tested in the browser with the branch code before the upload.

**TRANSITION:**
And this is what a visitor sees.

*TIME: 1:30*

## Slide 14: What the visitor sees, and what comes next

**SAY:**
On the left, step one with an error under every missing field. On the right, the review step just before submitting. Optional extras such as calculated fields, dynamic dropdowns and a confirmation page were not built. They are waiting for approval. Two of them are already in the block and would only need sheet rows.

**CLICK / DEMONSTRATE:**
Live: https://forms-poc--bv-poc-wknd-aln--araji-adobe.aem.page/forms-poc/advanced

**TRANSITION:**
So when should you use which approach?

*TIME: 1:00*

## Slide 15: When to use DA by hand, and when to use Ema

**SAY:**
My recommendation is to use both. Ema drafts the form fast and accurately. The author reviews the sheet in DA, previews it and runs the four tests. DA by hand stays the fallback for small changes and for times when the agent has no access.

**TRANSITION:**
Let me show you both forms live.

*TIME: 1:00*

## Slide 16: Demo order (3 minutes)

**SAY:**
Five quick stops. The DA folder, the sheet as data, Form A failing validation, Form B succeeding, and the code branch.

**CLICK / DEMONSTRATE:**
Open each link in order, in a browser tab prepared before the session.

**AUDIENCE SHOULD OBSERVE:**
Both forms come from sheets; the code is on a branch; nothing is live.

*TIME: 3:00*

## Slide 17: From POC to production

**SAY:**
To go to production: confirm the licence and allowlist, trial the submission service, merge the branch through a normal pull request, and publish through our usual process. The SOP and the four tests are reusable for every future form.

**TRANSITION:**
Questions.

*TIME: 0:45*

## Slide 18: Sources and evidence

Reference slide, not presented.
