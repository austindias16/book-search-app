import { isRouteErrorResponse, useRouteError } from 'react-router'
import { HTTP_STATUS } from '@/constants'
import { AppLayout } from '../AppLayout'
import { ErrorResult } from '../StatusResult'
import { NotFoundPage } from './NotFoundPage'

/** Root `errorElement`: renders outside the route tree, so it wraps its own layout. */
export function RouteErrorPage() {
  const error = useRouteError()
  const notFound = isRouteErrorResponse(error) && error.status === HTTP_STATUS.notFound

  return <AppLayout>{notFound ? <NotFoundPage /> : <ErrorResult />}</AppLayout>
}
