# Phase 6: Experience Workspace / Coworker replication of the Ema scheduled-publishing test

Prepared 22 Oct 2026. Mirrors Ema tasks T1–T5 (19 Oct) as W1–W5 on 8 different, equivalent pages
(previewed 16 Oct, never published; checked 22 Oct). Original Ema pages and crontab rows must stay untouched.

| Ema task | Workspace task | Page(s) under /us/en/adventures/ | Relative time |
|---|---|---|---|
| T1 publish | W1 | climbing-new-zealand | S |
| T2 schedule + cancel | W2 | downhill-skiing-wyoming | S+10 → cancelled |
| T3 reschedule | W3 | gastronomic-marais-tour | S+10 → S+20 |
| T4 bulk (4 pages) | W4 | riverside-camping-australia, ski-touring-mont-blanc, surf-camp-costa-rica, west-coast-cycling | S+25 |
| T5 publish + unpublish | W5 | whistler-mountain-biking | S+25 / S+40 |

Spare (unused): yosemite-backpacking.

## Superprompt (copy everything between the lines)

---
You are helping me run a controlled scheduled-publishing test on an AEM Edge Delivery Services site. I need you to ACTUALLY PERFORM the scheduling actions, not just explain how they could be done. If you cannot perform an action, say so clearly (see "If you can't do something").

SITE
- Org: araji-adobe · Site: bv-poc-wknd-aln · Branch: main · Content source: Document Authoring (da.live)
- Preview: https://main--bv-poc-wknd-aln--araji-adobe.aem.page
- Live: https://main--bv-poc-wknd-aln--araji-adobe.aem.live
- My time zone: IST (Asia/Kolkata, UTC+05:30). Always show times in IST AND UTC.

PAGES (all currently previewed but NOT live, which is the required starting state)
- W1: /us/en/adventures/climbing-new-zealand
- W2: /us/en/adventures/downhill-skiing-wyoming
- W3: /us/en/adventures/gastronomic-marais-tour
- W4 (bulk): /us/en/adventures/riverside-camping-australia, /us/en/adventures/ski-touring-mont-blanc, /us/en/adventures/surf-camp-costa-rica, /us/en/adventures/west-coast-cycling
- W5: /us/en/adventures/whistler-mountain-biking

TIMING
Let S = the first 5-minute boundary (:00, :05, :10 …) that is at least 20 minutes after you receive my approval.
- W1: schedule PUBLISH at S.
- W2: schedule PUBLISH at S+10, then CANCEL it (before S+10) so it never publishes.
- W3: schedule PUBLISH at S+10, then RESCHEDULE it to S+20 (before S+10).
- W4: schedule PUBLISH of all 4 pages together, at S+25, in as few actions as possible.
- W5: schedule PUBLISH at S+25 AND UNPUBLISH at S+40.

STEP 1: PRE-CHECK AND PLAN (no changes yet)
1. Confirm for each of the 8 pages: preview exists, live does NOT exist. If any page is already live, stop and tell me.
2. Tell me which scheduling mechanism(s) you will use, and whether you can do each of W1–W5 with it.
3. Show the plan as a table: task, page(s), action, time in IST and UTC.
4. Wait for me to reply "approved" before changing anything.

STEP 2: EXECUTE (after "approved")
Create all schedules, then do the W2 cancellation and W3 reschedule. After each action, report: what you did, the exact tool/API/UI action used, and the success response or error.

STEP 3: CONFIRM THE SCHEDULES EXIST
Show evidence that each schedule is really saved (for example the scheduled-items list, the stored entry, or an audit/log entry). Clearly label each item "SCHEDULED (evidence: …)" or "NOT CONFIRMED".

STEP 4: VERIFY EXECUTION
At or after each scheduled time, check each page's live status (live URL returns the page or 404, and the live last-modified time) and any audit-log entries. Expected outcome:
- W1, W3, W4 (all 4), W5: live at their times (W3 at S+20, NOT at S+10)
- W2: never live
- W5: removed from live at S+40
If you cannot wait or check automatically, tell me exactly when and what to check, and resume when I come back.

STEP 5: FINAL REPORT
Give a table: task · page · planned time (IST/UTC) · action · executed? (Yes / No / Not verified) · evidence (timestamp, status, log entry) · notes. Then list: the mechanism used, every error or retry, every manual step I had to do, and any limitations you hit.

STRICT RULES
- NEVER publish or unpublish any page directly or immediately (no Publish/Unpublish button, no direct live/publish API call). Every go-live and removal must come from a scheduled action.
- Do NOT touch any other page, and do not edit page content or the site configuration.
- If there is an existing schedule sheet/crontab (/.helix/crontab), do NOT delete or change its existing rows. Only add new rows. Those rows belong to an earlier test.
- Do NOT claim something was scheduled or executed without evidence. Say "not verified" instead.
- Ask me before doing anything not described here.

IF YOU CAN'T DO SOMETHING
For any task you cannot execute, state: (a) what you tried, (b) the exact error or reason, (c) whether it's a permission, product or tool limitation, and (d) the closest supported alternative (for example, the editor's Prepare → Schedule Publish dialog, or the scheduler app at https://da.live/apps/scheduler), with the exact steps I'd take.

REFERENCE (for you, if useful)
On this site, both of these have worked before:
(a) The Document Authoring "Schedule Publish" plugin (enabled in the site config `prepare` tab; the site is registered at https://da.live/apps/scheduler). It auto-previews on scheduling; it offered no unpublish option.
(b) The admin schedule sheet at /.helix/crontab (columns `when`, `command`; UTC; 5-minute ticks; activated by previewing /.helix/crontab.json). Example row: when = "at 10:30 am on the 19th day of October in 2026", command = "publish /us/en/adventures/beervana-portland". Multiple commands in one cell are separated by line breaks; "unpublish /path" is supported.
Docs: https://www.aem.live/docs/ew/administering/schedule-publish
---
