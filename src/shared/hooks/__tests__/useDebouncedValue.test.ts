import { act, renderHook } from '@testing-library/react'
import { useDebouncedValue } from '@/shared/hooks'

const DELAY_MS = 300
const STEP_MS = 200

describe('useDebouncedValue', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('only updates after the delay has passed without changes', () => {
    const { result, rerender } = renderHook(({ v }) => useDebouncedValue(v, DELAY_MS), {
      initialProps: { v: 'a' },
    })
    rerender({ v: 'ab' })
    act(() => vi.advanceTimersByTime(STEP_MS))
    rerender({ v: 'abc' })
    act(() => vi.advanceTimersByTime(STEP_MS))
    expect(result.current).toBe('a')
    act(() => vi.advanceTimersByTime(DELAY_MS - STEP_MS))
    expect(result.current).toBe('abc')
  })
})
