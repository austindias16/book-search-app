import { useQuery } from '@tanstack/react-query'
import { queryKeys, WORK_STALE_TIME_MS } from '@/constants'
import { getWork } from '@/services/openLibrary'

export function useWork(id: string) {
  return useQuery({
    queryKey: queryKeys.work(id),
    queryFn: ({ signal }) => getWork(id, signal),
    staleTime: WORK_STALE_TIME_MS,
  })
}
