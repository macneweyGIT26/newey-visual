#!/usr/bin/env node
// Reads master_tracker.csv → outputs src/data/live.json for Next.js build

const fs = require('fs')
const path = require('path')

const CSV_PATH = '/Users/newey/newey/tracker/master_tracker.csv'
const OUT_PATH = path.join(__dirname, '..', 'src', 'data', 'live.json')

const lines = fs.readFileSync(CSV_PATH, 'utf8').trim().split('\n')
const headers = lines[0].split(',')
const rows = lines.slice(1).map(line => {
  // Handle quoted fields
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

// Color map
const COLORS = {
  'Newey': '168,85,247',
  'F1 Intelligence': '34,211,238',
  'Media Library': '245,158,11',
  'Instagram Interests': '236,72,153',
  'Instagram': '236,72,153',
  'Asset Index': '16,185,129',
  'Grocery List': '251,146,60',
  'Family': '253,186,116',
}

const projectList = Object.values(projects)
  .sort((a, b) => b.cost - a.cost)
  .map(p => ({
    name: p.name,
    entries: p.entries,
    cost: Math.round(p.cost * 100) / 100,
    domain: p.domain,
    color: COLORS[p.name] || '150,150,150',
  }))

const lanes = [
  { name: 'SYSTEM', cost: Math.round(domainCosts.SYSTEM * 100) / 100, entries: domainEntries.SYSTEM, color: '168,85,247' },
  { name: 'WORK', cost: Math.round(domainCosts.WORK * 100) / 100, entries: domainEntries.WORK, color: '34,211,238' },
  { name: 'PERSONAL', cost: Math.round(domainCosts.PERSONAL * 100) / 100, entries: domainEntries.PERSONAL, color: '251,146,60' },
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
