export default function StatsBar({ users }) {
  const total = users.length
  const mfaOn = users.filter(u => u.mfaEnabled).length
  const pwStale = users.filter(u => u.passwordStale).length
  const accessStale = users.filter(u => u.accessStale).length

  const stats = [
    { label: 'Total Users', value: total, color: 'var(--accent)' },
    { label: 'MFA Enabled', value: `${mfaOn}/${total}`, color: 'var(--success)' },
    { label: 'Stale Password (>1yr)', value: pwStale, color: 'var(--warn)' },
    { label: 'Inactive >90 days', value: accessStale, color: 'var(--danger)' },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
      {stats.map(s => (
        <div key={s.label} style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          padding: '14px 18px',
          borderTop: `2px solid ${s.color}`
        }}>
          <div style={{ fontSize: 22, fontWeight: 600, fontFamily: 'IBM Plex Mono, monospace', color: s.color }}>
            {s.value}
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{s.label}</div>
        </div>
      ))}
    </div>
  )
}