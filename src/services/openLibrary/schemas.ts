import { z } from 'zod'
import { STRINGS } from '@/constants'

export const searchDocSchema = z.object({
  key: z.string(),
  title: z.string().default(STRINGS.book.untitled),
  author_name: z.array(z.string()).optional(),
  first_publish_year: z.number().optional(),
  cover_i: z.number().optional(),
  edition_count: z.number().optional(),
})

export const searchResponseSchema = z.object({
  numFound: z.number(),
  docs: z.array(searchDocSchema),
})

/** Open Library text fields are either a plain string or `{ type, value }`. */
const textSchema = z
  .union([z.string(), z.object({ value: z.string() })])
  .transform((v) => (typeof v === 'string' ? v : v.value))

export const workSchema = z.object({
  title: z.string().default(STRINGS.book.untitled),
  description: textSchema.optional(),
  subjects: z.array(z.string()).optional(),
  first_publish_date: z.string().optional(),
  covers: z.array(z.number()).optional(),
  authors: z.array(z.object({ author: z.object({ key: z.string() }).optional() })).optional(),
})

export const authorSchema = z.object({
  name: z.string().optional(),
  personal_name: z.string().optional(),
})

export type SearchDoc = z.infer<typeof searchDocSchema>
export type WorkRecord = z.infer<typeof workSchema>
