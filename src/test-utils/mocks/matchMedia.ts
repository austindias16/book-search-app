import { vi } from 'vitest'

/** antd's responsive Grid (Row/Col) calls matchMedia, which jsdom does not implement. */
export function installMatchMediaMock(matches = false): void {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })) as unknown as typeof window.matchMedia
}
