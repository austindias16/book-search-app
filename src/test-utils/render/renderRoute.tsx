import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { AppProviders } from '@/app'
import { routes } from '@/app/router'
import { createTestQueryClient } from './createTestQueryClient'

/** Page tests: the real route tree inside the real providers, starting at `initialPath`. */
export function renderRoute(initialPath = '/') {
  const router = createMemoryRouter(routes, { initialEntries: [initialPath] })
  const user = userEvent.setup()
  const utils = render(
    <AppProviders queryClient={createTestQueryClient()}>
      <RouterProvider router={router} />
    </AppProviders>,
  )
  return { ...utils, router, user }
}
