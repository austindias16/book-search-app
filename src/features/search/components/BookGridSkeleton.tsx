import { Col, Flex, Row, Skeleton } from 'antd'
import { BOOK_GRID_COLUMNS, GRID_GUTTER, SKELETON_CARD_COUNT, STRINGS } from '@/constants'

const SKELETON_KEYS = Array.from({ length: SKELETON_CARD_COUNT }, (_, index) => `skeleton-${index}`)

/** Same geometry as BookCard: a 2:3 cover above a two-line title and an author line. */
export function BookGridSkeleton() {
  return (
    <Row
      gutter={GRID_GUTTER}
      role="list"
      aria-label={STRINGS.search.loadingResultsLabel}
      aria-busy="true"
    >
      {SKELETON_KEYS.map((key) => (
        <Col key={key} role="listitem" {...BOOK_GRID_COLUMNS}>
          <Flex vertical gap={12}>
            <Skeleton.Node active style={{ width: '100%', height: 'auto', aspectRatio: '2 / 3' }} />
            <Skeleton active title={{ width: '85%' }} paragraph={{ rows: 1, width: '55%' }} />
          </Flex>
        </Col>
      ))}
    </Row>
  )
}
