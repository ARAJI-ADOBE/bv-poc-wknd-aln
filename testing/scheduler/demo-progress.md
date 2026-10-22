# Scheduled Publishing Demo: Progress & Findings

Working log for the Friday (23 Oct 2026) demo. Not served (`testing/*` is in `.hlxignore`).

Evidence labels: **Documented** (Adobe docs say so), **Tested** (we proved it on this site),
**Unsupported** (docs or tests show it doesn't work), **Unknown** (no evidence yet).

## Progress checklist

- [x] 0. Identify EDS environment (completed 22 Oct 2026)
- [x] 1. Manual scheduled publishing (DA "Schedule Publish" plugin, no Ema), completed 22 Oct
  - [x] 1a. Enable Schedule Publish in the DA config (`prepare` tab), verified 22 Oct
  - [x] 1b. Register the site in the DA scheduler app (22 Oct)
  - [x] 1c-pre. Prepare menu shows Schedule Publish (22 Oct)
  - [ ] 1d. Create test page `/us/en/scheduled-publish-test` (never previewed). Auto-preview test design:
        v1 marker typed, NOT previewed → schedule → check whether preview appears (auto-preview at scheduling time?)
        → type v2 marker, NOT previewed → after the run, check live: v2 = DA content at run time, v1 = preview from scheduling time
  - [x] 1d done (M4). 1e scheduled + auto-preview proven (M5, M6). 1g published at 12:00:08 IST; live = V1 only (M8, M9)
  - [x] 1f. Scheduler list view shows the pending job (screenshot 10)
  - [x] 1h-a. Reschedule 12:25 → 12:30 honoured (M11, M12)
  - [x] 1h-b. Cancel via Delete in the scheduler list (M13, M14)
  - [x] 1i. Demo explanation written (see "Part 1 demo talk track" below)
  - Cleanup pending (user decision): `/us/en/scheduled-publish-test` is live; `/us/en/scheduled-cancel-test` is previewed only
  - [ ] 1d. Reschedule / cancel and verify
- [x] 2. Ema-assisted scheduled publishing: reviewed from the 19 Oct records, verified against the audit log (22 Oct). Not re-run
- [x] 3. Assets when a page is unpublished: done 22 Oct (B5, image stays reachable)
- [x] 4. Does scheduled page publish also publish referenced assets / fragments? Done 22 Oct (Scenarios A, B, C)
- [x] 5. Automatic asset unpublish from expiry metadata: concluded 22 Oct (EDS: time-based only via crontab; metadata needs automation; PDF unpublish run not executed)
- [ ] 6. Experience Workspace / Coworker capabilities
- [ ] 7. AEM vs EDS comparison
- [ ] 8. Knowledge document, Adobe Express slides, screenshots, demo script

## 0. Environment (verified 22 Oct 2026)

| Item | Value | Evidence |
|---|---|---|
| Org / site / branch | `araji-adobe` / `bv-poc-wknd-aln` / `main` | Admin site config |
| Code source | GitHub `araji-adobe/bv-poc-wknd-aln` | Site config; `/scripts/scripts.js` returns 200 on preview |
| Content source | Document Authoring: `content.da.live/araji-adobe/bv-poc-wknd-aln` | Site config; DA source API 200 |
| Preview / Live | `main--bv-poc-wknd-aln--araji-adobe.aem.page` / `.aem.live` | Status API |
| Home page | `/us/en` (site root `/` is 404 by design: no root page) | Status API |
| Site admin | `araji@adobe.com` | Site config `access.admin` |
| DA editor toolbar | Shows **Preview** and **Publish** only, no **Prepare** menu | User observation, 22 Oct |
| DA site config / org config | **Do not exist** (404 for both) | `GET admin.da.live/config/...` |
| Crontab sheet `/.helix/crontab` | Exists; 5 past one-time rows from the 19 Oct test; previewed 19 Oct 10:25 UTC | DA source API, status API |
| Stale reference | README / AGENTS.md list the old site `edscapstoneajay--ajayajju2412`. Ignore for the demo. | Repo files |

## Key finding: there are two different scheduling mechanisms

| | A. DA "Schedule Publish" plugin | B. Admin crontab sheet (`/.helix/crontab`) |
|---|---|---|
| Where it's driven from | DA editor → **Prepare** menu → Schedule publish; overview at `da.live/apps/scheduler` | A sheet of `when` / `command` rows, activated by previewing it |
| Enabled on this site? | **No**: no DA config → no `prepare` tab → no Prepare menu | **Yes**: used and proven on 19 Oct |
| Used by Ema on 19 Oct? | No | **Yes**: Ema wrote and previewed the crontab |
| Demo role | Part 1 (manual, no Ema) | Part 2 (Ema-assisted) |

## Capability register

| Capability | Status | Evidence |
|---|---|---|
| DA Schedule Publish needs a `prepare` config row + site registration | Documented | aem.live schedule-publish doc; bbird how-to |
| Scheduled publish uses the content as it is at run time, auto-previewed | Documented (plugin) | Both references |
| Delete a schedule in the scheduler app (no confirmation) | **Documented + Tested** | M14 |
| Reschedule via the reopened dialog (prefilled with the old time) | **Documented + Tested** | M11, M12 |
| Cancel from inside the editor dialog | **Not available in the UI tested.** The dialog has only Schedule and X; bbird's "cancel by reopening the plugin" was not observed | Screenshot of dialog (M5) |
| Execution accuracy | **Tested.** `POST live` 7–8 s after the minute (06:30:08, 07:00:07) | M8, M12 |
| Every scheduler action is audit-logged (`scheduled-publish`, `deleted-scheduled-publish`, system `live` by helix@adobe.com) | **Tested** | M6, M8, M14 |
| Crontab: one-time publish at a UTC time | Tested: Pass (T1, 19 Oct) | Test log |
| Crontab: cancel by removing the row before it runs | Tested: Pass (T2) | Test log |
| Crontab: reschedule by editing the row | Tested: Pass (T3) | Test log |
| Crontab: bulk publish (multi-command cell) | Tested: Pass (T4, 4/4 pages) | Test log |
| Crontab: scheduled unpublish | Tested: Pass (T5) | Test log |
| Crontab runs on 5-minute ticks; times in UTC | Tested | Jobs ran 4–6 s after tick |
| Crontab publishes the previewed content, not the latest DA edit | Unknown (likely; not tested) | Test log follow-up (4) |
| Plugin is found "by its title"; casing differs between docs ("Schedule Publish" on aem.live vs "Schedule publish" on bbird) | Unknown whether title matching is case-sensitive | Using aem.live casing first |
| Plugin docs: scheduled publish uses content "as it exists at the time of the scheduled publish" | **Tested (clarified).** It is the content **in preview** at run time. Editor edits after scheduling go live only if previewed before the run | M7–M9 |
| Scheduled run is attributed to `helix@adobe.com` as `route: live` in the audit log | **Tested** | M8 |
| "Experience Workspace" in aem.live docs = the da.live editor (bbird calls it DA) | Documented (same steps, different names) | Both references |
| Time zone handling in the DA plugin | **Tested.** The dialog shows and uses the browser's time zone, labelled e.g. "Schedule (Asia/Calcutta)" | M5 |
| Scheduling a page triggers an automatic preview | **Documented + Tested** (preview 404 → 200 at scheduling time) | M6 |
| The DA plugin writes a `scheduled-publish` entry to the admin audit log (the crontab did not) | **Tested** | M6 vs 19 Oct O1 |
| Scheduler app lists "scheduled pages **and snapshots**". Snapshot scheduling may also be possible | Unknown (seen in the UI, not tested) | Scheduler app UI text |
| Scheduler app list shows crontab-sheet jobs | Unknown. The crontab has only past rows, so an empty list proves nothing either way | M2b |
| How to unregister a site from the scheduler | Unknown | Not documented |
| Preflight and Unpublish also appear in the Prepare menu without config rows | Observed. Unknown whether they were already there before 1a (user's original toolbar description didn't mention the Prepare icon) | M3 |
| The calendar icon in the editor's right rail | Unknown purpose (possibly schedule-related); not yet tested | Screenshot 06 |
| Scheduled unpublish in the DA plugin | Unknown | Not documented |
| Assets / fragments published with a scheduled page | Unknown | Not documented; test in Part 4 |
| Asset auto-unpublish from expiry metadata | Unknown | Test in Part 5 |

## Screenshot register

| File name | Shows | Taken? |
|---|---|---|
| `01-da-toolbar-before-schedule-enabled.png` | Editor toolbar: Preview / Publish only | Pending (user to confirm) |
| `02-da-site-config-empty.png` | Empty site config (data tab only) | Optional |
| `03-config-prepare-row.png` | `prepare` tab with the Schedule Publish row, after Save | Planned |
| `04-scheduler-not-registered.png` | Scheduler app: "site not registered" message | Planned |
| `05-scheduler-registered.png` | Scheduler app: registration confirmed | Planned |
| `06-prepare-menu-schedule-option.png` | Editor: Prepare menu showing Schedule publish | Planned |
| `07-test-page-before-preview-vs-live.png` | Test page before scheduling: no preview, not live | **Not taken.** The mentor never prompted for it after the plan changed to a brand-new page; the before state is gone. Use the M4 evidence as a text slide, or a substitute page |
| `08-schedule-dialog-datetime.png` | Schedule dialog with date/time filled in | Planned |
| `09-schedule-confirmed.png` | Confirmation after clicking Schedule | Planned |
| `10-scheduler-list-pending.png` | Scheduler app list showing the pending job | Planned |
| `11-live-page-after-publish.png` | Live URL showing the page after the scheduled time | Planned |
| `12-reschedule-dialog-prefilled.png` | Reopened dialog with the earlier time prefilled | Planned |
| `13-scheduler-list-after-delete.png` | Scheduler list after Delete (cancel) | Planned |
| `14-live-still-404-after-cancel.png` | Cancelled page still not live after its time | Planned |

## Test results (this round)

Earlier crontab results are in `scheduler-test-log-2026-10-19.xlsx`.

| # | Date | Check | Result | Evidence |
|---|---|---|---|---|
| M0 | 22 Oct 2026 | Is DA Schedule Publish enabled? | **No.** Site and org DA config both 404; no Prepare menu in the editor | Config API + user observation |
| M2a | 22 Oct 2026 | Scheduler app: Load schedules for `/araji-adobe/bv-poc-wknd-aln/` | **As documented.** Shows "site not registered" with a Register site button | User observation (screenshot 04) |
| M2b | 22 Oct 2026 | Click Register site | **Pass.** View changes to "Schedule Publish: View scheduled pages and snapshots for a site", reading "No scheduled pages or snapshots found for this site", with a Refresh schedule button. No separate confirmation text noted. | Screenshot 05 |
| M3 | 22 Oct 2026 | Prepare menu appears after reload | **Pass.** The Prepare button is a document icon (no text label) left of the blue Publish button. Menu: **Preflight, Unpublish, Schedule Publish** | Screenshot 06 |
| M4 | 22 Oct 2026 06:14 UTC | Baseline for test page `/us/en/scheduled-publish-test` | **Clean.** DA source 200 containing "SPT-V1"; preview **404**; live 404. Created via the direct edit URL (the New button is only in the folder view, not the editor) | DA source + status API |
| M5 | 22 Oct 2026 06:21 UTC | Schedule Publish for 22 Oct 12:00 PM IST (06:30 UTC) | **Pass.** Reopened dialog shows "Scheduled by araji@adobe.com. Reschedule?" with field "Schedule (Asia/Calcutta)" `10/22/2026 12:00 PM` (MM/DD/YYYY hh:mm AM/PM). The user asked for 12:05; the stored time is 12:00 (picker granularity or entry, unclear) | Screenshot 08/09 |
| M6 | 22 Oct 2026 06:22 UTC | **Auto-preview on scheduling** | **Pass (Tested).** Preview went 404 → **200** at 06:20:58 UTC with SPT-V1 content, without any manual preview. Audit log: `POST preview` 06:20:56 by araji@adobe.com, then `route: scheduled-publish` 06:21:00 by araji@adobe.com | Status API, preview .plain.html, admin log |
| M7 | 22 Oct 2026 06:28 UTC | Post-scheduling edit: the user added a "SPT-V2" line, no preview | DA source = V1 + V2; preview = V1 only | DA source + preview .plain.html |
| M8 | 22 Oct 2026 06:30 UTC | **Scheduled publish executes** | **Pass.** Live 404 → 200 first seen 06:30:11 UTC (12:00:11 IST). Audit log: `POST live` 06:30:08 by **helix@adobe.com** (system), status 200. Live lastModified 06:30:10 | Polling + status API + admin log |
| M9 | 22 Oct 2026 06:30 UTC | **Which content went live?** | **Live = SPT-V1 only.** V2 (edited after scheduling, not previewed) did **not** go live. The scheduler publishes the **current preview** at run time; it does **not** re-preview the editor content. "Content as it exists at the time of the scheduled publish" therefore means the *previewed* content | Live vs DA source comparison |
| M10 | 22 Oct 2026 06:48 UTC | Schedule the already-live page again, for 12:25 IST (06:55 UTC) | **Pass.** Auto-preview again (`POST preview` 06:48:14, then `scheduled-publish` 06:48:18). Preview = V1 + V2; live still V1 only | Admin log, preview/live .plain.html |
| M11 | 22 Oct 2026 06:50 UTC | Reschedule 12:25 → **12:30 IST** (07:00 UTC) via the reopened dialog | `POST preview` 06:50:37, then `scheduled-publish` 06:50:41. **Rescheduling also auto-previews.** (Correction: a 06:51 log query missed the preview entry because of about 1 minute of log ingestion lag, the same as O2 on 19 Oct) | Admin log (re-queried 07:00) |
| M12 | 22 Oct 2026 07:00 UTC | **Reschedule honoured** | **Pass.** At 12:25 IST (old time), live unchanged (V1 only, checked 06:56:32 UTC). At 12:30 IST, `POST live` 07:00:07 by helix@adobe.com; live shows V1 + V2 at 07:00:13 UTC. Scheduler list showed the single entry at 12:30 before the run | Polling, admin log, screenshot 10 |
| M13 | 22 Oct 2026 07:08 UTC | Schedule new page `/us/en/scheduled-cancel-test` for 12:45 IST (07:15 UTC) | **Pass.** Auto-preview 07:08:32 (404 → 200), `scheduled-publish` 07:08:36; live 404 | Admin log + status |
| M14 | 22 Oct 2026 07:10 UTC | **Cancel** via Delete in the scheduler list | **Pass.** No confirmation prompt (as documented); entry gone after Refresh. Audit log: `deleted-scheduled-publish` 07:10:07 by araji@adobe.com. After the 12:45 slot (checked 07:16:39 UTC): live **404**, preview untouched | Status API, aem.live 404, admin log, screenshot 13 |
| Note | 22 Oct 2026 07:04 UTC | Audit log shows a **manual** `preview` + `live` POST on `scheduled-publish-test` at 12:34:55 / 12:34:58 IST by araji@adobe.com (after the 12:30 scheduled run; not part of the tests; does not affect M12) | Info | Admin log |
| M1 | 22 Oct 2026 | Add `prepare` tab to the site config: title=`Schedule Publish` | **Pass.** Site config now 200, sheets `data` + `prepare`, row `{title:"Schedule Publish", path:"", icon:"", ref:""}` | Config API readback |

## Part 1 demo talk track: manual scheduled publishing (no Ema)

> Setup steps live in the official docs. Link to them; don't copy them:
> aem.live/docs/ew/administering/schedule-publish · demo.bbird.live/demo-docs/usecases/how-to-schedule-publish

**One-line summary.** In EDS, publishing is always "copy preview to live". Schedule Publish is a managed
Adobe service that performs that copy at a chosen time, so authors don't have to be online at go-live.

**How it works (what we proved on our site, 22 Oct 2026):**
1. **Opt-in, two parts.** A one-row `prepare` config adds the menu item. A one-click site registration lets
   Adobe's scheduler service run jobs for the site. Without both, nothing is scheduled.
2. **Scheduling previews for you.** A never-previewed page went from no preview to preview at the moment of scheduling.
   Rescheduling previews again. That guarantees something exists to publish.
3. **The run publishes preview, not the editor.** An edit made *after* scheduling, without a fresh preview,
   did **not** go live. Rule for authors: *edit, then preview again before go-live*.
4. **Accurate and attributable.** Jobs ran 7–8 s after the minute. Every step is in the admin audit log:
   who scheduled, who deleted, and the system account (`helix@adobe.com`) that executed the publish.
5. **Time zone = the author's browser** (dialog label "Schedule (Asia/Calcutta)").
6. **Manage:** reschedule by reopening the dialog (old time prefilled). Cancel with Delete in the scheduler
   list, which has **no confirmation prompt**, so be careful in the live demo.

**Compared with the schedule sheet (crontab) used on 19 Oct with Ema:**

| | Editor Schedule Publish | Crontab sheet |
|---|---|---|
| Who uses it | Authors, in the editor UI | Admins / automation (Ema) |
| Previews automatically | Yes (tested) | No; publishes the existing preview |
| Unpublish on a schedule | Not offered in the dialog | Yes (tested 19 Oct) |
| Bulk | One page per dialog | Many commands in one row (tested) |
| Granularity | Minute (ran at :00:07) | 5-minute ticks, UTC |
| Audit trail | Explicit `scheduled-publish` entries | Only downstream indexer/sitemap entries |
| Central list | da.live/apps/scheduler | The sheet itself |

**Evidence status:** Tested M0–M14 (this file). Open Unknowns: snapshot scheduling, scheduled unpublish via
the plugin, title case-sensitivity, unregistering a site.

## Phase 3: Ema-assisted scheduled publishing (reviewed 22 Oct 2026, not re-run)

**Sources and their status**

| Source | Status |
|---|---|
| `scheduler-test-log-2026-10-19.xlsx` (7 tabs, committed in b852d25, merged PR #1) | **Verified historical record**, written by Ema during the run |
| Admin audit log 19 Oct 10:00–11:20 UTC (17 entries), re-queried 22 Oct | **Independently verified.** It matches the workbook |
| Page status API, 22 Oct | **Independently verified.** Live timestamps match the workbook |
| `/.helix/crontab` sheet in DA (5 rows still present) | **Independently verified** |
| 19 Oct chat transcript (session eeaea77f) | **Not retained.** Only startup files remain, so the exact prompts typed to Ema are unavailable |
| 19 Oct screenshots | **None found** in the repo or session files |

**What Ema did (from the workbook, confirmed by the audit log)**
- Read-only discovery: listed 28 DA docs and took a status snapshot (17 unpublished), and found the mechanism to be the **crontab sheet `/.helix/crontab`** (UTC, 5-minute ticks, activated by previewing the sheet). The editor Schedule Publish plugin was **not** used and the site was not registered at that time.
- Proposed a timed test plan; the user approved each step (approval gates are logged).
- Wrote the crontab via the DA source API and activated it via `POST preview /.helix/crontab.json`: 5 versions, audit log 10:16:07–10:25:37 UTC, all 200.
- Never called publish directly (standing rule L6); all go-lives came from the scheduler.
- Polled status and the audit log every ~20 s in-session to verify each run.

**Results (verified twice, workbook + audit log/status on 22 Oct)**

| Test | Page(s) | Schedule (IST) | Outcome |
|---|---|---|---|
| T1 publish | adventures/beervana-portland | 16:00 | Live 16:00:04, still live |
| T2 cancel (row removed) | adventures/napa-wine-tasting | 16:10 → cancelled | Never published, still 404 |
| T3 reschedule | adventures/tahoe-skiing | 16:10 → 16:20 | Live 16:20:04 only |
| T4 bulk (one multi-command cell) | 4 × magazine/* | 16:25 | All 4 live 16:25:04–:06 |
| T5 publish + unpublish | magazine/arctic-surfing | 16:25 / 16:40 | Live 16:25:04; index "content: deleted" 16:40:14 IST; now 404 |

**Observations / limitations (from the workbook):** runs are not attributed in the audit log (only indexer/sitemap
side effects, O1); the log lags about 1 min (O2, also seen 22 Oct); there's no API to list queued crontab jobs (L3); activation gives
no syntax feedback (L7); Ema cannot monitor unattended between chat turns (L4); one shared sheet means one syntax
error disables all jobs (L5); Ema trimmed some poll output once (E1). Additional finding 22 Oct: Ema's DA/admin
actions are logged as **araji@adobe.com**, so the audit log can't tell Ema from the human user.

**Ema vs manual (editor Schedule Publish)**

| | Manual (Phase 2) | Ema (Phase 3) |
|---|---|---|
| Mechanism | Editor plugin + Adobe scheduler service | Crontab sheet, written and activated by Ema |
| Setup | prepare row + site registration | None in UI; Ema found and created the sheet |
| Bulk | One page per dialog | Many pages in one instruction |
| Scheduled unpublish | Not offered | Yes (T5) |
| Auto-preview | Yes | No; publishes the existing preview |
| Verification | Human checks | Ema polled status + audit log and wrote the evidence workbook |
| Governance | Author clicks | Ema proposes, human approves each change |

**Gaps:** the exact Ema prompt text and screenshots from 19 Oct (optional; the user can supply them from memory, and they will be labelled as such).

**Phase 3 status: COMPLETE.** Evidence is sufficient; not re-run.

## Phase 4 prep notes (22 Oct 2026)
- Images on live pages are served from this site's **media bus** as content-hashed files
  (`./media_<hash>.jpg?width=…`), e.g. beervana-portland has 4 and san-diego-surf 6 images.
- In the DA source, those images still point at the **old site** `main--edscapstoneajay--ajayajju2412.aem.live/media_*`.
  Preview copies them into this site's media bus. Risk to note: the source documents depend on another site's URLs.
- No AEM Assets / Dynamic Media URLs found on these pages yet. Testing AEM Assets references needs a page that uses them.

## Phase 6: Experience Workspace / Coworker replication (prepared 22 Oct 2026)
- User decisions: replicate all five tasks (W1–W5 = T1–T5) on 8 unpublished adventure pages (user approved that 7 will go live).
- Superprompt and page mapping: `phase6-workspace-superprompt.md`. Times are relative (S = first 5-min mark ≥ 20 min after approval).
- Caveat for the comparison: the superprompt includes a "Reference" section naming both working mechanisms. Ema discovered the mechanism itself on 19 Oct.
- Ema baseline for the comparison (from the 19 Oct workbook): 20 recorded user entries (plan approval, page selections, per-task approvals, verification waits) and 24 Ema entries in the workbook activity log (recounted 22 Oct; an earlier "~18" was a partial count);
  workbook "actual window" 15:32 → 16:46 IST ≈ 74 min (time is dominated by the schedule); 0 manual UI steps; 1 tool retry (DA upload), 1 output-trim error (E1);
  5/5 tasks verified by Ema with status + audit log evidence.
- Status: superprompt delivered, waiting for the user's Workspace results.

## Phase 4: Scheduled publishing with referenced resources (started 22 Oct 2026)

### Step 1: how fragments and assets are integrated (repo + config inspection)
| Item | Finding | Status |
|---|---|---|
| EDS **document fragments** | `blocks/fragment/fragment.js` fetches `<path>.plain.html` **in the browser at view time** (and rebases `./media_*` images to the fragment's path). `scripts/scripts.js` also auto-loads any link containing `/fragments/` | Tested (code inspection) |
| **AEM Content Fragments** (structured CFs from AEM author, GraphQL / OpenAPI) | **No integration**: no block, no GraphQL / delivery API call, no CF config anywhere in the repo | Tested (code inspection) |
| **AEM Assets** in Document Authoring | **Not configured**: DA site config has only `data` (empty) + `prepare`; no `aem.repositoryId` / assets keys | Tested (config read) |
| Images on pages today | DA documents with images; preview copies them into the site **media bus** (`media_<hash>`) | Tested (Phase 4 prep) |

### Scope decisions (user, 22 Oct)
- Scenario A = **EDS document fragment only** (AEM Content Fragments are not part of this test; no CF integration exists).
- AEM Assets: the user has access but doesn't know the author URL. AEM Assets image test deferred to Scenario B (needs URL + DA connection).

### Scenario A plan: EDS fragment + scheduled page
| Item | Value |
|---|---|
| Fragment | `/us/en/fragments/sched-frag-test`, text "FRAG-V1", **never previewed** before the test |
| Page | `/us/en/sched-frag-page`, text "PAGE-A1" + link to the fragment (auto-blocked by `scripts.js` because the URL contains `/fragments/`) |
| Expected (hypothesis, to test) | Scheduling auto-previews the **page only**; the fragment stays unpreviewed and unpublished; the live page loads but the fragment area is empty; the fragment needs its own preview + publish |
| Checks | Fragment preview/live status before, after scheduling, and after the run; live page rendering; browser fetch of the fragment (404 or 200) |
| A1 | 22 Oct 13:41 UTC | Fragment created with "FRAG-V1", no preview | **Baseline OK.** DA source has FRAG-V1; preview 404; live 404 | DA source + status API · 📸 A1 |
| A2 | 22 Oct 13:46 UTC | Page created with "PAGE-A1" + link to `/us/en/fragments/sched-frag-test` | **Baseline OK.** Link stored; page and fragment both preview 404 / live 404 | DA source + status API · 📸 A2 |
| A3 | 22 Oct ~13:47 UTC | Manual **Preview of the page only** | **Page previewed; fragment NOT previewed** (fragment preview still 404). Preview page shows "PAGE-A1" plus the **raw fragment URL as a visible blue link**: `scripts.js` tries to fetch `/us/en/fragments/sched-frag-test.plain.html`, gets 404, and leaves the link in place (error caught silently). So previewing a page does not detect or preview its fragment dependency, and the failure shows as a raw link, not an empty space | 📸 A3 + status API + code `scripts.js` buildAutoBlocks |
| A4 | 22 Oct 14:00 UTC | Schedule the **page** for 7:36 PM IST (14:06 UTC) | Page auto-previewed again (`POST preview` 14:00:44, `scheduled-publish` 14:00:49). **Fragment NOT previewed** (still 404), and no log entry for it | Status API + admin log · 📸 A4 |
| A5 | 22 Oct 14:06 UTC | **Scheduled run: page live; is the fragment live?** | **Page published** 14:06:04 UTC by helix@adobe.com. **Fragment NOT published** (preview 404, live 404). The live page in a real browser shows "PAGE-A1" plus the raw fragment URL as a visible link; console shows `404 …/fragments/sched-frag-test.plain.html` and "Fragment loading failed". On live, the link href was rewritten to relative `/us/en/fragments/sched-frag-test`, so clicking it gives a 404 page | Status API, aem.live 404, headless browser DOM + console · 📸 A5 |
| A5-ui | 22 Oct 14:30 UTC | User's live screenshot | On live the broken fragment link is shown as a **yellow call-to-action button** (preview showed a plain blue link). Cause: `scripts.js` decorateButtons skips links whose text equals their URL; on live the href becomes aem.live while the text says aem.page, so they differ and it is buttonized. The broken reference is *more* visible on live than in preview | 📸 A5 + `scripts/scripts.js:110-131` |
| A7 | 22 Oct 14:40 UTC | Schedule the **fragment alone** for 8:16 PM IST (14:46 UTC) | Fragment auto-previewed 14:40:21. Immediately afterwards the **preview** page showed FRAG-V1 while the **live** page was still broken (preview ≠ live) | Status API + headless browser |
| A8 | 22 Oct 14:46 UTC | **Fragment's scheduled run** | Fragment live 14:46:12 by helix@adobe.com. **Page was NOT republished** (live lastModified still 14:06:04), yet the live page now renders "PAGE-A1 + FRAG-V1", because fragments are fetched by the browser at view time | Status API + headless browser DOM |
| A9 | 22 Oct 14:46 UTC | **Browser caching of the earlier 404** | A browser that had already loaded the broken page **kept showing the broken link** after the fragment went live: the 404 for `…/sched-frag-test.plain.html` is served with `cache-control: max-age=7200` (2 h). A forced re-fetch returned 200 and fixed it. The CDN itself served 200 right away (x-cache MISS→HIT) | curl headers on the 404 + 200; browser fetch `cache:'reload'` |

### Scenario A conclusions (EDS document fragment)
| Question | Answer | Status |
|---|---|---|
| Does previewing a page preview its fragment? | **No** | Tested (A3) |
| Does scheduling a page preview or publish its fragment? | **No.** Only the page is auto-previewed and published | Tested (A4, A5) |
| Are dependencies detected / is there a warning? | **No** detection, no warning in the dialog or the log | Tested (A4) |
| Does the fragment need separate publication? | **Yes**, its own preview + publish (or its own schedule) | Tested (A7, A8) |
| What if the page publishes first? | Visitors see the **raw fragment URL as a yellow CTA button** linking to a 404 | Tested (A5, A5-ui) |
| Does the page need republishing after the fragment goes live? | **No.** The page picks up the fragment automatically (runtime fetch) | Tested (A8) |
| Is there a lag? | Returning visitors may see the broken version **for up to 2 h** (browser-cached 404) | Tested (A9) |
| Practical rule | **Publish or schedule fragments before (or at the same time as) the pages that use them** | Conclusion |
| A10 | 22 Oct ~14:55 UTC | User: live page in normal + incognito windows | **Both show FRAG-V1.** The user's normal browser had already refreshed its copy, so the 2-hour cache effect (A9) is possible but not guaranteed | User observation · 📸 A10a/A10b |

### Scenario B plan: image added in the editor (DA-native asset)
| Item | Value |
|---|---|
| Page | `/us/en/sched-asset-page`, text "ASSET-B1" + a **new** image dragged in from the user's computer, never previewed |
| Questions | Where is the image stored before preview? Does scheduling carry it? Is it reachable on the live domain *before* the page publishes? After the page is unpublished, does the image URL still work? |
| Expected (hypothesis) | The image is embedded in the page, so it is copied into the media bus on preview and goes live with the page; the media URL may stay reachable after unpublish (content-addressed) |
| B1 | 22 Oct 15:17 UTC | Page with "ASSET-B1" + new image, no preview | Image stored **beside the document** in a hidden folder `/us/en/.sched-asset-page/` as **`rick copy.png`** (user reported "beach.jpg", a mismatch to clarify). The image URL on content.da.live returns **401** without login, so it is private before preview. Page preview 404 / live 404 | DA source + list API + unauthenticated curl · 📸 B1 |
| B2 | 22 Oct 15:20 UTC | Schedule the page for 8:56 PM IST (15:26 UTC), **no manual preview** | Auto-preview 15:20:48 copied the image into the media bus as `media_171704bfe62ecbfe053083487fe19f22094048810.png` (652 KB). Preview HTML references `./media_…png` | Status API + preview .plain.html |
| B3 | 22 Oct 15:22 UTC | **Is the image reachable on the LIVE domain before the page publishes?** | **YES.** `…aem.live/us/en/media_1717…png` and `…aem.live/media_1717…png` both return **200 image/png** while the page itself is live **404**. The media bus is shared by preview and live; anyone with the (unguessable, hash-based) URL can load an image as soon as it is previewed. Embargo risk for sensitive images | curl on aem.live |
| B4 | 22 Oct 15:26 UTC | **Scheduled run: page + image** | Page live 15:26:12 by helix@adobe.com. The live page renders "ASSET-B1" **with the image loaded** (`…aem.live/us/en/media_1717…png`, naturalWidth 2000). No separate image publish needed; the image was already reachable on live since the preview (B3) | Status API + headless browser |
| B5 | 22 Oct 15:30 UTC | **Unpublish the page** (Prepare → Unpublish, immediate) | The editor's Unpublish removed **both live and preview** (`DELETE preview` 15:30:30 + `DELETE live` 15:30:32 by araji@adobe.com, 204). Page now 404 on both. **The image is still served** with 200 on aem.live and aem.page (full original 5.2 MB) and is even reachable under **any path** (e.g. /us/en/adventures/media_1717…png) | Status API, admin log, curl |

### Scenario B conclusions (image added in the editor)
| Question | Answer | Status |
|---|---|---|
| Where is a new image before preview? | Beside the document in DA, in a hidden dot-folder named after the page; private (401) | Tested (B1) |
| Does scheduling carry the image? | **Yes.** The auto-preview copies it into the media bus; it goes live with the page; no separate publish | Tested (B2, B4) |
| Reachable before the page publishes? | **Yes**, on the live domain as soon as previewed (hash URL) | Tested (B3) |
| What happens to the image when the page is unpublished? | **Nothing.** It stays reachable by direct URL on preview and live; only the page disappears | Tested (B5) |
| Can the image be removed from the media bus? | No UI option observed | Unknown |
| Editor "Unpublish" also deletes the **preview** | Yes (preview + live DELETE) | Tested (B5) |

### Scenario C (multiple dependencies): answered from A + B + docs; no separate test (user decision, 22 Oct)
| Question | Answer | Status |
|---|---|---|
| Are dependencies detected automatically? | **No.** Neither preview nor scheduling detected the fragment; images only "come along" because they are inside the page | Tested (A3, A4, B2) |
| Is separate publishing required? | Fragments: **yes**. Images inside the page: **no**. Widgets: go live with **code** (merge to main). External embeds (YouTube etc.): controlled by the **third party** | Fragment/image tested; widget/external explained from code inspection, not tested |
| Is a bundle / equivalent available? | **Snapshots**: "a set of pages (and other resources) that are captured at a particular point in time", published as a unit after review (aem.live/docs/snapshots-reviews). The scheduler app lists "scheduled pages **and snapshots**" | Documented; scheduling a snapshot is **Unknown** (not tested; the docs page doesn't mention scheduling) |
| What if the page publishes before its dependencies? | Fragment: raw URL shown as a yellow CTA linking to a 404, fixed automatically once the fragment is live (returning visitors may keep the broken version up to 2 h). Images: can't happen, they are published with the page | Tested (A5, A8, A9) |
| Project capability notes | No Embed block in the project; widget mechanism exists (`/widgets/` links) but no widgets are deployed | Code inspection |

**Phase 4 status: COMPLETE** (A + B tested, C answered). Optional extras not done: the AEM Assets image test (needs the author URL + DA connection) and the snapshot scheduling test.

## Phase 5: Asset expiry and scheduled unpublishing (started 22 Oct 2026)

### Research (documentation)
| Source | Finding | Status |
|---|---|---|
| aem.live/docs/media | Images and MP4s go to the **media bus**: content-addressed, "immutable (cache-optimized)". There is no mention of delete, unpublish or expiry. **PDF and SVG** are "delivered as part of the content… following the regular preview and publish lifecycle" | Documented |
| aem.live/docs/scheduling | Crontab commands: preview, publish, http, publish-index, **publish-snapshot**, process, **unpublish**. Time-based only; **no metadata- or expiry-driven unpublishing** | Documented |
| Experience League: Manage digital assets (AEM Assets) | AEM Assets has **Off Time** (scheduled deactivation): "after the Off Time is reached, the asset and its renditions are no longer available… because the deactivation automatically withdraws them from delivery". Also Manage Publication → Unpublish **Later**. Expired assets can be excluded from browsing/search in Desktop / Asset Link (configuration) | Documented |
| Experience League: Dynamic Media with OpenAPI | "Only brand-approved assets are exposed"; the overview page does not document expiry behaviour of delivery URLs | Unknown |
| This project | No AEM Assets connection in DA config; pages use DA / media-bus images only | Tested (Phase 4 step 1) |
| Earlier result | Media-bus image still served after its page was unpublished; no UI to remove it | Tested (B5) |

### Phase 5 tests
| # | Time | Action | Result | Evidence |
|---|---|---|---|---|
| X1 | 22 Oct 16:55 UTC | Ema generated `expiry-test.pdf` (1 page, text "EXPIRY-PDF-V1" + "Created by ALAN RAJI MANI"; replaced at the user's request 22 Oct, re-upload 200) and uploaded it to DA `/us/en/expiry-test.pdf` (user's typed approval) | **201 Created**; readback 200 application/pdf. Preview 404, live 404 | DA source API |
| X2a | 22 Oct 16:58 UTC | Ema uploaded page `/us/en/expiry-test-page` ("EXPIRY-PAGE-V1" + link to the PDF inside a sentence, so it stays a link) | **201 Created**. Preview 404, live 404 | DA source API |
| X-note | 22 Oct | Ema's preview calls were **blocked by the platform's change-approval guard** (uploads were allowed). The user will preview from the editor UI, which also tests whether a PDF has Preview/Prepare buttons | Guard message |
| X1b | 22 Oct ~17:10 UTC | User opened the PDF in DA | Opens in a **media viewer** (`da.live/media#/…/expiry-test.pdf`) showing the new text. Toolbar has **Prepare icon + Preview + Publish** buttons. **My prediction (no Prepare menu for PDFs) was WRONG**: PDFs do get preview/publish controls in the editor | User screenshot 📸 X1 |
| X1c | 22 Oct 17:07 UTC | User clicked **Preview** on the PDF; opened the Prepare menu | **Pass.** PDF preview 200 at 17:07:49 UTC; preview file is byte-identical to the uploaded PDF ("Created by ALAN RAJI MANI"). Live 404. Prepare menu shows **Schedule Publish** for the PDF; no schedule-unpublish or expiry option reported | Status API, cmp of the downloaded file, user observation 📸 X1c |

### Phase 5 run plan (IST)
| Time | Action | Mechanism | Who |
|---|---|---|---|
| 10:55 PM | Publish `expiry-test-page` | Editor Schedule Publish | User |
| 11:00 PM | Publish `expiry-test.pdf` | Editor Schedule Publish (tests that it works for PDFs) | User |
| 11:15 PM (17:45 UTC) | **Unpublish** `expiry-test.pdf` = its expiry date from the register | Crontab row, written from the expiry register | Ema (needs typed approval) |

### Phase 5 conclusions (closed early at the user's request, 22 Oct ~17:20 UTC; X2–X4 not run)
| Question | Answer | Status |
|---|---|---|
| Is there asset expiry metadata in EDS / DA? | **No.** Images and PDFs in DA have no metadata or expiry fields | Documented + inspected |
| Can EDS images be unpublished (scheduled or not)? | **No.** Media bus is immutable; the image stays reachable after its page is unpublished | Tested (B5) |
| Can PDFs/SVGs be published / unpublished? | **Yes.** Own lifecycle; the PDF has Preview / Publish / Prepare in the DA media viewer | Tested (X1b, X1c) |
| Editor scheduling for PDFs | **Schedule Publish only**; no scheduled unpublish, no expiry option | Tested (X1c) |
| Scheduled unpublish in EDS at all? | **Yes, time-based**, via the crontab `unpublish` command (proved for a page on 19 Oct, T5) | Documented + Tested (page). For a PDF: **not tested** |
| Unpublish **based on metadata**? | **Not native in EDS.** It needs automation that reads an expiry date (register sheet or AEM metadata) and writes crontab rows or calls the admin unpublish API, e.g. Ema with human approval, or a scheduled script / GitHub Action | Documented (no such feature) |
| AEM Assets native option | **Off Time** / Unpublish Later withdraws an AEM asset from delivery. Only relevant for assets **delivered from AEM** (this site has no AEM Assets connection) | Documented; **not tested** |
| Page referencing an unpublished PDF | Expected: the link leads to 404 (same pattern as the fragment, A5) | **Inferred, not tested** |
| Ema capability | Can write crontab unpublish rows (19 Oct). In this session, DA/admin writes were **blocked unless the user typed an explicit request**; preview calls were blocked even after that, a governance safeguard | Tested |
| Experience Workspace | Pending the Phase 6 results | Unknown |
| Metadata vs status vs availability | Expiry metadata = a label (no effect by itself); publication status = what the system records; availability = whether the URL still loads (can differ: B5) | Concept + B5 evidence |

Sandbox left behind: `/us/en/expiry-test.pdf` (previewed, not live) and `/us/en/expiry-test-page` (in DA, not previewed). No schedules created in Phase 5.

## Phase 7 (unified deck + speaker script), started 22 Oct 2026
- Template: EDS_usecase.pptx was attached twice; both times the chat delivered only a **text extract** (1,160 B, identical). Usable: 5-slide structure, title fields, footer "© 2026 Adobe. All Rights Reserved. Adobe Confidential." + slide numbers, Adobe wordmark (3840×928 PNG). **Not available:** theme colours, fonts, layouts. Decision (user): use the template structure/footer + **Adobe defaults** (white, Adobe red #EB1000, wordmark).
- Evidence images saved to `testing/scheduler/evidence/` (8 screenshots + logo).
- Tooling: an editable .pptx with speaker notes is feasible (npm registry reachable; the library is not yet installed).

## Phase 6 results: Experience Workspace / Coworker (user screenshots W-01…W-04 + audit log, verified 22 Oct)
| # | Observation | Evidence | Status |
|---|---|---|---|
| W1 | Step 1 "pre-check" called `content_preview` ×8: **it actually re-previewed all 8 pages, twice** (POST preview 12:33:49–59 and 12:37:37–39 UTC = 18:03 / 18:07 IST, as araji@adobe.com). The prompt said "no changes yet". Preview only; nothing went live | Audit log + status API | Tested |
| W2 | `content_read` of the crontab: **Bad Request** ×3, then succeeded after the user asked; it listed all 5 existing rows correctly and promised append-only | W-01, W-02 | Tested |
| W3 | Could not compute S: "I don't have a real-time clock"; asked the user for the current IST time | W-02, W-03 | Tested |
| W4 | User asked "publish the current page in next 5 mins": "**I cannot schedule a publish action**" (reason: no clock). It offered 3 alternatives. Option 2 ("find the page in da.live/apps/scheduler, click Schedule Publish") **contradicts the docs and our test**: the scheduler app only lists/opens/deletes; scheduling happens in the editor | W-03 vs aem.live doc + M2b | Tested |
| W5 | User asked "publish this page at 6:45 pm IST": content_read **Bad Request** ×3; it then said it **cannot read or write** the crontab ("DA sheets require the sheet editor UI"), contradicting W2 (it had read it) and 19 Oct (Ema wrote it via the DA source API) | W-04 | Tested |
| W6 | Its manual fallback row had a **wrong date**: "at 1:15 pm on the 14th day of July in 2025" (past date, so it would never run). Conversion 6:45 PM IST = 1:15 PM UTC was correct. It also said opening `…aem.page/.helix/crontab.json` in a browser activates the schedule; activation actually requires a **Preview** action (19 Oct: POST preview) | W-04 | Tested |
| W7 | Outcome: **no schedule created by Coworker, no page published**. 8 pages still live 404. Crontab **preview unchanged** (19 Oct), so nothing activated | Status API, crontab status | Tested |
| W8 | Crontab **row 6 now exists in DA**: when = "at 6:47 pm on the 22nd day of October in 2026", **command empty**, **not previewed / inactive**. Origin to be confirmed with the user | DA source | Tested (origin unknown) |
| Side | Registering the site in the scheduler app (M2b, ~05:38 UTC) created an **admin API key** (`config POST …/apiKeys.json` by araji@adobe.com) | Audit log | Tested |

Characterisation: **unsuccessful in our environment, with tool limitations reported by Coworker itself** (no clock access, crontab read/write errors). Not shown to be unsupported in general.
| W8-resolved | Row 6 was **added manually by the user** while trying Coworker's manual fallback; left incomplete (no command, never previewed, so inactive) | User confirmation | — |
| W-meta | The Workspace prompt **kept the REFERENCE section** (Coworker had hints Ema didn't need). The test was complete after 4 user messages: superprompt, "can you access this cron tab", "publish the current page in next 5 mins", "publish this page at 6:45 pm IST". The user never replied "approved" or gave the time in the requested form | User confirmation + W-01…W-04 | — |

### Sitemap / index evidence for 7A (checked 22 Oct 17:50 UTC)
| Observation | Status |
|---|---|
| Pages published by the 19 Oct scheduler (beervana, tahoe, 4 magazine pages) **are in /sitemap.xml and /query-index.json** | Tested |
| arctic-surfing (scheduled publish then scheduled unpublish, T5) is **not** in the sitemap/index; the 19 Oct log shows indexer "content: deleted" 16:40:14 IST | Tested |
| Test pages directly under /us/en/ (sched-*, scheduled-*, expiry-*) are never indexed: the index config only includes /us/en/adventures/** and /us/en/magazine/** (by design) | Config inspection |
| ⚠️ The sitemap `origin` in helix-sitemap.yaml is still the **old site** (`main--edscapstoneajay--ajayajju2412.aem.live`), so every sitemap URL points at the old host | Tested (config + live sitemap) |
| W-user | User's summary: "it doesn't support scheduling because it has no clock". Deck wording agreed: in our test Coworker could not create the schedule. It reported (1) no time access and (2) crontab read/write errors that blocked it even with an exact time (W5); it also suggested a past date and an incorrect activation step (W6). Do not claim it is unsupported in general | Agreed framing |
- Screenshots: the user captured only what is in `evidence/`; use results tables for the rest (22 Oct).
- Duration: **15 minutes** including Q&A → about 14–16 main slides + an appendix holding the reusable knowledge-artifact detail (22 Oct).
- Demo mode: **slides + live opening of the key pages/screens per section** (show the real page or functionality in the browser; no live scheduling). Each slide gets a 'Live link' and the script says when to click (22 Oct).
- Title slide: keep the template line 'Prepared for: VP, Global Delivery Center'. Presenter: ALAN RAJI MANI, araji@adobe.com (22 Oct).
- Deck built 22 Oct 18:15 UTC: `Scheduled-Publishing-EDS.pptx`: 25 slides (16 main + 9 appendix), speaker notes on all 25, footer on every slide, 11 real screenshots, 10 labelled "SCREENSHOT NEEDED" placeholders (slides 4, 6, 7, 12, 14). Font Arial (Adobe Clean not assumed available). No visual render check was possible here (no PowerPoint/LibreOffice); the user reviews slide by slide.
- 22 Oct: the user supplied 03, 14, E1, B5a, B5b, X1c (saved to evidence/). Deck rebuilt; only slide 6 still has placeholders (10, 11, 13).
- Correction X1c: the PDF Prepare menu shows **Preflight, Unpublish (immediate), Schedule Publish** (screenshot X1c); still no *scheduled* unpublish.
- The crontab is back to **5 rows**: the user removed their incomplete row 6 (DA source check, 22 Oct).
- 22 Oct: the user supplied 10, 11, 13, 04, 11b, A10b. Deck rebuilt: **26 slides** (17 main + 9 appendix). New slide 7 "Verified: queue, reschedule and cancel" (10, 13, 14); slide 6 = key-insight pair (11b vs 11); slide 4 = 2×2 setup grid (M0, 03, 04, M2b); slide 14 adds A10b. **No placeholders remain.** Q&A time reduced to 1:15 to keep 15 min.
- New observations from screenshot 10: the scheduler queue shows Type, Item, "Publishes on" (with time zone + countdown), Requested by, Open/Delete. Screenshot 04 text: "araji-adobe/bv-poc-wknd-aln is not registered for scheduling. Register this site to enable scheduler actions."
- 22 Oct review round 1: the user asked to remove the "Prepared for" line from slide 1 (overrides the earlier decision; the name and email stay). Screenshot captions unified to **"Figure 1–21: description"** in slide order; new appendix **A10 Figure index** (figure → slide → description → test ID). Image alt text now uses the figure description (no server paths). Deck = **27 slides** (17 main + 10 appendix). Build script saved as `deck-build.js` so the deck can be rebuilt.
- 22 Oct: the user still saw 'Prepared for' because their viewer showed a cached copy (the old one-line name layout). The deck is now saved as **Scheduled-Publishing-EDS-v2.pptx** and the old file is removed.
- 22 Oct: per the user, test codes (M0, T1, W1, A3, B5, X1c, L5…) were removed from all slide text and speaker notes and replaced with plain wording or figure references. Ema tasks are shown as '1 · Publish' to '5 · Publish + unpublish'; appendix logs use step numbers; the figure index uses 'Log · step' (e.g. A2 · 6). Saved as **Scheduled-Publishing-EDS-v3.pptx** (v2 removed). The progress log keeps the original IDs for traceability.
- 22 Oct: per the user, the 'Open items' line was removed from slide 16 (Conclusion) and from its notes; open items remain in appendix A9. Saved as **Scheduled-Publishing-EDS-v4.pptx**.
- 22 Oct: per the user, 'Coworker' (an internal nickname, not a product name) was replaced with 'Experience Workspace' everywhere in the deck: slides, notes and file properties (24 mentions). Saved as **Scheduled-Publishing-EDS-v5.pptx**.
