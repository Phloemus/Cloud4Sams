<script setup>
import { useTaxProfiling } from '~/composables/useTaxProfiling'

const router = useRouter()
const { getAllTools } = useTaxProfiling()
const searchQuery = ref('')

// Data is immediately available (no loading wait!)
const tools = computed(() => getAllTools())
const filteredTools = computed(() => {
  if (!searchQuery.value) return tools.value
  const query = searchQuery.value.toLowerCase()
  return tools.value.filter(tool => 
    tool.name.toLowerCase().includes(query) ||
    tool.description.toLowerCase().includes(query)
  )
})

// No need for loading state - data is cached
const loading = ref(false)
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
    <!-- Header -->
    <section class="py-8 px-4 md:px-8 border-b border-slate-200">
      <div class="max-w-6xl mx-auto">
        <NuxtLink to="/taxprofiling" class="text-sky-600 hover:underline text-sm mb-4 inline-block">
          ← Back to Catalog
        </NuxtLink>
        <h1 class="text-3xl font-bold text-slate-900 mb-2">Taxonomic Profiling Tools</h1>
        <p class="text-slate-600">{{ tools.length }} tools available</p>
      </div>
    </section>

    <!-- Search -->
    <section class="py-6 px-4 md:px-8 bg-white border-b border-slate-200">
      <div class="max-w-6xl mx-auto">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search tools by name or description..."
          class="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-sky-500 focus:outline-none transition"
        />
      </div>
    </section>

    <!-- Loading State -->
    <div v-if="loading" class="py-12 text-center">
      <div class="inline-block animate-spin">⏳</div>
      <p class="text-slate-600 mt-2">Loading tools...</p>
    </div>

    <!-- Tools Grid -->
    <section v-else class="py-8 px-4 md:px-8">
      <div class="max-w-6xl mx-auto">
        <div v-if="filteredTools.length === 0" class="text-center py-12">
          <p class="text-slate-600">No tools found matching your search.</p>
        </div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="tool in filteredTools"
            :key="tool['@id']"
            @click="router.push(`/taxprofiling/tool/${tool['@id']}`)"
            class="p-4 bg-white rounded-lg border-2 border-slate-100 hover:border-sky-500 hover:shadow-md transition-all group hover:cursor-pointer"
          >
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-semibold text-lg text-slate-900 group-hover:text-sky-600 transition">
                {{ tool.name }}
              </h3>
              <span class="px-2 py-1 bg-sky-200 text-sky-600 text-xs rounded-sm">
                {{ tool.type }}
              </span>
            </div>
            
            <p class="text-slate-600 text-sm line-clamp-3 mb-3">
              {{ tool.description }}
            </p>

            <div class="flex gap-2 flex-wrap mb-3">
              <span v-if="tool.supports_shortreads" class="px-2 py-1 bg-teal-100 text-teal-700 text-xs rounded">
                Short Reads
              </span>
              <span v-if="tool.supports_longreads" class="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                Long Reads
              </span>
              <span v-if="tool.strain_level" class="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">
                Strain Level
              </span>
              <span v-if="tool.functional_profiling" class="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                Functional
              </span>
            </div>

            <div class="text-xs text-slate-500">
              <span v-if="tool.latest_release" class="mr-3">v{{ tool.latest_release }}</span>
              <span v-if="tool.citations_count">📚 {{ tool.citations_count }} citations</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>