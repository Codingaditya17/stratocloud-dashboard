import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FilterBar from '../components/FilterBar'

describe('FilterBar', () => {
  const defaultFilters = { mfa: 'all', stale: 'all', search: '' }

  it('renders search input', () => {
    render(<FilterBar filters={defaultFilters} setFilters={() => {}} total={8} />)
    expect(screen.getByPlaceholderText('Search by name...')).toBeInTheDocument()
  })

  it('renders MFA dropdown', () => {
    render(<FilterBar filters={defaultFilters} setFilters={() => {}} total={8} />)
    expect(screen.getByText('All MFA')).toBeInTheDocument()
    expect(screen.getByText('MFA On')).toBeInTheDocument()
    expect(screen.getByText('MFA Off')).toBeInTheDocument()
  })

  it('renders stale dropdown', () => {
    render(<FilterBar filters={defaultFilters} setFilters={() => {}} total={8} />)
    expect(screen.getByText('All Users')).toBeInTheDocument()
    expect(screen.getByText('Stale Password')).toBeInTheDocument()
    expect(screen.getByText('Inactive 90+ days')).toBeInTheDocument()
  })

  it('shows correct user count', () => {
    render(<FilterBar filters={defaultFilters} setFilters={() => {}} total={8} />)
    expect(screen.getByText('8 users')).toBeInTheDocument()
  })

  it('shows singular user when count is 1', () => {
    render(<FilterBar filters={defaultFilters} setFilters={() => {}} total={1} />)
    expect(screen.getByText('1 user')).toBeInTheDocument()
  })

  it('calls setFilters when search input changes', async () => {
    const setFilters = vi.fn()
    render(<FilterBar filters={defaultFilters} setFilters={setFilters} total={8} />)
    const input = screen.getByPlaceholderText('Search by name...')
    await userEvent.type(input, 'Foo')
    expect(setFilters).toHaveBeenCalled()
  })

  it('calls setFilters when MFA dropdown changes', async () => {
    const setFilters = vi.fn()
    render(<FilterBar filters={defaultFilters} setFilters={setFilters} total={8} />)
    const select = screen.getByDisplayValue('All MFA')
    await userEvent.selectOptions(select, 'true')
    expect(setFilters).toHaveBeenCalled()
  })
})