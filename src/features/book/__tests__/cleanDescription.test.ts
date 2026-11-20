import { cleanDescription } from '../utils/cleanDescription'

describe('cleanDescription', () => {
  it('drops the sources block after the separator', () => {
    expect(cleanDescription('Body text.\n----------\nSee also: x')).toBe('Body text.')
  })

  it('reduces markdown links to their label', () => {
    expect(cleanDescription('Read [the book](https://example.com) now.')).toBe('Read the book now.')
  })

  it('trims surrounding whitespace', () => {
    expect(cleanDescription('  padded  ')).toBe('padded')
  })
})
