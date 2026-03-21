# A-Series Visual Version Registry

---

## V5 — Stable Baseline (current)
**Deployed:** 2026-03-20
**Pages:** A4, A6
**Commit range:** `dc537a7` → `05be13d`

### What's in V5
- A4: runtime fetch live.json from raw GitHub (no stale build data)
- A4: setTransform(2,0,0,2,0,0) — fixed scale accumulation on resize
- A4: activity floor 0.5 — motion always visible on load
- A4: timestamp displays full `timestamp_edt` without truncation
- A4: no agent particles
- A6: agent dashboard, nav matches A4
- A5: demoted to Lab (hidden from nav)

### Rollback target
`dc537a7` — Canon: setTransform fix + visual debug toolkit

### Known state
- Motion: stable, visible from load
- Data: hourly live refresh at :29
- Timestamp: correct format, V5 label shown
- Freeze after resize: fixed

---

## V5 — LOCKED
**Tag:** `v5-locked` (commit `e5fc744`)
**Status:** Frozen. Do not modify.
**Purpose:** Safe visual anchor. Revert target if V6 regresses.

---

## V6 — Visual Refinement (experimental)
**Status:** Not started
**Branch:** `v6-experiment` (create when ready)
**Target:** A4 only

### Allowed in V6
- Slightly stronger Reason band visibility
- Irregular / elliptical Memory orbs
- Scheduled-vs-idle differentiation refinement
- Masked labels / abstraction refinements
- Stage-based attrition (if tested later)

### NOT allowed in V6
- Token gumball on A4
- Literal dashboard widgets
- Anything exposing sensitive operational detail
- Major architecture changes
- Agent particles (deferred beyond V6)

### Rollback from V6
If V6 feels worse: `git checkout v5-locked -- src/components/a4/A4Canvas.tsx` and redeploy.

### V6 workflow
- Branch from main: `git checkout -b v6-experiment`
- Test on preview URL only
- Do NOT merge to main without R approval
- Version label on deploy: V6

---

## Version Label Format
Displayed in canvas timestamp line (A4/A5) and page subtitle (A6):

```
<timestamp_edt> · <VERSION> · <entries> entries · <activity_label> (<act%>)
```

Example: `3/20/2026, 11:29 AM EDT · V5 · 58 entries · sleep (58%)`

---

## Changelog

| Version | Date | Change | Rollback |
|---------|------|--------|----------|
| V5 | 2026-03-20 | Stable baseline: setTransform, activity floor, correct timestamp, A5 to Lab | `dc537a7` |
| V6 | TBD | Add Horner/Zack agent layer | `05be13d` |
