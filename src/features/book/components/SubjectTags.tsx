import { Flex, Tag, Typography } from 'antd'
import { Link } from 'react-router'
import { buildSearchPath, MAX_SUBJECT_TAGS, STRINGS } from '@/constants'

interface SubjectTagsProps {
  subjects: readonly string[]
}

export function SubjectTags({ subjects }: SubjectTagsProps) {
  return (
    <Flex vertical gap="small">
      <Typography.Title level={5} style={{ margin: 0, color: 'var(--ant-color-text-secondary)' }}>
        {STRINGS.book.subjects}
      </Typography.Title>
      <Flex wrap gap="small">
        {subjects.slice(0, MAX_SUBJECT_TAGS).map((subject) => (
          <Tag key={subject} style={{ fontSize: 14, padding: '2px 12px', margin: 0 }}>
            <Link to={buildSearchPath({ query: `subject:"${subject}"` })}>{subject}</Link>
          </Tag>
        ))}
      </Flex>
    </Flex>
  )
}
