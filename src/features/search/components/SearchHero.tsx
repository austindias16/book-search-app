import { Flex, Typography } from 'antd'
import { STRINGS } from '@/constants'
import { SearchInput } from './SearchInput'
import { SuggestionTags } from './SuggestionTags'

interface SearchHeroProps {
  draft: string
  onDraftChange: (value: string) => void
  onSubmit: () => void
  busy: boolean
}

export function SearchHero({ draft, onDraftChange, onSubmit, busy }: SearchHeroProps) {
  return (
    <Flex vertical align="center" gap="large" style={{ textAlign: 'center', paddingTop: '12vh' }}>
      <Flex vertical align="center" gap="middle">
        <Typography.Text
          type="secondary"
          style={{ letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: 12 }}
        >
          {STRINGS.search.eyebrow}
        </Typography.Text>
        <Typography.Title level={1} style={{ margin: 0, fontSize: 'clamp(2.25rem, 6vw, 3.75rem)' }}>
          {STRINGS.search.heroBefore}{' '}
          <em style={{ color: 'var(--ant-color-primary)' }}>{STRINGS.search.heroAccent}</em>{' '}
          {STRINGS.search.heroAfter}
        </Typography.Title>
      </Flex>
      <SearchInput large value={draft} onChange={onDraftChange} onSubmit={onSubmit} busy={busy} />
      <SuggestionTags />
    </Flex>
  )
}
