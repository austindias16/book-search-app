import { API_PATHS, COVERS_BASE_URL, OPEN_LIBRARY_BASE_URL } from '@/constants'

export const SEARCH_URL = new URL(API_PATHS.search, OPEN_LIBRARY_BASE_URL).toString()
export const WORK_URL_PATTERN = `${OPEN_LIBRARY_BASE_URL}${API_PATHS.work}/:id.json`
export const AUTHOR_URL_PATTERN = `${OPEN_LIBRARY_BASE_URL}${API_PATHS.author}/:id.json`
export const COVER_URL_PATTERN = `${COVERS_BASE_URL}${API_PATHS.cover}/:file`
