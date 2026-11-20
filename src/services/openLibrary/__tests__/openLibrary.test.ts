import { http, HttpResponse } from 'msw/http'
import { OPEN_LIBRARY_BASE_URL } from '@/constants'
import { ApiError, buildCoverUrl, getWork, searchBooks } from '@/services/openLibrary'
import { server, TEST_WORK_AUTHOR, TEST_WORK_DESCRIPTION, TEST_WORK_ID } from '@/test-utils'
import { SEARCH_URL, WORK_URL_PATTERN } from '@/test-utils/msw/urls'

describe('searchBooks', () => {
  it('maps docs to summaries and tolerates missing fields', async () => {
    let requested: URL | undefined
    server.use(
      http.get(SEARCH_URL, ({ request }) => {
        requested = new URL(request.url)
        return HttpResponse.json({ numFound: 1, start: 0, docs: [{ key: '/works/OL1W' }] })
      }),
    )

    const page = await searchBooks({ query: 'dune', sort: 'new', page: 2 })

    expect(page).toEqual({
      total: 1,
      page: 2,
      books: [{ id: 'OL1W', title: 'Untitled', authors: [] }],
    })
    expect(requested?.searchParams.get('q')).toBe('dune')
    expect(requested?.searchParams.get('sort')).toBe('new')
    expect(requested?.searchParams.get('page')).toBe('2')
  })

  it('omits the sort param for relevance', async () => {
    let sort: string | null = 'unset'
    server.use(
      http.get(SEARCH_URL, ({ request }) => {
        sort = new URL(request.url).searchParams.get('sort')
        return HttpResponse.json({ numFound: 0, start: 0, docs: [] })
      }),
    )
    await searchBooks({ query: 'x', sort: 'relevance', page: 1 })
    expect(sort).toBeNull()
  })

  it('throws ApiError on HTTP failures', async () => {
    server.use(http.get(SEARCH_URL, () => new HttpResponse(null, { status: 503 })))
    await expect(searchBooks({ query: 'x', sort: 'relevance', page: 1 })).rejects.toBeInstanceOf(
      ApiError,
    )
  })
})

describe('getWork', () => {
  it('normalizes description, cover sentinel and authors', async () => {
    const work = await getWork(TEST_WORK_ID)
    expect(work.description).toMatch(new RegExp(`^${TEST_WORK_DESCRIPTION}`))
    expect(work.coverId).toBe(42)
    expect(work.authors).toEqual([TEST_WORK_AUTHOR])
    expect(work.subjects).toEqual(['Science fiction', 'Gender'])
  })

  it('accepts a plain-string description and survives a failed author lookup', async () => {
    server.use(
      http.get(WORK_URL_PATTERN, () =>
        HttpResponse.json({
          title: 'T',
          description: 'Plain text',
          authors: [{ author: { key: '/authors/OL9A' } }],
        }),
      ),
      http.get(
        `${OPEN_LIBRARY_BASE_URL}/authors/:id.json`,
        () => new HttpResponse(null, { status: 500 }),
      ),
    )
    const work = await getWork('OL1W')
    expect(work.description).toBe('Plain text')
    expect(work.authors).toEqual([])
    expect(work.coverId).toBeUndefined()
  })
})

it('builds cover URLs that 404 when missing', () => {
  expect(buildCoverUrl(7, 'L')).toBe('https://covers.openlibrary.org/b/id/7-L.jpg?default=false')
})
