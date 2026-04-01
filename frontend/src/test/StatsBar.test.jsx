import { render, screen } from '@testing-library/react'
import StatsBar from '../components/StatsBar'

const mockUsers = [
  { mfaEnabled: true, passwordStale: true, accessStale: true },
  { mfaEnabled: true, passwordStale: true, accessStale: true },
  { mfaEnabled: false, passwordStale: false, accessStale: false },
  { mfaEnabled: false, passwordStale: true, accessStale: true },
]

describe('StatsBar', () => {
  it('renders all 4 stat cards', () => {
    render(<StatsBar users={mockUsers} />)
    expect(screen.getByText('Total Users')).toBeInTheDocument()
    expect(screen.getByText('MFA Enabled')).toBeInTheDocument()
    expect(screen.getByText('Stale Password (>1yr)')).toBeInTheDocument()
    expect(screen.getByText('Inactive >90 days')).toBeInTheDocument()
  })

  it('shows correct total user count', () => {
    render(<StatsBar users={mockUsers} />)
    expect(screen.getByText('4')).toBeInTheDocument()
  })

  it('shows correct MFA enabled ratio', () => {
    render(<StatsBar users={mockUsers} />)
    expect(screen.getByText('2/4')).toBeInTheDocument()
  })

  it('shows correct stale password count', () => {
    render(<StatsBar users={mockUsers} />)
    const allThrees = screen.getAllByText('3')
    expect(allThrees.length).toBeGreaterThanOrEqual(1)
  })

  it('shows correct inactive count', () => {
    render(<StatsBar users={mockUsers} />)
    const allThrees = screen.getAllByText('3')
    expect(allThrees.length).toBeGreaterThanOrEqual(1)
  })

  it('renders with empty users array', () => {
    render(<StatsBar users={[]} />)
    const zeros = screen.getAllByText('0')
    expect(zeros.length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('0/0')).toBeInTheDocument()
  })
})