import { authorSchema, workSchema } from './schemas'
import { getJson } from './httpClient'
import { toWorkDetail } from './mappers'
import { buildAuthorUrl, buildWorkUrl } from './urls'
import type { WorkDetail } from './types'

export async function getWork(id: string, signal?: AbortSignal): Promise<WorkDetail> {
  const work = workSchema.parse(await getJson(buildWorkUrl(id), signal))

  const authorKeys = (work.authors ?? [])
    .map((a) => a.author?.key)
    .filter((key): key is string => Boolean(key))

  // Author lookups are best-effort: a failed one shouldn't break the page.
  const results = await Promise.allSettled(
    authorKeys.map(async (key) => authorSchema.parse(await getJson(buildAuthorUrl(key), signal))),
  )
  const authors = results.flatMap((result) => {
    if (result.status !== 'fulfilled') return []
    const name = result.value.name ?? result.value.personal_name
    return name ? [name] : []
  })

  return toWorkDetail(work, id, authors)
}
