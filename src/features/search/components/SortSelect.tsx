import { Flex, Select, Typography } from 'antd'
import { SORT_SELECT_OPTIONS, STRINGS, type SortOption } from '@/constants'

interface SortSelectProps {
  value: SortOption
  onChange: (value: SortOption) => void
}

export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <Flex align="center" gap="small">
      <Typography.Text type="secondary">{STRINGS.sort.label}</Typography.Text>
      <Select<SortOption>
        aria-label={STRINGS.sort.label}
        value={value}
        options={SORT_SELECT_OPTIONS}
        onChange={onChange}
        style={{ minWidth: 180 }}
      />
    </Flex>
  )
}
