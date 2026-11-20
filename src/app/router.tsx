import { createBrowserRouter, type RouteObject } from 'react-router'
import { ROUTE_PATHS } from '@/constants'
import { AppLayout, NotFoundPage, RouteErrorPage } from '@/shared/components'
import { RouteFallback } from './RouteFallback'

// Vite's BASE_URL has a trailing slash; React Router wants it without.
const ROUTER_BASENAME = import.meta.env.BASE_URL.replace(/\/$/, '') || ROUTE_PATHS.home

export const routes: RouteObject[] = [
  {
    path: ROUTE_PATHS.home,
    element: <AppLayout />,
    errorElement: <RouteErrorPage />,
    hydrateFallbackElement: <RouteFallback />,
    children: [
      {
        index: true,
        lazy: async () => ({ Component: (await import('@/features/search')).SearchPage }),
      },
      {
        path: ROUTE_PATHS.work,
        lazy: async () => ({ Component: (await import('@/features/book')).BookPage }),
      },
      { path: ROUTE_PATHS.notFound, element: <NotFoundPage /> },
    ],
  },
]

export function createAppRouter() {
  return createBrowserRouter(routes, { basename: ROUTER_BASENAME })
}
