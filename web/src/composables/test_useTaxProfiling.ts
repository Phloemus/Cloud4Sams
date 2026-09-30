/// <reference types="vite/client" />
import { ref } from 'vue'
import type { Ref } from 'vue'

// ───────────────────────── Bases de données (inchangé) ─────────────────────────

export interface DatabaseRef {
  name: string
  "@id": string
  release?: string | string[]
  taxonomy_system?: string
}

export interface ToolRef {
  "@id": string
  "DB"?: Array<{
    name: string
    download?: string
    size?: number
    ifb_server?: { name: string; path: string } | null
  }>
}

export interface TaxonomicScope {
  "@id": string
  label: string
}

export interface SampleOrOrigin {
  "@id"?: string
  label: string
}

export interface HasPartEntry {
  "@id": string
}

export class Database {
  "@context": string
  name: string
  "@id": string
  type: string
  release: string | null
  latest_release: string | null
  to_update: boolean
  description: string
  doi: string | null
  homepage: string | null
  license: string | null
  taxonomic_scope: TaxonomicScope[]
  sample: SampleOrOrigin | SampleOrOrigin[] | null
  origin: SampleOrOrigin | SampleOrOrigin[] | null
  is_about: string | null
  isPartOf: HasPartEntry[] | null
  hasPart: HasPartEntry[] | null
  compatible_tools: ToolRef[]

  constructor(data: any) {
    this["@context"] = data["@context"] || ""
    this.name = data.name || ""
    this["@id"] = data["@id"] || ""
    this.type = data.type || "Database"
    this.release = data.release || null
    this.latest_release = data.latest_release || null
    this.to_update = data.to_update || false
    this.description = data.description || ""
    this.doi = data.doi || null
    this.homepage = data.homepage || null
    this.license = data.license || null
    this.taxonomic_scope = data.taxonomic_scope || []
    this.sample = data.sample || null
    this.origin = data.origin || null
    this.is_about = data.is_about || null
    this.isPartOf = data.isPartOf || null
    this.hasPart = data.hasPart || null
    this.compatible_tools = data.compatible_tools || []
  }

  getCompatibleToolIds(): string[] {
    return this.compatible_tools.map((tool: ToolRef) => tool["@id"])
  }
}

// ───────────────────── Outils : overlay minimal (le reste vient de bio.tools) ─────────────────────
// Retirés par rapport à avant : description, repo, doi, documentation
// → récupérés via /api/biotools/:id (voir composables/useBioTool.ts)

export interface SubModule {
  name: string
  "@id": string
}

export class Tool {
  "@context": string
  "@id": string
  /** À renseigner seulement si l'ID bio.tools diffère de "@id" */
  biotools_id: string | null
  /** Libellé pour tri/filtre/affichage immédiat (évite d'attendre l'API pour la liste) */
  name: string
  type: string
  approach_detail: string
  additional_functionality: string
  sub_module: SubModule | null
  uses_databases: DatabaseRef[]
  supports_longreads: boolean
  supports_shortreads: boolean
  functional_profiling: boolean
  strain_level: boolean
  host_reads_removal: string | null
  memory: string | null
  quality_control: string | null
  curated_release: string
  latest_release: string
  citations_count: number | null
  issues_count: number | null
  to_update: boolean
  github_last_fetched: string

  constructor(data: any) {
    this["@context"] = data["@context"] || ""
    this["@id"] = data["@id"] || ""
    this.biotools_id = data.biotools_id || null
    this.name = data.name || ""
    this.type = data.type || "Taxonomic profiler"
    this.approach_detail = data.approach_detail || ""
    this.additional_functionality = data.additional_functionality || ""
    this.sub_module = data.sub_module || null
    this.uses_databases = data.uses_databases || []
    this.supports_longreads = data.supports_longreads || false
    this.supports_shortreads = data.supports_shortreads || false
    this.functional_profiling = data.functional_profiling || false
    this.strain_level = data.strain_level || false
    this.host_reads_removal = data.host_reads_removal || null
    this.memory = data.memory || null
    this.quality_control = data.quality_control || null
    this.curated_release = data.curated_release || ""
    this.latest_release = data.latest_release || ""
    this.citations_count = data.citations_count ?? null
    this.issues_count = data.issues_count || null
    this.to_update = data.to_update || false
    this.github_last_fetched = data.github_last_fetched || ""
  }

  /** Identifiant à utiliser pour interroger bio.tools */
  get biotoolsId(): string {
    return this.biotools_id ?? this["@id"]
  }

  getDatabaseIds(): string[] {
    return this.uses_databases.map((db: DatabaseRef) => db["@id"])
  }

  getMainFeatures(): string[] {
    const features: string[] = []
    if (this.functional_profiling) features.push("Functional Profiling")
    if (this.strain_level) features.push("Strain Level")
    if (this.supports_longreads) features.push("Long Reads")
    if (this.supports_shortreads) features.push("Short Reads")
    return features
  }
}

// ───────────────────── Chargement au build (aucun réseau ici) ─────────────────────

const toolModules = import.meta.glob('../data/taxprofiling/tools/*.json', { eager: true, import: 'default' })
const databaseModules = import.meta.glob('../data/taxprofiling/databases/*.json', { eager: true, import: 'default' })

const cachedTools = new Map<string, Tool>()
const cachedDatabases = new Map<string, Database>()

for (const path in toolModules) {
  try {
    const tool = new Tool(toolModules[path])
    cachedTools.set(tool["@id"], tool)
  } catch (err) {
    console.warn(`Failed to initialize tool from ${path}`, err)
  }
}

for (const path in databaseModules) {
  try {
    const db = new Database(databaseModules[path])
    cachedDatabases.set(db["@id"], db)
  } catch (err) {
    console.warn(`Failed to initialize database from ${path}`, err)
  }
}

interface TaxProfilingData {
  tools: Tool[]
  databases: Database[]
  toolsMap: Map<string, Tool>
  databasesMap: Map<string, Database>
}

export const useTaxProfiling = () => {
  const tools = Array.from(cachedTools.values())
  const databases = Array.from(cachedDatabases.values())

  const data: Ref<TaxProfilingData> = ref({
    tools,
    databases,
    toolsMap: cachedTools,
    databasesMap: cachedDatabases,
  })

  // Conservés pour compatibilité avec les composants existants : plus rien à charger.
  const loading: Ref<boolean> = ref(false)
  const error: Ref<string | null> = ref(null)
  const load = async () => {}

  const getToolById = (id: string): Tool | undefined => data.value.toolsMap.get(id)
  const getDatabaseById = (id: string): Database | undefined => data.value.databasesMap.get(id)

  const getToolsByDatabase = (databaseId: string): Tool[] =>
    data.value.tools.filter((tool: Tool) =>
      tool.uses_databases.some((db: DatabaseRef) => db["@id"] === databaseId),
    )

  const getDatabasesByTool = (toolId: string): Database[] => {
    const tool = data.value.toolsMap.get(toolId)
    if (!tool) return []
    return tool.uses_databases
      .map((dbRef: DatabaseRef) => data.value.databasesMap.get(dbRef["@id"]))
      .filter((db): db is Database => db !== undefined)
  }

  const getAllTools = (): Tool[] => data.value.tools
  const getAllDatabases = (): Database[] => data.value.databases

  return {
    data,
    loading,
    error,
    load,
    getToolById,
    getDatabaseById,
    getToolsByDatabase,
    getDatabasesByTool,
    getAllTools,
    getAllDatabases,
  }
}