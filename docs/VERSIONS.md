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

## V6 — A4 + Agent Layer (planned)
**Status:** NOT started
**Target pages:** A4 only (A6 gets updated separately)

### What V6 adds
- Horner (purple) and Zack (green) agent particles in Motion pane
- Visible wandering with trail
- Named labels above agents
- Speed: Horner 1.2px/frame, Zack 0.9px/frame

### Prerequisites before V6 deploy
- [ ] V5 confirmed stable in production (30s+ motion, no freeze, correct timestamp)
- [ ] V5 confirmed stable after resize
- [ ] V5 confirmed stable on Safari (second browser)

### Rollback from V6
If V6 breaks motion or data: revert to `05be13d` immediately.
Revert command: `git revert HEAD` or `git reset --hard 05be13d && git push --force`

### Versioning rule for V6
- Create V6 branch: `git checkout -b v6-agents`
- Test on preview URL only
- Do NOT merge to main until V5 stability confirmed
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
