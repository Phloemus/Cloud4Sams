<script setup lang="ts">
import { useTaxProfiling } from '~/composables/useTaxProfiling'
import ToolCard from '~/components/ToolCard.vue'
import ToolStats from '~/components/ToolStats.vue'
import MoreInformation from '~/components/MoreInformation.vue'

const route = useRoute()

const { getToolById, getDatabasesByTool } = useTaxProfiling()

// Get tool synchronously (data is already cached)
const toolId = route.params.id as string

const tool = computed(() => getToolById(toolId))

const associatedDatabases = computed(() =>
  tool.value ? getDatabasesByTool(toolId) : []
)

// Loading is immediate since data is cached
const loading = ref(false)
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">

    <!-- Header -->
    <section class="py-8 px-4 md:px-8 border-b border-slate-200 bg-white">
      <div class="max-w-4xl mx-auto">
        <NuxtLink
          to="/taxprofiling/tool"
          class="text-sky-600 hover:underline text-sm mb-4 inline-block"
        >
          ← Back to Tools
        </NuxtLink>
      </div>
    </section>

    <!-- Loading State -->
    <div v-if="loading" class="py-12 text-center">
      <div class="inline-block animate-spin">⏳</div>
      <p class="text-slate-600 mt-2">
        Loading tool details...
      </p>
    </div>

    <!-- Tool Not Found -->
    <div v-else-if="!tool" class="py-12 text-center">
      <p class="text-red-600 text-lg">
        Tool not found
      </p>

      <NuxtLink
        to="/taxprofiling/tool"
        class="text-sky-600 hover:underline mt-4 inline-block"
      >
        Back to Tools
      </NuxtLink>
    </div>

    <!-- Tool Details -->
    <section v-else class="py-8">
      <div class="max-w-4xl mx-auto">

        <!-- Main Info Card -->
        <div class="mb-8">
          <ToolCard
            :id="tool['@id']"
            :name="tool.name"
            :description="tool.description"
            :link="tool.repo"
            :repo="tool.repo"
            :doi="tool.doi"
            :documentation="tool.documentation"
            :type="tool.type"
            :latest_release="tool.latest_release"
            :curated_release="tool.curated_release"
            :citations_count="tool.citations_count"
            :strain_level="tool.strain_level"
            :functional_profiling="tool.functional_profiling"
            :supports_long_reads="tool.supports_longreads"
            :supports_short_reads="tool.supports_shortreads"
            :uses_databases="tool.uses_databases"
          />
        </div>

        <!-- Additional Details -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

          <!-- Features -->
          <div>
            <h2 class="text-xl font-bold text-slate-900 mb-4">
              Features
            </h2>

            <div class="space-y-3">

              <div class="flex items-center">
                <span class="w-6 h-6 mr-3">
                  {{ tool.supports_shortreads ? '✓' : '✗' }}
                </span>

                <span class="text-slate-700">
                  Short Reads
                </span>
              </div>

              <div class="flex items-center">
                <span class="w-6 h-6 mr-3">
                  {{ tool.supports_longreads ? '✓' : '✗' }}
                </span>

                <span class="text-slate-700">
                  Long Reads
                </span>
              </div>

              <div class="flex items-center">
                <span class="w-6 h-6 mr-3">
                  {{ tool.strain_level ? '✓' : '✗' }}
                </span>

                <span class="text-slate-700">
                  Strain-level Resolution
                </span>
              </div>

              <div class="flex items-center">
                <span class="w-6 h-6 mr-3">
                  {{ tool.functional_profiling ? '✓' : '✗' }}
                </span>

                <span class="text-slate-700">
                  Functional Profiling
                </span>
              </div>

            </div>
          </div>

          <!-- Metadata -->
          <div>
            <h2 class="text-xl font-bold text-slate-900 mb-4">
              Information
            </h2>

            <div class="space-y-3">

              <div v-if="tool.latest_release">
                <span class="text-slate-600 text-sm">
                  Latest Release
                </span>

                <p class="text-slate-900 font-semibold">
                  {{ tool.latest_release }}
                </p>
              </div>

              <div v-if="tool.citations_count">
                <span class="text-slate-600 text-sm">
                  Citations
                </span>

                <p class="text-slate-900 font-semibold">
                  {{ tool.citations_count }}
                </p>
              </div>

              <div v-if="tool.approach_detail">
                <span class="text-slate-600 text-sm">
                  Approach
                </span>

                <p class="text-slate-900 font-semibold">
                  {{ tool.approach_detail }}
                </p>
              </div>

              <div v-if="tool.to_update" class="mt-2">
                <span class="px-3 py-1 bg-yellow-200 text-yellow-700 text-sm rounded">
                  ⚠ Needs Update
                </span>
              </div>

            </div>
          </div>

        </div>

        <!-- External Links -->
        <div class="mb-8">

          <h2 class="text-xl font-bold text-slate-900 mb-4">
            Links
          </h2>

          <div class="flex gap-4 flex-wrap">

            <a
              v-if="tool.repo"
              :href="tool.repo"
              target="_blank"
              rel="noopener noreferrer"
              class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md transition"
            >
              🔗 Repository
            </a>

            <a
              v-if="tool.doi"
              :href="tool.doi"
              target="_blank"
              rel="noopener noreferrer"
              class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md transition"
            >
              📄 Publication
            </a>

            <a
              v-if="tool.documentation"
              :href="tool.documentation"
              target="_blank"
              rel="noopener noreferrer"
              class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md transition"
            >
              📚 Documentation
            </a>

          </div>
        </div>

        <!-- Associated Databases -->
        <div>

          <h2 class="text-xl font-bold text-slate-900 mb-4">
            Compatible Databases ({{ associatedDatabases.length }})
          </h2>

          <div
            v-if="associatedDatabases.length === 0"
            class="text-slate-600"
          >
            No databases associated with this tool.
          </div>

          <div
            v-else
            class="grid grid-cols-1 gap-4"
          >

            <NuxtLink
              v-for="database in associatedDatabases"
              :key="database['@id']"
              :to="`/taxprofiling/database/${database['@id']}`"
              class="p-4 border-2 border-emerald-100 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition"
            >

              <h3 class="font-semibold text-slate-900 mb-1">
                {{ database.name }}
              </h3>

              <p class="text-slate-600 text-sm line-clamp-2">
                {{ database.description }}
              </p>

              <div class="mt-2 flex gap-2 flex-wrap">

                <span
                  v-for="scope in database.taxonomic_scope"
                  :key="scope['@id']"
                  class="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded"
                >
                  {{ scope.label }}
                </span>

              </div>

            </NuxtLink>

          </div>

        </div>

      </div>
    </section>

  </div>
</template>