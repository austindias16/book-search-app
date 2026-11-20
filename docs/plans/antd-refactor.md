# Plan: Tailwind → Ant Design refactor (modular, constants-driven)

> **Audience:** an implementation agent executing this step by step. Do the phases **in order**.
> After every phase, run the **Gate** commands and fix failures before moving on.
> Do not add features that are not listed. Do not change app behaviour except where stated.

## 0. Context

The app (`Shelf — Book Search`) is a Vite 8 + React 19 + TypeScript 6 + Tailwind v4 app that searches
Open Library. It works and has 21 passing Vitest tests. The owner wants:

1. **Ant Design instead of Tailwind.** Tailwind markup is "too cluttered". Remove Tailwind completely.
2. **Proper React patterns.** Feature folders, container/presentational split, custom hooks, context
   only for theme, route-level code splitting, an error boundary, named exports.
3. **Separate test-utils folders.** No test helpers mixed into app code.
4. **Modularize as much as possible.** Small single-purpose files and barrel `index.ts` per module.
5. **Constants everywhere.** No inline UI strings, URLs, route paths, query keys, storage keys,
   magic numbers or param names. This is enforced by ESLint (Phase 9).
6. **Modern ECMAScript.** ES2024 target. Use `??`, `?.`, `??=`, `Array.prototype.at`, `toSorted`,
   `Object.fromEntries`, `Intl.NumberFormat`/`Intl.ListFormat`, `satisfies`, `as const`, and
   `#private` class fields.
7. **Vitest** stays the test runner.

### Behaviour to preserve (all currently tested)

- Search is debounced 400 ms into `?q=`. Enter submits immediately. Sort is stored in `?sort=`
  (omitted for relevance).
- The URL is the source of truth. Back/forward resyncs the input. URL updates the page made itself
  must **not** overwrite characters the user typed in the meantime (see `src/routes/SearchPage.tsx`,
  which uses router state `fromInput` plus `useNavigationType() !== 'POP'`).
- Sorting is done by Open Library. "Load more" uses an infinite query with 24 books per page.
- Loading skeletons, an empty state, an error state with retry, and a placeholder cover when a
  cover is missing or fails to load (`?default=false` makes a missing cover return 404).
- Detail page at `/works/:id`:
  - shows description (with the `----------` block and markdown links stripped), authors, subjects
    and a link to Open Library;
  - "Back to results" restores the previous search through `location.state.fromSearch`;
  - shows a not-found state on 404.
- Light/dark theme follows the system, can be toggled, and is persisted in `localStorage`.
- Vite `base: '/book-search-app/'` and router `basename` (for a later GitHub Pages deploy).

### Facts already verified (do not re-research)

| Package                       | Version / note                                                                                                                                                                             |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `antd`                        | 6.7.x. Peer `react >=18`. Supports React 19 natively, so do **not** install `@ant-design/v5-patch-for-react-19`.                                                                           |
| `@ant-design/icons`           | 6.3.x                                                                                                                                                                                      |
| `eslint-plugin-react`         | Does **not** support ESLint 10. Do not install it. Use the core `no-restricted-syntax` rule instead (Phase 9).                                                                            |
| `msw` 3                       | Import `http, HttpResponse` from `'msw/http'` and `setupServer` from `'msw/node'`. `listen({ onUnhandledFrame: 'error' })` (**not** `onUnhandledRequest`).                                |
| `react-router` 8              | `createBrowserRouter` and `createMemoryRouter` from `'react-router'`. `RouterProvider` from `'react-router/dom'`. Route `lazy` is supported.                                               |
| `eslint-plugin-react-refresh` | Named import: `import { reactRefresh } from 'eslint-plugin-react-refresh'`.                                                                                                              |
| TypeScript                    | Stay on `~6.0` (typescript-eslint does not support 7 yet).                                                                                                                                  |
| antd 6 API                    | Some v5 props were renamed. **Before using a component prop, check `node_modules/antd/es/<component>/*.d.ts`.** Any antd deprecation warning in the console is a bug (tests fail on it, see Phase 7). |

---

## Phase 1: Dependencies and tooling

1. Commit or stash the current work first. If the tree is dirty, **ask the user** before committing.
   Create branch `refactor/antd`.
2. Uninstall: `tailwindcss @tailwindcss/vite prettier-plugin-tailwindcss lucide-react`.
3. Install: `antd@latest @ant-design/icons@latest`. Dev: `@vitest/coverage-v8@latest`.
4. `.prettierrc.json`: remove the `plugins` entry.
5. Add the path alias `@/*` → `src/*`:
   - `tsconfig.app.json`: add `"paths": { "@/*": ["./src/*"] }`.
   - `vite.config.ts`:
     `resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } }`.
6. `tsconfig.app.json`: set `target` and `lib` to `ES2024` (`["ES2024", "DOM", "DOM.Iterable"]`).
   Replace `"types"` with `["vite/client", "vitest/globals", "@testing-library/jest-dom"]`
   (unchanged; just confirm).
7. Move test config out of `vite.config.ts` into a new **`vitest.config.ts`**:

   ```ts
   import { defineConfig, mergeConfig } from 'vitest/config'
   import viteConfig from './vite.config'

   export default mergeConfig(
     viteConfig,
     defineConfig({
       test: {
         environment: 'jsdom',
         globals: true,
         setupFiles: ['./src/test-utils/setup/vitest.setup.ts'],
         include: ['src/**/*.test.{ts,tsx}'],
         testTimeout: 15_000,
         css: false,
         coverage: {
           provider: 'v8',
           include: ['src/**/*.{ts,tsx}'],
           exclude: ['src/test-utils/**', 'src/**/index.ts', 'src/main.tsx'],
         },
       },
     }),
   )
   ```

   Add `vitest.config.ts` to `tsconfig.node.json` `include`. Add the script
   `"test:coverage": "vitest run --coverage"`.

**Gate:** `npm run typecheck` (failures from Tailwind classes still in the code are expected until
Phase 6).

---

## Phase 2: Target folder structure

Create exactly this layout. Delete the old `src/api`, `src/components`, `src/hooks`, `src/routes`
and `src/test` folders as their contents move. Every folder that other modules import from gets an
`index.ts` barrel that exports **only** its public API.

```
src/
  main.tsx                          # createRoot → <App/>
  app/
    App.tsx                         # <AppProviders><RouterProvider/></AppProviders>
    router.tsx                      # createAppRouter() + routes array (exported for tests)
    queryClient.ts                  # createQueryClient(options?)
    providers/
      AppProviders.tsx              # QueryClientProvider → ThemeModeProvider → AntdThemeProvider
      AntdThemeProvider.tsx         # ConfigProvider + antd <App> wrapper, reads theme mode
  constants/                        # see Phase 3. No React imports here.
    api.ts  routes.ts  searchParams.ts  sort.ts  queryKeys.ts  timing.ts
    storage.ts  theme.ts  strings.ts  suggestions.ts  layout.ts  index.ts
  services/
    openLibrary/
      httpClient.ts                 # getJson(url, signal), ApiError (#private fields)
      schemas.ts                    # zod schemas only
      mappers.ts                    # raw → domain (toBookSummary, toWorkDetail, cleanText)
      urls.ts                       # buildSearchUrl, buildWorkUrl, buildAuthorUrl, buildCoverUrl, buildOpenLibraryWorkUrl
      searchBooks.ts
      getWork.ts
      types.ts                      # BookSummary, SearchPage, WorkDetail, SortOption type
      index.ts
  features/
    search/
      pages/SearchPage.tsx          # container: wires hooks → presentational components
      components/
        SearchHero.tsx  SearchInput.tsx  SuggestionTags.tsx  ResultsHeader.tsx
        SortSelect.tsx  BookGrid.tsx  BookCard.tsx  BookGridSkeleton.tsx  LoadMoreFooter.tsx
        index.ts
      hooks/
        useSearchUrlState.ts        # parse/serialize q + sort from URL; setSearch(next, {replace})
        useSearchDraft.ts           # draft input state + debounce + URL resync (logic from current SearchPage)
        useBookSearch.ts            # infinite query
        index.ts
      __tests__/  SearchPage.test.tsx  useSearchUrlState.test.tsx
      index.ts                      # export { SearchPage }
    book/
      pages/BookPage.tsx
      components/
        BookDetails.tsx  AuthorLinks.tsx  SubjectTags.tsx  BackToResultsLink.tsx
        BookPageSkeleton.tsx  index.ts
      hooks/useWork.ts
      utils/cleanDescription.ts
      __tests__/  BookPage.test.tsx  cleanDescription.test.ts
      index.ts
  shared/
    components/
      AppLayout/AppLayout.tsx  AppLayout/AppLayout.module.css  AppLayout/index.ts
      CoverImage/CoverImage.tsx  CoverImage/CoverImage.module.css  CoverImage/pickSpineColor.ts  CoverImage/index.ts
      ThemeToggle/ThemeToggle.tsx  ThemeToggle/index.ts
      StatusResult/ErrorResult.tsx  StatusResult/EmptyResult.tsx  StatusResult/index.ts
      RouteErrorPage/RouteErrorPage.tsx  RouteErrorPage/index.ts
      __tests__/CoverImage.test.tsx
    hooks/
      useDebouncedValue.ts  __tests__/useDebouncedValue.test.ts  index.ts
    utils/
      format.ts                     # numberFormatter, listFormatter (Intl), formatResultsCount
  theme/
    ThemeModeContext.ts             # createContext + type
    ThemeModeProvider.tsx           # state, persistence, system preference
    useThemeMode.ts                 # useContext with guard (throws outside provider)
    antdTheme.ts                    # buildAntdTheme(mode): ThemeConfig
    index.ts
  styles/
    global.css                      # ~20 lines: body margin, font-family vars, reduced motion
  test-utils/                       # see Phase 7. Never imported by app code.
```

Rules:

- **Named exports only.** No `export default`, except where config files require it
  (`vite.config.ts`, `vitest.config.ts`, `eslint.config.js`).
- Imports across modules go through the `@/` alias and the barrel, e.g.
  `import { SearchPage } from '@/features/search'`. Inside the same feature, use relative imports.
- One component per file. File name = component name.
- Features never import from other features. Shared code goes in `shared/`, `services/`,
  `constants/` or `theme/`.

---

## Phase 3: Constants (`src/constants/`)

Everything below is `as const`. Derive types from it; do not write string unions by hand.

- **`api.ts`**
  - `OPEN_LIBRARY_BASE_URL = 'https://openlibrary.org'`, `COVERS_BASE_URL = 'https://covers.openlibrary.org'`.
  - `API_PATHS = { search: '/search.json', work: '/works', author: '/authors' }` (in addition to
    the full author key such as `/authors/OL1A`).
  - `API_QUERY_PARAMS = { query: 'q', page: 'page', limit: 'limit', fields: 'fields', sort: 'sort', defaultCover: 'default' }`.
  - `SEARCH_PAGE_SIZE = 24`, `FIRST_PAGE = 1`.
  - `SEARCH_FIELDS = ['key','title','author_name','first_publish_year','cover_i','edition_count']`.
  - `COVER_SIZE = { small: 'S', medium: 'M', large: 'L' }`, `NO_COVER_SENTINEL = -1`.
  - `HTTP_STATUS = { notFound: 404 }`, `JSON_EXTENSION = '.json'`, `WORK_KEY_PREFIX = '/works/'`.
  - `ACCEPT_JSON_HEADERS = { Accept: 'application/json' }`.
- **`routes.ts`**
  - `ROUTE_PATHS = { home: '/', work: '/works/:id', notFound: '*' }`, `ROUTE_PARAMS = { workId: 'id' }`.
  - Builders: `buildWorkPath(id)` and `buildSearchPath({ query, sort })`. The latter returns
    `'/?q=…'` using `URLSearchParams` and the constants from `searchParams.ts`.
- **`searchParams.ts`**: `SEARCH_PARAMS = { query: 'q', sort: 'sort' }`.
- **`sort.ts`**
  - `SORT_OPTION = { relevance: 'relevance', newest: 'new', oldest: 'old', title: 'title' }`,
    `type SortOption = (typeof SORT_OPTION)[keyof typeof SORT_OPTION]`, `DEFAULT_SORT = SORT_OPTION.relevance`.
  - `isSortOption(value: string | null): value is SortOption`.
  - `SORT_SELECT_OPTIONS = Object.values(SORT_OPTION).map(value => ({ value, label: STRINGS.sort.labels[value] }))`.
- **`queryKeys.ts`**:
  `queryKeys = { search: (q, sort) => ['search', q, sort] as const, work: (id) => ['work', id] as const }`.
  The `'search'` and `'work'` scope names are themselves constants in this file.
- **`timing.ts`**: `SEARCH_DEBOUNCE_MS = 400`, `SEARCH_STALE_TIME_MS = 5 * 60_000`,
  `WORK_STALE_TIME_MS = 30 * 60_000`, `QUERY_RETRY_COUNT = 1`.
- **`storage.ts`**: `STORAGE_KEYS = { themeMode: 'theme' }`. Keep the value `'theme'`, because
  the pre-paint script in `index.html` reads it.
- **`theme.ts`**
  - `THEME_MODE = { light: 'light', dark: 'dark' }`, `type ThemeMode`.
  - `DARK_MODE_MEDIA_QUERY = '(prefers-color-scheme: dark)'`.
  - `BRAND = { primaryLight: '#9a3b26', primaryDark: '#e08a6c', paperLight: '#f6f1e7', paperDark: '#16130f', surfaceLight: '#fffcf5', surfaceDark: '#211c16' }`.
  - `FONT_FAMILY = { serif: "'Fraunces', Georgia, serif", sans: "'Inter', system-ui, sans-serif" }`.
  - `BORDER_RADIUS = 8`.
  - `COVER_SPINE_COLORS = [...]` (the six colours currently in `CoverImage.tsx`).
- **`layout.ts`**
  - `BOOK_GRID_COLUMNS = { xs: 12, sm: 8, md: 6, lg: 4, xl: 4, xxl: 4 }`. These are antd 24-column
    spans, giving 2/3/4/6 books per row.
  - `GRID_GUTTER = [20, 32]`, `SKELETON_CARD_COUNT = 12`, `MAX_SUBJECT_TAGS = 14`,
    `DESCRIPTION_MAX_ROWS = 8`, `CONTENT_MAX_WIDTH = 1280`.
- **`suggestions.ts`**: `SEARCH_SUGGESTIONS = ['Ursula K. Le Guin', 'Dune', 'Toni Morrison', 'Sherlock Holmes', 'Astronomy']`.
- **`strings.ts`**
  - One nested `STRINGS` object holding **all** user-visible copy. Use functions for interpolation:
    ```ts
    export const STRINGS = {
      app: { name: 'Shelf', documentTitle: 'Shelf — Book Search', titleSuffix: ' · Shelf', attribution: 'Book data and covers from', openLibrary: 'Open Library' },
      search: { eyebrow: '…', heroTitle: '…', heroAccent: 'great', placeholder: 'Title, author, or subject…', inputLabel: '…', try: 'Try',
                resultsCount: (count: string, query: string) => `${count} results for “${query}”`, searching: (q: string) => `Searching for “${q}”…`,
                showing: (shown: string, total: string) => `Showing ${shown} of ${total}`, loadMore: 'Load more', loadMoreError: '…', resultsListLabel: 'Search results' },
      sort: { label: 'Sort by', labels: { relevance: 'Most relevant', new: 'Newest first', old: 'Oldest first', title: 'Title (A–Z)' } },
      book: { backToResults: 'Back to results', backToSearch: 'Search books', by: 'by', firstPublished: 'First published', noDescription: '…',
              subjects: 'Subjects', viewOnOpenLibrary: 'View on Open Library', coverAlt: (t: string) => `Cover of ${t}`, noCoverAlt: (t: string) => `No cover available for ${t}` },
      status: { emptyTitle: 'No books found', emptyBody: (q: string) => `…`, errorTitle: 'Something went wrong', errorBody: '…', retry: 'Try again',
                notFoundTitle: 'Book not found', notFoundBody: '…', pageNotFoundTitle: '…', backHome: 'Back to search' },
      theme: { toLight: 'Switch to light theme', toDark: 'Switch to dark theme' },
    } as const
    ```
  - Copy the exact wording from the current components, so existing test expectations still match.
  - Use `Intl.NumberFormat` for counts. The singular "result" (when `count === 1`) goes in
    `STRINGS` too, e.g. `resultsCount(count, query, isSingular)`.
- **`index.ts`**: re-export everything.

**Tests import from `@/constants` too.** For example,
`screen.getByRole('button', { name: STRINGS.search.loadMore })`. Do not hard-code copy in tests.

---

## Phase 4: Services (`src/services/openLibrary/`)

Split the current `src/api/openLibrary.ts` into the files listed in Phase 2. Keep the logic
identical, but use constants.

- `httpClient.ts`
  - `export class ApiError extends Error { #status; get status() { return this.#status } }`.
  - `getJson(url: URL, signal?: AbortSignal): Promise<unknown>`.
- `urls.ts`: build every URL with `new URL()` and `searchParams.set(API_QUERY_PARAMS.x, …)`.
  `buildCoverUrl(id, size)` adds `default=false`.
- `mappers.ts`
  - `toBookSummary(doc)` strips `WORK_KEY_PREFIX`.
  - `toWorkDetail(work, authors)` picks the first cover with `covers?.find(c => c > NO_COVER_SENTINEL)`.
- `searchBooks.ts` and `getWork.ts`: fetch, then parse with zod, then map. Author lookups stay
  best-effort (`Promise.allSettled` is preferred; filter fulfilled results).
- `types.ts`: domain types only. Re-export `SortOption` from constants.

---

## Phase 5: Theme (`src/theme/`)

- `ThemeModeContext.ts`: `createContext<ThemeModeContextValue | null>(null)`, where the value is
  `{ mode: ThemeMode; toggleMode: () => void }`.
- `ThemeModeProvider.tsx`
  - Initial state is a lazy initializer: read `localStorage[STORAGE_KEYS.themeMode]` in
    try/catch; if absent, use `matchMedia(DARK_MODE_MEDIA_QUERY)`.
  - `toggleMode` is a `useCallback`. A `useEffect` on `mode`:
    - writes `localStorage` (in try/catch);
    - sets `document.documentElement.dataset.theme = mode`;
    - sets `document.documentElement.style.colorScheme = mode`.
  - Memoize the context value with `useMemo`.
- `useThemeMode.ts`: `use(ThemeModeContext)` (React 19 `use`). Throw if `null`.
- `antdTheme.ts`: `buildAntdTheme(mode): ThemeConfig` returns
  `{ algorithm: mode === dark ? theme.darkAlgorithm : theme.defaultAlgorithm, token: { colorPrimary, colorBgLayout (paper), colorBgContainer (surface), fontFamily: FONT_FAMILY.sans, borderRadius }, components: { Typography: { fontFamilyCode?: … } } }`.
  - Headings use the serif font through **one** CSS rule in `global.css`:
    `.ant-typography:is(h1,h2,h3) { font-family: var(--font-serif) }`. Define `--font-serif` in
    `global.css` using the same value as the constant, with a comment saying they must match.
- `index.html`: keep the pre-paint script but make it set `document.documentElement.dataset.theme`
  instead of the `dark` class. Also set
  `document.documentElement.style.background` to the matching paper colour to avoid a flash.

---

## Phase 6: UI rewrite with Ant Design

**Styling rules:**

- **No Tailwind classes. No `className` strings longer than one class.** Use antd props first:
  `Flex` (`gap`, `vertical`, `align`, `justify`, `wrap`), `Space`, `Row`/`Col`, `Typography`, and
  token-driven colours.
- When antd props are not enough, use a co-located **CSS Module** (`*.module.css`). Use **only**
  antd CSS variables or the `--font-serif` var. Turn on antd CSS variables with
  `ConfigProvider theme={{ cssVar: true }}`; check the exact option in `antd/es/config-provider` types.
- Use `theme.useToken()` only when a token is needed in JS (rare).
- Icons come from `@ant-design/icons`: `SearchOutlined`, `MoonOutlined`, `SunOutlined`,
  `ArrowLeftOutlined`, `ExportOutlined`, `ReloadOutlined`, `BookOutlined`.

**Component mapping (current → antd):**

| Current                                           | New                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `RootLayout`                                      | `shared/components/AppLayout`: antd `Layout` with a sticky `Layout.Header` (brand `Link` + `BookOutlined` + `ThemeToggle`), a `Layout.Content` centred at `CONTENT_MAX_WIDTH`, and a `Layout.Footer` (attribution + link). Renders `<Outlet/>` and `<ScrollRestoration/>`.                                                                                                                                                                                  |
| `ThemeToggle`                                     | `Button type="text" shape="circle" icon={mode===dark ? <SunOutlined/> : <MoonOutlined/>} aria-label={…}`                                                                                                                                                                                                                                                                                                                                                  |
| `SearchBar`                                       | `SearchInput`: antd `Input.Search` with `allowClear`, `size={large ? 'large' : 'middle'}`, `loading={busy}`, `enterButton`, `onSearch` (submit immediately) and `onChange` (draft). Has a visible label for a11y via `aria-label={STRINGS.search.inputLabel}`. The input keeps `type="search"` so tests can find `role="searchbox"`. If antd renders it as `textbox`, update the test queries to use the label instead. |
| Hero                                              | `SearchHero`: `Flex vertical align="center"`, `Typography.Text type="secondary"` eyebrow, `Typography.Title level={1}` with the accent word in `Typography.Text` coloured `colorPrimary`, then `SearchInput`, then `SuggestionTags` (antd `Tag` / `Tag.CheckableTag` rendered as router `Link`s to `buildSearchPath`).                                                                                                                                     |
| Results header                                    | `ResultsHeader`: `Flex justify="space-between" align="end" wrap` with `Typography.Title level={2}` (`aria-live="polite"`) and `SortSelect`.                                                                                                                                                                                                                                                                                                               |
| `SortSelect`                                      | antd `Select` with `options={SORT_SELECT_OPTIONS}`, an `aria-label`, and a visible `Typography.Text` label.                                                                                                                                                                                                                                                                                                                                               |
| `BookGrid` / `BookCard`                           | `Row gutter={GRID_GUTTER}` + `Col {...BOOK_GRID_COLUMNS}`. `BookCard` is wrapped in `memo`, is an antd `Card hoverable` with `cover={<CoverImage/>}` and `Card.Meta` (title = book title in an `h3` via `Typography.Title level={5}`, description = author + year), and the whole card is wrapped in a router `Link` to `buildWorkPath(id)` with `state={{ fromSearch: location.search }}`. Keep `aria-label={STRINGS.search.resultsListLabel}` on a wrapping `<ul>`/list role, so tests still find the list. |
| Skeleton grid                                     | `BookGridSkeleton`: the same `Row`/`Col` with `Skeleton.Node active` (2:3 box via CSS Module) and `Skeleton active paragraph={{ rows: 1 }} title`, repeated `SKELETON_CARD_COUNT` times via `Array.from`.                                                                                                                                                                                                                                                   |
| Load more                                         | `LoadMoreFooter`: `Flex vertical align="center"` with the "Showing" text, a `Typography.Text type="danger"` on error, and `Button size="large" loading={isFetchingNextPage}`.                                                                                                                                                                                                                                                                               |
| `EmptyState`                                      | `EmptyResult`: antd `Empty` with `description` from `STRINGS`. The title must stay findable as a **heading** with `STRINGS.status.emptyTitle`, so render it as `Typography.Title level={3}` inside `description`.                                                                                                                                                                                                                                            |
| `ErrorState`                                      | `ErrorResult`: antd `Result status="error"` (or `"404"` when `notFound`) with `title`, `subTitle`, and `extra={onRetry && <Button icon={<ReloadOutlined/>}>…}`. Check that `Result` renders `title` as a heading; if not, pass a `Typography.Title`.                                                                                                                                                                                                         |
| `NotFoundPage`                                    | `RouteErrorPage`: `useRouteError()` + `isRouteErrorResponse`. Shows `Result status="404"` for 404s and `status="error"` otherwise. Wrapped in `AppLayout` chrome. Used as the root `errorElement`, and the `*` route renders the 404 variant.                                                                                                                                                                                                              |
| `CoverImage`                                      | Keep the logic (`useState` failed flag, `onError`, placeholder with a spine colour from `pickSpineColor(title)`). Move styling into `CoverImage.module.css` (aspect-ratio 2/3, object-fit cover, placeholder flex layout). Add an optional `preview` prop: when true (detail page), render antd `Image` with `preview` and `onError`; otherwise render a plain `<img loading="lazy">` (cards).                                                               |
| `BookPage`                                        | Container `BookPage` + presentational `BookDetails`, laid out as `Row gutter` with a `Col xs={24} md={8}` cover and a `Col xs={24} md={16}` body: `Typography.Title level={1}`, `AuthorLinks` (`Intl.ListFormat` to join, each a `Link` to `buildSearchPath({query: author})`), `Descriptions` with a "First published" item, `Typography.Paragraph ellipsis={{ rows: DESCRIPTION_MAX_ROWS, expandable: true }}`, `SubjectTags` (antd `Tag`s linking to `buildSearchPath({ query: \`subject:"${s}"\` })`, first `MAX_SUBJECT_TAGS`), and `Button type="primary" href target="_blank" icon={<ExportOutlined/>}`. `BackToResultsLink` is a `Button type="link" icon={<ArrowLeftOutlined/>}` rendered as a router `Link`. `BookPageSkeleton` uses antd `Skeleton`. |

- **Document title:** keep React 19 `<title>` elements, with text from `STRINGS`.

---

## Phase 7: React patterns and hooks

- **`useSearchUrlState()`** returns `{ query, sort, setSearch }`.
  - `setSearch({ query?, sort? }, { replace?, fromInput? })` builds `URLSearchParams` from the
    constants. It omits `sort` when it equals `DEFAULT_SORT` or when the query is empty, and
    passes `state: { fromInput }`.
- **`useSearchDraft({ query, onCommit })`** moves the draft, debounce and resync logic out of the
  current `SearchPage.tsx` unchanged.
  - Keep the "adjust state during render" resync (`syncedQuery` state) and the
    `fromInput` + `useNavigationType() !== NavigationType.Pop` guard. Use the `NavigationType`
    enum from react-router, **not** the string `'POP'`.
  - Returns `{ draft, setDraft, submit, isTyping }`.
- **`useBookSearch(query, sort)`** returns the infinite query. It also derives
  `books` (via `pages.flatMap`) and `total` (via `pages.at(0)?.total ?? 0`) inside the hook with
  `useMemo`, so the page stays thin.
- **`useWork(id)`**: unchanged, but uses `queryKeys` and the timing constants.
- **`SearchPage`** (container): calls the hooks and renders `SearchHero` **or**
  (`SearchInput` + `ResultsHeader` + one of skeleton/error/empty/grid + `LoadMoreFooter`). Extract
  that branch into a small `renderResults()` helper or a `SearchResults` component. Do not nest
  ternaries.
- **Handlers** passed to memoized children are wrapped in `useCallback`.
- **No `useEffect` for derived data.** Effects are only for syncing with external systems (URL
  commit after debounce, localStorage/DOM theme).
- **Routing** (`app/router.tsx`):
  - Export a `routes: RouteObject[]` and `createAppRouter()`. The root element is `AppLayout`,
    with `errorElement: <RouteErrorPage/>`.
  - Children: `{ index: true, lazy: () => import('@/features/search/route') }` and
    `{ path: 'works/:id', lazy: () => import('@/features/book/route') }`.
  - Each feature gets a `route.ts` that exports `{ Component: SearchPage }` (the React Router lazy
    convention). Lint must allow this: add `route.ts` to the react-refresh ignore list if needed.
  - Add `hydrateFallbackElement` with an antd `Spin` on the root route, so lazy routes show a
    spinner on first load.
  - `{ path: ROUTE_PATHS.notFound, element: <RouteErrorPage notFound /> }` (or throw a 404 in a
    loader; pick the simpler option).
- **`main.tsx`**: `createRoot(...).render(<StrictMode><App/></StrictMode>)`. Import
  `@/styles/global.css` and `antd/dist/reset.css` if it exists in antd 6 (check
  `node_modules/antd/dist`). If it doesn't, skip it.

---

## Phase 8: Test utils (`src/test-utils/`) and tests

```
src/test-utils/
  setup/vitest.setup.ts        # jest-dom, mocks, MSW lifecycle, cleanup, antd-warning guard
  mocks/matchMedia.ts          # installMatchMediaMock(matches = false), needed by antd Grid/Row/Col
  mocks/browserApis.ts         # window.scrollTo noop, ResizeObserver stub if antd needs it
  msw/server.ts                # setupServer(...defaultHandlers)
  msw/handlers.ts              # defaultHandlers + handler factories: searchHandler(opts), workHandler(opts), authorHandler(opts), errorHandler(url, status)
  msw/urls.ts                  # MSW URL patterns built from @/constants/api
  fixtures/factories.ts        # buildSearchDoc(overrides), buildSearchResponse({ total, page, count }), buildWork(overrides), buildAuthor(overrides)
  fixtures/constants.ts        # TEST_QUERY = 'dune', TEST_WORK_ID, TEST_TOTAL = 30, EMPTY_QUERY = 'nothing', etc.
  render/renderWithProviders.tsx  # component tests: QueryClient(retry:false) + ThemeModeProvider + AntdThemeProvider + MemoryRouter
  render/renderRoute.tsx       # page tests: createMemoryRouter(routes, { initialEntries }) inside the same providers; returns { router, user, ...rtl }
  render/createTestQueryClient.ts
  interactions/antdSelect.ts   # selectAntdOption(user, comboboxName, optionLabel): open the Select and click the option (antd Select is not a native <select>; options render in a portal and can be found with findByTitle)
  index.ts                     # barrel
```

- `vitest.setup.ts`:
  - `beforeAll(server.listen({ onUnhandledFrame: 'error' }))`, `afterEach(cleanup + server.resetHandlers())`,
    `afterAll(server.close())`.
  - Install the mocks.
  - **Fail on antd warnings:** spy on `console.error` and `console.warn`, and in `afterEach` throw
    if any call contains `'[antd'` or `'Warning:'`.
- `renderRoute` uses `userEvent.setup()` and returns `user`, so tests don't call it themselves.
- Lazy routes resolve asynchronously, so page tests must use `findBy*` for the first assertion.
- **Port all 21 existing tests** to the new locations, and replace hard-coded strings and URLs with
  `STRINGS`, `buildSearchPath` and the fixture constants. The sort test changes from
  `user.selectOptions` to `selectAntdOption`.
- **New tests:**
  - `cleanDescription.test.ts`
  - `useSearchUrlState.test.tsx` (sort omitted for relevance/empty query)
  - `ThemeModeProvider` test: toggle flips `data-theme` and persists to `localStorage`, and
    `useThemeMode` throws outside the provider.
  - `routes.ts` builders test.
  - `RouteErrorPage` test: an unknown path shows the 404 result.

---

## Phase 9: Lint guard for constants

In `eslint.config.js`, for `src/**/*.{ts,tsx}` **excluding** `src/constants/**`,
`src/test-utils/**` and `**/*.test.*`, add:

```js
'no-restricted-syntax': ['error',
  { selector: 'JSXText[value=/\\S/]', message: 'Put user-visible text in @/constants/strings.' },
  { selector: 'JSXAttribute[name.name=/^(aria-label|placeholder|title|alt)$/] > Literal', message: 'Use STRINGS for accessible/user-visible attributes.' },
  { selector: "Literal[value=/^https?:\\/\\//]", message: 'URLs belong in @/constants/api.' },
  { selector: 'ExportDefaultDeclaration', message: 'Use named exports.' },
],
'no-restricted-imports': ['error', { patterns: [
  { group: ['@/features/*/*'], message: 'Import features through their barrel (@/features/x).' },
  { group: ['**/test-utils/**'], message: 'App code must not import test utils.' },
]}],
```

There is no import plugin; `no-restricted-syntax` covers "no default exports". Then fix every
violation.

---

## Phase 10: Cleanup and docs

- Delete: `src/index.css`, the old folders, and every Tailwind reference
  (`grep -ri tailwind src index.html package.json` must return nothing).
- `README.md`: in the Stack line, replace "Tailwind CSS v4" with "Ant Design 6". Update the
  Project layout block to the new tree, and add the `test:coverage` script to the table.
- Keep this plan file.

---

## Gates (run after each phase; all must pass at the end)

```bash
npm run typecheck
npm run lint
npm run test:run          # run 3 times at the end to confirm it isn't flaky
npm run build
npx prettier --check .
```

## Final manual verification (browser)

Run `npm run dev` and open `http://localhost:5173/book-search-app/`. Check:

1. The hero renders with antd styling in both themes. Toggle the theme and reload: the choice
   persists with no flash.
2. Type `dune`: the URL updates after a pause, a skeleton grid appears, then cards with covers.
3. Change the sort to "Newest first": the URL gets `&sort=new` and results refetch.
   "Load more" appends 24 books.
4. Open a book: the detail page shows the cover (click it to preview), description with
   "expand", subjects and authors. "Back to results" restores the query and sort.
5. Visit `/book-search-app/nope`: the antd 404 result appears.
6. At 375 px width: two columns and no horizontal scroll.
7. The console has no errors and no antd deprecation warnings.
8. `npm run build && npm run preview`: the app works under `/book-search-app/`.

## Out of scope

GitHub Pages deployment, i18n libraries, new features, and visual changes beyond moving to antd
components with the existing brand colours and fonts.
