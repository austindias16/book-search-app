import { Link } from 'react-router'
import { buildSearchPath, STRINGS } from '@/constants'
import { listFormatter } from '@/shared/utils'

interface AuthorLinksProps {
  authors: readonly string[]
}

/** "by A, B, and C", where each author links to a search for that name. */
export function AuthorLinks({ authors }: AuthorLinksProps) {
  const parts = listFormatter.formatToParts(authors)

  return (
    <>
      {STRINGS.book.by}{' '}
      {parts.map((part, index) =>
        part.type === 'element' ? (
          <Link key={index} to={buildSearchPath({ query: part.value })}>
            {part.value}
          </Link>
        ) : (
          <span key={index}>{part.value}</span>
        ),
      )}
    </>
  )
}
