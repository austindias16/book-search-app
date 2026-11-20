import { fireEvent, screen } from '@testing-library/react'
import { STRINGS } from '@/constants'
import { renderWithProviders } from '@/test-utils'
import { CoverImage } from '../CoverImage'

const TITLE = 'Untold'
const BROKEN_TITLE = 'Broken'
const AUTHOR = 'Anon'
const COVER_ID = 5

describe('CoverImage', () => {
  it('renders a placeholder when there is no cover', () => {
    renderWithProviders(<CoverImage title={TITLE} author={AUTHOR} />)
    expect(screen.getByRole('img', { name: STRINGS.book.noCoverAlt(TITLE) })).toHaveTextContent(
      AUTHOR,
    )
  })

  it('falls back to the placeholder when the image fails to load', () => {
    renderWithProviders(<CoverImage coverId={COVER_ID} title={BROKEN_TITLE} />)
    fireEvent.error(screen.getByRole('img', { name: STRINGS.book.coverAlt(BROKEN_TITLE) }))
    expect(
      screen.getByRole('img', { name: STRINGS.book.noCoverAlt(BROKEN_TITLE) }),
    ).toBeInTheDocument()
  })
})
