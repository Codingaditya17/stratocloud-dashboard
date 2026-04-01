const cols = [
  { key: 'name', label: 'Name' },
  { key: 'userCreateDate', label: 'Created' },
  { key: 'passwordChangedDate', label: 'PW Changed' },
  { key: 'daysSincePasswordChange', label: 'Days Since PW' },
  { key: 'lastAccessDate', label: 'Last Access' },
  { key: 'daysSinceLastAccess', label: 'Days Since Access' },
  { key: 'mfaEnabled', label: 'MFA' },
]

export default function UserTable({ users, sortConfig, onSort }) {
  if (!users.length) return (
    <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)', fontFamily: 'IBM Plex Mono, monospace', fontSize: 13 }}>
      No users match the current filters.
    </div>
  )

  return (
    <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: 8 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: 'var(--surface2)', borderBottom: '1px solid var(--border)' }}>
            {cols.map(c => (
              <th
                key={c.key}
                onClick={() => onSort(c.key)}
                style={{
                  padding: '10px 14px', textAlign: 'left', cursor: 'pointer',
                  userSelect: 'none', color: 'var(--muted)', fontWeight: 500,
                  fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em',
                  whiteSpace: 'nowrap'
                }}
              >
                {c.label} {sortConfig.key === c.key ? (sortConfig.dir === 'asc' ? '↑' : '↓') : ''}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr
              key={u.name + i}
              style={{
                borderBottom: '1px solid var(--border)',
                background: (u.passwordStale || u.accessStale)
                  ? 'rgba(245,158,11,0.04)'
                  : (i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)'),
              }}
            >
              <td style={{ padding: '10px 14px', fontWeight: 500 }}>{u.name}</td>
              <td style={{ padding: '10px 14px', color: 'var(--muted)', fontFamily: 'IBM Plex Mono, monospace', fontSize: 12 }}>
                {u.userCreateDate}
              </td>
              <td style={{ padding: '10px 14px', fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, color: u.passwordStale ? 'var(--warn)' : 'var(--muted)' }}>
                {u.passwordChangedDate}
              </td>
              <td style={{ padding: '10px 14px', fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, color: u.passwordStale ? 'var(--warn)' : 'inherit' }}>
                {u.daysSincePasswordChange}
                {u.passwordStale && (
                  <span style={{ marginLeft: 6, fontSize: 10, background: 'rgba(245,158,11,0.15)', color: 'var(--warn)', padding: '2px 5px', borderRadius: 3 }}>
                    STALE
                  </span>
                )}
              </td>
              <td style={{ padding: '10px 14px', fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, color: 'var(--muted)' }}>
                {u.lastAccessDate}
              </td>
              <td style={{ padding: '10px 14px', fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, color: u.accessStale ? 'var(--danger)' : 'inherit' }}>
                {u.daysSinceLastAccess}
                {u.accessStale && (
                  <span style={{ marginLeft: 6, fontSize: 10, background: 'rgba(239,68,68,0.15)', color: 'var(--danger)', padding: '2px 5px', borderRadius: 3 }}>
                    INACTIVE
                  </span>
                )}
              </td>
              <td style={{ padding: '10px 14px' }}>
                <span style={{
                  fontSize: 11, padding: '3px 8px', borderRadius: 4,
                  fontFamily: 'IBM Plex Mono, monospace',
                  background: u.mfaEnabled ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.12)',
                  color: u.mfaEnabled ? 'var(--success)' : 'var(--danger)'
                }}>
                  {u.mfaEnabled ? 'YES' : 'NO'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}