import { useApps } from '../context/useApps'
import type { FilterStatus, SortBy } from '../types/types'

const FILTERS: { value: FilterStatus; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Done' },
]

const SORTS: { value: SortBy; label: string }[] = [
  { value: 'createdAt', label: 'Newest' },
  { value: 'priority', label: 'Priority' },
  { value: 'title', label: 'A–Z' },
]

export function Toolbar() {
  const { filter, setFilter, sortBy, setSortBy, searchQuery, setSearchQuery } = useApps()

  return (
    <div className="toolbar">
      <div className="search-wrap">
        <svg className="search-icon" viewBox="0 0 16 16" fill="none">
          <circle cx="6.5" cy="6.5" r="4" stroke="currentColor" strokeWidth="1.5" />
          <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input
          className="search-input"
          type="search"
          placeholder="Search tasks…"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          aria-label="Search tasks"
        />
        {searchQuery && (
          <button className="search-clear" onClick={() => setSearchQuery('')} aria-label="Clear search">✕</button>
        )}
      </div>

      <div className="filter-tabs" role="tablist">
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            role="tab"
            aria-selected={filter === value}
            className={`filter-tab ${filter === value ? 'active' : ''}`}
            onClick={() => setFilter(value)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="sort-wrap">
        <span className="sort-label">Sort:</span>
        <select
          className="sort-select"
          value={sortBy}
          onChange={e => setSortBy(e.target.value as SortBy)}
        >
          {SORTS.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
