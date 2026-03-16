#!/usr/bin/env node
// Reads master_tracker.csv → outputs src/data/live.json for Next.js build

const fs = require('fs')
const path = require('path')

const CSV_PATH = '/Users/newey/newey/tracker/master_tracker.csv'
const OUT_PATH = path.join(__dirname, '..', 'src', 'data', 'live.json')

// New color palette
const COLORS = {
  'Newey': '166,107,255',           // violet
  'F1 Intelligence': '52,209,231',  // cyan
  'Media Library': '255,154,60',    // amber
  'Instagram Interests': '255,154,60', // amber
  'Instagram': '255,154,60',        // amber
  'Asset Index': '43,230,166',      // emerald
  'Grocery List': '255,154,60',     // amber
  'Family': '255,154,60',           // amber
}

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

// Aggregate
const projects = {}
let totalCost = 0, totalEntries = rows.length, resumeCount = 0, teamCount = 0, soloCount = 0
const domainCosts = { WORK: 0, SYSTEM: 0, PERSONAL: 0 }
const domainEntries = { WORK: 0, SYSTEM: 0, PERSONAL: 0 }
const domainColors = { SYSTEM: '166,107,255', WORK: '52,209,231', PERSONAL: '255,154,60' }

rows.forEach(r => {
  const name = r.project_name || r.category || 'Other'
  const cost = parseFloat(r.cost_est) || 0
  const domain = r.domain || 'WORK'

  if (!projects[name]) projects[name] = { name, entries: 0, cost: 0, domain, categories: new Set() }
  projects[name].entries++
  projects[name].cost += cost
  projects[name].categories.add(r.subcategory || '')

  totalCost += cost
  if (r.resume_signal === 'yes') resumeCount++
  if (r.team_mode === 'team') teamCount++
  if (r.team_mode === 'solo') soloCount++
  if (domainCosts[domain] !== undefined) { domainCosts[domain] += cost; domainEntries[domain]++ }
})

const projectList = Object.values(projects)
  .sort((a, b) => b.cost - a.cost)
  .map(p => ({
    name: p.name,
    entries: p.entries,
    cost: Math.round(p.cost * 100) / 100,
    domain: p.domain,
    color: COLORS[p.name] || domainColors[p.domain] || '128,128,128',
  }))

const lanes = [
  { name: 'SYSTEM', cost: Math.round(domainCosts.SYSTEM * 100) / 100, entries: domainEntries.SYSTEM, color: domainColors.SYSTEM },
  { name: 'WORK', cost: Math.round(domainCosts.WORK * 100) / 100, entries: domainEntries.WORK, color: domainColors.WORK },
  { name: 'PERSONAL', cost: Math.round(domainCosts.PERSONAL * 100) / 100, entries: domainEntries.PERSONAL, color: domainColors.PERSONAL },
]

const output = {
  generated: new Date().toISOString(),
  totalEntries,
  totalCost: Math.round(totalCost * 100) / 100,
  resumeCount,
  teamCount,
  soloCount,
  projects: projectList,
  lanes,
  recentEntries: rows.slice(-10).reverse().map(r => ({
    date: r.date,
    title: r.title,
    domain: r.domain,
    category: r.category,
    project: r.project_name,
    resume: r.resume_signal === 'yes',
    cost: parseFloat(r.cost_est) || 0,
    team: r.team_mode,
  })),
}

fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true })
fs.writeFileSync(OUT_PATH, JSON.stringify(output, null, 2))
console.log(`✓ Generated ${OUT_PATH}`)
console.log(`  ${projectList.length} projects, ${totalEntries} entries, $${output.totalCost}`)
