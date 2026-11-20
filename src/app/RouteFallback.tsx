import { Flex, Spin } from 'antd'
import { PAGE_PADDING_BLOCK } from '@/constants'

export function RouteFallback() {
  return (
    <Flex justify="center" style={{ padding: PAGE_PADDING_BLOCK }}>
      <Spin size="large" />
    </Flex>
  )
}
