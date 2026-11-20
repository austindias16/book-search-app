# Shelf — Book Search

Search twenty million books from [Open Library](https://openlibrary.org). Type a title, author, or subject; browse covers; open any book for its description and subjects.

## Features

- Debounced search-as-you-type, with the query and sort order kept in the URL (shareable, back/forward friendly)
- Server-side sorting (relevance, newest, oldest, title) and "Load more" pagination
- Book detail pages (`/works/:id`) with description, authors, subjects (clickable to search) and a link to Open Library
- Loading skeletons, empty and error states with retry, generated placeholder covers for books without one
- Light and dark themes (follows the system, with a toggle that remembers your choice)
- Responsive from phone to wide desktop; keyboard and screen-reader friendly

## Stack

React 19 · TypeScript (strict) · Vite · Ant Design 6 · TanStack Query · React Router · Zod · Vitest + Testing Library + MSW · ESLint (flat config) + Prettier

## Getting started

Requires Node.js 20.19 or newer.

```bash
npm install
npm run dev
```

The dev server opens at `http://localhost:5173/book-search-app/`.

## Scripts

| Script                  | What it does                       |
| ----------------------- | ---------------------------------- |
| `npm run dev`           | Start the Vite dev server          |
| `npm run build`         | Typecheck and build to `dist/`     |
| `npm run preview`       | Serve the production build locally |
| `npm test`              | Run tests in watch mode            |
| `npm run test:run`      | Run tests once                     |
| `npm run test:coverage` | Run tests with V8 coverage         |
| `npm run lint`          | Lint with ESLint                   |
| `npm run typecheck`     | Typecheck without building         |
| `npm run format`        | Format with Prettier               |

## Project layout

```
src/
  app/                   App shell: providers, router, query client
  constants/             All strings, URLs, routes, query keys, storage keys, magic numbers
  services/openLibrary/  HTTP client, Zod schemas, mappers, URL builders, fetchers
  features/
    search/              Search page: pages/, components/, hooks/
    book/                Book detail page: pages/, components/, hooks/, utils/
  shared/                AppLayout, CoverImage, ThemeToggle, status results, hooks, utils
  theme/                 Light/dark mode context and the antd theme builder
  styles/                Global CSS (serif font, reduced motion)
  test-utils/            MSW server and handlers, fixtures, render helpers (tests only)
```
