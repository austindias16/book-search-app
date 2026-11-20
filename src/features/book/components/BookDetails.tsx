import { ExportOutlined } from '@ant-design/icons'
import { Button, Col, Descriptions, Flex, Row, Typography } from 'antd'
import { DESCRIPTION_MAX_ROWS, DETAIL_BODY_SPAN, DETAIL_COVER_SPAN, STRINGS } from '@/constants'
import { CoverImage } from '@/shared/components'
import { buildOpenLibraryWorkUrl, type WorkDetail } from '@/services/openLibrary'
import { AuthorLinks } from './AuthorLinks'
import { SubjectTags } from './SubjectTags'
import { cleanDescription } from '../utils/cleanDescription'

interface BookDetailsProps {
  work: WorkDetail
}

export function BookDetails({ work }: BookDetailsProps) {
  const description = work.description ? cleanDescription(work.description) : undefined

  return (
    <Row gutter={[40, 32]}>
      <Col {...DETAIL_COVER_SPAN}>
        <div
          style={{
            maxWidth: 288,
            margin: '0 auto',
            boxShadow: '0 24px 48px -24px rgb(0 0 0 / 0.55)',
          }}
        >
          <CoverImage
            coverId={work.coverId}
            title={work.title}
            author={work.authors[0]}
            size="L"
            eager
            preview
          />
        </div>
      </Col>

      <Col {...DETAIL_BODY_SPAN}>
        <Flex vertical gap="middle">
          <Typography.Title level={1} style={{ margin: 0 }}>
            {work.title}
          </Typography.Title>

          {work.authors.length > 0 && (
            <Typography.Text style={{ fontSize: 18 }} type="secondary">
              <AuthorLinks authors={work.authors} />
            </Typography.Text>
          )}

          {work.firstPublishDate && (
            <Descriptions
              size="small"
              column={1}
              items={[
                {
                  key: 'first-published',
                  label: STRINGS.book.firstPublished,
                  children: work.firstPublishDate,
                },
              ]}
            />
          )}

          <div style={{ borderTop: '1px solid var(--ant-color-split)', paddingTop: 24 }}>
            {description ? (
              <Typography.Paragraph
                style={{ fontSize: 17, whiteSpace: 'pre-line', maxWidth: '65ch' }}
                ellipsis={{ rows: DESCRIPTION_MAX_ROWS, expandable: true, symbol: 'more' }}
              >
                {description}
              </Typography.Paragraph>
            ) : (
              <Typography.Text type="secondary" italic>
                {STRINGS.book.noDescription}
              </Typography.Text>
            )}
          </div>

          {work.subjects.length > 0 && <SubjectTags subjects={work.subjects} />}

          <div>
            <Button
              type="primary"
              shape="round"
              size="large"
              href={buildOpenLibraryWorkUrl(work.id)}
              target="_blank"
              rel="noreferrer"
              icon={<ExportOutlined />}
            >
              {STRINGS.book.viewOnOpenLibrary}
            </Button>
          </div>
        </Flex>
      </Col>
    </Row>
  )
}
