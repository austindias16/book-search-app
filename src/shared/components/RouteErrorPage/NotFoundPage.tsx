import { Link } from 'react-router'
import { ROUTE_PATHS, STRINGS } from '@/constants'
import { ErrorResult } from '../StatusResult'

/** Rendered for unknown paths inside the app layout. */
export function NotFoundPage() {
  return (
    <>
      <title>{`${STRINGS.status.pageNotFoundDocumentTitle}${STRINGS.app.titleSuffix}`}</title>
      <ErrorResult
        status="404"
        title={STRINGS.status.pageNotFoundTitle}
        subTitle={<Link to={ROUTE_PATHS.home}>{STRINGS.status.backHome}</Link>}
      />
    </>
  )
}
