import { useState, useEffect } from 'react'
import UserTable from './components/UserTable'
import FilterBar from './components/FilterBar'
import StatsBar from './components/StatsBar'

const API_URL = 'http://localhost:8080'

export default function App() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({ mfa: 'all', stale: 'all', search: '' })
  const [sortConfig, setSortConfig] = useState({ key: null, dir: 'asc' })

  useEffect(() => {
    const params = new URLSearchParams()
    if (filters.mfa !== 'all') params.set('mfa', filters.mfa)
    if (filters.stale === 'password') params.set('stale', 'password')
    if (filters.stale === 'access') params.set('stale', 'access')

    setLoading(true)
    fetch(`${API_URL}/api/users?${params}`)
      .then(r => {
        if (!r.ok) throw new Error('HTTP ' + r.status)
        return r.json()
      })
      .then(data => { setUsers(data); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [filters.mfa, filters.stale])

  const displayed = users
    .filter(u =>
      filters.search === '' ||
      u.name.toLowerCase().includes(filters.search.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortConfig.key) return 0
      const av = a[sortConfig.key], bv = b[sortConfig.key]
      if (typeof av === 'boolean') return sortConfig.dir === 'asc' ? (av === bv ? 0 : av ? 1 : -1) : (av === bv ? 0 : av ? -1 : 1)
      if (typeof av === 'number') return sortConfig.dir === 'asc' ? av - bv : bv - av
      return sortConfig.dir === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av))
    })

  const handleSort = (key) => {
    setSortConfig(s => ({
      key,
      dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc'
    }))
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <div style={{
        borderBottom: '1px solid var(--border)',
        background: 'var(--surface)',
        padding: '20px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 700, color: '#fff',
            fontFamily: 'IBM Plex Mono, monospace'
          }}>S</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>
              Strato<span style={{ color: 'var(--accent)' }}>Cloud</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'IBM Plex Mono, monospace' }}>
              User Security Dashboard
            </div>
          </div>
        </div>
        <div style={{
          fontSize: 11, color: 'var(--muted)', fontFamily: 'IBM Plex Mono, monospace',
          padding: '4px 10px', border: '1px solid var(--border)', borderRadius: 4
        }}>
          Live · {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      <div style={{ padding: '24px 32px', maxWidth: 1400, margin: '0 auto' }}>
        {!loading && !error && <StatsBar users={users} />}
        <FilterBar filters={filters} setFilters={setFilters} total={displayed.length} />

        {loading && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--muted)', fontFamily: 'IBM Plex Mono, monospace', fontSize: 13 }}>
            Fetching users from Go API...
          </div>
        )}

        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 8, padding: '16px 20px', color: '#fca5a5',
            fontFamily: 'IBM Plex Mono, monospace', fontSize: 13
          }}>
            Failed to connect to Go API: {error}
            <div style={{ marginTop: 6, color: 'var(--muted)', fontSize: 11 }}>
              Make sure the backend is running: cd backend && go run main.go
            </div>
          </div>
        )}

        {!loading && !error && (
          <UserTable users={displayed} sortConfig={sortConfig} onSort={handleSort} />
        )}
      </div>
    </div>
  )
}