import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import UserTable from '../components/UserTable'

const mockUsers = [
  {
    name: 'Foo Bar1',
    userCreateDate: 'Oct 1 2020',
    passwordChangedDate: 'Oct 1 2021',
    daysSincePasswordChange: 1643,
    lastAccessDate: 'Jan 4 2025',
    daysSinceLastAccess: 452,
    mfaEnabled: true,
    passwordStale: true,
    accessStale: true,
  },
  {
    name: 'Human3',
    userCreateDate: 'Apr 8 2025',
    passwordChangedDate: 'May 8 2025',
    daysSincePasswordChange: 328,
    lastAccessDate: 'May 23 2025',
    daysSinceLastAccess: 313,
    mfaEnabled: true,
    passwordStale: false,
    accessStale: true,
  },
]

const defaultSort = { key: null, dir: 'asc' }

describe('UserTable', () => {
  it('renders all column headers', () => {
    render(<UserTable users={mockUsers} sortConfig={defaultSort} onSort={() => {}} />)
    expect(screen.getByText(/Name/i)).toBeInTheDocument()
    expect(screen.getByText(/Created/i)).toBeInTheDocument()
    expect(screen.getByText(/PW Changed/i)).toBeInTheDocument()
    expect(screen.getByText(/Days Since PW/i)).toBeInTheDocument()
    expect(screen.getByText(/Last Access/i)).toBeInTheDocument()
    expect(screen.getByText(/Days Since Access/i)).toBeInTheDocument()
    expect(screen.getByText(/MFA/i)).toBeInTheDocument()
  })

  it('renders all user rows', () => {
    render(<UserTable users={mockUsers} sortConfig={defaultSort} onSort={() => {}} />)
    expect(screen.getByText('Foo Bar1')).toBeInTheDocument()
    expect(screen.getByText('Human3')).toBeInTheDocument()
  })

  it('shows STALE badge for stale password users', () => {
    render(<UserTable users={mockUsers} sortConfig={defaultSort} onSort={() => {}} />)
    expect(screen.getByText('STALE')).toBeInTheDocument()
  })

  it('shows INACTIVE badge for inactive users', () => {
    render(<UserTable users={mockUsers} sortConfig={defaultSort} onSort={() => {}} />)
    const badges = screen.getAllByText('INACTIVE')
    expect(badges.length).toBe(2)
  })

  it('shows YES for MFA enabled users', () => {
    render(<UserTable users={mockUsers} sortConfig={defaultSort} onSort={() => {}} />)
    const yesBadges = screen.getAllByText('YES')
    expect(yesBadges.length).toBe(2)
  })

  it('shows empty state when no users', () => {
    render(<UserTable users={[]} sortConfig={defaultSort} onSort={() => {}} />)
    expect(screen.getByText('No users match the current filters.')).toBeInTheDocument()
  })

  it('calls onSort when column header is clicked', async () => {
    const onSort = vi.fn()
    render(<UserTable users={mockUsers} sortConfig={defaultSort} onSort={onSort} />)
    await userEvent.click(screen.getByText(/Name/i))
    expect(onSort).toHaveBeenCalledWith('name')
  })

  it('shows sort arrow when column is active', () => {
    render(<UserTable users={mockUsers} sortConfig={{ key: 'name', dir: 'asc' }} onSort={() => {}} />)
    expect(screen.getByText(/↑/)).toBeInTheDocument()
  })
})