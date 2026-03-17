#!/usr/bin/env node
// Reads master_tracker.csv + session activity → outputs live.json + viz-state.json

const fs = require('fs')
const path = require('path')

const CSV_PATH = '/Users/newey/newey/tracker/master_tracker.csv'
const OUT_PATH = path.join(__dirname, '..', 'src', 'data', 'live.json')
const STATE_PATH = path.join(__dirname, '..', 'src', 'data', 'viz-state.json')

// ── TRACKER DATA ──
const lines = fs.readFileSync(CSV_PATH, 'utf8').trim().split('\n')
const headers = lines[0].split(',')
const rows = lines.slice(1).map(line => {
  const fields = []
  let current = '', inQuotes = false
  for (const ch of line) {
    if (ch === '"') { inQuotes = !inQuotes; continue }
    if (ch === ',' && !inQuotes) { fields.push(current); current = ''; continue }
    current += ch
  }
  fields.push(current)
  const obj = {}
  headers.forEach((h, i) => obj[h.trim()] = (fields[i] || '').trim())
  return obj
})

const domainColors = { SYSTEM: '166,107,255', WORK: '52,209,231', PERSONAL: '255,154,60' }
const COLORS = {
  'Newey': '166,107,255',
  'F1 Intelligence': '52,209,231',
  'Media Library': '255,154,60',
  'Instagram Interests': '255,154,60',
  'Instagram': '255,154,60',
  'Asset Index': '52,209,231',
  'Grocery List': '255,154,60',
  'Family': '255,154,60',
}

const projects = {}
let totalCost = 0, totalEntries = rows.length, resumeCount = 0, teamCount = 0, soloCount = 0
const domainCosts = { WORK: 0, SYSTEM: 0, PERSONAL: 0 }
const domainEntries = { WORK: 0, SYSTEM: 0, PERSONAL: 0 }

rows.forEach(r => {
  const name = r.project_name || r.category || 'Other'
  const cost = parseFloat(r.cost_est) || 0
  const domain = r.domain || 'WORK'
  if (!projects[name]) projects[name] = { name, entries: 0, cost: 0, domain, categories: new Set() }
  projects[name].entries++
  projects[name].cost += cost
  totalCost += cost
  if (r.resume_signal === 'yes') resumeCount++
  if (r.team_mode === 'team') teamCount++
  if (r.team_mode === 'solo') soloCount++
  if (domainCosts[domain] !== undefined) { domainCosts[domain] += cost; domainEntries[domain]++ }
})

const projectList = Object.values(projects)
  .sort((a, b) => b.cost - a.cost)
  .map(p => ({
    name: p.name, entries: p.entries,
    cost: Math.round(p.cost * 100) / 100,
    domain: p.domain,
    color: COLORS[p.name] || domainColors[p.domain] || '128,128,128',
  }))

const lanesArr = [
  { name: 'SYSTEM', cost: Math.round(domainCosts.SYSTEM * 100) / 100, entries: domainEntries.SYSTEM, color: domainColors.SYSTEM },
  { name: 'WORK', cost: Math.round(domainCosts.WORK * 100) / 100, entries: domainEntries.WORK, color: domainColors.WORK },
  { name: 'PERSONAL', cost: Math.round(domainCosts.PERSONAL * 100) / 100, entries: domainEntries.PERSONAL, color: domainColors.PERSONAL },
]

// ── ACTIVITY DETECTION ──
// Count today's tracker entries
// Use local date (EDT), not UTC
const now = new Date()
const today = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`
const todayEntries = rows.filter(r => r.date === today).length

// Check recent memory/daily files for session activity
let recentMessages = 0
let cronJobsToday = 0
try {
  const memDir = '/Users/newey/.openclaw/workspace/memory'
  const todayFile = path.join(memDir, `${today}.md`)
  if (fs.existsSync(todayFile)) {
    const content = fs.readFileSync(todayFile, 'utf8')
    // Rough proxy: count lines as activity indicator
    recentMessages = Math.min(100, content.split('\n').length)
  }
} catch (e) {}

// Check cron state
try {
  const cronState = '/Users/newey/.openclaw/state/cron'
  if (fs.existsSync(cronState)) {
    const files = fs.readdirSync(cronState)
    cronJobsToday = files.length
  }
} catch (e) {}

// Calculate activity score (0.0 to 1.0)
// Weighted: tracker entries (40%), memory file size (40%), cron (20%)
const trackerScore = Math.min(1, todayEntries / 10) // 10 entries = max
const memoryScore = Math.min(1, recentMessages / 50) // 50 lines = max
const cronScore = Math.min(1, cronJobsToday / 5)     // 5 jobs = max
const activityScore = Math.round((trackerScore * 0.4 + memoryScore * 0.4 + cronScore * 0.2) * 100) / 100

const hour = new Date().getHours()
let autoTheme = 'dark'
if (hour >= 7 && hour < 19) autoTheme = 'light'

// ── OUTPUT ──
const output = {
  generated: new Date().toISOString(),
  totalEntries, totalCost: Math.round(totalCost * 100) / 100,
  resumeCount, teamCount, soloCount,
  projects: projectList, lanes: lanesArr,
  recentEntries: rows.slice(-10).reverse().map(r => ({
    date: r.date, title: r.title, domain: r.domain,
    category: r.category, project: r.project_name,
    resume: r.resume_signal === 'yes',
    cost: parseFloat(r.cost_est) || 0, team: r.team_mode,
  })),
}

const vizState = {
  generated: new Date().toISOString(),
  activity: {
    score: activityScore,
    todayEntries,
    recentMemoryLines: recentMessages,
    cronJobs: cronJobsToday,
    label: activityScore >= 0.7 ? 'active' : activityScore >= 0.3 ? 'working' : activityScore >= 0.1 ? 'idle' : 'sleep',
  },
  timeOfDay: { hour, autoTheme },
}

fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true })
fs.writeFileSync(OUT_PATH, JSON.stringify(output, null, 2))
fs.writeFileSync(STATE_PATH, JSON.stringify(vizState, null, 2))
console.log(`✓ live.json: ${projectList.length} projects, ${totalEntries} entries, $${output.totalCost}`)
console.log(`✓ viz-state.json: activity=${activityScore} (${vizState.activity.label}), entries today=${todayEntries}, memory=${recentMessages} lines, cron=${cronJobsToday}`)
