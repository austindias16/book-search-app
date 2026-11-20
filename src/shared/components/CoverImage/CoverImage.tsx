import { Image } from 'antd'
import { useState } from 'react'
import { COVER_SIZE, COVER_TEXT_COLOR, STRINGS, type CoverSize } from '@/constants'
import { buildCoverUrl } from '@/services/openLibrary'
import { pickSpineColor } from './pickSpineColor'
import styles from './CoverImage.module.css'

export interface CoverImageProps {
  coverId?: number
  title: string
  author?: string
  size?: CoverSize
  /** Eager-load covers that are above the fold (the detail page). */
  eager?: boolean
  /** Click-to-enlarge preview, used on the detail page. */
  preview?: boolean
}

export function CoverImage({
  coverId,
  title,
  author,
  size = COVER_SIZE.medium,
  eager = false,
  preview = false,
}: CoverImageProps) {
  const [failed, setFailed] = useState(false)

  if (coverId && !failed) {
    const src = buildCoverUrl(coverId, size)
    const alt = STRINGS.book.coverAlt(title)
    const onError = () => setFailed(true)

    if (preview) {
      return (
        <Image
          src={src}
          alt={alt}
          onError={onError}
          preview={{ mask: null }}
          className={styles.cover}
          style={{ width: '100%', height: 'auto' }}
        />
      )
    }

    return (
      <img
        src={src}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        onError={onError}
        className={styles.cover}
      />
    )
  }

  return (
    <div
      role="img"
      aria-label={STRINGS.book.noCoverAlt(title)}
      className={styles.placeholder}
      style={{
        aspectRatio: '2 / 3',
        width: '100%',
        borderRadius: 'var(--ant-border-radius)',
        backgroundColor: pickSpineColor(title),
        color: COVER_TEXT_COLOR,
      }}
    >
      <div className={styles.placeholderRule} />
      <div>
        <p className={styles.placeholderTitle}>{title}</p>
        {author && <p className={styles.placeholderAuthor}>{author}</p>}
      </div>
      <div className={styles.placeholderRule} />
    </div>
  )
}
