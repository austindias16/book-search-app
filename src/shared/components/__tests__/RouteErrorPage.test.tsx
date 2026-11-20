import { screen } from '@testing-library/react'
import { STRINGS } from '@/constants'
import { renderRoute } from '@/test-utils'

describe('routes not found', () => {
  it('shows the 404 result for an unknown path inside the app layout', async () => {
    renderRoute('/nope')
    expect(
      await screen.findByRole('heading', { name: STRINGS.status.pageNotFoundTitle }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: STRINGS.status.backHome })).toBeInTheDocument()
  })
})
