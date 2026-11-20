import { API_PATHS, NO_COVER_SENTINEL } from '@/constants'
import type { SearchDoc, WorkRecord } from './schemas'
import type { BookSummary, WorkDetail } from './types'

export function toBookSummary(doc: SearchDoc): BookSummary {
  return {
    id: stripPrefix(doc.key, API_PATHS.workKeyPrefix),
    title: doc.title,
    authors: doc.author_name ?? [],
    firstPublishYear: doc.first_publish_year,
    coverId: doc.cover_i,
    editionCount: doc.edition_count,
  }
}

export function toWorkDetail(work: WorkRecord, id: string, authors: readonly string[]): WorkDetail {
  return {
    id,
    title: work.title,
    description: work.description?.trim() || undefined,
    subjects: work.subjects ?? [],
    firstPublishDate: work.first_publish_date,
    // Open Library uses -1 as a "no cover" sentinel in some records.
    coverId: work.covers?.find((c) => c > NO_COVER_SENTINEL),
    authors: [...authors],
  }
}

function stripPrefix(value: string, prefix: string): string {
  return value.startsWith(prefix) ? value.slice(prefix.length) : value
}
