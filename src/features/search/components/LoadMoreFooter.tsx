import { Button, Flex, Typography } from 'antd'
import { STRINGS } from '@/constants'
import { formatCount } from '@/shared/utils'

interface LoadMoreFooterProps {
  shown: number
  total: number
  hasNextPage: boolean
  isFetchingNextPage: boolean
  isFetchNextPageError: boolean
  onLoadMore: () => void
}

export function LoadMoreFooter({
  shown,
  total,
  hasNextPage,
  isFetchingNextPage,
  isFetchNextPageError,
  onLoadMore,
}: LoadMoreFooterProps) {
  return (
    <Flex vertical align="center" gap="middle" style={{ marginTop: 48 }}>
      <Typography.Text type="secondary" style={{ fontVariantNumeric: 'tabular-nums' }}>
        {STRINGS.search.showing(formatCount(shown), formatCount(total))}
      </Typography.Text>
      {isFetchNextPageError && (
        <Typography.Text type="danger">{STRINGS.search.loadMoreError}</Typography.Text>
      )}
      {hasNextPage && (
        <Button size="large" shape="round" loading={isFetchingNextPage} onClick={onLoadMore}>
          {isFetchingNextPage ? STRINGS.search.loadingMore : STRINGS.search.loadMore}
        </Button>
      )}
    </Flex>
  )
}
