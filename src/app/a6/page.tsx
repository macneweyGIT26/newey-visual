'use client'

import React from 'react';

export default function A6Page() {
  const lastUpdated = '2026-03-22 21:24 EDT';

  const agents = [
    {
      name: 'Horner',
      role: 'audit',
      checks: 7,
      issuesFound: 4,
      critical: 0,
      cost: 0.24,
      color: '#8B5CF6',
      lastRun: '2026-03-22 20:49 EDT',
      summary: '0 CRITICAL · 2 WARN · 2 INFO — trading architecture validated',
    },
    {
      name: 'Zack',
      role: 'watchdog',
      checks: 9,
      issuesFound: 0,
      critical: 0,
      cost: 0.10,
      color: '#22C55E',
      lastRun: '2026-03-22 21:00 EDT',
      summary: '5 PASS · 4 WARN · 0 FAIL — healthy after token ledger fix',
    },
  ];

  const scheduledJobs = [
    {
      name: 'Regime Monitor',
      frequency: 'Every 30 min',
      lastSuccess: '2026-03-22 21:00 EDT',
      status: 'healthy',
      canonicalPath: '~/.openclaw/workspace/tracker/regime_monitor.log',
      notes: 'Silent mode. Alerts on shift only.',
    },
    {
      name: 'Trade Executor',
      frequency: 'Every 4 hours',
      lastSuccess: '2026-03-22 18:40 EDT',
      status: 'healthy',
      canonicalPath: 'journal/trades.csv',
      notes: 'Stage C — PingPong live, Core monitoring',
    },
    {
      name: 'A4 Live JSON',
      frequency: 'Hourly @ :29',
      lastSuccess: '2026-03-22 20:29 EDT',
      status: 'healthy',
      canonicalPath: '~/.openclaw/workspace/projects/newey-visual/src/data/live.json',
      notes: '',
    },
    {
      name: 'Nightly Backup',
      frequency: 'Daily 1:00 AM',
      lastSuccess: '2026-03-22 01:00 EDT',
      status: 'healthy',
      canonicalPath: '~/QBranch/Backups/',
      notes: '70 MB, nominal',
    },
    {
      name: 'Session Handoff',
      frequency: 'Daily 2:59 AM',
      lastSuccess: '2026-03-22 02:59 EDT',
      status: 'healthy',
      canonicalPath: '~/.openclaw/workspace/memory/YYYY-MM-DD.md',
      notes: '',
    },
    {
      name: 'Token Ledger',
      frequency: 'Friday 5:00 PM',
      lastSuccess: '2026-03-22 20:58 EDT',
      status: 'healthy',
      canonicalPath: '~/newey/token_ledger.md',
      notes: 'Manual reconciliation cleared FAIL',
    },
    {
      name: 'Security Audit',
      frequency: 'Sunday 9:00 AM',
      lastSuccess: '2026-03-22 09:00 EDT',
      status: 'healthy',
      canonicalPath: '~/.openclaw/workspace/tracker/audits.log',
      notes: '',
    },
  ];

  const activeItems = [
    {
      name: 'CASE-001: Reset Memory Path',
      status: 'monitor',
      agent: 'System',
      nextAction: 'Await 03:00 AM scheduled proof (2026-03-23)',
      lastChecked: '2026-03-22 08:30 EDT',
    },
    {
      name: 'PP-001: ETH SHORT',
      status: 'open',
      agent: 'PingPong',
      nextAction: 'Set TP/SL after Monday volume assessment',
      lastChecked: '2026-03-22 20:49 EDT',
    },
    {
      name: 'Gateway operator.read scope',
      status: 'blocked',
      agent: 'System',
      nextAction: 'Regenerate auth token or grant scope',
      lastChecked: '2026-03-22 09:00 EDT',
    },
    {
      name: 'Trading Architecture Migration',
      status: 'complete',
      agent: 'Horner',
      nextAction: 'Monitor Stage C operations',
      lastChecked: '2026-03-22 20:49 EDT',
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Tab Bar */}
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
          <p className="text-xs text-stone-500 mt-1">Last updated: {lastUpdated}</p>
        </div>

        {/* System Health */}
        <div className="border border-slate-700 rounded-lg p-8 bg-slate-900/50 backdrop-blur mb-12">
          <h3 className="text-xl font-bold mb-6">System Health</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div>
              <p className="text-sm text-slate-400">Cron Jobs</p>
              <p className="text-3xl font-bold text-blue-400">7</p>
              <p className="text-xs text-green-400 mt-1">Active</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Strategies</p>
              <p className="text-3xl font-bold text-purple-400">2</p>
              <p className="text-xs text-slate-400 mt-1">Core + PingPong</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Stage</p>
              <p className="text-3xl font-bold text-amber-400">C</p>
              <p className="text-xs text-slate-400 mt-1">PP live · Core monitor</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Reserve</p>
              <p className="text-3xl font-bold text-green-400">81%</p>
              <p className="text-xs text-green-400 mt-1">Above 75% min</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Watchdog</p>
              <p className="text-3xl font-bold text-green-400">9/9</p>
              <p className="text-xs text-green-400 mt-1">No FAIL</p>
            </div>
          </div>
        </div>

        {/* Active Items — rolls forward */}
        <div className="border border-slate-700 rounded-lg p-8 bg-slate-900/50 backdrop-blur mb-12">
          <h3 className="text-xl font-bold mb-6">Active Items</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400 font-semibold">Item</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-semibold">Owner</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-semibold">Next Action</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-semibold hidden md:table-cell">Last Checked</th>
                </tr>
              </thead>
              <tbody>
                {activeItems.map((item, idx) => {
                  const statusColorMap: Record<string, { bg: string; text: string }> = {
                    monitor: { bg: 'rgba(251, 146, 60, 0.15)', text: '#fb923c' },
                    open: { bg: 'rgba(59, 130, 246, 0.15)', text: '#93C5FD' },
                    blocked: { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444' },
                    complete: { bg: 'rgba(34, 197, 94, 0.15)', text: '#86EFAC' },
                  };
                  const colors = statusColorMap[item.status] || statusColorMap.monitor;

                  return (
                    <tr key={idx} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 text-slate-200 font-medium">{item.name}</td>
                      <td className="py-3 px-4">
                        <span
                          className="px-2 py-1 rounded text-xs font-semibold capitalize"
                          style={{ background: colors.bg, color: colors.text }}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400">{item.agent}</td>
                      <td className="py-3 px-4 text-slate-300 text-xs">{item.nextAction}</td>
                      <td className="py-3 px-4 text-slate-500 text-xs hidden md:table-cell">{item.lastChecked}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Scheduled Jobs Health */}
        <div className="border border-slate-700 rounded-lg p-8 bg-slate-900/50 backdrop-blur mb-12">
          <h3 className="text-xl font-bold mb-6">Scheduled Jobs</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400 font-semibold">Job</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-semibold">Frequency</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-semibold">Last Success</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-semibold hidden lg:table-cell">Notes</th>
                </tr>
              </thead>
              <tbody>
                {scheduledJobs.map((job, idx) => {
                  const statusColorMap: Record<string, { bg: string; text: string }> = {
                    healthy: { bg: 'rgba(34, 197, 94, 0.1)', text: '#4ade80' },
                    warn: { bg: 'rgba(251, 146, 60, 0.1)', text: '#fb923c' },
                    stale: { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444' },
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
                          style={{ background: colors.bg, color: colors.text }}
                        >
                          {job.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 text-xs hidden lg:table-cell">{job.notes}</td>
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
              <div className="flex items-center gap-3 mb-2">
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
              <p className="text-xs text-slate-500 mb-4">Last run: {agent.lastRun}</p>
              <p className="text-xs text-slate-400 mb-6">{agent.summary}</p>

              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-slate-400">Checks</p>
                  <p className="text-2xl font-bold text-blue-400">{agent.checks}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Issues</p>
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
      </div>
    </div>
  );
}
