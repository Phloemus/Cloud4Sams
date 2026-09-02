<script setup>
import { useTaxProfiling } from '~/composables/useTaxProfiling'

const router = useRouter()
const { getAllDatabases } = useTaxProfiling()
const searchQuery = ref('')

// Data is immediately available (no loading wait!)
const databases = computed(() => getAllDatabases())
const filteredDatabases = computed(() => {
  if (!searchQuery.value) return databases.value
  const query = searchQuery.value.toLowerCase()
  return databases.value.filter(db => {
    const matchName = db.name.toLowerCase().includes(query)
    const matchDesc = db.description.toLowerCase().includes(query)
    const matchSample = db.sample?.label?.toLowerCase().includes(query)
    const matchOrigin = db.origin?.label?.toLowerCase().includes(query)
    return matchName || matchDesc || matchSample || matchOrigin
  })
})

// No need for loading state - data is cached
const loading = ref(false)
</script>
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
    <!-- Header -->
    <section class="py-8 px-4 md:px-8 border-b border-slate-200">
      <div class="max-w-6xl mx-auto">
        <NuxtLink to="/taxprofiling" class="text-emerald-600 hover:underline text-sm mb-4 inline-block">
          ← Back to Catalog
        </NuxtLink>
        <h1 class="text-3xl font-bold text-slate-900 mb-2">Reference Databases</h1>
        <p class="text-slate-600">{{ databases.length }} databases available</p>
      </div>
    </section>

    <!-- Search -->
    <section class="py-6 px-4 md:px-8 bg-white border-b border-slate-200">
      <div class="max-w-6xl mx-auto">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search databases by name or description..."
          class="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none transition"
        />
      </div>
    </section>

    <!-- Loading State -->
    <div v-if="loading" class="py-12 text-center">
      <div class="inline-block animate-spin">⏳</div>
      <p class="text-slate-600 mt-2">Loading databases...</p>
    </div>

    <!-- Databases Grid -->
    <section v-else class="py-8 px-4 md:px-8">
      <div class="max-w-6xl mx-auto">
        <div v-if="filteredDatabases.length === 0" class="text-center py-12">
          <p class="text-slate-600">No databases found matching your search.</p>
        </div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="database in filteredDatabases"
            :key="database['@id']"
            @click="router.push(`/taxprofiling/database/${database['@id']}`)"
            class="p-4 bg-white rounded-lg border-2 border-slate-100 hover:border-emerald-500 hover:shadow-md transition-all group hover:cursor-pointer"
          >
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-semibold text-lg text-slate-900 group-hover:text-emerald-600 transition">
                {{ database.name }}
              </h3>
              <span class="px-2 py-1 bg-emerald-200 text-emerald-600 text-xs rounded-sm">
                Database
              </span>
            </div>
            
            <p class="text-slate-600 text-sm line-clamp-3 mb-3">
              {{ database.description }}
            </p>

            <div v-if="database.sample || database.origin" class="flex gap-3 mb-3 text-xs">
              <div v-if="database.sample" class="flex items-center gap-1">
                <span>🧫</span>
                <span class="font-semibold text-slate-700">{{ database.sample.label }}</span>
              </div>
              <div v-if="database.origin" class="flex items-center gap-1">
                <span>🌍</span>
                <span class="font-semibold text-slate-700">{{ database.origin.label }}</span>
              </div>
            </div>

            <div class="flex gap-2 flex-wrap mb-3">
              <span 
                v-for="scope in database.taxonomic_scope"
                :key="scope['@id']"
                class="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded"
              >
                {{ scope.label }}
              </span>
            </div>

            <div class="text-xs text-slate-500 flex justify-between">
              <span v-if="database.latest_release">v{{ database.latest_release }}</span>
              <span v-if="database.compatible_tools" class="text-emerald-600">
                🔗 {{ database.compatible_tools.length }} tools
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>