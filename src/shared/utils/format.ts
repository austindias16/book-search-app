export const numberFormatter = new Intl.NumberFormat()

export const listFormatter = new Intl.ListFormat(undefined, {
  style: 'long',
  type: 'conjunction',
})

export function formatCount(value: number): string {
  return numberFormatter.format(value)
}
