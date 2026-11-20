import { Col, Row } from 'antd'
import { BOOK_GRID_COLUMNS, GRID_GUTTER, STRINGS } from '@/constants'
import type { BookSummary } from '@/services/openLibrary'
import { BookCard } from './BookCard'

interface BookGridProps {
  books: BookSummary[]
}

export function BookGrid({ books }: BookGridProps) {
  return (
    <Row gutter={GRID_GUTTER} role="list" aria-label={STRINGS.search.resultsListLabel}>
      {books.map((book) => (
        <Col key={book.id} role="listitem" {...BOOK_GRID_COLUMNS}>
          <BookCard book={book} />
        </Col>
      ))}
    </Row>
  )
}
