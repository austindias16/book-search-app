import { act, screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw/http'
import { buildSearchPath, SEARCH_DEBOUNCE_MS, STRINGS } from '@/constants'
import {
  EMPTY_QUERY,
  renderRoute,
  selectAntdOption,
  server,
  TEST_PAGE_SIZE,
  TEST_QUERY,
  TEST_TOTAL,
} from '@/test-utils'
import { SEARCH_URL } from '@/test-utils/msw/urls'

const FIRST_BOOK = 'Book 1'
const DEBOUNCE_WAIT_MS = SEARCH_DEBOUNCE_MS * 2
const SECOND_PAGE_BOOK = 'Book 30'

describe('SearchPage', () => {
  it('shows the landing hero when there is no query', async () => {
    const { router } = renderRoute('/')
    expect(
      await screen.findByRole('heading', { name: /find your next great read/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('searchbox')).toHaveValue('')
    expect(router.state.location.search).toBe('')
  })

  it('debounces typing into the URL and shows results', async () => {
    const { router, user } = renderRoute('/')

    await user.type(await screen.findByRole('searchbox'), TEST_QUERY)

    await waitFor(() => expect(router.state.location.search).toBe(`?q=${TEST_QUERY}`))
    expect(
      await screen.findByRole('heading', {
        name: STRINGS.search.resultsCount(String(TEST_TOTAL), TEST_QUERY, false),
      }),
    ).toBeInTheDocument()
    const grid = screen.getByRole('list', { name: STRINGS.search.resultsListLabel })
    expect(within(grid).getAllByRole('link')).toHaveLength(TEST_PAGE_SIZE)
  })

  it('keeps typed text when the URL updates mid-typing', async () => {
    const { router, user } = renderRoute('/')
    const input = await screen.findByRole('searchbox')
    await user.type(input, 'dun')
    await waitFor(() => expect(router.state.location.search).toBe('?q=dun'))
    await user.type(input, 'e')
    expect(input).toHaveValue(TEST_QUERY)
    await waitFor(() => expect(router.state.location.search).toBe(`?q=${TEST_QUERY}`))
    expect(input).toHaveValue(TEST_QUERY)
  })

  it('resyncs the input on back navigation', async () => {
    // Navigate with the router rather than typing: typed debounce commits can replace the
    // history entry under load, which would make "back" a no-op.
    const { router } = renderRoute(buildSearchPath({ query: TEST_QUERY }))
    const input = await screen.findByRole('searchbox')
    await act(() => router.navigate(buildSearchPath({ query: 'tolkien' })))
    await waitFor(() => expect(input).toHaveValue('tolkien'))
    await act(() => router.navigate(-1))
    await waitFor(() => expect(input).toHaveValue(TEST_QUERY))
  })

  it('clearing the box keeps the results until a new query is submitted', async () => {
    const { router, user } = renderRoute(buildSearchPath({ query: TEST_QUERY }))
    const input = await screen.findByRole('searchbox')
    await screen.findByRole('heading', { name: FIRST_BOOK })

    await user.click(screen.getByRole('button', { name: /clear/i }))

    expect(input).toHaveValue('')
    // Longer than the debounce, so a pending navigation would have happened by now.
    await new Promise((resolve) => setTimeout(resolve, DEBOUNCE_WAIT_MS))
    expect(router.state.location.search).toBe(`?q=${TEST_QUERY}`)
    expect(screen.getByRole('heading', { name: FIRST_BOOK })).toBeInTheDocument()
  })

  it('submits immediately on Enter', async () => {
    const { router, user } = renderRoute('/')
    await user.type(await screen.findByRole('searchbox'), 'tolkien{Enter}')
    await waitFor(() => expect(router.state.location.search).toBe('?q=tolkien'))
  })

  it('loads more results', async () => {
    const { user } = renderRoute(buildSearchPath({ query: TEST_QUERY }))
    await user.click(await screen.findByRole('button', { name: STRINGS.search.loadMore }))
    expect(await screen.findByRole('heading', { name: SECOND_PAGE_BOOK })).toBeInTheDocument()
    expect(
      screen.getByText(STRINGS.search.showing(String(TEST_TOTAL), String(TEST_TOTAL))),
    ).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: STRINGS.search.loadMore })).not.toBeInTheDocument()
  })

  it('puts the sort order in the URL and refetches', async () => {
    const sorts: (string | null)[] = []
    server.use(
      http.get(SEARCH_URL, ({ request }) => {
        sorts.push(new URL(request.url).searchParams.get('sort'))
        return HttpResponse.json({
          numFound: 1,
          start: 0,
          docs: [{ key: '/works/OL1W', title: FIRST_BOOK }],
        })
      }),
    )
    const { router, user } = renderRoute(buildSearchPath({ query: TEST_QUERY }))
    await screen.findByRole('heading', { name: FIRST_BOOK })

    await selectAntdOption(user, STRINGS.sort.label, STRINGS.sort.labels.new)

    await waitFor(() => expect(sorts).toEqual([null, 'new']))
    expect(router.state.location.search).toBe(`?q=${TEST_QUERY}&sort=new`)
  })

  it('shows an empty state', async () => {
    renderRoute(buildSearchPath({ query: EMPTY_QUERY }))
    expect(
      await screen.findByRole('heading', { name: STRINGS.status.emptyTitle }),
    ).toBeInTheDocument()
  })

  it('shows an error state with retry', async () => {
    server.use(http.get(SEARCH_URL, () => new HttpResponse(null, { status: 500 }), { once: true }))
    const { user } = renderRoute(buildSearchPath({ query: TEST_QUERY }))
    // antd icons carry their own aria-label, so match the button name loosely.
    await user.click(
      await screen.findByRole('button', { name: new RegExp(STRINGS.status.retry, 'i') }),
    )
    expect(await screen.findByRole('heading', { name: FIRST_BOOK })).toBeInTheDocument()
  })
})
