export default function FilterBar({ filters, setFilters, total }) {
  return (
    <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
      <input
        placeholder="Search by name..."
        value={filters.search}
        onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
        style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 6, padding: '7px 12px', color: 'var(--text)',
          fontSize: 13, width: 200, outline: 'none'
        }}
      />
      <select
        value={filters.mfa}
        onChange={e => setFilters(f => ({ ...f, mfa: e.target.value }))}
        style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 6, padding: '7px 12px', color: 'var(--text)',
          fontSize: 13, outline: 'none'
        }}
      >
        <option value="all">All MFA</option>
        <option value="true">MFA On</option>
        <option value="false">MFA Off</option>
      </select>
      <select
        value={filters.stale}
        onChange={e => setFilters(f => ({ ...f, stale: e.target.value }))}
        style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 6, padding: '7px 12px', color: 'var(--text)',
          fontSize: 13, outline: 'none'
        }}
      >
        <option value="all">All Users</option>
        <option value="password">Stale Password</option>
        <option value="access">Inactive 90+ days</option>
      </select>
      <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--muted)', fontFamily: 'IBM Plex Mono, monospace' }}>
        {total} user{total !== 1 ? 's' : ''}
      </span>
    </div>
  )
}