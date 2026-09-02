/// <reference types="vite/client" />
import { ref, computed } from 'vue'
import type { Ref } from 'vue'

// Import all tools and databases at build time using Vite's glob
const toolModules = import.meta.glob('../data/taxprofiling/tools/*.json', { eager: true })
const databaseModules = import.meta.glob('../data/taxprofiling/databases/*.json', { eager: true })

// Pre-instantiate all tools and databases (do this ONCE at module load, not on every render)
const cachedTools = new Map<string, Tool>()
const cachedDatabases = new Map<string, Database>()

// Initialize caches immediately
for (const path in toolModules) {
  try {
    const module = toolModules[path] as any
    const toolData = module.default || module
    const tool = new Tool(toolData)
    cachedTools.set(tool["@id"], tool)
  } catch (err) {
    console.warn(`Failed to initialize tool from ${path}`, err)
  }
}

for (const path in databaseModules) {
  try {
    const module = databaseModules[path] as any
    const dbData = module.default || module
    const db = new Database(dbData)
    cachedDatabases.set(db["@id"], db)
  } catch (err) {
    console.warn(`Failed to initialize database from ${path}`, err)
  }
}

export interface DatabaseRef {
  name: string
  "@id": string
  release?: string
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
  sample: SampleOrOrigin | null
  origin: SampleOrOrigin | null
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

export interface SubModule {
  name: string
  "@id": string
}

export class Tool {
  "@context": string
  name: string
  "@id": string
  type: string
  description: string
  latest_release: string
  curated_release: string
  citations_count: number | null
  issues_count: number | null
  host_reads_removal: string | null
  memory: string | null
  quality_control: string | null
  functional_profiling: boolean
  strain_level: boolean
  approach_detail: string
  to_update: boolean
  supports_longreads: boolean
  supports_shortreads: boolean
  repo: string
  doi: string
  additional_functionality: string
  sub_module: SubModule | null
  uses_databases: DatabaseRef[]
  github_last_fetched: string

  constructor(data: any) {
    this["@context"] = data["@context"] || ""
    this.name = data.name || ""
    this["@id"] = data["@id"] || ""
    this.type = data.type || "Taxonomic profiler"
    this.description = data.description || ""
    this.latest_release = data.latest_release || ""
    this.curated_release = data.curated_release || ""
    this.citations_count = data.citations_count || null
    this.issues_count = data.issues_count || null
    this.host_reads_removal = data.host_reads_removal || null
    this.memory = data.memory || null
    this.quality_control = data.quality_control || null
    this.functional_profiling = data.functional_profiling || false
    this.strain_level = data.strain_level || false
    this.approach_detail = data.approach_detail || ""
    this.to_update = data.to_update || false
    this.supports_longreads = data.supports_longreads || false
    this.supports_shortreads = data.supports_shortreads || false
    this.repo = data.repo || ""
    this.doi = data.doi || ""
    this.additional_functionality = data.additional_functionality || ""
    this.sub_module = data.sub_module || null
    this.uses_databases = data.uses_databases || []
    this.github_last_fetched = data.github_last_fetched || ""
  }

  getDatabaseIds(): string[] {
    return this.uses_databases.map((db: DatabaseRef) => db["@id"])
  }

  getMainFeatures(): string[] {
    const features = []
    if (this.functional_profiling) features.push("Functional Profiling")
    if (this.strain_level) features.push("Strain Level")
    if (this.supports_longreads) features.push("Long Reads")
    if (this.supports_shortreads) features.push("Short Reads")
    return features
  }
}

interface TaxProfilingData {
  tools: Tool[]
  databases: Database[]
  toolsMap: Map<string, Tool>
  databasesMap: Map<string, Database>
}

export const useTaxProfiling = () => {
  // Initialize data IMMEDIATELY from cached instances (no need to wait for async load)
  const initializeData = () => {
    const tools = Array.from(cachedTools.values())
    const databases = Array.from(cachedDatabases.values())
    const toolsMap = new Map(tools.map((tool) => [tool["@id"], tool]))
    const databasesMap = new Map(databases.map((db) => [db["@id"], db]))
    
    return {
      tools,
      databases,
      toolsMap,
      databasesMap
    }
  }

  const data: Ref<TaxProfilingData> = ref(initializeData())
  const loading: Ref<boolean> = ref(false)
  const error: Ref<string | null> = ref(null)

  const loadAllTools = async (): Promise<Tool[]> => {
    // Return cached tools (already instantiated at module load)
    return Array.from(cachedTools.values())
  }

  const loadAllDatabases = async (): Promise<Database[]> => {
    // Return cached databases (already instantiated at module load)
    return Array.from(cachedDatabases.values())
  }

  // load() is now essentially a no-op since data is already initialized
  // but we keep it for backward compatibility
  const load = async () => {
    // Data is already initialized, just return
    if (data.value && data.value.tools.length > 0) {
      return
    }
    
    loading.value = true
    error.value = null

    try {
      const [tools, databases] = await Promise.all([
        loadAllTools(),
        loadAllDatabases()
      ])

      const toolsMap = new Map(tools.map((tool) => [tool["@id"], tool]))
      const databasesMap = new Map(databases.map((db) => [db["@id"], db]))

      data.value = {
        tools,
        databases,
        toolsMap,
        databasesMap
      }
    } catch (err) {
      error.value = `Failed to load data: ${err}`
      console.error(error.value, err)
    } finally {
      loading.value = false
    }
  }

  const getToolById = (id: string): Tool | undefined => {
    return data.value.toolsMap.get(id)
  }

  const getDatabaseById = (id: string): Database | undefined => {
    return data.value.databasesMap.get(id)
  }

  const getToolsByDatabase = (databaseId: string): Tool[] => {
    return data.value.tools.filter((tool: Tool) =>
      tool.uses_databases.some((db: DatabaseRef) => db["@id"] === databaseId)
    )
  }

  const getDatabasesByTool = (toolId: string): Database[] => {
    const tool = data.value.toolsMap.get(toolId)
    if (!tool) return []
    return tool.uses_databases
      .map((dbRef: DatabaseRef) => data.value.databasesMap.get(dbRef["@id"]))
      .filter((db: Database | undefined) => db !== undefined) as Database[]
  }

  const getAllTools = (): Tool[] => {
    return data.value.tools
  }

  const getAllDatabases = (): Database[] => {
    return data.value.databases
  }

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
    getAllDatabases
  }
}
