/** jsdom gaps: scrolling, ResizeObserver (used by antd), and the layout APIs antd probes. */
export function installBrowserApiMocks(): void {
  window.scrollTo = () => {}

  class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver
}
