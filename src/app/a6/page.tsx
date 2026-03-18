'use client'

import React from 'react';

export default function A6Page() {
  const agents = [
    {
      name: 'Horner',
      role: 'audit',
      checks: 11,
      issuesFound: 11,
      critical: 3,
      cost: 0.24,
      color: '#8B5CF6',
    },
    {
      name: 'Zack',
      role: 'watchdog',
      checks: 12,
      issuesFound: 0,
      critical: 0,
      cost: 0.10,
      color: '#22C55E',
    },
  ];

  const projects = [
    { name: 'CRON_JOBS.md', lastChecked: '2026-03-18 22:02', agent: 'Horner', status: 'complete' },
    { name: 'Regime Monitor', lastChecked: '2026-03-18 15:29', agent: 'Zack', status: 'running' },
    { name: 'Trade Executor', lastChecked: '2026-03-18 14:40', agent: 'Horner', status: 'eligible' },
    { name: 'A4 Activity Update', lastChecked: '2026-03-18 15:00', agent: 'Zack', status: 'active' },
    { name: 'Position Monitor', lastChecked: '2026-03-17 12:00', agent: 'Zack', status: 'disabled' },
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Tab Bar */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-8 py-3">
          <nav className="flex gap-6 text-sm tracking-wider uppercase">
            <a href="/a4" className="text-slate-400 hover:text-amber-500 transition-colors">A4</a>
            <a href="/a5" className="text-slate-400 hover:text-green-500 transition-colors">A5</a>
            <a href="/a6" className="text-blue-500 font-bold">A6</a>
            <a href="/" className="text-slate-400 hover:text-slate-300 transition-colors ml-auto">Light</a>
            <a href="/dark" className="text-slate-400 hover:text-slate-300 transition-colors">Dark</a>
            <a href="/mashup" className="text-slate-400 hover:text-slate-300 transition-colors">Mashup</a>
            <a href="/guide" className="text-slate-400 hover:text-slate-300 transition-colors">Guide</a>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">A6 — Agent Intelligence</h1>
          <p className="text-slate-400">Live agent activity + system health</p>
        </div>

        {/* System Health */}
        <div className="border border-slate-700 rounded-lg p-8 bg-slate-900/50 backdrop-blur mb-12">
          <h3 className="text-xl font-bold mb-6">System Health</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
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
            <div>
              <p className="text-sm text-slate-400">Total Cost</p>
              <p className="text-2xl font-bold text-green-400">$365.58</p>
              <p className="text-xs text-slate-500">YTD</p>
            </div>
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
