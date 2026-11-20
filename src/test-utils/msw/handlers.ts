import { http, HttpResponse } from 'msw/http'
import { ROUTE_PARAMS } from '@/constants'
import { buildAuthor, buildSearchResponse, buildWork } from '../fixtures/factories'
import { TEST_PAGE_SIZE, TEST_TOTAL, EMPTY_QUERY } from '../fixtures/constants'
import { AUTHOR_URL_PATTERN, SEARCH_URL, WORK_URL_PATTERN } from './urls'
import { API_QUERY_PARAMS, FIRST_PAGE } from '@/constants'

/** Default search: `TEST_TOTAL` results split across pages of `TEST_PAGE_SIZE`. */
export function searchHandler() {
  return http.get(SEARCH_URL, ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get(API_QUERY_PARAMS.page) ?? FIRST_PAGE)
    if (url.searchParams.get(API_QUERY_PARAMS.query) === EMPTY_QUERY) {
      return HttpResponse.json(buildSearchResponse({ total: 0 }))
    }
    return HttpResponse.json(
      buildSearchResponse({ total: TEST_TOTAL, page, pageSize: TEST_PAGE_SIZE }),
    )
  })
}

export function workHandler() {
  return http.get(WORK_URL_PATTERN, ({ params }) =>
    HttpResponse.json(buildWork({ key: `/works/${String(params[ROUTE_PARAMS.workId])}` })),
  )
}

export function authorHandler() {
  return http.get(AUTHOR_URL_PATTERN, () => HttpResponse.json(buildAuthor()))
}

export function errorHandler(url: string, status: number) {
  return http.get(url, () => new HttpResponse(null, { status }))
}

export const defaultHandlers = [searchHandler(), workHandler(), authorHandler()]
