import { useEffect, useState } from 'react'
import { NavigationType, useLocation, useNavigationType } from 'react-router'
import { SEARCH_DEBOUNCE_MS, type LocationState } from '@/constants'
import { useDebouncedValue } from '@/shared/hooks'
import type { SetSearch } from './useSearchUrlState'

interface UseSearchDraftOptions {
  query: string
  setSearch: SetSearch
}

/**
 * The input is local state so typing stays responsive. The draft is pushed into the URL once
 * typing settles, and the input resyncs when the URL changes from outside (back/forward, a
 * subject link). URL changes this page made itself are skipped, so keystrokes typed while
 * that navigation was in flight are not overwritten.
 */
export function useSearchDraft({ query, setSearch }: UseSearchDraftOptions) {
  const location = useLocation()
  const navigationType = useNavigationType()
  const state = location.state as LocationState | null
  const selfInitiated = state?.fromInput === true && navigationType !== NavigationType.Pop

  const [draft, setDraft] = useState(query)
  const [syncedQuery, setSyncedQuery] = useState(query)
  // Adjust state during render (not in an effect) when the URL query changes.
  if (query !== syncedQuery) {
    setSyncedQuery(query)
    if (!selfInitiated) setDraft(query)
  }

  const debounced = useDebouncedValue(draft, SEARCH_DEBOUNCE_MS)

  // The `debounced === draft` guard stops a stale debounced value from overwriting a URL
  // change that came from navigation. Only react to settled input. An empty draft (cleared by
  // the clear button or backspace) only empties the box; results stay until the user submits.
  useEffect(() => {
    const next = debounced.trim()
    if (debounced === draft && next !== '' && next !== query) {
      setSearch({ query: next }, { replace: query !== '' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only the settled value triggers a commit
  }, [debounced])

  const submit = () => setSearch({ query: draft }, { replace: false })

  return {
    draft,
    setDraft,
    submit,
    isTyping: draft.trim() !== query,
  }
}
