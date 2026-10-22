# Scheduled Publishing in AEM Edge Delivery Services: Presentation Pack

Site: **araji-adobe / bv-poc-wknd-aln** (branch `main`, content in Document Authoring)
Status snapshot: 22 Oct 2026, 14:00 IST. Times are IST (UTC+5:30) unless marked UTC.

Evidence labels: **Tested** = proved on our site · **Documented** = Adobe docs say so · **Unknown** = no evidence yet ·
**Not available** = not found in the UI or docs. Official setup steps: link to
[aem.live: Schedule Publish](https://www.aem.live/docs/ew/administering/schedule-publish) and
[bbird demo: How to schedule publish](https://demo.bbird.live/demo-docs/usecases/how-to-schedule-publish).

---

## 1. Environment & key links

| Item | Link |
|---|---|
| Preview site | https://main--bv-poc-wknd-aln--araji-adobe.aem.page/us/en |
| Live site | https://main--bv-poc-wknd-aln--araji-adobe.aem.live/us/en |
| Editor (folder) | https://da.live/#/araji-adobe/bv-poc-wknd-aln/us/en |
| Site configuration | https://da.live/config#/araji-adobe/bv-poc-wknd-aln/ |
| Scheduler app (queue) | https://da.live/apps/scheduler (enter `/araji-adobe/bv-poc-wknd-aln/`) |
| Schedule sheet used by Ema | https://da.live/sheet#/araji-adobe/bv-poc-wknd-aln/.helix/crontab |
| GitHub repo | https://github.com/araji-adobe/bv-poc-wknd-aln |

---

## 2. Phase 2: Manual scheduled publishing (editor "Schedule Publish"), 22 Oct 2026

### 2a. Pages used

| Page | Editor | Preview | Live | Used in | Current state |
|---|---|---|---|---|---|
| scheduled-publish-test | [edit](https://da.live/edit#/araji-adobe/bv-poc-wknd-aln/us/en/scheduled-publish-test) | [preview](https://main--bv-poc-wknd-aln--araji-adobe.aem.page/us/en/scheduled-publish-test) | [live](https://main--bv-poc-wknd-aln--araji-adobe.aem.live/us/en/scheduled-publish-test) | M4–M12 | Live (V1 + V2) |
| scheduled-cancel-test | [edit](https://da.live/edit#/araji-adobe/bv-poc-wknd-aln/us/en/scheduled-cancel-test) | [preview](https://main--bv-poc-wknd-aln--araji-adobe.aem.page/us/en/scheduled-cancel-test) | [live](https://main--bv-poc-wknd-aln--araji-adobe.aem.live/us/en/scheduled-cancel-test) | M13–M14 | Not live (404), as intended |

### 2b. Tests

| # | Task | Page | Time (IST) | Result | Evidence |
|---|---|---|---|---|---|
| M0 | Check if Schedule Publish is enabled | n/a | 22 Oct | **Not enabled.** No site/org config, no menu item | Config check |
| M1 | Add `prepare` tab with row `title = Schedule Publish` | Site config | 22 Oct | **Pass**, config saved | Config readback · 📸 03 |
| M2a | Load the site in the scheduler app | Scheduler app | 22 Oct | "Site not registered" + Register button | 📸 04 |
| M2b | Register site | Scheduler app | 22 Oct | **Pass.** Empty queue shown; no separate success message | 📸 05 |
| M3 | Prepare menu shows Schedule Publish | /us/en | 22 Oct | **Pass.** Icon-only button; menu: Preflight, Unpublish, Schedule Publish | 📸 06 |
| M4 | Baseline: new page, typed "SPT-V1", not previewed | scheduled-publish-test | 11:44 | Preview 404, live 404 | Status API |
| M5 | Schedule publish for 12:00 | scheduled-publish-test | 11:51 | **Pass.** Dialog label "Schedule (Asia/Calcutta)", format MM/DD/YYYY hh:mm AM/PM | 📸 08/09 |
| M6 | **Auto-preview on scheduling** | scheduled-publish-test | 11:50:56 | **Pass.** Preview 404 → 200 with no manual preview | Audit log: preview → scheduled-publish |
| M7 | Edit after scheduling (add "SPT-V2"), no preview | scheduled-publish-test | ~11:58 | Editor V1 + V2; preview V1 only | Source vs preview |
| M8 | Scheduled run | scheduled-publish-test | 12:00:08 | **Pass.** Published by system account helix@adobe.com | Audit log · 📸 11 |
| M9 | **Which content went live?** | scheduled-publish-test | 12:00 | **V1 only.** The run publishes the *preview*, not later editor changes | Live vs editor · 📸 11/11b |
| M10 | Schedule again for 12:25 | scheduled-publish-test | 12:18 | **Pass.** Auto-preview again (preview now V1 + V2) | Audit log |
| M11 | Reschedule 12:25 → 12:30 | scheduled-publish-test | 12:20 | **Pass.** Re-previewed and re-queued | Audit log · 📸 12 |
| — | Queue view | Scheduler app | 12:22 | One entry at 12:30 | 📸 10 |
| M12 | **Reschedule honoured** | scheduled-publish-test | 12:25 / 12:30:07 | **Pass.** No change at 12:25; V1 + V2 live at 12:30 | Polling + audit log · 📸 11c |
| M13 | New page, schedule for 12:45 | scheduled-cancel-test | 12:38 | **Pass.** Auto-previewed, queued | Audit log |
| M14 | **Cancel** via Delete in scheduler list | scheduled-cancel-test | 12:40 | **Pass.** No confirmation prompt; still 404 after 12:45 | `deleted-scheduled-publish` in log · 📸 13/14 |
| Note | Manual Preview + Publish clicked (not a test) | scheduled-publish-test | 12:34 | Outside the test window; doesn't affect M12 | Audit log |

---

## 3. Phase 3: Ema-assisted scheduled publishing (schedule sheet / crontab), 19 Oct 2026

Source: Ema's test workbook `scheduler-test-log-2026-10-19.xlsx` (verified historical record), independently
re-checked on 22 Oct against Adobe's audit log (17 entries) and page status. The original chat transcript and
prompts were not retained.

### 3a. Pages used

| Page | Preview | Live | Task | Current state |
|---|---|---|---|---|
| adventures/beervana-portland | [preview](https://main--bv-poc-wknd-aln--araji-adobe.aem.page/us/en/adventures/beervana-portland) | [live](https://main--bv-poc-wknd-aln--araji-adobe.aem.live/us/en/adventures/beervana-portland) | T1 | Live since 19 Oct 16:00:04 |
| adventures/napa-wine-tasting | [preview](https://main--bv-poc-wknd-aln--araji-adobe.aem.page/us/en/adventures/napa-wine-tasting) | [live](https://main--bv-poc-wknd-aln--araji-adobe.aem.live/us/en/adventures/napa-wine-tasting) | T2 | Not live (404), as intended |
| adventures/tahoe-skiing | [preview](https://main--bv-poc-wknd-aln--araji-adobe.aem.page/us/en/adventures/tahoe-skiing) | [live](https://main--bv-poc-wknd-aln--araji-adobe.aem.live/us/en/adventures/tahoe-skiing) | T3 | Live since 19 Oct 16:20:04 |
| magazine/guide-la-skateparks | [preview](https://main--bv-poc-wknd-aln--araji-adobe.aem.page/us/en/magazine/guide-la-skateparks) | [live](https://main--bv-poc-wknd-aln--araji-adobe.aem.live/us/en/magazine/guide-la-skateparks) | T4 | Live since 19 Oct 16:25:04 |
| magazine/san-diego-surf | [preview](https://main--bv-poc-wknd-aln--araji-adobe.aem.page/us/en/magazine/san-diego-surf) | [live](https://main--bv-poc-wknd-aln--araji-adobe.aem.live/us/en/magazine/san-diego-surf) | T4 | Live since 19 Oct 16:25:05 |
| magazine/ski-touring | [preview](https://main--bv-poc-wknd-aln--araji-adobe.aem.page/us/en/magazine/ski-touring) | [live](https://main--bv-poc-wknd-aln--araji-adobe.aem.live/us/en/magazine/ski-touring) | T4 | Live since 19 Oct 16:25:06 |
| magazine/western-australia | [preview](https://main--bv-poc-wknd-aln--araji-adobe.aem.page/us/en/magazine/western-australia) | [live](https://main--bv-poc-wknd-aln--araji-adobe.aem.live/us/en/magazine/western-australia) | T4 | Live since 19 Oct 16:25:06 |
| magazine/arctic-surfing | [preview](https://main--bv-poc-wknd-aln--araji-adobe.aem.page/us/en/magazine/arctic-surfing) | [live](https://main--bv-poc-wknd-aln--araji-adobe.aem.live/us/en/magazine/arctic-surfing) | T5 | Not live (404). Published 16:25, unpublished 16:40 |

### 3b. Tests

| # | Task | Page(s) | Schedule (IST) | Result |
|---|---|---|---|---|
| T1 | Scheduled publish | beervana-portland | 16:00 | **Pass.** Live 16:00:04, identical to preview |
| T2 | Schedule, then cancel (row removed) | napa-wine-tasting | 16:10 → cancelled | **Pass.** Never published |
| T3 | Reschedule | tahoe-skiing | 16:10 → 16:20 | **Pass.** Live 16:20:04 only |
| T4 | Bulk publish (one row, 4 commands) | 4 magazine pages | 16:25 | **Pass.** 4/4 live 16:25:04–:06 |
| T5 | Scheduled publish + scheduled unpublish | arctic-surfing | 16:25 / 16:40 | **Pass.** Live 16:25:04; removed on the 16:40 tick |

### 3c. What Ema did
1. Read-only discovery: listed 28 pages and took a status snapshot (17 unpublished), and found the schedule-sheet mechanism.
2. Proposed a timed plan; the **user approved every change**.
3. Wrote the schedule sheet (`/.helix/crontab`, times in UTC) and activated it by previewing it: 5 versions, all successful.
4. **Never published directly.** Every go-live came from the scheduler.
5. Verified each run (status + audit log polling) and wrote the evidence workbook.

---

## 4. Findings register

| # | Finding | Status | Source |
|---|---|---|---|
| F1 | Editor Schedule Publish is **off by default**; it needs a `prepare` config row **and** site registration | Documented + Tested | M0–M3 |
| F2 | The "Prepare" menu is an **icon without a label** in the editor | Tested | M3 |
| F3 | Scheduling **auto-previews** the page, so preview content is guaranteed | Documented + Tested | M6, M10 |
| F4 | Rescheduling also auto-previews | Tested | M11 |
| F5 | The run publishes **what is in preview at run time**. Edits after scheduling need a fresh preview | Tested (clarifies docs) | M7–M9 |
| F6 | Runs execute ~7–8 s after the scheduled minute, by system account helix@adobe.com | Tested | M8, M12 |
| F7 | Time zone = the author's **browser** time zone (shown in the dialog) | Tested (not in docs) | M5 |
| F8 | Reschedule via the reopened dialog (old time prefilled); the old time is ignored | Documented + Tested | M11–M12 |
| F9 | Cancel = **Delete** in the scheduler list, **no confirmation** | Documented + Tested | M14 |
| F10 | No cancel button inside the editor dialog (only Schedule / X) | Not available (in UI tested) | M5 |
| F11 | Editor plugin actions are explicit in the audit log (`scheduled-publish`, `deleted-scheduled-publish`) | Tested | M6, M14 |
| F12 | Two independent mechanisms exist: editor Schedule Publish vs the schedule sheet (crontab) | Tested | M2a vs T1–T5 |
| F13 | Schedule sheet: UTC times, 5-minute ticks, activated by previewing the sheet | Tested | T1–T5 |
| F14 | Schedule sheet supports **bulk** and **scheduled unpublish** | Tested | T4, T5 |
| F15 | Schedule sheet does **not** auto-preview; it publishes the existing preview | Tested (workbook follow-up 4) | T1–T5 |
| F16 | Schedule sheet runs are not explicitly attributed in the audit log (only indexer/sitemap side effects) | Tested | 19 Oct audit log |
| F17 | Ema's actions are logged under the **human user's account** | Tested | 19 Oct audit log |
| F18 | Ema can't monitor between chat turns; verification happens in-session | Tested | Workbook L4 |
| F19 | One syntax error in the shared schedule sheet disables all its jobs | Documented risk (workbook L5) | Workbook |
| F20 | The audit log lags about 1 minute | Tested | 19 Oct O2, 22 Oct M11 |
| F21 | Scheduler app also lists **snapshots** (group scheduling) | Unknown | Scheduler UI |
| F22 | Scheduled **unpublish** via the editor plugin | Unknown / not offered in dialog | M5 |
| F23 | Page images are served from the site's media bus (`media_<hash>`); editor sources still point at the old site `edscapstoneajay` | Tested (observation) | Phase 4 prep |

---

## 5. Manual vs Ema: comparison slide

| | Manual (editor Schedule Publish) | Ema-assisted (schedule sheet) |
|---|---|---|
| Setup | Config row + site registration | None in UI; Ema creates the sheet |
| Who | Author, per page | Ema plans; human approves |
| Auto-preview | ✅ Yes | ❌ No |
| Bulk | One page per dialog | ✅ Many pages per instruction |
| Scheduled unpublish | ❌ Not offered | ✅ Yes |
| Queue view | ✅ Scheduler app | ❌ Only the sheet |
| Time zone | Browser time zone | UTC |
| Precision | Minute (~8 s late) | 5-minute ticks (~4–6 s late) |
| Audit trail | ✅ Explicit entries | Side effects only; logged as the user |
| Verification | Human checks | ✅ Ema polls and writes the evidence workbook |

---

## 6. Screenshot list

| File | Shows | Phase / test | Status |
|---|---|---|---|
| 01-da-toolbar-before-schedule-enabled.png | Toolbar before enabling | M0 | User to confirm (may already show the Prepare icon) |
| 02-da-site-config-empty.png | Empty site config | M1 | Optional |
| 03-config-prepare-row.png | `prepare` row saved | M1 | Taken |
| 04-scheduler-not-registered.png | "Not registered" | M2a | Taken |
| 05-scheduler-registered.png | Empty queue after registering | M2b | Taken |
| 06-prepare-menu-schedule-option.png | Prepare menu | M3 | Taken |
| 07-test-page-before-preview-vs-live.png | Before state | M4 | **Not taken.** Use the M4/M6 evidence table instead |
| 08-schedule-dialog-datetime.png | Dialog with time | M5 | Optional |
| 09-schedule-confirmed.png | "Scheduled by … Reschedule?" | M5 | Taken |
| 10-scheduler-list-pending.png | Job in queue | M11/M12 | Taken |
| 11-live-page-after-publish.png | Live = V1 only | M9 | Taken |
| 11b-editor-shows-v1-and-v2.png | Editor = V1 + V2 | M7 | Optional |
| 11c-live-after-reschedule-v1-v2.png | Live = V1 + V2 | M12 | Optional |
| 12-reschedule-dialog-prefilled.png | Prefilled old time | M11 | Taken |
| 13-scheduler-list-after-delete.png | Queue after Delete | M14 | Taken |
| 14-live-still-404-after-cancel.png | 404 after cancel | M14 | Requested |
| (19 Oct) | None exist | T1–T5 | Use the workbook tabs as visuals |

---

## 7. Suggested slide outline

1. **Title**: Scheduled Publishing in AEM Edge Delivery Services
2. **Publishing model**: Editor → Preview (`.aem.page`) → Live (`.aem.live`); publishing = copy preview to live
3. **Two ways to schedule** (F12): editor Schedule Publish vs schedule sheet
4. **Enabling Schedule Publish** (F1, F2): 📸 03, 05, 06
5. **Scheduling a page** (F3, F7): 📸 09, auto-preview evidence table (M4 → M6)
6. **Key insight** (F5): 📸 11b vs 11. "Edit, then preview again"
7. **Reschedule & cancel** (F8–F10): 📸 12, 10, 13, 14
8. **Ema-assisted scheduling** (T1–T5): results table + workbook
9. **Manual vs Ema** (section 5)
10. **Governance & limits** (F11, F16–F20)
11. **Open questions / next tests** (F21, F22, Phase 4–7)
12. **References**: the two Adobe links
