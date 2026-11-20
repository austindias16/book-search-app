import { ArrowLeftOutlined } from '@ant-design/icons'
import { Link } from 'react-router'
import { ROUTE_PATHS, STRINGS } from '@/constants'
import styles from './BackToResultsLink.module.css'

interface BackToResultsLinkProps {
  /** The search string the user came from. Absent when the page was opened directly. */
  fromSearch?: string
}

export function BackToResultsLink({ fromSearch }: BackToResultsLinkProps) {
  return (
    <Link to={{ pathname: ROUTE_PATHS.home, search: fromSearch ?? '' }} className={styles.link}>
      <ArrowLeftOutlined aria-hidden="true" />
      {fromSearch ? STRINGS.book.backToResults : STRINGS.book.backToSearch}
    </Link>
  )
}
