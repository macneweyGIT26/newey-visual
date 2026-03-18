'use client'

export default function A5Page() {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">A5 — Agent Intelligence</h1>
          <p className="text-slate-400">Live agent activity + system health</p>
        </div>

        {/* Agent Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Horner */}
          <div className="relative border border-slate-700 rounded-lg p-8 bg-slate-900/50 backdrop-blur">
            {/* Pulsing Glow */}
            <div
              className="absolute inset-0 rounded-lg opacity-50"
              style={{
                background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
                animation: 'pulse 3s ease-in-out infinite',
              }}
            />

            {/* Content */}
            <div className="relative z-10">
              {/* Name + Role */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{
                    background: '#8B5CF6',
                    boxShadow: '0 0 12px rgba(139,92,246,0.8)',
                  }}
                />
                <h2 className="text-2xl font-bold">Horner</h2>
                <span className="text-sm px-3 py-1 rounded-full bg-slate-800 text-slate-300">
                  audit
                </span>
              </div>

              {/* Status */}
              <div className="mb-4">
                <p className="text-sm text-slate-400">
                  Status: <span className="text-green-400 font-semibold">complete</span>
                </p>
                <p className="text-xs text-slate-500">
                  Last run: 2026-03-17 20:02
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-slate-400">Issues Found</p>
                  <p className="text-2xl font-bold text-orange-400">11</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Critical</p>
                  <p className="text-2xl font-bold text-red-500">3</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Cost</p>
                  <p className="text-xl font-bold text-green-400">$0.24</p>
                </div>
              </div>
            </div>
          </div>

          {/* Zack */}
          <div className="relative border border-slate-700 rounded-lg p-8 bg-slate-900/50 backdrop-blur">
            {/* Pulsing Glow */}
            <div
              className="absolute inset-0 rounded-lg opacity-50"
              style={{
                background: 'radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 70%)',
                animation: 'pulse 2s ease-in-out infinite',
              }}
            />

            {/* Content */}
            <div className="relative z-10">
              {/* Name + Role */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{
                    background: '#22C55E',
                    boxShadow: '0 0 12px rgba(34,197,94,0.8)',
                  }}
                />
                <h2 className="text-2xl font-bold">Zack</h2>
                <span className="text-sm px-3 py-1 rounded-full bg-slate-800 text-slate-300">
                  watchdog
                </span>
              </div>

              {/* Status */}
              <div className="mb-4">
                <p className="text-sm text-slate-400">
                  Status: <span className="text-green-400 font-semibold">ready</span>
                </p>
                <p className="text-xs text-slate-500">
                  Awaiting trigger
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-slate-400">Checks</p>
                  <p className="text-2xl font-bold text-blue-400">12</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Status</p>
                  <p className="text-sm font-semibold text-green-400">Active</p>
                </div>
              </div>

              {/* Triggers */}
              <div className="text-xs text-slate-400">
                <p className="mb-2">Triggers:</p>
                <ul className="space-y-1">
                  <li>• session gap 5d</li>
                  <li>• user request</li>
                  <li>• before horner</li>
                  <li>• monthly</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="border border-slate-700 rounded-lg p-8 bg-slate-900/50 backdrop-blur">
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
      </div>

      {/* CSS for pulsing animation */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
}
