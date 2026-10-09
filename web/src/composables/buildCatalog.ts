// ─────────────────────────────────────────────────────────────────────────────
// Catalogue TaxProfiling
//
//   dump bio.tools (topic Metagenomics)  ──►  BioToolsTool        (tous les outils)
//   + tes JSON locaux (features curées)  ──►  TaxProfilingTool    (extension de BioToolsTool)
//   + tes JSON de bases de données       ──►  DatabaseData        (liés via uses_databases)
//
// Règle : ce qui existe déjà dans bio.tools vient de bio.tools.
// Les JSON locaux ne portent que les informations en plus.
// ─────────────────────────────────────────────────────────────────────────────

type JsonRecord = Record<string, unknown>

const DEFAULT_TOOL_TYPE = 'Taxonomic profiler'

// ───────────────────────────── Types des données ─────────────────────────────

export interface BioToolsPublication {
  doi: string | null
}

export interface BioToolsToolData {
  name: string
  biotoolsID: string
  publication: BioToolsPublication
  homepage: string | null
  description: string
}

export interface DatabaseReference {
  name: string
  "@id": string
  release?: string | string[]
  taxonomy_system?: string | string[]
  [key: string]: unknown
}

export interface DatabaseData {
  "@id": string
  [key: string]: unknown
}

export interface SubModule {
  name: string
  biotoolsID: string
}

export interface TaxProfilingToolData extends BioToolsToolData {
  type: string
  host_reads_removal: boolean | string | null
  quality_control: boolean | string | null
  functional_profiling: boolean
  strain_level: boolean
  supports_longreads: boolean
  supports_shortreads: boolean
  uses_databases: DatabaseReference[]

  // Champs curés supplémentaires : garde seulement ceux qui existent dans tes JSON
  approach_detail: string
  additional_functionality: string
  sub_module: SubModule | null
  memory: string | null
  curated_release: string
  latest_release: string
  citations_count: number | null
  issues_count: number | null
  to_update: boolean
  github_last_fetched: string
}

// ─────────────────────────────────── Classes ─────────────────────────────────

/** Un outil tel que décrit par bio.tools. */
export class BioToolsTool {
  name: string
  biotoolsID: string
  publication: BioToolsPublication
  homepage: string | null
  description: string

  constructor(data: BioToolsToolData) {
    this.name = data.name
    this.biotoolsID = data.biotoolsID
    this.publication = data.publication
    this.homepage = data.homepage
    this.description = data.description
  }

  /** DOI de la publication (raccourci : l'information n'est stockée qu'à un seul endroit). */
  get doi(): string | null {
    return this.publication.doi
  }

  /** Page de l'outil sur bio.tools, construite à partir de l'identifiant (aucun appel réseau). */
  get biotoolsUrl(): string {
    return `https://bio.tools/${encodeURIComponent(this.biotoolsID)}`
  }
}

/** Un outil de profilage taxonomique : un BioToolsTool + tes features curées. */
export class TaxProfilingTool extends BioToolsTool {
  type: string
  host_reads_removal: boolean | string | null
  quality_control: boolean | string | null
  functional_profiling: boolean
  strain_level: boolean
  supports_longreads: boolean
  supports_shortreads: boolean
  uses_databases: DatabaseReference[]

  approach_detail: string
  additional_functionality: string
  sub_module: SubModule | null
  memory: string | null
  curated_release: string
  latest_release: string
  citations_count: number | null
  issues_count: number | null
  to_update: boolean
  github_last_fetched: string

  constructor(data: TaxProfilingToolData) {
    super(data) // la classe parente range name, biotoolsID, publication, homepage, description

    this.type = data.type || DEFAULT_TOOL_TYPE
    this.host_reads_removal = data.host_reads_removal ?? null
    this.quality_control = data.quality_control ?? null
    this.functional_profiling = data.functional_profiling ?? false
    this.strain_level = data.strain_level ?? false
    this.supports_longreads = data.supports_longreads ?? false
    this.supports_shortreads = data.supports_shortreads ?? false
    this.uses_databases = Array.isArray(data.uses_databases) ? data.uses_databases : []

    this.approach_detail = data.approach_detail ?? ''
    this.additional_functionality = data.additional_functionality ?? ''
    this.sub_module = data.sub_module ?? null
    this.memory = data.memory ?? null
    this.curated_release = data.curated_release ?? ''
    this.latest_release = data.latest_release ?? ''
    this.citations_count = data.citations_count ?? null
    this.issues_count = data.issues_count ?? null
    this.to_update = data.to_update ?? false
    this.github_last_fetched = data.github_last_fetched ?? ''
  }
}

// ───────────────────────────── Chargement des fichiers ───────────────────────

const toolModules = import.meta.glob(
  '../data/taxprofiling/tools/*.json',
  { eager: true }
) as Record<string, unknown>

const databaseModules = import.meta.glob(
  '../data/taxprofiling/databases/*.json',
  { eager: true }
) as Record<string, unknown>

const bioToolsModules = import.meta.glob(
  '../static/biotools.json',
  { eager: true }
) as Record<string, unknown>

// ─────────────────────── Petits outils de lecture « défensive » ──────────────

const isRecord = (value: unknown): value is JsonRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const getString = (value: unknown): string | null =>
  typeof value === 'string' && value.trim() ? value.trim() : null

const getBooleanOrString = (value: unknown): boolean | string | null =>
  typeof value === 'boolean' ? value : getString(value)

const getNumberOrNull = (value: unknown): number | null =>
  typeof value === 'number' && Number.isFinite(value) ? value : null

const getStringOrList = (value: unknown): string | string[] | undefined => {
  if (typeof value === 'string') return value
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string')
  }
  return undefined
}

/** Identifiants comparés sans tenir compte de la casse ni des espaces. */
const normalizeId = (id: unknown): string => String(id || '').trim().toLowerCase()

const getToolIdFromPath = (path: string): string =>
  path.split(/[\\/]/).pop()?.replace(/\.json$/i, '') || ''

const getFirstDoi = (publication: unknown): string | null => {
  if (Array.isArray(publication)) {
    for (const entry of publication) {
      if (isRecord(entry)) {
        const doi = getString(entry.doi)
        if (doi) return doi
      }
    }
  }

  if (isRecord(publication)) {
    return getString(publication.doi)
  }

  return null
}

/** Un fichier JSON peut contenir des objets dans des tableaux imbriqués. */
const getRawToolRecords = (module: unknown): JsonRecord[] => {
  const raw = isRecord(module) && 'default' in module
    ? module.default
    : module

  const collectRecords = (value: unknown): JsonRecord[] => {
    if (Array.isArray(value)) {
      return value.flatMap(collectRecords)
    }

    return isRecord(value) ? [value] : []
  }

  return collectRecords(raw)
}

// ───────────────────────────── Outils bio.tools ──────────────────────────────

const getBioToolsRecords = (): JsonRecord[] =>
  Object.values(bioToolsModules)
    .flatMap((module) => getRawToolRecords(module))

/** Renvoie null (au lieu de planter) si l'entrée n'a pas d'identifiant. */
const buildBioToolsToolData = (entry: JsonRecord): BioToolsToolData | null => {
  const biotoolsID = getString(entry.biotoolsID)

  if (!biotoolsID) return null

  return {
    name: getString(entry.name) || biotoolsID,
    biotoolsID,
    publication: {
      doi: getFirstDoi(entry.publication)
    },
    homepage: getString(entry.homepage),
    description: getString(entry.description) || ''
  }
}

// ───────────────────────────── Bases de données ──────────────────────────────

/** Ne garde que les bases qui ont un @id (sinon elles ne pourraient pas être référencées). */
const buildDatabaseRecords = (): DatabaseData[] =>
  Object.values(databaseModules)
    .flatMap((module) => getRawToolRecords(module))
    .filter((record): record is DatabaseData => getString(record['@id']) !== null)

/** Les bases citées par un outil : on normalise name / @id / release / taxonomy_system. */
const buildDatabaseReferences = (raw: unknown): DatabaseReference[] => {
  if (!Array.isArray(raw)) return []

  return raw.filter(isRecord).map((database) => {
    const id = getString(database['@id']) || ''

    return {
      ...database, // d'abord les champs d'origine…
      name: getString(database.name) || id, // …puis les valeurs normalisées par-dessus
      "@id": id,
      release: getStringOrList(database.release),
      taxonomy_system: getStringOrList(database.taxonomy_system)
    }
  })
}

// ───────────────────────── Outils de profilage taxonomique ───────────────────

const buildSubModule = (raw: unknown): SubModule | null => {
  if (!isRecord(raw)) return null

  const name = getString(raw.name)
  // On accepte biotoolsID (nouveau) ou @id (ancien format)
  const biotoolsID = getString(raw.biotoolsID) || getString(raw['@id'])

  return name && biotoolsID ? { name, biotoolsID } : null
}

const buildTaxProfilingTools = (
  bioToolsById: Map<string, BioToolsToolData>
): {
  tools: TaxProfilingTool[]
  missingBioToolsIds: string[]
} => {
  const tools: TaxProfilingTool[] = []
  const missingBioToolsIds: string[] = []

  for (const [path, module] of Object.entries(toolModules)) {
    for (const localEntry of getRawToolRecords(module)) {
      // L'identifiant vient du JSON ; à défaut, du nom du fichier (kraken2.json → kraken2)
      const localId = getString(localEntry.biotoolsID) || getToolIdFromPath(path)
      const standardEntry = bioToolsById.get(normalizeId(localId))

      if (!standardEntry) {
        missingBioToolsIds.push(localId)
      }

      // Tout ce qui existe dans bio.tools vient de bio.tools (la vérité est là-bas).
      // Si la fiche est absente, on n'invente rien : seul l'identifiant est connu,
      // et l'outil est signalé dans missingBioToolsIds.
      const bioTools: BioToolsToolData = standardEntry ?? {
        biotoolsID: localId,
        name: localId,
        description: '',
        homepage: null,
        publication: { doi: null }
      }

      tools.push(new TaxProfilingTool({
        ...bioTools,
        type: getString(localEntry.type) || DEFAULT_TOOL_TYPE,
        host_reads_removal: getBooleanOrString(localEntry.host_reads_removal),
        quality_control: getBooleanOrString(localEntry.quality_control),
        functional_profiling: localEntry.functional_profiling === true,
        strain_level: localEntry.strain_level === true,
        supports_longreads: localEntry.supports_longreads === true,
        supports_shortreads: localEntry.supports_shortreads === true,
        uses_databases: buildDatabaseReferences(localEntry.uses_databases),

        approach_detail: getString(localEntry.approach_detail) || '',
        additional_functionality: getString(localEntry.additional_functionality) || '',
        sub_module: buildSubModule(localEntry.sub_module),
        memory: getString(localEntry.memory),
        curated_release: getString(localEntry.curated_release) || '',
        latest_release: getString(localEntry.latest_release) || '',
        citations_count: getNumberOrNull(localEntry.citations_count),
        issues_count: getNumberOrNull(localEntry.issues_count),
        to_update: localEntry.to_update === true,
        github_last_fetched: getString(localEntry.github_last_fetched) || ''
      }))
    }
  }

  return { tools, missingBioToolsIds }
}

// ─────────────────────────────── Le catalogue ────────────────────────────────

export interface TaxProfilingCatalogResult {
  /** Uniquement tes outils curés (profilage taxonomique). */
  tools: TaxProfilingTool[]
  /**
   * TOUS les outils bio.tools du topic Metagenomics. Ceux que tu as curés sont des
   * TaxProfilingTool (test : `tool instanceof TaxProfilingTool`), les autres des BioToolsTool.
   */
  allTools: BioToolsTool[]
  databases: DatabaseData[]
  databasesById: Map<string, DatabaseData>
  /** Outils curés dont l'identifiant est absent du dump bio.tools. */
  missingBioToolsIds: string[]
  /** Références vers des bases qui n'existent pas dans data/taxprofiling/databases. */
  missingDatabaseRefs: Array<{
    toolId: string
    databaseId: string
  }>
  /** Entrées du dump ignorées car sans biotoolsID. */
  skippedBioToolsEntries: number
}

export const buildTaxProfilingCatalog = (): TaxProfilingCatalogResult => {
  // 1. Tous les outils bio.tools (dédoublonnés par identifiant)
  const bioToolsById = new Map<string, BioToolsToolData>()
  let skippedBioToolsEntries = 0

  for (const entry of getBioToolsRecords()) {
    const data = buildBioToolsToolData(entry)

    if (data) {
      bioToolsById.set(normalizeId(data.biotoolsID), data)
    } else {
      skippedBioToolsEntries++
    }
  }

  // 2. Tes outils curés, enrichis avec leur fiche bio.tools
  const { tools, missingBioToolsIds } = buildTaxProfilingTools(bioToolsById)
  const curatedById = new Map(tools.map((tool) => [normalizeId(tool.biotoolsID), tool]))

  // 3. Liste complète : un outil curé remplace son équivalent bio.tools
  const allTools: BioToolsTool[] = Array.from(bioToolsById.entries()).map(
    ([id, data]) => curatedById.get(id) ?? new BioToolsTool(data)
  )

  // Un outil curé absent du dump reste affiché (avec ses données locales de secours)
  for (const tool of tools) {
    if (!bioToolsById.has(normalizeId(tool.biotoolsID))) {
      allTools.push(tool)
    }
  }

  // 4. Bases de données et liens outil → base
  const databases = buildDatabaseRecords()
  const databasesById = new Map(
    databases.map((database) => [normalizeId(database['@id']), database])
  )

  const missingDatabaseRefs = tools.flatMap((tool) =>
    tool.uses_databases
      .filter((database) => !databasesById.has(normalizeId(database['@id'])))
      .map((database) => ({
        toolId: tool.biotoolsID,
        databaseId: database['@id']
      }))
  )

  return {
    tools,
    allTools,
    databases,
    databasesById,
    missingBioToolsIds,
    missingDatabaseRefs,
    skippedBioToolsEntries
  }
}

// Le catalogue est construit UNE SEULE FOIS puis réutilisé (inutile de tout refaire à chaque affichage).
let cachedCatalog: TaxProfilingCatalogResult | null = null

export const getTaxProfilingCatalog = (): TaxProfilingCatalogResult => {
  if (!cachedCatalog) {
    cachedCatalog = buildTaxProfilingCatalog()

    if (import.meta.env.DEV) {
      const { missingBioToolsIds, missingDatabaseRefs, skippedBioToolsEntries } = cachedCatalog

      if (missingBioToolsIds.length) {
        console.warn('[catalogue] outils curés absents du dump bio.tools :', missingBioToolsIds)
      }
      if (missingDatabaseRefs.length) {
        console.warn('[catalogue] bases référencées mais introuvables :', missingDatabaseRefs)
      }
      if (skippedBioToolsEntries) {
        console.warn(`[catalogue] ${skippedBioToolsEntries} entrée(s) du dump ignorée(s) (pas de biotoolsID)`)
      }
    }
  }

  return cachedCatalog
}

// ───────────────────────────────── Recherches ────────────────────────────────

/** N'importe quel outil du catalogue (curé ou non). */
export const getCatalogToolById = (
  catalog: TaxProfilingCatalogResult,
  biotoolsID: string
): BioToolsTool | undefined =>
  catalog.allTools.find((tool) => normalizeId(tool.biotoolsID) === normalizeId(biotoolsID))

/** Uniquement un outil curé. */
export const getTaxProfilingToolById = (
  catalog: TaxProfilingCatalogResult,
  biotoolsID: string
): TaxProfilingTool | undefined =>
  catalog.tools.find((tool) => normalizeId(tool.biotoolsID) === normalizeId(biotoolsID))

/** Outil → ses bases. */
export const getTaxProfilingDatabasesByTool = (
  catalog: TaxProfilingCatalogResult,
  toolId: string
): DatabaseData[] => {
  const tool = getTaxProfilingToolById(catalog, toolId)

  if (!tool) return []

  return tool.uses_databases
    .map((database) => catalog.databasesById.get(normalizeId(database['@id'])))
    .filter((database): database is DatabaseData => database !== undefined)
}

/** Base → les outils qui l'utilisent (sens inverse). */
export const getTaxProfilingToolsByDatabase = (
  catalog: TaxProfilingCatalogResult,
  databaseId: string
): TaxProfilingTool[] =>
  catalog.tools.filter((tool) =>
    tool.uses_databases.some(
      (database) => normalizeId(database['@id']) === normalizeId(databaseId)
    )
  )