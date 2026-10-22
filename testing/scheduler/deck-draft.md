# Deck draft: Scheduled Publishing in Edge Delivery Services
Presenter: ALAN RAJI MANI · araji@adobe.com · Friday 23 Oct 2026 · 15 min
Style: template structure, title fields and footer + Adobe defaults (white, Adobe red #EB1000, wordmark).
Footer on every slide: "© 2026 Adobe. All Rights Reserved. Adobe Confidential." + slide number.
Evidence IDs refer to `demo-progress.md` (M = manual, T = Ema, W = Workspace, A = fragment, B = image, X = expiry).
Labels used on slides: ✅ Tested · 📄 Documented · ⚠️ Limitation · ❓ Unknown / not tested.

---------------------------------------------------------------------------------------------------

## 1 · Title
- Kicker: EDS · Experience Workspace · EMA
- Title: **Scheduled Publishing in Edge Delivery Services**
- Subtitle: Manual, Ema-assisted and Experience Workspace approaches, tested on a live sandbox
- Summary: We enabled, ran and verified scheduled publishing on bv-poc-wknd-aln, compared Ema and Experience Workspace, and tested fragment, asset and expiry behaviour.
- Prepared for: VP, Global Delivery Center
- ALAN RAJI MANI · araji@adobe.com · 23 Oct 2026
- Visual: Adobe wordmark top-left

**Notes**
- Say: "Today I'll show how scheduled publishing works in Edge Delivery Services, how we did it manually, with Ema and with Experience Workspace, and what we learned from the extra cases Abhishek and Mohit asked for. Everything I show was tested on our sandbox site between 19 and 22 October."
- Transition: "Let's start with what scheduling actually means in EDS."

---------------------------------------------------------------------------------------------------

## 2 · 1. Explain scheduling: how publishing and scheduling work in EDS
- Diagram (left → right): **Editor (da.live)** → *Preview* → **Preview site (.aem.page)** → *Publish* → **Live site (.aem.live)**
- Callout: "Publishing = copying the **preview** version to live." 📄
- Callout: "Scheduling = doing that copy automatically at a chosen time." 📄
- Two schedulers on one site (✅ both tested):
  | | Editor Schedule Publish | Schedule sheet (crontab) |
  |---|---|---|
  | Used by | Authors, in the editor | Admins / automation (Ema) |
  | Where | Prepare → Schedule Publish | `/.helix/crontab` sheet |
  | Time | Browser time zone, minute | UTC, 5-minute ticks |
- 🔗 Live: open the same page on .aem.page and .aem.live

**Notes**
- Say: "In EDS, an author edits in the editor. Preview creates a draft version on .aem.page. Publish copies that preview to .aem.live, which the public sees. Scheduling simply automates that second step at a time you choose."
- Click: preview URL, then live URL of `/us/en/scheduled-publish-test`.
- Observe: the same page on two hosts, preview and live.
- Explain: "There are two independent schedulers. The editor's Schedule Publish is the author-facing one. The schedule sheet, or crontab, is an admin sheet of 'when' and 'command' rows. That's what Ema used."
- Q: *Are they the same thing?* A: "No. Our 19 Oct crontab tests ran while the editor scheduler wasn't even registered (M2a)."
- Transition: "Why does the business need this?"

---------------------------------------------------------------------------------------------------

## 3 · 2. Business use case: why marketers need scheduled publishing
- Problem: content must go live **at a precise moment**, often outside working hours or in another time zone, without someone clicking Publish.
- Infographic (4 tiles, labelled *illustrative scenarios*):
  1. Campaign / product launch at a fixed time
  2. Embargoed announcement (go live exactly at embargo lift)
  3. Global launch in another time zone
  4. Time-limited promotion (go live, then come down)
- Marketer requirements → what we tested:
  | Requirement | Covered by |
  |---|---|
  | Pick a date/time in the UI | Editor Schedule Publish ✅ |
  | Change or cancel the plan | Reschedule / Delete ✅ |
  | Many pages at once | Crontab bulk ✅ (Ema); Snapshots 📄 |
  | Take content down on time | Crontab unpublish ✅ (Ema) |
  | Proof it happened | Audit log ✅ |

**Notes**
- Say: "These scenarios are illustrative, but each requirement on the right maps to something we actually tested."
- Q: *Can authors schedule an unpublish in the UI?* A: "Not in the editor dialog we tested. Scheduled unpublish worked through the crontab (T5)."
- Transition: "First, the manual way, without Ema."

---------------------------------------------------------------------------------------------------

## 4 · 3. Manual scheduling: setup, two switches
- Step 1: Site config → `prepare` tab → row `title = Schedule Publish` (path/icon/ref empty) ✅ M1
- Step 2: da.live/apps/scheduler → `/araji-adobe/bv-poc-wknd-aln/` → **Register site** ✅ M2b
- Before: no site config existed; the menu item was absent ✅ M0
- Screenshots: `M0-site-config-empty.jpg`, `M2b-scheduler-registered.jpg`
- Observed: registration showed no "success" message, just the empty queue. It created an admin API key (audit log) ✅
- References: aem.live schedule-publish doc · bbird how-to (link only)
- 🔗 Live: da.live/config#/araji-adobe/bv-poc-wknd-aln/ · da.live/apps/scheduler

**Notes**
- Say: "Schedule Publish is off by default. It took two switches: one config row so the menu appears, and one registration so Adobe's scheduler service runs jobs for the site."
- Click: config page (show the prepare tab), then the scheduler app.
- Q: *Org or site level?* A: "We used site level, so only this site is affected; the docs allow either."
- Transition: "With that in place, scheduling a page takes four clicks."

---------------------------------------------------------------------------------------------------

## 5 · 3. Manual scheduling: scheduling a page
- Flow: Open page → **Prepare** (icon, no label) → **Schedule Publish** → date/time → **Schedule**
- Screenshots: `M3-prepare-menu-schedule-publish.jpg`, `M5-schedule-dialog-asia-calcutta.jpg`
- Auto-preview proof ✅ M4–M6:
  | | Before scheduling | Right after |
  |---|---|---|
  | Preview | none (404) | created 11:50:58 IST |
  | Live | none | none (correct) |
- Time zone = the author's browser ("Schedule (Asia/Calcutta)") ✅ (not in the docs)
- 🔗 Live: Prepare menu on `/us/en/scheduled-publish-test`

**Notes**
- Say: "The Prepare button is just an icon, so point it out. The dialog shows the browser's time zone. And the docs' claim that scheduling previews the page automatically is true: we used a never-previewed page and a preview appeared the moment we clicked Schedule."
- Click: open the Prepare menu live; don't schedule.
- Q: *Do I need to preview first?* A: "Not for the first schedule. But see the next slide."
- Transition: "So what actually went live?"

---------------------------------------------------------------------------------------------------

## 6 · 3. Manual scheduling: verified results and the key insight
- Timeline (22 Oct, IST) ✅:
  | Time | Event | Evidence |
  |---|---|---|
  | 12:00:08 | Published by system account helix@adobe.com | M8 |
  | 12:00 | Live = **V1 only**; V2 edited after scheduling did **not** go live | M9 |
  | 12:25 → 12:30:07 | Reschedule honoured (no change at the old time) | M12 |
  | 12:40 / 12:45 | Delete in the list (no confirmation) → page never went live | M14 |
- Key insight: **"The scheduler publishes the preview, not later edits. Edit, then preview again before go-live."**
- Not available: cancel inside the dialog (only Schedule / X) ⚠️; scheduled unpublish in the dialog ❓
- 🔗 Live: live test page · scheduler list

**Notes**
- Say: "It ran 8 seconds after the minute. The important lesson: we edited the page after scheduling and that edit did not go live, because the scheduler copies whatever is in preview."
- Q: *Why does the doc say 'content as it exists at publish time'?* A: "It means the previewed content at that time. We proved editor-only changes don't go live (M9)."
- Q: *Is Delete reversible?* A: "No confirmation prompt; you would schedule again."
- Transition: "Now the same use case with Ema."

---------------------------------------------------------------------------------------------------

## 7 · 4. Ema-assisted scheduling: how Ema did it
- Flow diagram: **Discover** (read-only: 28 pages, status snapshot, found crontab) → **Plan** (timed plan) → **Approve** (user, every change) → **Write** crontab rows (DA API) → **Activate** (preview the sheet) → **Verify** (status + audit log polling) → **Report** (evidence workbook)
- Interaction flow (*reconstructed from the 19 Oct test log; original prompt not retained*): 20 recorded user entries (approvals, page choices, wait-for-check confirmations), 24 Ema actions
- Rule followed: Ema never published directly; every go-live came from the scheduler ✅
- 🔗 Live: the crontab sheet (5 rows)

**Notes**
- Say: "Ema worked out by itself that the site had a schedule sheet, proposed a plan, and only changed anything after I approved. It wrote the rows, activated them, then checked the results itself."
- Be clear: "We don't have the exact prompt text. This flow is reconstructed from Ema's own test log."
- Transition: "And the results."

---------------------------------------------------------------------------------------------------

## 8 · 4. Ema-assisted scheduling: results (19 Oct)
| Test | Page(s) | Plan (IST) | Result |
|---|---|---|---|
| T1 Publish | beervana-portland | 16:00 | ✅ 16:00:04 |
| T2 Cancel | napa-wine-tasting | 16:10 → removed | ✅ never live |
| T3 Reschedule | tahoe-skiing | 16:10 → 16:20 | ✅ 16:20:04 only |
| T4 Bulk (4 pages, 1 row) | magazine/* | 16:25 | ✅ 16:25:04–06 |
| T5 Publish + unpublish | arctic-surfing | 16:25 / 16:40 | ✅ removed 16:40 |
- Verified twice: Ema's workbook **and** Adobe's audit log (17 entries, re-checked 22 Oct) ✅
- 🔗 Live: beervana-portland live page

**Notes**
- Say: "Five of five passed, including two things the editor dialog doesn't offer: bulk publishing and scheduled unpublish."
- Q: *How do we know Ema didn't just publish directly?* A: "The audit log shows only sheet previews by the user account and system indexing entries; no direct publish calls."
- Transition: "So what does Ema add?"

---------------------------------------------------------------------------------------------------

## 9 · 5. Ema's added value and limitations
| | Manual (editor) | Ema (schedule sheet) |
|---|---|---|
| Setup | Config row + registration | None in UI |
| Bulk | 1 page per dialog | ✅ many pages per instruction |
| Scheduled unpublish | Not offered | ✅ |
| Auto-preview | ✅ | ⚠️ No; publishes the existing preview |
| Queue view | ✅ scheduler app | ⚠️ only the sheet |
| Time | Browser zone, minute | UTC, 5-min ticks |
| Audit trail | ✅ explicit entries | ⚠️ side effects only, logged as the user |
| Verification | Human | ✅ Ema polls and writes evidence |
- Still needs the user: approvals (20 recorded entries), staying in session to verify (Ema can't monitor between turns) ⚠️
- Risk: one syntax error in the shared sheet disables every job ⚠️ (workbook L5)
- No efficiency metrics claimed; recorded facts only

**Notes**
- Say: "Ema simplifies the mechanics and adds bulk and unpublish. But it doesn't remove human approval, and its actions show up in the log under my account."
- Q: *Is Ema faster?* A: "We didn't measure that. The 74-minute window was set by the schedule times, not by Ema."
- Transition: "We then asked Experience Workspace to do the same task."

---------------------------------------------------------------------------------------------------

## 10 · 6. Experience Workspace: what happened
- Same 5-task superprompt, on 8 equivalent pages; REFERENCE hints included; 4 user messages
- Findings (✅ verified via screenshots + audit log):
  - Re-previewed all 8 pages **twice** during the "no changes" pre-check (W1)
  - Read the crontab after errors (W2), then said it **cannot schedule**: "no real-time clock" (W3, W4)
  - Given an exact time (6:45 PM IST), it hit **read/write errors** on the sheet (W5)
  - Fallback advice had a **past date** (14 Jul 2025) and a wrong activation step (W6)
- Outcome: **no schedule created, no page published** (W7)
- Screenshots: `W-03-cannot-schedule-no-clock.jpg`, `W-04-cannot-write-sheet-wrong-date.jpg`

**Notes**
- Say: "Experience Workspace couldn't complete it in our environment. It told us why: it has no clock, and it couldn't read or write the schedule sheet reliably. Even with an exact time, it failed."
- Careful: "We're not claiming Workspace can never schedule, only that it didn't in our setup on 22 Oct."
- Q: *Did it break anything?* A: "It re-previewed 8 pages (preview only). Nothing went live. I added an incomplete row to the sheet myself while trying its fallback; it was never activated."
- Transition: "Side by side with Ema:"

---------------------------------------------------------------------------------------------------

## 11 · 6. Ema vs Experience Workspace
| | Ema (19 Oct) | Experience Workspace (22 Oct) |
|---|---|---|
| Schedules created | ✅ 5/5 tasks | ❌ 0 |
| Pages published on time | ✅ 7/7 + 1 unpublish | ❌ none |
| User messages | 20 recorded entries | 4 |
| Discovered the mechanism | ✅ itself | Given hints; partly |
| Verified results | ✅ status + audit log | ❌ not reached |
| Errors | 1 retry, 1 trimmed output | Bad Request ×6, contradictory answers |
| Unrequested changes | None recorded | 8 pages re-previewed ×2 |
| Advice quality | n/a | Past date; wrong activation step; scheduler-app claim contradicts docs |
- Characterisation: **unsuccessful in our environment** (tool limitations reported by Experience Workspace)

**Notes**
- Say: "Ema finished and proved it. Experience Workspace didn't create a schedule, and some of its advice would have failed silently."
- Transition: "Abhishek and Mohit also asked for three extra investigations."

---------------------------------------------------------------------------------------------------

## 12 · 7A. Additional investigations: unpublishing a page and its assets
- Test: page with a new image → scheduled publish → **Unpublish** (B1–B5)
| What | After unpublish | |
|---|---|---|
| Page on live | Gone (404) | ✅ |
| Page in **preview** | Also gone; editor Unpublish removes both | ✅ |
| The image URL | **Still served** (full 5.2 MB original), even under other paths | ✅ |
| Sitemap | Scheduled-unpublished page removed (T5, arctic-surfing) | ✅ |
- ⚠️ Images are stored permanently, keyed by content; no removal option found ❓
- ⚠️ Side finding: the sitemap still points at the old site host
- 🔗 Live: image URL after unpublish

**Notes**
- Say: "Unpublishing removes the page, but not its images. Anyone with the image address can still load it."
- Q: *Can we delete the image?* A: "We found no option in the editor. Unknown via other routes."
- Transition: "Next: does scheduling a page bring its dependencies along?"

---------------------------------------------------------------------------------------------------

## 13 · 7B. Fragment and asset publishing dependencies
| Resource | Published with the scheduled page? | Evidence |
|---|---|---|
| EDS fragment | ❌ No; needs its own preview/publish | A3–A5 |
| Image in the page | ✅ Yes, automatically | B2–B4 |
| Image before page publish | ⚠️ Already reachable on live after preview | B3 |
- If the page goes first: visitors see the raw fragment URL as a **yellow button** linking to a 404 (screenshot `A5-live-broken-fragment-cta.jpg`)
- Once the fragment is live, the page fixes itself without republishing ✅ A8; some browsers may keep the broken version up to 2 h ⚠️ A9
- No dependency detection or warning ⚠️ · Bundle option: **Snapshots** 📄 (scheduling a snapshot ❓)
- 🔗 Live: live fragment page

**Notes**
- Say: "EDS has no dependency management. What's inside a page travels with it; what it references has its own lifecycle."
- Q: *AEM Content Fragments?* A: "Not integrated in this project; we tested EDS fragments only."
- Transition: "Finally, Abhishek's question about expiry."

---------------------------------------------------------------------------------------------------

## 14 · 7C. Asset expiry and scheduled unpublishing
- Three different things: **expiry metadata** (a label) ≠ **publication status** (what the system records) ≠ **availability** (does the URL load). B5 showed status and availability can differ.
| Question | Answer | |
|---|---|---|
| Expiry metadata in EDS? | None | 📄 + checked |
| Unpublish images? | Not possible | ✅ B5 |
| PDFs publish/unpublish? | Yes; own Preview/Publish/Prepare | ✅ X1b–X1c |
| Editor schedule for PDFs | Publish only, no unpublish | ✅ X1c |
| Time-based unpublish | Crontab `unpublish` | ✅ page (T5); PDF ❓ |
| Metadata-based unpublish | Not native; needs automation (Ema/script → crontab) | 📄 |
| AEM Assets Off Time | Withdraws AEM-delivered assets | 📄, not tested |
- Screenshot: `X1b-pdf-media-viewer.jpg`

**Notes**
- Say: "Short answer for Abhishek: in EDS you can schedule an unpublish by time, not by metadata. Something has to turn the expiry date into a scheduled unpublish."
- Be clear: "The PDF unpublish run itself was not executed; that's still to validate."
- Transition: "To wrap up:"

---------------------------------------------------------------------------------------------------

## 15 · Conclusion: verified findings and recommendations
- Verified ✅: two-switch setup · auto-preview on scheduling · publishes preview, not later edits · reschedule/cancel work · Ema 5/5 incl. bulk + unpublish · fragments not carried; images carried · images survive unpublish
- Recommendations:
  1. Authors: **edit → preview → (re)schedule**
  2. Publish or schedule fragments **before** their pages
  3. Use the crontab (or Ema) for bulk and unpublish; Snapshots for coordinated launches
  4. Don't put embargoed images on previewed pages
  5. Treat expiry as a process: register → automation → crontab
- Open items ❓: PDF scheduled unpublish run · snapshot scheduling · AEM Assets integration · Experience Workspace re-test · sitemap host fix
- References: aem.live schedule-publish · bbird how-to · aem.live/docs/scheduling · aem.live/docs/snapshots-reviews · aem.live/docs/media

**Notes**
- Say: "Everything with a green tick we proved on the site. The open items are clearly marked."

---------------------------------------------------------------------------------------------------

## 16 · Q&A
- "Questions?" · ALAN RAJI MANI · araji@adobe.com
- Appendix pointer: "Full test logs and capability register in the appendix"

---------------------------------------------------------------------------------------------------

## Appendix (reference only, not presented)
- A1 Environment & links: org/site/branch, preview/live, config, scheduler, crontab, repo
- A2 Manual test log M0–M14
- A3 Ema test log T1–T5 + crontab format (`when` / `command`, UTC, 5-min ticks, activate by preview) + L1–L7
- A4 Workspace test log W1–W8 + prompt summary + row 6 note
- A5 Fragment tests A1–A10
- A6 Image tests B1–B5 + sitemap/index evidence
- A7 Expiry tests X1–X1c + mechanism comparison
- A8 Capability register (Documented / Tested / Unknown / Not available)
- A9 Open items & sandbox cleanup (test pages, crontab row 6, sitemap origin, unknowns)
