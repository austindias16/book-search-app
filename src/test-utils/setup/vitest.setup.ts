import '@testing-library/jest-dom/vitest'
import { cleanup, configure } from '@testing-library/react'
import { afterAll, afterEach, beforeAll, beforeEach, vi, type MockInstance } from 'vitest'
import { installBrowserApiMocks } from '../mocks/browserApis'
import { installMatchMediaMock } from '../mocks/matchMedia'
import { server } from '../msw/server'

// Lazy route chunks and jsdom are slow under parallel workers; the 1s default is too tight.
// The first page test in a file pays for the cold lazy-route import (~7s seen), so allow 10s.
const ASYNC_UTIL_TIMEOUT_MS = 10_000
configure({ asyncUtilTimeout: ASYNC_UTIL_TIMEOUT_MS })

const ANTD_WARNING_MARKERS = ['[antd', 'Warning:'] as const

let consoleSpies: MockInstance[] = []

installBrowserApiMocks()
installMatchMediaMock(false)

beforeAll(() => server.listen({ onUnhandledFrame: 'error' }))

beforeEach(() => {
  consoleSpies = [vi.spyOn(console, 'error'), vi.spyOn(console, 'warn')]
})

afterEach(() => {
  cleanup()
  server.resetHandlers()

  // Fail on antd deprecation and React warnings, so they cannot slip into the console unnoticed.
  const offending = consoleSpies
    .flatMap((spy) => spy.mock.calls)
    .map((args) => args.map(String).join(' '))
    .filter((message) => ANTD_WARNING_MARKERS.some((marker) => message.includes(marker)))
  consoleSpies.forEach((spy) => spy.mockRestore())
  consoleSpies = []

  if (offending.length > 0) {
    throw new Error(`Unexpected antd/React warning(s):\n${offending.join('\n')}`)
  }
})

afterAll(() => server.close())
