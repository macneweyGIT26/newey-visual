# Visual Debug Toolkit — A-Series Animated Panes
**Created:** 2026-03-20
**Applies to:** A4Canvas, A5Canvas, MashupCanvas, and all future animated canvas panes

---

## Version Map

| Commit | Page | Motion Working | Data Linked | Agent Layer | Notes |
|--------|------|---------------|-------------|-------------|-------|
| `59b5355` | Mashup | ✅ | ❌ | ❌ | Original working baseline — random data only |
| `f5402d7` | Mashup | ✅ | ❌ | ❌ | 3-section version — still clean baseline |
| `5965696` | A4 | ✅ (assumed) | ✅ static | ❌ | Static import live.json — scale bug latent |
| `79e97d8` | A4 | ✅ (assumed) | ✅ static | ❌ | Live data tab — scale bug latent, no async |
| `7b90a53` | A5 | ⚠️ | ✅ static | ✅ (vx=0.08) | Agents too slow to see; scale bug latent |
| `e8d7f36` | A5 | ⚠️ | ✅ static | ✅ | Agent wander fix attempt, still slow |
| `78b33f5` | A5 | ⚠️ | ✅ static | ✅ | Removed activity scaling from agent vel |
| `de7cd7c` | A4 | ❌ freeze | ✅ runtime | ❌ | **Regression introduced** — runtime fetch + liveLoaded state |
| `4f8b05b` | A5 | ❌ freeze | ✅ runtime | ✅ (vx=1.2) | Same regression; black-screen from liveLoaded dep |
| `b2880f8` | A4/A5 | ❌ freeze | ✅ runtime | ✅ | Removed liveLoaded dep — canvas starts, but scale still accumulates |
| `ac35314` | A4/A5 | ✅ (deployed) | ✅ runtime | ✅ | **setTransform fix** — scale accumulation resolved |

---

## Root Cause Record — Scale Accumulation (2026-03-20)

**Failure class:** Cumulative transform / scaling drift

**Symptom:** Canvas appears to freeze 3–10 seconds after page load. RAF loop continues running; animation is executing off-screen.

**Cause:** `ctx.scale(2,2)` called inside `resize()`. Each window resize event multiplies the existing transform rather than resetting it. After 2–3 resize events: scale becomes 8x–16x, pushing all draw coordinates far outside visible canvas area.

**Why A4/A5 but not Mashup:** Mashup has no async operations. A4/A5 run `fetch()` on mount. The async callback completes after initial paint, potentially triggering layout recalc + resize event. This causes the second (fatal) `ctx.scale(2,2)` call.

**Fix:**
```diff
- ctx.scale(2,2)
+ ctx.setTransform(2, 0, 0, 2, 0, 0)
```

**Canon rule:** Never stack `ctx.scale()` across resize events. Always use `ctx.setTransform(dpr, 0, 0, dpr, 0, 0)` to reset to exact target scale.

---

## Common Failure Classes

### 1. Cumulative transform / scaling drift
- **Cause:** `ctx.scale()` called in resize without resetting transform first
- **Symptom:** Canvas appears frozen after 2–10 seconds; RAF still running
- **Detection:** Sample pixel at canvas center — returns background color or transparent
- **Fix:** Replace `ctx.scale(n,n)` with `ctx.setTransform(n, 0, 0, n, 0, 0)`

### 2. Animation loop running, drawing off-screen
- **Cause:** Scale drift, coordinate offset, or section boundaries calculated wrong
- **Symptom:** Pixel sampling returns background; no visible particles; RAF loop active
- **Detection:** `ctx.getImageData()` at multiple points — all return background color
- **Fix:** Log draw coordinates; verify against canvas width/height

### 3. Effect cleanup / remount killing loop
- **Cause:** useEffect dependency array triggers re-run, cleanup cancels animId, new loop doesn't start cleanly
- **Symptom:** Brief animation then stop; may cycle on/off
- **Detection:** Check useEffect deps; add console.log to cleanup function
- **Fix:** Move animation to `useEffect([], [])` — single mount only; fetch separately

### 4. State / closure freeze
- **Cause:** Stale closure captures old ref values; updates to refs not visible inside draw loop
- **Symptom:** Animation runs but data never updates; particles use initialization values only
- **Detection:** Log ref values inside draw loop
- **Fix:** Use `useRef` not `useState` for values read inside RAF loop

### 5. Data feed blocking render cadence
- **Cause:** Awaited fetch blocks canvas start; or re-fetch triggers React re-render
- **Symptom:** Black canvas until fetch resolves; may flash
- **Detection:** Check if canvas pixels are non-zero before fetch completes
- **Fix:** Start canvas immediately on mount; update refs when fetch resolves — never await in canvas useEffect

### 6. Resize event re-init corruption
- **Cause:** `resize()` re-runs `initAll()` on every resize, resetting particle positions
- **Symptom:** Particles reset/jump on any window resize
- **Detection:** Resize window — watch for position resets
- **Fix:** Guard `initAll()` with `if (!initRef.current)` — already implemented

### 7. Hydration mismatch (Next.js)
- **Cause:** Server renders canvas element; client hydrates and React re-mounts; useEffect fires twice
- **Symptom:** Brief animation, full stop, restart; or double initialization
- **Detection:** Add `'use client'` directive; check React StrictMode double-invoke
- **Fix:** Always `'use client'`; single useEffect with `[]` dependency

### 8. Browser visibility throttling
- **Cause:** RAF is throttled to ~1fps when tab is backgrounded
- **Symptom:** Animation appears frozen in headless browser or background tab
- **Note:** NOT a code bug — expected browser behavior. Never diagnose as code failure without testing in focused tab
- **Detection:** RAF stops entirely in headless screenshot tools. Use pixel eval with setTimeout, not passive screenshot

### 9. Agent layer overwhelming visible movement
- **Cause:** Agent velocity set too low (< 0.1px/frame at 60fps = imperceptibly slow)
- **Symptom:** Agents appear stationary; motion pane looks frozen
- **Fix:** Agent speed must be ≥ 0.8px/frame for visible motion at 60fps. Current: Horner 1.2, Zack 0.9

### 10. Stale live.json / static import at build time
- **Cause:** `import liveData from '@/data/live.json'` bakes data at Vercel build
- **Symptom:** Dashboard shows old date regardless of live.json commits
- **Fix:** Runtime fetch from raw GitHub URL inside useEffect; static import as fallback only

---

## Resize / Transform Checklist

Before shipping any canvas pane:

- [ ] `ctx.setTransform(dpr, 0, 0, dpr, 0, 0)` used in resize (NOT `ctx.scale`)
- [ ] `initAll()` guarded by `initRef.current` — runs once only
- [ ] `resize()` called once on mount, then only on window resize events
- [ ] No `ctx.save()` / `ctx.restore()` missing matching pairs
- [ ] Canvas width/height set before transform reset

## RAF Lifecycle Checklist

- [ ] `animId` captured as `let` — reassigned each frame
- [ ] `cancelAnimationFrame(animId)` in useEffect cleanup
- [ ] `removeEventListener` for all added listeners in cleanup
- [ ] `clearInterval` for all setIntervals in cleanup
- [ ] useEffect dependency array is `[]` — single mount only
- [ ] No awaited async operations before `draw()` starts

## Canvas Clearing / Draw Bounds Checklist

- [ ] Background fill covers full canvas each frame (or appropriate accumulation strategy)
- [ ] Periodic full clear (e.g. `if (t % 600 === 0)`) prevents trail build-up
- [ ] All draw coordinates verified against `W()` and `H()` — not hardcoded pixel values
- [ ] Section boundaries (`reasonH`, `streetY`, etc.) recalculated on resize

## Data Feed Impact Checklist

- [ ] Canvas starts immediately — fetch does not gate animation start
- [ ] Fetch updates `ref.current` only — no `setState` that could trigger re-render
- [ ] Fallback data (static import) used if fetch fails
- [ ] 5-minute refresh interval cleaned up in useEffect return

## Rollback Test Procedure

If a canvas pane regresses:
1. Check `git log --oneline | grep -v "live update"` for last non-data commit
2. `git show <commit>:src/components/<pane>/<File>.tsx > /tmp/test.tsx` to inspect
3. Compare resize + RAF lifecycle lines against this toolkit
4. If unclear: diff against mashup baseline (known working motion system)
5. If mashup still animates: copy mashup motion core, re-apply labels/data on top

---

## Proof Standard

A canvas pane fix is NOT complete until:

1. ✅ Sustained visible motion for 30+ seconds in real browser
2. ✅ Tested in >1 real browser (not headless)
3. ✅ No freeze after window resize / layout change
4. ✅ Data-linked pane shows current timestamp (not build-time date)
5. ✅ Screenshot or clip from live page (not pixel eval, not code output)
6. ✅ Root cause documented in this file under Common Failure Classes

---

## Production URLs

- **A4:** `https://newey-visual.vercel.app/a4` (or latest preview URL)
- **A5:** `https://newey-visual.vercel.app/a5`
- **Mashup (baseline):** `https://newey-visual.vercel.app/mashup`

---

## Pending Verification

| Item | Status |
|------|--------|
| A4 setTransform fix — live browser 30s test | ⏳ Pending |
| A5 setTransform fix — live browser 30s test | ⏳ Pending |
| A5 agent motion visible >10s | ⏳ Pending |
| Mashup setTransform patch (latent bug) | ⏳ Not yet applied |
| Multi-browser test (Chrome + Safari) | ⏳ Pending |
