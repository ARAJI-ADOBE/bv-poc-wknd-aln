# Presenter script: Forms on Edge Delivery Services (show and tell)

For: ALAN RAJI MANI, for your eyes only. Use it with `Forms-Show-and-Tell.pptx` (17 slides, about 18 minutes plus questions).

How to read it: **▶ CLICK** = what to open or point at (all the links are in the blue OPEN bar at the bottom of the slide). **SAY** = read it out as written, or in your own words. *Italics* = a reminder for you only, don't read it out.

---

## Before you start (5 minutes before)

- Log in to **DA.live** in the browser you will present from, so the DA links open straight away.
- Open the deck in presenter view. Click each Part 1 link once to warm the pages up, then close the tabs.
- *Never send a filled-in entry on Form A (contact). It really adds a row to the OneDrive Excel sheet.*
- *In DA, show the **booking** page, not the contact page. The contact page shows the Power Automate address.*
- *If a page doesn't load during the talk, say "this was tested earlier" and point at the screenshot on the slide. Every slide has one or a table, so you can carry on without the link.*

---

## Slide 1: Title (0:30)

**SAY:**
"Hi everyone. Today I want to show you how a form is made on Edge Delivery Services, in three ways. First by hand in DA.live, then with Ema, the Experience Modernization Agent, and finally how Experience Workspace, the assistant inside DA.live, did with exactly the same requirements.
Everything I'll show is already built and tested, so I won't build anything live. I'll just open the real pages as we go."

---

## Slide 2: A form is just a sheet, a page and a block (1:00)

**SAY:**
"Before the three ways, one simple idea. Every form is two pieces of content. A **sheet**, where each row is one field, and a **page** with a small table called the **form block** that points to the sheet. The site code then turns that into a working form.
So for each approach, the only questions are: who writes the sheet and the page, and can they change the code?"

**▶ CLICK** "DA folder /forms-poc".
**SAY:** "Here's our folder in DA. You can see the pairs: contact-form and contact, booking-form and booking, and so on. A sheet and a page for every form."

**▶ CLICK** "A sheet as the website reads it (JSON)".
**SAY:** "And this is exactly what the website reads once a sheet is previewed: the same rows, as data."

**SAY:** "One more thing: all of this is preview only, on a separate branch of the code. Nothing was published, and the live site wasn't touched."

*Next: "Let's start with the manual way."*

---

## Slide 3: Part 1, By hand in DA.live (0:10)

**SAY:** "Part one: building a form by hand in DA.live. This is Form A, a simple contact form I typed myself."

---

## Slide 4: Step 1, a sheet with one row per field (1:30)

**SAY:**
"Step one is the sheet. There are six columns, all lowercase: the field name, the label people see, the type, a placeholder, options for dropdowns, and whether it's required. One row per field, plus a last row for the button. The table on the slide is Form A exactly as it is in DA today."

**▶ CLICK** "Form A sheet in DA". Point at row 1, then at the Topic row with its options.
**SAY:** "It's a normal spreadsheet. The Topic dropdown's choices are just typed into one cell, separated by commas."

**SAY:**
"One lesson from doing this by hand: my first round of typing was lost because DA hadn't saved it yet. So now I wait a few seconds and reload before leaving the sheet. Then you click **Preview**, not Publish, so the website can read it."

*Next: "The sheet on its own shows nothing. It needs a page."*

---

## Slide 5: Step 2, a page with a form block (1:30)

**SAY:**
"Step two is the page. In DA you insert a table. DA always calls a new table 'columns', which you can see in the screenshot, so you rename it to 'form'. The first cell is a link to the sheet. The second cell is optional: it's where entries get sent.
For Form A, I connected that second cell to an Excel table in OneDrive through Microsoft Power Automate. So entries are saved without an AEM Forms licence."

**▶ CLICK** "A finished page in DA (booking)". Point at the form table and the link in cell 1.
**SAY:** "This is what a finished page looks like: one small table, one link. Form A's page is built the same way."

*Don't open the contact page in DA.*

**SAY:** "Two small things confused me at first: DA's menu says 'Page', not 'Document', and the form only appears on our branch address, because that's where the form code lives."

*Next: "And this is the result."*

---

## Slide 6: The result, Form A on the website (1:30)

**▶ CLICK** "Form A live (branch preview)" and scroll slowly.
**SAY:**
"Here's Form A on the website. Everything you see comes from that sheet: the labels, the placeholders, the dropdown options and which fields are required."

*Optional: click **Send Message** with everything empty. It stops at Full Name. Don't fill it in and send.*
**SAY (if you clicked):** "If I try to send it empty, it stops me at the first required field, and nothing in the web address changes."

**SAY:**
"It took me about 35 minutes and ten steps. It works, but it's slow, and small typing slips creep in. I made five small cosmetic ones."

*Next: "Now let's do the same job with Ema."*

---

## Slide 7: Part 2, With Ema (0:10)

**SAY:** "Part two: Ema. First a normal form, then an advanced one."

---

## Slide 8: Form B, one request, about 4 minutes (1:30)

**SAY:**
"For Form B, I simply described what I wanted in plain words: an adventure booking request form with these fields. In about four minutes Ema wrote the sheet and the page and tested them in a browser. It asked me before uploading anything to DA, then checked the DA copy row by row (eight out of eight rows matched) and previewed it. It never publishes."

**▶ CLICK** "Form B live" and scroll through it.
**SAY:** "Seven different field types: text, email, a dropdown, a date, a number, radio buttons and a consent checkbox."

**▶ CLICK** "Form B sheet in DA".
**SAY:** "And this is the sheet Ema wrote. It's the same kind of sheet I typed by hand. Nothing special or hidden."

**SAY:**
"Something I didn't expect: while testing its own work, Ema found a real bug in the standard form block. If you clicked Send on an empty form, the page reloaded and put whatever the visitor had typed into the web address. Ema fixed it on our branch and retested both forms."

*Next: "A booking form is easy. So we gave Ema real business requirements."*

---

## Slide 9: Advanced form, business rules in, a 3-step form out (2:00)

**SAY:**
"This was the real test. I gave Ema plain business requirements: strict field rules with friendly error messages, a form in three steps with a review page, and extra fields that only appear for business enquiries.
Some of that the block simply couldn't do. So Ema read the block code, added the missing features as optional extras (so Forms A and B didn't change at all), and tested everything before and after uploading."

**▶ CLICK** "Advanced form live". Point at "Step 1 of 3" and the Next button.
**SAY:** "You can see the steps and the progress."

*Optional, no typing: click **Next** with everything empty.*
**SAY (if you clicked):** "Every field that's wrong gets its own message, at once."

**▶ CLICK** "Its sheet in DA". Point at the step rows and the pattern and error columns.
**SAY:** "And it's still just a sheet. The steps are rows, and the rules and messages are columns. An author can read and change them."

**SAY:** "As the table shows, every requirement passed on the live branch preview, including the thank-you page after sending."

*Next: "Why could Ema do this? Because it can see the code."*

---

## Slide 10: What made the difference (1:00)

**SAY:**
"Three things made the difference. One: Ema reads the code, so it knows exactly what the block understands, instead of guessing. Two: it can extend the block when something's missing, safely on a branch, without touching the live site. Three: it tests its own work, and it found and fixed two bugs itself.
My part was one request, a couple of approvals, and pushing the code with Sync.
The one thing to watch: after a session restart, it lost access to DA and GitHub until I switched it back on in Settings."

*Optional:* **▶ CLICK** "SOP: sheet format".
**SAY (if you clicked):** "The format is now written down in our SOP, so anyone can reuse it."

*Next: "Now, the same requirements for an assistant that can't see the code."*

---

## Slide 11: Part 3, Testing with Experience Workspace (0:10)

**SAY:** "Part three: Experience Workspace, the assistant inside DA.live. We gave it exactly the same advanced requirements as Ema."

---

## Slide 12: How we tested it (1:00)

**SAY:**
"We ran two rounds. In round one, which I call blind, it got only the business requirements, exactly what Ema got. In round two, guided, we also gave it the sheet format that Ema had found by reading the code.
Each round created brand-new files only, and it had clear rules: wait for my approval, ask before previewing, never publish.
When I asked what it can do, it said it can create and change DA content, preview and even publish, but it can't see or change code. That turns out to be the key point."

*Optional:* **▶ CLICK** "Round 1 prompt".
**SAY (if you clicked):** "This is the exact prompt, so you can see it was a fair test."

*Next: "Round one first."*

---

## Slide 13: Round 1 (blind), it guessed the format (1:30)

**▶ CLICK** "Round 1 form live" and scroll.
**SAY:** "This is what it built: one long page. No steps."

**▶ CLICK** "Its sheet in DA". Point at the column headers.
**SAY:**
"Because it couldn't see the code, it had to guess the column names. Its guesses were sensible ('validation', 'errorMessage', 'showIf'), but they're not what our block reads. The table on the slide shows each guess next to the real name.
So the block silently ignored them. The form looks fine, but the rules do nothing: a name with numbers in it was accepted, the business fields were always visible, and pressing Enter sent the form straight away. And nothing warned anyone.
Two out of ten requirement groups passed.
To be fair, it told us itself that steps and rules 'depend on the block's JavaScript'. It also added a US ZIP code rule that nobody asked for."

*Next: "So in round two, we gave it the format."*

---

## Slide 14: Round 2 (guided), it got close to Ema (1:30)

**▶ CLICK** "Round 2 form live". Point at "Step 1 of 3" and Next.
**SAY:**
"With the right format, it built fifteen correct rows: three steps, field rules with messages, the business fields that appear and hide, and a review step. Nine passes out of twelve.
But notice why it worked: it was using the code that Ema had written."

**SAY:**
"Three things were still wrong, as shown in the table. It left Company Name optional for business enquiries, which was partly our wording. The Enquiry Type dropdown had no placeholder, so it quietly defaults to 'Personal'. And it added the ZIP code rule again, after being told not to, this time with syntax the browser rejects, so it's silently ignored."

*Next: "So what was it like to work with?"*

---

## Slide 15: What it was like to work with (1:00)

**SAY:**
"Working with it was safe and polite. It always proposed a plan and waited for my approval, asked again before previewing, never published, and didn't touch any other file. We checked that in DA. And it was honest about what depends on code.
The risk is silent failure. If it doesn't know the format, the form looks right but doesn't behave. It adds rules nobody asked for, and it doesn't test its own work, so all the checking was ours.
So I've added a part to our SOP with the exact format, a checklist for reviewing its rows, and a prompt you can copy and fill in."

*Optional:* **▶ CLICK** "SOP with the Experience Workspace part" and scroll to Part C.

*Next: "Let's put all three side by side."*

---

## Slide 16: Three ways side by side (1:30)

**SAY:**
"Here are all three side by side.
**By hand** is slow, about 35 minutes for a simple form, but it needs nothing extra, and the author really understands the form.
**Ema** is the fastest, about four minutes, and it's the only one that can change the code. That's why it handled every advanced requirement.
**Experience Workspace** is safe and good for content changes, but it depends on someone writing down the format for it.
So my recommendation is to use them together. Ema builds and documents the block once. Then authors, by hand or with Experience Workspace, create forms using that format. And the author always previews and tests before anything is published."

*Next: "Every link is on the last slide."*

---

## Slide 17: Everything to open and show (0:30)

**SAY:**
"All the links are on this slide, grouped by part, so you can look again after the session. They're also in the full 25-slide POC deck and the SOP.
Thank you. Any questions?"

---

## If they ask…

**"Can we go live with this?"**
"Not yet. The form block is still on a branch, so it needs a normal pull request into main. And for saving entries in production, we need to pick a route: Power Automate with spam protection added, or Adobe's own submission service, which needs an AEM Forms licence."

**"Where do the entries go?"**
"For Form A, into an Excel table in OneDrive through Power Automate. That's tested, and an entry arrived within seconds. The other forms are demo only, so nothing they send is saved."

**"Is the Power Automate route safe?"**
"It works, but the flow address is visible in the page source, so anyone could post rows, and the trigger is a Microsoft Premium feature. Before production we'd need spam protection, or the Adobe route."

**"Would better prompting fix Experience Workspace?"**
"Partly. Just giving it the format took it from two passes to nine. But it still can't extend the block, so anything the code doesn't support stays out of reach."

**"Does changing the block break other forms?"**
"No. Ema's additions are opt-in. Forms A and B were tested again afterwards and behave exactly as before."

**"How long did Experience Workspace take?"**
"I didn't time it, so I'd rather not guess."

**"Why not just use Ema for everything?"**
"Ema is best for new or advanced forms and for code. For small content changes, authors in DA or Experience Workspace are fine, as long as they follow the documented format and run the four quick tests."
