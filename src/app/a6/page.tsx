'use client'

import React from 'react';

export default function A6Page() {
  const agents = [
    {
      name: 'Horner',
      role: 'audit',
      checks: 7,
      issuesFound: 3,
      critical: 0,
      cost: 0.24,
      color: '#8B5CF6',
    },
    {
      name: 'Zack',
      role: 'watchdog',
      checks: 10,
      issuesFound: 2,
      critical: 0,
      cost: 0.10,
      color: '#22C55E',
    },
  ];

  const projects = [
    { name: 'Code Red Triage', lastChecked: '2026-03-21 22:50', agent: 'Horner', status: 'complete' },
    { name: 'Regime Monitor', lastChecked: '2026-03-21 22:27', agent: 'Zack', status: 'running' },
    { name: 'Backup Fix', lastChecked: '2026-03-21 22:53', agent: 'Horner', status: 'complete' },
    { name: 'A4 Live JSON', lastChecked: '2026-03-21 22:29', agent: 'Zack', status: 'active' },
    { name: 'Frick Phase 1', lastChecked: '2026-03-21 19:37', agent: 'Horner', status: 'complete' },
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Tab Bar — matches A4 nav exactly */}
      <div className="border-b border-white/5 bg-[#080c18] sticky top-0 z-40">
        <div className="flex items-baseline justify-between max-w-[1800px] mx-auto px-8 py-5">
          <div>
            <h1 className="text-sm font-semibold tracking-[0.3em] uppercase text-stone-400">Newey 2.0</h1>
            <p className="text-xs text-stone-600 mt-0.5">A6 — Agent Intelligence</p>
          </div>
          <nav className="flex gap-3 text-[10px] tracking-wider uppercase">
            <a href="/a4" className="text-amber-500 hover:text-amber-300 transition-colors">A4</a>
            <span className="text-stone-700 cursor-default" title="Lab — not stable">A5</span>
            <a href="/a6" className="text-blue-500 font-bold">A6</a>
            <a href="/" className="text-stone-600 hover:text-stone-300 transition-colors ml-auto">Light</a>
            <a href="/dark" className="text-stone-600 hover:text-stone-300 transition-colors">Dark</a>
            <a href="/mashup" className="text-stone-600 hover:text-stone-300 transition-colors">Mashup</a>
            <a href="/guide" className="text-stone-600 hover:text-stone-300 transition-colors">Guide</a>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">A6 — Agent Intelligence</h1>
          <p className="text-slate-400">Live agent activity + system health</p>
          <p className="text-xs text-stone-600 mt-1">V5 · agent dashboard</p>
        </div>

        {/* System Health */}
        <div className="border border-slate-700 rounded-lg p-8 bg-slate-900/50 backdrop-blur mb-12">
          <h3 className="text-xl font-bold mb-6">System Health</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-slate-400">Cron Jobs</p>
              <p className="text-3xl font-bold text-blue-400">7</p>
              <p className="text-xs text-green-400 mt-1">Running</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Mutex</p>
              <p className="text-2xl font-bold text-purple-400">✓</p>
              <p className="text-xs text-slate-500">Implemented</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Pre-Flight</p>
              <p className="text-2xl font-bold text-purple-400">✓</p>
              <p className="text-xs text-slate-500">Active</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Tracking</p>
              <p className="text-2xl font-bold text-green-400">✓</p>
              <p className="text-xs text-slate-500">Enabled</p>
            </div>
          </div>
        </div>

        {/* Scheduled Jobs Health */}
        <div className="border border-slate-700 rounded-lg p-8 bg-slate-900/50 backdrop-blur mb-12">
          <h3 className="text-xl font-bold mb-6">Scheduled Jobs Health</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400 font-semibold">Job</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-semibold">Frequency</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-semibold">Last Success</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-semibold hidden md:table-cell">Canonical Path</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-semibold hidden lg:table-cell">Notes</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    name: 'Regime Monitor',
                    frequency: 'Every 30 min',
                    lastSuccess: '2026-03-21 22:27 EDT',
                    status: 'healthy',
                    canonicalPath: '~/.openclaw/workspace/tracker/regime_monitor.log',
                    notes: 'Do not check legacy path /Users/newey/newey/tracker/',
                  },
                  {
                    name: 'A4 Live JSON',
                    frequency: 'Hourly @ :29',
                    lastSuccess: '2026-03-21 22:29 EDT',
                    status: 'healthy',
                    canonicalPath: '~/.openclaw/workspace/projects/newey-visual/src/data/live.json',
                    notes: '',
                  },
                  {
                    name: 'Nightly Backup',
                    frequency: 'Daily 1:00 AM',
                    lastSuccess: '2026-03-21 22:53 EDT',
                    status: 'healthy',
                    canonicalPath: '~/QBranch/Backups/',
                    notes: 'Size gate: >1MB = full, <1MB = PARTIAL',
                  },
                  {
                    name: 'Session Handoff',
                    frequency: 'Daily 2:59 AM',
                    lastSuccess: '2026-03-21 02:59 EDT',
                    status: 'healthy',
                    canonicalPath: '~/.openclaw/workspace/memory/YYYY-MM-DD.md',
                    notes: '',
                  },
                  {
                    name: 'Token Ledger',
                    frequency: 'Friday 5:00 PM',
                    lastSuccess: '2026-03-20 17:00 EDT',
                    status: 'warn',
                    canonicalPath: '~/newey/token_ledger.md',
                    notes: 'Ran ok but no visible output — path mismatch suspected',
                  },
                  {
                    name: 'Security Audit',
                    frequency: 'Sunday 9:00 AM',
                    lastSuccess: '2026-03-16 09:00 EDT',
                    status: 'warn',
                    canonicalPath: '~/newey/tracker/audits.log',
                    notes: 'Baseline building',
                  },

                  {
                    name: 'MEMORY.md Refresh',
                    frequency: 'Daily/manual',
                    lastSuccess: '2026-03-21 22:50 EDT',
                    status: 'healthy',
                    canonicalPath: '~/.openclaw/workspace/MEMORY.md',
                    notes: '',
                  },
                  {
                    name: 'STATE.md Refresh',
                    frequency: 'Daily/manual',
                    lastSuccess: '2026-03-21 22:50 EDT',
                    status: 'healthy',
                    canonicalPath: '~/.openclaw/workspace/STATE.md',
                    notes: '',
                  },
                ].map((job, idx) => {
                  const statusColorMap: Record<string, { bg: string; text: string }> = {
                    healthy: { bg: 'rgba(34, 197, 94, 0.1)', text: '#4ade80' },
                    warn: { bg: 'rgba(251, 146, 60, 0.1)', text: '#fb923c' },
                    disabled: { bg: 'rgba(100, 116, 139, 0.1)', text: '#94a3b8' },
                    stale: { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444' },
                    not_due: { bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6' },
                  };

                  const colors = statusColorMap[job.status] || statusColorMap.healthy;

                  return (
                    <tr key={idx} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 text-slate-200 font-medium">{job.name}</td>
                      <td className="py-3 px-4 text-slate-400 text-xs">{job.frequency}</td>
                      <td className="py-3 px-4 text-slate-400 text-xs">{job.lastSuccess}</td>
                      <td className="py-3 px-4">
                        <span
                          className="px-2 py-1 rounded text-xs font-semibold capitalize"
                          style={{
                            background: colors.bg,
                            color: colors.text,
                          }}
                        >
                          {job.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-xs font-mono hidden md:table-cell truncate max-w-xs">
                        {job.canonicalPath}
                      </td>
                      <td className="py-3 px-4 text-slate-600 text-xs hidden lg:table-cell">
                        {job.notes}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Agent KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {agents.map((agent) => (
            <div key={agent.name} className="border border-slate-700 rounded-lg p-6 bg-slate-900/50 backdrop-blur">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{
                    background: agent.color,
                    boxShadow: `0 0 12px ${agent.color}80`,
                  }}
                />
                <h2 className="text-2xl font-bold">{agent.name}</h2>
                <span className="text-sm px-3 py-1 rounded-full bg-slate-800 text-slate-300">
                  {agent.role}
                </span>
              </div>

              {/* KPI Row */}
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-slate-400">Checks</p>
                  <p className="text-2xl font-bold text-blue-400">{agent.checks}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Issues Found</p>
                  <p className="text-2xl font-bold text-orange-400">{agent.issuesFound}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Critical</p>
                  <p className="text-2xl font-bold text-red-500">{agent.critical}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Cost</p>
                  <p className="text-xl font-bold text-green-400">${agent.cost.toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Project Matrix */}
        <div className="border border-slate-700 rounded-lg p-8 bg-slate-900/50 backdrop-blur">
          <h3 className="text-xl font-bold mb-6">Project Status</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400 font-semibold">Project Name</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-semibold">Last Date Checked</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-semibold">Agent</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-3 px-4 text-slate-200">{project.name}</td>
                    <td className="py-3 px-4 text-slate-400">{project.lastChecked}</td>
                    <td className="py-3 px-4">
                      <span
                        className="px-2 py-1 rounded text-xs font-semibold"
                        style={{
                          background: project.agent === 'Horner' ? 'rgba(139,92,246,0.2)' : 'rgba(34,197,94,0.2)',
                          color: project.agent === 'Horner' ? '#A78BFA' : '#86EFAC',
                        }}
                      >
                        {project.agent}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className="px-2 py-1 rounded text-xs font-semibold"
                        style={{
                          background:
                            project.status === 'complete'
                              ? 'rgba(34,197,94,0.2)'
                              : project.status === 'running'
                              ? 'rgba(59,130,246,0.2)'
                              : project.status === 'eligible'
                              ? 'rgba(251,146,60,0.2)'
                              : 'rgba(148,163,184,0.2)',
                          color:
                            project.status === 'complete'
                              ? '#86EFAC'
                              : project.status === 'running'
                              ? '#93C5FD'
                              : project.status === 'eligible'
                              ? '#FDBA74'
                              : '#CBD5E1',
                        }}
                      >
                        {project.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
