import { Flex, Tag, Typography } from 'antd'
import { Link } from 'react-router'
import { buildSearchPath, SEARCH_SUGGESTIONS, STRINGS } from '@/constants'

export function SuggestionTags() {
  return (
    <Flex wrap justify="center" align="center" gap="small">
      <Typography.Text type="secondary">{STRINGS.search.try}</Typography.Text>
      {SEARCH_SUGGESTIONS.map((suggestion) => (
        <Tag key={suggestion} style={{ fontSize: 14, padding: '2px 12px', margin: 0 }}>
          <Link to={buildSearchPath({ query: suggestion })}>{suggestion}</Link>
        </Tag>
      ))}
    </Flex>
  )
}
