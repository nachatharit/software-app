import { useApps } from '../context/useApps'

export function StatsBar() {
  const { stats } = useApps()
  const pct = stats.total === 0 ? 0 : Math.round((stats.completed / stats.total) * 100)

  return (
    <div className="stats-bar">
      <div className="stats-counts">
        <span className="stat"><strong>{stats.total}</strong> total</span>
        <span className="stat-divider">·</span>
        <span className="stat"><strong>{stats.active}</strong> active</span>
        <span className="stat-divider">·</span>
        <span className="stat stat--done"><strong>{stats.completed}</strong> done</span>
      </div>
      <div className="progress-track" aria-label={`${pct}% complete`}>
        <div
          className="progress-fill"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  )
}
