import { Typography } from 'antd'
import { memo } from 'react'
import { Link, useLocation } from 'react-router'
import { buildWorkPath, type LocationState } from '@/constants'
import { CoverImage } from '@/shared/components'
import type { BookSummary } from '@/services/openLibrary'
import styles from './BookCard.module.css'

interface BookCardProps {
  book: BookSummary
}

export const BookCard = memo(function BookCard({ book }: BookCardProps) {
  const location = useLocation()
  const author = book.authors[0]
  const state: LocationState = { fromSearch: location.search }

  return (
    <Link to={buildWorkPath(book.id)} state={state} className={styles.card}>
      <div className={styles.cover}>
        <CoverImage coverId={book.coverId} title={book.title} author={author} />
      </div>
      <div className={styles.body}>
        <Typography.Title level={5} className={styles.title}>
          {book.title}
        </Typography.Title>
        {author && (
          <Typography.Text type="secondary" ellipsis className={styles.author}>
            {author}
          </Typography.Text>
        )}
        {book.firstPublishYear && (
          <Typography.Text className={styles.year}>{book.firstPublishYear}</Typography.Text>
        )}
      </div>
    </Link>
  )
})
