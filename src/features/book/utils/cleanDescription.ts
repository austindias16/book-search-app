/** Work descriptions often end with a "----------" block of source links. */
const SOURCES_SEPARATOR = /\n-{5,}/
const MARKDOWN_LINK = /\[([^\]]+)\]\([^)]+\)/g

/** Drops the sources block and reduces markdown links to their label. */
export function cleanDescription(text: string): string {
  const [body = ''] = text.split(SOURCES_SEPARATOR)
  return body.replace(MARKDOWN_LINK, '$1').trim()
}
