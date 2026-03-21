# A7 — State Board Spec
**Created:** 2026-03-20
**Status:** Spec draft — not yet built
**Version:** V5-spec (ships as V5 addition, not a new visual version)

---

## Purpose

Single page that answers: **what is true right now.**

Replaces manual checking of:
- `open_loops.md`
- `regime_monitor.log`
- `watchdog.log`
- `tracker/` files
- `token_ledger.md`
- `QBranch/Tokens/` CSVs
- `QBranch/Backups/`
- cron job list
- wallet/position state

---

## Naming

**Recommendation: A7 — State**

"State" is correct. It's operational, not conceptual. Alternatives considered:
- "Truth" — too abstract
- "Ops" — too generic
- "Pulse" — too medical
- "Console" — too engineering
- "Status" — too boring

**State** works because it means both "current condition" and "the state of affairs." It pairs naturally with Reason and Agents.

The trinity: **Reason / Agents / State**

---

## Architecture Position

| Page | Role | Feel |
|------|------|------|
| A4 | Reason | Poetic, interpretive, visual motion |
| A6 | Agents | Structured, who/what/cost/result |
| A7 | State | Operational truth, traffic-light clarity |

A7 is the most utilitarian page. No orbs, no particles, no ambient layers. Clean grid, clear signals, immediate answers.

---

## Sections

### 1. System Mode (top banner)

Single-line status bar across the top.

| Field | Source | Example |
|-------|--------|---------|
| Mode | Manual or derived | `NORMAL` / `RECOVERY` / `GUARDED` / `MAINTENANCE` / `LIVE` |
| Priority | Manual | `A4 visual stability` |
| Phase | Manual | `V5 baseline confirmed` |
| Last Refresh | Page load timestamp | `2026-03-20 20:46 EDT` |

**Design:** Full-width dark bar. Mode in large text. Priority and phase in smaller text right-aligned. Green/yellow/red dot next to mode.

**Static v1:** Hardcoded mode/priority/phase. Updated manually in a config JSON.
**Live later:** Read from a `state.json` that Newey writes on heartbeat or cron.

---

### 2. Health Grid

4-column grid. Each cell = one system. Traffic light: 🟢 / 🟡 / 🔴.

| System | Source File | Green | Yellow | Red |
|--------|-----------|-------|--------|-----|
| Cron | `cron list` API | All enabled jobs ran in expected window | Any job >2x overdue | Any job in error state |
| Watchdog | `tracker/watchdog.log` | Last entry <5 days | Last entry 5-10 days | Last entry >10 days |
| Backup | `QBranch/Backups/` | Latest backup <24h | Backup 24-48h old | Backup >48h or missing |
| Mutex | `/tmp/newey_tracker.lock` | Lock acquirable | — | Lock stuck (stale PID) |
| Tracking | `tracker/regime_monitor.log` | Entry <90min old | Entry 90min-3h old | Entry >3h old |
| Pre-flight | Mandate checks in orders.js | All constraints pass | Any soft warning | Hard constraint violation |
| Memory | `memory/` directory | Today's file exists + MEMORY.md <7d old | MEMORY.md 7-14d old | No today file or MEMORY.md >14d |

**Static v1:** Read files at build time or on page load via API route.
**Live later:** API route that runs checks server-side, returns JSON.

---

### 3. Open Loops

Table pulled from `open_loops.md` (or a structured `open_loops.json`).

| Column | Content |
|--------|---------|
| Item | Short description |
| Status | `blocked` / `waiting-user` / `waiting-system` / `stale` / `active` |
| Age | Days since created |
| Blocker | What's holding it up |
| Flag | 🔴 if >14 days, 🟡 if >7 days |

**Static v1:** Parse `open_loops.md` and render as table.
**Live later:** Structured JSON source, auto-flagging by age.

---

### 4. Trading / Operating Truth

Two-column layout: left = market state, right = execution state.

**Market State:**

| Field | Source | Display |
|-------|--------|---------|
| Regime | `regime_monitor.log` last entry | `BEAR 72%` with color |
| BTC | regime.js output | Price + 24h change |
| ETH | regime.js output | Price + 24h change |
| SOL | regime.js output | Price + 24h change |

**Execution State:**

| Field | Source | Display |
|-------|--------|---------|
| Execution | Trade executor cron enabled/disabled | `ENABLED` / `DISABLED` |
| Position | trades.csv or GMX state | `NONE` / `ETH SHORT $5 1.5x` |
| Wallet | wallet status | `USDC $80.23 · ETH 0.012` |
| Last Trade | trades.csv last row | Date + pair + result |
| Last Audit | `tracker/audits.log` | Date + result summary |
| Last Security | security audit cron | Date + pass/fail |
| Token Ledger | `token_ledger.md` | Last sync date + weekly total |
| Today Spend | QBranch/Tokens CSV | Partial-day label if same-day |

**Static v1:** Snapshot values from files at page load.
**Live later:** API route aggregating all sources.

---

### 5. File / Log Readouts

Reference panel showing what feeds the page.

| Source | Contributes | Refresh |
|--------|------------|---------|
| `tracker/regime_monitor.log` | Regime, prices, shift detection | Every 30min (cron) |
| `tracker/watchdog.log` | Watchdog health score | On Zack run |
| `open_loops.md` | Open items, blockers | Manual |
| `QBranch/Backups/` | Backup freshness | Nightly 1AM |
| `QBranch/Tokens/*.csv` | Token spend | Hourly export |
| `token_ledger.md` | Weekly reconciliation | Friday 5PM |
| `tracker/audits.log` | Audit results | On Horner run |
| `memory/YYYY-MM-DD.md` | Daily log existence | Session activity |
| `MEMORY.md` | Long-term memory freshness | Periodic review |

**This section is informational only — not live-rendered.** It's documentation embedded in the page so R knows what each signal sources from.

---

### 6. Alerts / Exceptions

Bottom panel. Only shows items that need attention. Empty = clean.

| Alert Type | Trigger | Display |
|------------|---------|---------|
| Failed Job | Cron job `lastRunStatus: error` | Job name + error + time |
| Stale Backup | Backup >48h | Last backup date + age |
| Token Anomaly | Daily spend >$15 or >150% baseline | Amount + delta |
| Execution Issue | Trade executor error or mandate violation | Error description |
| Missing Output | Expected file doesn't exist | File path + expected source |
| Stale Loop | Open loop item >14 days | Item name + age |

**Design:** Red-bordered cards. Only visible when triggered. When clean: single line "No active alerts."

---

## Design Language

| Property | A4 (Reason) | A6 (Agents) | A7 (State) |
|----------|-------------|-------------|------------|
| Background | `#080c18` | Slate gradient | `#080c18` |
| Typography | 8-10px system | Mixed sizes | 10-13px system, monospace for values |
| Density | Sparse (canvas) | Medium (cards) | Dense (grid + tables) |
| Motion | Continuous animation | None | None (static with auto-refresh) |
| Feel | Interpretive | Structured | Operational |
| Color role | Domain identity | Agent identity | Signal (red/yellow/green) |
| Primary action | Watch | Review | Decide |

**Header/nav:** Matches A4 exactly (same component). A5 stays as redirect. Tab order: A4 · A6 · A7.

**No canvas.** Pure HTML/CSS. Dark background, light text, colored signals. Feels like a control room panel, not a viz.

**Refresh:** Page-level auto-refresh every 5 minutes (meta refresh or client-side timer). Individual sections can have their own staleness indicators.

---

## Static v1 vs Live Later

| Section | V1 (static) | Future (live) |
|---------|------------|---------------|
| System Mode | Hardcoded JSON | Newey writes `state.json` on heartbeat |
| Health Grid | File existence checks at page load | API route with real-time checks |
| Open Loops | Parse `open_loops.md` | Structured `open_loops.json` |
| Trading Truth | Snapshot from files | API aggregating regime.js + wallet + trades |
| Alerts | File-based checks | Live cron status + file monitoring |

**V1 build plan:** Server-side Next.js page that reads local files at request time. No API routes needed — just `fs.readFileSync` in a server component. Vercel won't have access to local files, so V1 is **local dev only** or needs an API endpoint that Newey serves.

**Alternative V1:** Static JSON files committed to the repo (like `live.json`), updated by a cron job. Page reads from raw GitHub URL. Same pattern as A4 live data.

**Recommended V1 path:** New cron job writes `state.json` to the repo. A7 page fetches it at runtime from raw GitHub. Same proven pattern as A4.

---

## State vs A6 — What Goes Where

| Metric | A6 (Agents) | A7 (State) |
|--------|-------------|------------|
| Agent names, roles, checks | ✅ | ❌ |
| Agent cost per run | ✅ | ❌ |
| Agent issues found | ✅ | ❌ |
| Project audit status | ✅ | ❌ |
| Cron job health | ❌ | ✅ |
| Watchdog score | ❌ (Zack is an agent, but the score is state) | ✅ |
| Backup freshness | ❌ | ✅ |
| Regime / prices | ❌ | ✅ |
| Wallet / position | ❌ | ✅ |
| Open loops | ❌ | ✅ |
| Token spend | ❌ | ✅ |
| System mode | ❌ | ✅ |
| Alerts | ❌ | ✅ |

**Rule:** A6 answers "who is working and what did they find." A7 answers "what is true and what needs attention." If an agent produces a result, A6 shows the agent view; A7 shows the operational impact.

---

## Rollback

| Version | Rollback Target | Change Note |
|---------|----------------|-------------|
| A7 v1 | Don't ship to main until tested on preview | First State board — static JSON + runtime fetch |

---

## Next Steps

1. Create `scripts/state-updater.js` — reads all source files, writes `src/data/state.json`
2. Create cron job to run state-updater every 30 min
3. Build A7 page component — server-rendered HTML, no canvas
4. Add A7 to nav (A4 · A6 · A7)
5. Test on preview URL
6. Deploy to production

---

*Spec by Newey · 2026-03-20 · V5 era*
