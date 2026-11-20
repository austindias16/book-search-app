import { screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw/http'
import { buildSearchPath, STRINGS } from '@/constants'
import {
  MISSING_WORK_ID,
  renderRoute,
  server,
  TEST_SUBJECTS,
  TEST_WORK_AUTHOR,
  TEST_WORK_DESCRIPTION,
  TEST_WORK_ID,
  TEST_WORK_TITLE,
  TEST_QUERY,
} from '@/test-utils'
import { WORK_URL_PATTERN } from '@/test-utils/msw/urls'
import { buildOpenLibraryWorkUrl } from '@/services/openLibrary'

const workPath = (id: string) => `/works/${id}`

describe('BookPage', () => {
  it('renders work details', async () => {
    renderRoute(workPath(TEST_WORK_ID))

    expect(await screen.findByRole('heading', { name: TEST_WORK_TITLE })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: TEST_WORK_AUTHOR })).toBeInTheDocument()
    // The "----------" source-links block is stripped from the description.
    expect(screen.getByText(TEST_WORK_DESCRIPTION)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: TEST_SUBJECTS[0] })).toHaveAttribute(
      'href',
      buildSearchPath({ query: `subject:"${TEST_SUBJECTS[0]}"` }),
    )
    // antd icons carry their own aria-label, so match the link name loosely.
    expect(
      screen.getByRole('link', { name: new RegExp(STRINGS.book.viewOnOpenLibrary, 'i') }),
    ).toHaveAttribute('href', buildOpenLibraryWorkUrl(TEST_WORK_ID))
  })

  it('shows not-found for a missing work', async () => {
    server.use(http.get(WORK_URL_PATTERN, () => new HttpResponse(null, { status: 404 })))
    renderRoute(workPath(MISSING_WORK_ID))
    expect(
      await screen.findByRole('heading', { name: STRINGS.status.notFoundTitle }),
    ).toBeInTheDocument()
  })

  it('navigates from a result to the detail page and back to the same search', async () => {
    const searchPath = `${buildSearchPath({ query: TEST_QUERY })}`
    const { router, user } = renderRoute(searchPath)
    await user.click(await screen.findByRole('link', { name: /Book 1\b/ }))
    await waitFor(() => expect(router.state.location.pathname).toBe(workPath('OL1W')))
    await user.click(await screen.findByRole('link', { name: STRINGS.book.backToResults }))
    await waitFor(() => expect(router.state.location.search).toBe(`?q=${TEST_QUERY}`))
  })
})
