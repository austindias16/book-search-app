import { renderHook, act } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router'
import { SORT_OPTION } from '@/constants'
import { useSearchUrlState } from '../hooks/useSearchUrlState'

function renderSearchUrlState(initialEntry: string) {
  return renderHook(() => ({ state: useSearchUrlState(), location: useLocation() }), {
    wrapper: ({ children }) => (
      <MemoryRouter initialEntries={[initialEntry]}>{children}</MemoryRouter>
    ),
  })
}

describe('useSearchUrlState', () => {
  it('reads the query and falls back to relevance for an unknown sort', () => {
    const { result } = renderSearchUrlState('/?q=dune&sort=bogus')
    expect(result.current.state.query).toBe('dune')
    expect(result.current.state.sort).toBe(SORT_OPTION.relevance)
  })

  it('omits the sort param when it is relevance', () => {
    const { result } = renderSearchUrlState('/?q=dune&sort=new')
    act(() => result.current.state.setSearch({ sort: SORT_OPTION.relevance }))
    expect(result.current.location.search).toBe('?q=dune')
  })

  it('omits the sort param when the query is empty', () => {
    const { result } = renderSearchUrlState('/?q=dune&sort=new')
    act(() => result.current.state.setSearch({ query: '   ', sort: SORT_OPTION.newest }))
    expect(result.current.location.search).toBe('')
  })

  it('keeps a non-default sort when a query is set', () => {
    const { result } = renderSearchUrlState('/')
    act(() => result.current.state.setSearch({ query: 'dune', sort: SORT_OPTION.newest }))
    expect(result.current.location.search).toBe('?q=dune&sort=new')
  })
})
