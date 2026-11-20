import { Divider, Flex, Typography } from 'antd'
import type { ReactNode } from 'react'
import type { SortOption } from '@/constants'
import { SortSelect } from './SortSelect'

interface ResultsHeaderProps {
  title: ReactNode
  sort: SortOption
  onSortChange: (sort: SortOption) => void
}

export function ResultsHeader({ title, sort, onSortChange }: ResultsHeaderProps) {
  return (
    <Flex vertical gap="middle">
      <Flex justify="space-between" align="center" wrap gap="middle">
        <Typography.Title level={3} style={{ margin: 0 }} aria-live="polite">
          {title}
        </Typography.Title>
        <SortSelect value={sort} onChange={onSortChange} />
      </Flex>
      <Divider style={{ margin: 0 }} />
    </Flex>
  )
}
