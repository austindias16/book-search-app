import { Empty, Typography } from 'antd'
import { STRINGS } from '@/constants'

export function EmptyResult({ query }: { query: string }) {
  return (
    <Empty
      description={
        <>
          <Typography.Title level={3} style={{ marginTop: 0 }}>
            {STRINGS.status.emptyTitle}
          </Typography.Title>
          <Typography.Text type="secondary">{STRINGS.status.emptyBody(query)}</Typography.Text>
        </>
      }
    />
  )
}
