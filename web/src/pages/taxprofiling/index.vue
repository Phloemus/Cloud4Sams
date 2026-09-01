<script setup>
import { useTaxProfiling } from '~/composables/useTaxProfiling'

const { load, loading, getAllTools, getAllDatabases } = useTaxProfiling()

onMounted(async () => {
  await load()
})

const tools = computed(() => getAllTools())
const databases = computed(() => getAllDatabases())
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
    <!-- Header Section -->
    <section class="py-12 px-4 md:px-8 text-center">
      <h1 class="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
        Taxonomic Profiling Tools & Databases
      </h1>
      <p class="text-lg text-slate-600 max-w-3xl mx-auto">
        Explore a comprehensive catalog of taxonomic profiling tools and their associated reference databases.
        Choose your tool or database to get started.
      </p>
    </section>

    <!-- Navigation Buttons -->
    <section class="py-8 px-4 md:px-8">
      <div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <!-- Tools Button -->
        <NuxtLink
          to="/taxprofiling/tool"
          class="p-8 bg-white rounded-lg border-2 border-sky-200 hover:border-sky-500 hover:shadow-lg transition-all group"
        >
          <div class="text-5xl mb-4 group-hover:scale-110 transition-transform">🔍</div>
          <h2 class="text-2xl font-bold text-slate-900 mb-2">Profiling Tools</h2>
          <p class="text-slate-600 mb-4">
            Explore {{ tools.length }} taxonomic profiling tools
          </p>
          <div class="inline-block px-4 py-2 bg-sky-200 text-sky-600 font-semibold rounded-md group-hover:bg-sky-300 transition">
            Browse Tools →
          </div>
        </NuxtLink>

        <!-- Databases Button -->
        <NuxtLink
          to="/taxprofiling/database"
          class="p-8 bg-white rounded-lg border-2 border-emerald-200 hover:border-emerald-500 hover:shadow-lg transition-all group"
        >
          <div class="text-5xl mb-4 group-hover:scale-110 transition-transform">💾</div>
          <h2 class="text-2xl font-bold text-slate-900 mb-2">Reference Databases</h2>
          <p class="text-slate-600 mb-4">
            Explore {{ databases.length }} reference databases
          </p>
          <div class="inline-block px-4 py-2 bg-emerald-200 text-emerald-600 font-semibold rounded-md group-hover:bg-emerald-300 transition">
            Browse Databases →
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- Quick Stats -->
    <section class="py-8 px-4 md:px-8 border-t border-slate-200">
      <div class="max-w-4xl mx-auto">
        <div class="grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
          <div>
            <div class="text-3xl font-bold text-sky-600">{{ tools.length }}</div>
            <div class="text-slate-600 text-sm mt-2">Profiling Tools</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-emerald-600">{{ databases.length }}</div>
            <div class="text-slate-600 text-sm mt-2">Databases</div>
          </div>
          <div class="col-span-2 md:col-span-1">
            <div class="text-3xl font-bold text-purple-600">∞</div>
            <div class="text-slate-600 text-sm mt-2">Combinations</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer Navigation -->
    <section class="py-8 px-4 md:px-8 border-t border-slate-200">
      <div class="max-w-4xl mx-auto flex justify-center">
        <NuxtLink
          to="/"
          class="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-md transition"
        >
          ← Back to Catalog
        </NuxtLink>
      </div>
    </section>
  </div>
</template>