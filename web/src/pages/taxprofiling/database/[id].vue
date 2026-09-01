<script setup>
import { useTaxProfiling } from '~/composables/useTaxProfiling'
import DatabaseCard from '~/components/DatabaseCard.vue'

const route = useRoute()
const { load, getDatabaseById, getToolsByDatabase } = useTaxProfiling()

const database = ref(null)
const compatibleToolList = ref([])
const loading = ref(true)

onMounted(async () => {
  await load()
  const databaseId = route.params.id
  database.value = getDatabaseById(databaseId)
  if (database.value) {
    compatibleToolList.value = getToolsByDatabase(databaseId)
  }
  loading.value = false
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
    <!-- Header -->
    <section class="py-8 px-4 md:px-8 border-b border-slate-200 bg-white">
      <div class="max-w-4xl mx-auto">
        <NuxtLink to="/taxprofiling/database" class="text-emerald-600 hover:underline text-sm mb-4 inline-block">
          ← Back to Databases
        </NuxtLink>
      </div>
    </section>

    <!-- Loading State -->
    <div v-if="loading" class="py-12 text-center">
      <div class="inline-block animate-spin">⏳</div>
      <p class="text-slate-600 mt-2">Loading database details...</p>
    </div>

    <!-- Database Not Found -->
    <div v-else-if="!database" class="py-12 text-center">
      <p class="text-red-600 text-lg">Database not found</p>
      <NuxtLink to="/taxprofiling/database" class="text-emerald-600 hover:underline mt-4 inline-block">
        Back to Databases
      </NuxtLink>
    </div>

    <!-- Database Details -->
    <section v-else class="py-8 px-4 md:px-8">
      <div class="max-w-4xl mx-auto">
        <!-- Main Info Card -->
        <div class="bg-white rounded-lg border-2 border-slate-100 p-8 mb-8">
          <DatabaseCard
            :id="database['@id']"
            :name="database.name"
            :description="database.description"
            :homepage="database.homepage"
            :doi="database.doi"
            :latest_release="database.latest_release"
            :taxonomic_scope="database.taxonomic_scope"
            :compatible_tools="database.compatible_tools"
            :sample="database.sample"
            :origin="database.origin"
          />
        </div>

        <!-- Additional Details -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <!-- Taxonomic Coverage -->
          <div v-if="database.taxonomic_scope && database.taxonomic_scope.length > 0" class="bg-white rounded-lg border-2 border-slate-100 p-6">
            <h2 class="text-xl font-bold text-slate-900 mb-4">Taxonomic Coverage</h2>
            <div class="flex gap-2 flex-wrap">
              <span 
                v-for="scope in database.taxonomic_scope"
                :key="scope['@id']"
                class="px-3 py-2 bg-purple-100 text-purple-700 rounded-md text-sm"
              >
                {{ scope.label }}
              </span>
            </div>
          </div>

          <!-- Metadata -->
          <div class="bg-white rounded-lg border-2 border-slate-100 p-6">
            <h2 class="text-xl font-bold text-slate-900 mb-4">Information</h2>
            <div class="space-y-3">
              <div v-if="database.latest_release">
                <span class="text-slate-600 text-sm">Latest Release</span>
                <p class="text-slate-900 font-semibold">{{ database.latest_release }}</p>
              </div>
              <div v-if="database.release">
                <span class="text-slate-600 text-sm">Release</span>
                <p class="text-slate-900 font-semibold">{{ database.release }}</p>
              </div>
              <div v-if="database.to_update" class="mt-2">
                <span class="px-3 py-1 bg-yellow-200 text-yellow-700 text-sm rounded">
                  ⚠ Needs Update
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- External Links -->
        <div v-if="database.homepage || database.doi" class="bg-white rounded-lg border-2 border-slate-100 p-6 mb-8">
          <h2 class="text-xl font-bold text-slate-900 mb-4">Links</h2>
          <div class="flex gap-4 flex-wrap">
            <a
              v-if="database.homepage"
              :href="database.homepage"
              target="_blank"
              rel="noopener noreferrer"
              class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md transition"
            >
              🌐 Homepage
            </a>
            <a
              v-if="database.doi"
              :href="database.doi"
              target="_blank"
              rel="noopener noreferrer"
              class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md transition"
            >
              📄 DOI
            </a>
          </div>
        </div>

        <!-- Compatible Tools -->
        <div class="bg-white rounded-lg border-2 border-slate-100 p-6">
          <h2 class="text-xl font-bold text-slate-900 mb-4">
            Compatible Tools ({{ compatibleToolList.length }})
          </h2>
          <div v-if="compatibleToolList.length === 0" class="text-slate-600">
            No tools are associated with this database in the catalog.
          </div>
          <div v-else class="grid grid-cols-1 gap-4">
            <NuxtLink
              v-for="tool in compatibleToolList"
              :key="tool['@id']"
              :to="`/taxprofiling/tool/${tool['@id']}`"
              class="p-4 border-2 border-sky-100 rounded-lg hover:border-sky-500 hover:bg-sky-50 transition"
            >
              <h3 class="font-semibold text-slate-900 mb-1">{{ tool.name }}</h3>
              <p class="text-slate-600 text-sm line-clamp-2">{{ tool.description }}</p>
              <div class="mt-2 flex gap-2 flex-wrap">
                <span v-if="tool.supports_shortreads" class="px-2 py-1 bg-teal-100 text-teal-700 text-xs rounded">
                  Short Reads
                </span>
                <span v-if="tool.supports_longreads" class="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                  Long Reads
                </span>
                <span v-if="tool.strain_level" class="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">
                  Strain Level
                </span>
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- Part Of (Parent Databases) -->
        <div v-if="database.isPartOf && database.isPartOf.length > 0" class="bg-white rounded-lg border-2 border-slate-100 p-6 mt-8">
          <h2 class="text-xl font-bold text-slate-900 mb-4">Part Of</h2>
          <div class="flex gap-2 flex-wrap">
            <NuxtLink
              v-for="parent in database.isPartOf"
              :key="parent['@id']"
              :to="`/taxprofiling/database/${parent['@id']}`"
              class="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 hover:cursor-pointer transition font-semibold"
            >
              📦 {{ parent['@id'] }}
            </NuxtLink>
          </div>
        </div>

        <!-- Has Part (Child Databases) -->
        <div v-if="database.hasPart && database.hasPart.length > 0" class="bg-white rounded-lg border-2 border-slate-100 p-6 mt-8">
          <h2 class="text-xl font-bold text-slate-900 mb-4">Has Part</h2>
          <div class="flex gap-2 flex-wrap">
            <NuxtLink
              v-for="child in database.hasPart"
              :key="child['@id']"
              :to="`/taxprofiling/database/${child['@id']}`"
              class="px-4 py-2 bg-pink-100 text-pink-700 rounded-lg hover:bg-pink-200 hover:cursor-pointer transition font-semibold"
            >
              📂 {{ child['@id'] }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>