import { Flex } from 'antd'
import { useLocation, useParams } from 'react-router'
import { HTTP_STATUS, ROUTE_PARAMS, STRINGS, type LocationState } from '@/constants'
import { ErrorResult } from '@/shared/components'
import { ApiError, type WorkDetail } from '@/services/openLibrary'
import { BackToResultsLink } from '../components/BackToResultsLink'
import { BookDetails } from '../components/BookDetails'
import { BookPageSkeleton } from '../components/BookPageSkeleton'
import { useWork } from '../hooks/useWork'

export function BookPage() {
  const params = useParams()
  const location = useLocation()
  const id = params[ROUTE_PARAMS.workId] ?? ''
  const fromSearch = (location.state as LocationState | null)?.fromSearch
  const work = useWork(id)

  const notFound = work.error instanceof ApiError && work.error.status === HTTP_STATUS.notFound

  return (
    <Flex vertical gap="large">
      <BackToResultsLink fromSearch={fromSearch} />
      <BookPageBody
        work={work.data}
        isPending={work.isPending}
        isError={work.isError}
        notFound={notFound}
        onRetry={() => void work.refetch()}
      />
    </Flex>
  )
}

interface BookPageBodyProps {
  work: WorkDetail | undefined
  isPending: boolean
  isError: boolean
  notFound: boolean
  onRetry: () => void
}

function BookPageBody({ work, isPending, isError, notFound, onRetry }: BookPageBodyProps) {
  if (isPending) return <BookPageSkeleton />

  if (isError && notFound) {
    return (
      <ErrorResult
        status="404"
        title={STRINGS.status.notFoundTitle}
        subTitle={STRINGS.status.notFoundBody}
      />
    )
  }

  if (isError || !work) return <ErrorResult onRetry={onRetry} />

  return (
    <>
      <title>{`${work.title}${STRINGS.app.titleSuffix}`}</title>
      <BookDetails work={work} />
    </>
  )
}
