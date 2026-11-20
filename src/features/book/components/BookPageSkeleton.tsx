import { Col, Flex, Row, Skeleton } from 'antd'
import { DETAIL_BODY_SPAN, DETAIL_COVER_SPAN, STRINGS } from '@/constants'

export function BookPageSkeleton() {
  return (
    <Row gutter={[40, 32]} role="status" aria-label={STRINGS.book.loadingLabel} aria-busy="true">
      <Col {...DETAIL_COVER_SPAN}>
        <Skeleton.Node
          active
          style={{
            width: '100%',
            maxWidth: 288,
            height: 'auto',
            aspectRatio: '2 / 3',
            display: 'flex',
          }}
        />
      </Col>
      <Col {...DETAIL_BODY_SPAN}>
        <Flex vertical>
          <Skeleton active title={{ width: '75%' }} paragraph={{ rows: 4 }} />
        </Flex>
      </Col>
    </Row>
  )
}
