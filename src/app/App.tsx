import { RouterProvider } from 'react-router/dom'
import { AppProviders } from './providers/AppProviders'
import { createAppRouter } from './router'

const router = createAppRouter()

export function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  )
}
