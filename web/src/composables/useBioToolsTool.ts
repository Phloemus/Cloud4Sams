import { computed, toValue } from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import staticBioTools from '~/static/biotools.json'

const BIOTOOLS_API_BASE_URL = 'https://bio.tools/api/tool'
const BIOTOOLS_TOOL_LIST_URL = 'https://bio.tools/api/t/?topic=Metagenomics&per_page=100'
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000

type JsonRecord = Record<string, unknown>

export interface BioToolsToolRecord {
  biotoolsID: string
  name: string
  description: string
  homepage: string | null
  authors: string[]
  type: string
  global_id: string
  url: string
  publication: { doi: string | null }
}

interface CacheEntry {
  expiresAt: number
  tool: BioToolsToolRecord
}

const isRecord = (value: unknown): value is JsonRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const getString = (value: unknown): string | null =>
  typeof value === 'string' && value.trim() ? value.trim() : null

const getStringList = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : []

const getPublicationDoi = (value: unknown): string | null => {
  if (!Array.isArray(value)) return null

  for (const entry of value) {
    if (isRecord(entry)) {
      const doi = getString(entry.doi)
      if (doi) return doi
    }
  }

  return null
}

const normalizeBioToolsTool = (value: unknown): BioToolsToolRecord | null => {
  if (!isRecord(value)) return null

  const biotoolsID = getString(value.biotoolsID)
  if (!biotoolsID) return null

  const credits = Array.isArray(value.credit) ? value.credit.filter(isRecord) : []
  const authors = getStringList(value.authors)
  const creditedAuthors = credits
    .filter((credit) =>
      getStringList(credit.typeRole).some((role) => /author|creator/i.test(role))
    )
    .map((credit) => getString(credit.name))
    .filter((name): name is string => name !== null)
  const toolUrl = `https://bio.tools/${encodeURIComponent(biotoolsID)}`

  return {
    biotoolsID,
    name: getString(value.name) || biotoolsID,
    description: getString(value.description) || '',
    homepage: getString(value.homepage),
    authors: authors.length ? authors : creditedAuthors,
    type: getStringList(value.toolType).join(', '),
    global_id: getString(value.biotoolsCURIE) || `biotools:${biotoolsID}`,
    url: toolUrl,
    publication: { doi: getPublicationDoi(value.publication) }
  }
}

const getUsableBioToolsList = (records: unknown[]): BioToolsToolRecord[] =>
  records
    .map(normalizeBioToolsTool)
    .filter(
      (tool): tool is BioToolsToolRecord =>
        tool !== null && tool.name.trim() !== '' && tool.description.trim() !== ''
    )

const getStaticBioToolsList = (): BioToolsToolRecord[] =>
  getUsableBioToolsList(staticBioTools.flat(Infinity))

const getNextBioToolsPageUrl = (next: string, currentUrl: string): string => {
  const url = new URL(next, currentUrl)

  if (url.hostname !== 'bio.tools' || !/^\/api\/t\/?$/.test(url.pathname)) {
    throw new Error('Invalid pagination URL from bio.tools')
  }

  url.protocol = 'https:'
  return url.toString()
}

const fetchBioToolsList = async (): Promise<BioToolsToolRecord[]> => {
  const toolsById = new Map<string, BioToolsToolRecord>()
  const visitedPages = new Set<string>()
  let pageUrl: string | null = BIOTOOLS_TOOL_LIST_URL

  while (pageUrl) {
    if (visitedPages.has(pageUrl)) {
      throw new Error('Repeated pagination URL from bio.tools')
    }
    visitedPages.add(pageUrl)

    const response: unknown = await $fetch(pageUrl)
    if (!isRecord(response) || !Array.isArray(response.list)) {
      throw new Error('Invalid tool list response from bio.tools')
    }

    for (const tool of getUsableBioToolsList(response.list)) {
      toolsById.set(tool.biotoolsID.toLowerCase(), tool)
    }

    const nextPage = getString(response.next)
    pageUrl = nextPage ? getNextBioToolsPageUrl(nextPage, pageUrl) : null
  }

  return [...toolsById.values()]
}

const staticToolsById = new Map<string, BioToolsToolRecord>()

for (const entry of staticBioTools.flat(Infinity)) {
  const tool = normalizeBioToolsTool(entry)
  if (tool) staticToolsById.set(tool.biotoolsID.toLowerCase(), tool)
}

/** Récupère la liste live; le snapshot local sert de repli si l'API échoue. */
export const useBioToolsTools = async () =>
  await useAsyncData<BioToolsToolRecord[]>(
    'biotools-metagenomics-tools',
    async () => {
      try {
        return await fetchBioToolsList()
      } catch (error) {
        const fallbackTools = getStaticBioToolsList()
        if (fallbackTools.length > 0) {
          console.warn('[bio.tools] API unavailable; using static tool data.', error)
          return fallbackTools
        }

        throw error
      }
    },
    { dedupe: 'defer' }
  )

/** Récupère la fiche bio.tools en direct, avec repli sur le snapshot statique. */
export const useBioToolsTool = async (biotoolsId: MaybeRefOrGetter<string>) => {
  const requestedId = computed(() => toValue(biotoolsId).trim())
  const normalizedId = computed(() => requestedId.value.toLowerCase())
  const cache = useState<Record<string, CacheEntry>>(
    'biotools-tool-cache',
    () => ({})
  )

  return await useAsyncData<BioToolsToolRecord | null>(
    () => `biotools-tool-${normalizedId.value || 'empty'}`,
    async () => {
      const id = requestedId.value
      const normalized = normalizedId.value
      if (!id) return null

      const fallback = staticToolsById.get(normalized) ?? null

      try {
        const response = await $fetch<unknown>(
          `${BIOTOOLS_API_BASE_URL}/${encodeURIComponent(id)}`
        )
        const tool = normalizeBioToolsTool(response)

        if (!tool || tool.biotoolsID.toLowerCase() !== normalized) {
          throw new Error(`Invalid bio.tools response for ${id}`)
        }

        cache.value = {
          ...cache.value,
          [normalized]: {
            expiresAt: Date.now() + CACHE_DURATION_MS,
            tool
          }
        }

        return tool
      } catch (error) {
        if (fallback) {
          console.warn(`[bio.tools] API unavailable for ${id}; using static data.`, error)
          return fallback
        }

        throw error
      }
    },
    {
      dedupe: 'defer',
      getCachedData: () => {
        const cached = cache.value[normalizedId.value]
        return cached && cached.expiresAt > Date.now() ? cached.tool : undefined
      }
    }
  )
}
