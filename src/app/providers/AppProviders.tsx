import { QueryClientProvider, type QueryClient } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'
import { ThemeModeProvider } from '@/theme'
import { createQueryClient } from '../queryClient'
import { AntdThemeProvider } from './AntdThemeProvider'

interface AppProvidersProps {
  children: ReactNode
  /** Tests inject a client with retries disabled. */
  queryClient?: QueryClient
}

export function AppProviders({ children, queryClient }: AppProvidersProps) {
  const [defaultClient] = useState(() => createQueryClient())

  return (
    <QueryClientProvider client={queryClient ?? defaultClient}>
      <ThemeModeProvider>
        <AntdThemeProvider>{children}</AntdThemeProvider>
      </ThemeModeProvider>
    </QueryClientProvider>
  )
}
