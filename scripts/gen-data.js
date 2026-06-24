#!/usr/bin/env node
// Reads Newey workspace state → outputs live.json for A4 visualization
// No crypto. No trading. Just operational state.

const fs = require('fs')
const path = require('path')

const OUT_PATH = path.join(__dirname, '..', 'src', 'data', 'live.json')

// ── HELPERS ──
const now = new Date()
// EDT offset
const edtOffset = -4 * 60 // minutes
const edtNow = new Date(now.getTime() + edtOffset * 60000 + now.getTimezoneOffset() * 60000)
const today = `${edtNow.getFullYear()}-${String(edtNow.getMonth()+1).padStart(2,'0')}-${String(edtNow.getDate()).padStart(2,'0')}`
const timestamp_edt = `${edtNow.getMonth()+1}/${edtNow.getDate()}/${edtNow.getFullYear()}, ${String(edtNow.getHours()).padStart(2,'0')}:${String(edtNow.getMinutes()).padStart(2,'0')}:${String(edtNow.getSeconds()).padStart(2,'0')} PM EDT`

// ── TRACKER ENTRIES ──
let trackerEntries = 0
try {
  const errorLog = '/Users/newey/.openclaw/workspace/tracker/ERROR_FIX_LOG.md'
  if (fs.existsSync(errorLog)) {
    const content = fs.readFileSync(errorLog, 'utf8')
    // Count OPEN or MONITOR cases
    const openCases = (content.match(/Status:\s*(OPEN|MONITOR)/gi) || []).length
    trackerEntries = openCases
  }
} catch (e) {}

// ── MEMORY LINES ──
let memoryLines = 0
try {
  const memFile = `/Users/newey/.openclaw/workspace/memory/${today}.md`
  if (fs.existsSync(memFile)) {
    const content = fs.readFileSync(memFile, 'utf8')
    memoryLines = content.split('\n').filter(l => l.trim()).length
  }
  // Also count MEMORY.md
  const memMd = '/Users/newey/.openclaw/workspace/MEMORY.md'
  if (fs.existsSync(memMd)) {
    memoryLines += fs.readFileSync(memMd, 'utf8').split('\n').length
  }
} catch (e) {}

// ── TOKEN SPEND ──
let tokenSpendToday = 0
try {
  // Read from session status if available, otherwise estimate from usage
  const stateDir = '/Users/newey/.openclaw/state'
  if (fs.existsSync(stateDir)) {
    // token spend is tracked per-run; for now use 0 as placeholder
    // This will be enriched by the cron job that runs gen-data
  }
} catch (e) {}

// ── SESSION STATE ──
// Determine if Newey is actively in a session or idle
let sessionState = 'sleep'
try {
  // Check memory file for today — if it has recent content, we're active
  const memFile = `/Users/newey/.openclaw/workspace/memory/${today}.md`
  if (fs.existsSync(memFile)) {
    const stat = fs.statSync(memFile)
    const ageMs = Date.now() - stat.mtimeMs
    if (ageMs < 30 * 60 * 1000) {
      sessionState = 'active'
    } else if (ageMs < 3 * 60 * 60 * 1000) {
      sessionState = 'idle'
    }
  }
  // Also check workspace STATE.md
  const stateFile = '/Users/newey/.openclaw/workspace/STATE.md'
  if (fs.existsSync(stateFile)) {
    const stat = fs.statSync(stateFile)
    const ageMs = Date.now() - stat.mtimeMs
    if (ageMs < 30 * 60 * 1000) {
      sessionState = 'active'
    } else if (ageMs < 3 * 60 * 60 * 1000 && sessionState === 'sleep') {
      sessionState = 'idle'
    }
  }
} catch (e) {}

// ── CRON STATUS ──
let cronStatus = 'healthy'
try {
  // Check if cron state directory exists and has recent activity
  const cronDir = '/Users/newey/.openclaw/state/cron'
  if (fs.existsSync(cronDir)) {
    const files = fs.readdirSync(cronDir)
    if (files.length === 0) cronStatus = 'unknown'
  }
} catch (e) {
  cronStatus = 'unknown'
}

// ── ACTIVITY SCORE ──
// 0-10 scale: 0=sleep, 2=idle, 4=moderate, 7=active, 10=intense
let activityScore = 2 // default idle
if (sessionState === 'active') {
  activityScore = 7
} else if (sessionState === 'idle') {
  activityScore = 3
}
// Boost if memory file has content today
if (memoryLines > 50) activityScore = Math.min(10, activityScore + 2)
else if (memoryLines > 10) activityScore = Math.min(10, activityScore + 1)

// ── LANES ──
// These represent the three domain categories with approximate weight
const lanes = [
  { name: 'SYSTEM', cost: 40, entries: trackerEntries + 2, color: '168,85,247' },
  { name: 'WORK', cost: 45, entries: trackerEntries + 5, color: '34,211,238' },
  { name: 'PERSONAL', cost: 15, entries: 3, color: '251,146,60' },
]

// ── OUTPUT ──
const output = {
  timestamp: now.toISOString(),
  timestamp_edt,
  activity_score: activityScore,
  tracker_entries: trackerEntries,
  memory_lines: memoryLines,
  token_spend_today: tokenSpendToday,
  token_spend_date: today,
  session_state: sessionState,
  cron_status: cronStatus,
  lanes,
}

fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true })
fs.writeFileSync(OUT_PATH, JSON.stringify(output, null, 2))
console.log(`✓ live.json: activity=${activityScore} (${sessionState}), entries=${trackerEntries}, memory=${memoryLines} lines, cron=${cronStatus}`)
