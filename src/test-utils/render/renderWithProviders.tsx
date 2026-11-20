import { render, type RenderOptions } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'
import { MemoryRouter } from 'react-router'
import { AppProviders } from '@/app'
import { createTestQueryClient } from './createTestQueryClient'

/** Component tests: providers plus a memory router, no route tree. */
export function renderWithProviders(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  const queryClient = createTestQueryClient()
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <AppProviders queryClient={queryClient}>
        <MemoryRouter>{children}</MemoryRouter>
      </AppProviders>
    )
  }
  return { ...render(ui, { wrapper: Wrapper, ...options }), queryClient }
}
