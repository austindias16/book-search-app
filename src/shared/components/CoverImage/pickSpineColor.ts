import { COVER_HASH_MULTIPLIER, COVER_SPINE_COLORS } from '@/constants'

/** Deterministic colour per title, so a placeholder keeps its colour across renders. */
export function pickSpineColor(title: string): string {
  let hash = 0
  for (const ch of title) {
    hash = (hash * COVER_HASH_MULTIPLIER + ch.charCodeAt(0)) | 0
  }
  return COVER_SPINE_COLORS[Math.abs(hash) % COVER_SPINE_COLORS.length] ?? COVER_SPINE_COLORS[0]
}
