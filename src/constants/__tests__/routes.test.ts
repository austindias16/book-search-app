import { buildSearchPath, buildWorkPath, SORT_OPTION } from '@/constants'

describe('route builders', () => {
  it('builds a bare home path for an empty query', () => {
    expect(buildSearchPath({ query: '', sort: SORT_OPTION.newest })).toBe('/')
    expect(buildSearchPath()).toBe('/')
  })

  it('omits sort for relevance and includes it otherwise', () => {
    expect(buildSearchPath({ query: 'dune', sort: SORT_OPTION.relevance })).toBe('/?q=dune')
    expect(buildSearchPath({ query: 'dune', sort: SORT_OPTION.newest })).toBe('/?q=dune&sort=new')
  })

  it('encodes the query', () => {
    expect(buildSearchPath({ query: 'a&b' })).toBe('/?q=a%26b')
  })

  it('builds work paths with encoded ids', () => {
    expect(buildWorkPath('OL1W')).toBe('/works/OL1W')
  })
})
