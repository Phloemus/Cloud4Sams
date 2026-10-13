<script setup>
import { getTaxProfilingCatalog } from '~/composables/buildCatalog'

definePageMeta({ alias: ['/taxprofiling/tools'] })

const catalog = getTaxProfilingCatalog()
const searchQuery = ref('')

const tools = computed(() => catalog.tools)
const filteredTools = computed(() => {
  if (!searchQuery.value) return tools.value
  const query = searchQuery.value.toLowerCase()
  return tools.value.filter(tool => 
    tool.name.toLowerCase().includes(query) ||
    tool.description.toLowerCase().includes(query)
  )
})

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

    <!-- Tools Grid -->
    <section class="py-8 px-4 md:px-8">
      <div class="max-w-6xl mx-auto">
        <div v-if="filteredTools.length === 0" class="text-center py-12">
          <p class="text-slate-600">No tools found matching your search.</p>
        </div>
        
        <div v-else class="grid grid-cols-3 gap-4">
          <NuxtLink
            v-for="tool in filteredTools"
            :key="tool.biotoolsID"
            :to="`/tool/${encodeURIComponent(tool.biotoolsID)}`"
            class="p-4 relative bg-slate-100 rounded-md border-2 border-slate-100 hover:border-sky-500 hover:cursor-pointer"
          >
            <h3 class="font-semibold text-md text-slate-800 truncate">{{ tool.name }}</h3>
            <div class="mt-2 flex gap-2">
              <span class="px-2 py-1 bg-sky-200 text-sky-500 text-sm rounded-sm">Tool</span>
            </div>
            <p class="mt-6 mb-16 text-slate-600 text-md line-clamp-4">
              {{ tool.description }}
            </p>
            <div class="absolute bottom-4 flex gap-2">
              <span class="px-4 py-2 bg-white hover:bg-slate-50 text-slate-900 text-sm border-2 border-slate-900 rounded-md">More info</span>
              <span class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm rounded-md">Use the data</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>