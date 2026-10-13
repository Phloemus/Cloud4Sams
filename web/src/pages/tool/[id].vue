<script setup>
    import { useRoute } from 'vue-router'
    import { getTaxProfilingCatalog, getTaxProfilingToolById } from '~/composables/buildCatalog'

    import biotools from "../../static/biotools.json"

    definePageMeta({
        layout: 'example-tool'
    })

    const route = useRoute()
    const biotoolsId = String(route.params.id ?? '').toLowerCase()
    const tool = biotools.flat().find(
        item => item.biotoolsID?.toLowerCase() === biotoolsId
    )
    const catalog = getTaxProfilingCatalog()
    const taxProfilingTool = computed(() => getTaxProfilingToolById(catalog, biotoolsId))

</script>
<template>
    <div v-if="tool">
    <div class="flex justify-between items-start">
        <div>
            <h1 class="mb-1 text-2xl text-slate-900 font-bold">{{ tool.name }}</h1>
            <div class="flex gap-2">
                <span 
                    class="text-md text-slate-600"
                    v-for="author in tool.authors"
                >
                    {{ author }}
                </span>
            </div>
            <div class="mt-4 flex gap-2">
                <span class="px-4 py-1 bg-teal-200 text-teal-500 hover:underline rounded-sm">public</span>
                <span class="px-4 py-1 bg-sky-200 text-sky-500 hover:underline rounded-sm">{{ tool.type }}</span>
            </div>
        </div>
        <NuxtLink 
            class="px-4 py-1 bg-sky-200 text-sky-500 hover:underline rounded-sm"
            v-if="tool.global_id" 
            :to="tool.url"
        >
            {{ tool.global_id }}
        </NuxtLink>
    </div>
    <div>
        <p class="my-8 text-lg text-slate-700 line-clamp-6">{{ tool.description }}</p>
    </div>
    <section v-if="taxProfilingTool" class="my-10">
        <h2 class="text-xl text-slate-900 font-bold">Taxonomic profiling details</h2>

        <div class="my-6 flex gap-2 flex-wrap">
            <span v-if="taxProfilingTool.supports_shortreads" class="px-3 py-2 bg-sky-200 text-sky-600 rounded-sm text-sm">Short reads</span>
            <span v-if="taxProfilingTool.supports_longreads" class="px-3 py-2 bg-sky-200 text-sky-600 rounded-sm text-sm">Long reads</span>
            <span v-if="taxProfilingTool.strain_level" class="px-3 py-2 bg-sky-200 text-sky-600 rounded-sm text-sm">Strain-level profiling</span>
            <span v-if="taxProfilingTool.functional_profiling" class="px-3 py-2 bg-sky-200 text-sky-600 rounded-sm text-sm">Functional profiling</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-if="taxProfilingTool.approach_detail || taxProfilingTool.additional_functionality" class="p-4 bg-slate-100 rounded-md">
                <h3 class="font-semibold text-slate-800">Method and functionality</h3>
                <p v-if="taxProfilingTool.approach_detail" class="mt-2 text-slate-600">{{ taxProfilingTool.approach_detail }}</p>
                <p v-if="taxProfilingTool.additional_functionality" class="mt-2 text-slate-600">{{ taxProfilingTool.additional_functionality }}</p>
            </div>
            <div v-if="taxProfilingTool.host_reads_removal !== null || taxProfilingTool.quality_control !== null || taxProfilingTool.memory" class="p-4 bg-slate-100 rounded-md">
                <h3 class="font-semibold text-slate-800">Requirements and processing</h3>
                <p v-if="taxProfilingTool.host_reads_removal !== null" class="mt-2 text-slate-600">
                    Host-read removal: {{ typeof taxProfilingTool.host_reads_removal === 'boolean' ? (taxProfilingTool.host_reads_removal ? 'Yes' : 'No') : taxProfilingTool.host_reads_removal }}
                </p>
                <p v-if="taxProfilingTool.quality_control !== null" class="mt-2 text-slate-600">
                    Quality control: {{ typeof taxProfilingTool.quality_control === 'boolean' ? (taxProfilingTool.quality_control ? 'Yes' : 'No') : taxProfilingTool.quality_control }}
                </p>
                <p v-if="taxProfilingTool.memory" class="mt-2 text-slate-600">Memory: {{ taxProfilingTool.memory }}</p>
            </div>
            <div v-if="taxProfilingTool.curated_release || taxProfilingTool.latest_release || taxProfilingTool.citations_count !== null || taxProfilingTool.issues_count !== null || taxProfilingTool.sub_module" class="p-4 bg-slate-100 rounded-md">
                <h3 class="font-semibold text-slate-800">Curated metadata</h3>
                <p v-if="taxProfilingTool.curated_release" class="mt-2 text-slate-600">Curated release: {{ taxProfilingTool.curated_release }}</p>
                <p v-if="taxProfilingTool.latest_release" class="mt-2 text-slate-600">Latest release: {{ taxProfilingTool.latest_release }}</p>
                <p v-if="taxProfilingTool.citations_count !== null" class="mt-2 text-slate-600">Citations: {{ taxProfilingTool.citations_count }}</p>
                <p v-if="taxProfilingTool.issues_count !== null" class="mt-2 text-slate-600">Open issues: {{ taxProfilingTool.issues_count }}</p>
                <p v-if="taxProfilingTool.sub_module" class="mt-2 text-slate-600">Submodule: {{ taxProfilingTool.sub_module.name }}</p>
                <p v-if="taxProfilingTool.to_update" class="mt-2 text-amber-700">This record needs an update.</p>
            </div>
        </div>

        <div v-if="taxProfilingTool.repository || taxProfilingTool.curated_doi || taxProfilingTool.documentation" class="mt-6 flex gap-3 flex-wrap">
            <a v-if="taxProfilingTool.repository" :href="taxProfilingTool.repository" target="_blank" rel="noopener noreferrer" class="px-3 py-2 bg-slate-900 text-white rounded-md">Repository</a>
            <a v-if="taxProfilingTool.curated_doi" :href="taxProfilingTool.curated_doi" target="_blank" rel="noopener noreferrer" class="px-3 py-2 bg-slate-900 text-white rounded-md">Curated DOI</a>
            <a v-if="taxProfilingTool.documentation" :href="taxProfilingTool.documentation" target="_blank" rel="noopener noreferrer" class="px-3 py-2 bg-slate-900 text-white rounded-md">Documentation</a>
        </div>

        <div class="mt-8">
            <h3 class="text-lg text-slate-900 font-bold">Associated reference databases ({{ taxProfilingTool.uses_databases.length }})</h3>
            <p v-if="taxProfilingTool.uses_databases.length === 0" class="mt-3 text-slate-600">No associated reference database is listed.</p>
            <div v-else class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                <NuxtLink
                    v-for="database in taxProfilingTool.uses_databases"
                    :key="database['@id']"
                    :to="`/taxprofiling/databases/${encodeURIComponent(database['@id'])}`"
                    class="p-4 bg-slate-100 rounded-md border-2 border-slate-100 hover:border-sky-500"
                >
                    <span class="font-semibold text-slate-800">{{ database.name }}</span>
                    <span v-if="database.release" class="block mt-1 text-sm text-slate-600">Release: {{ Array.isArray(database.release) ? database.release.join(', ') : database.release }}</span>
                </NuxtLink>
            </div>
        </div>
    </section>
    <div class="my-10">
        <h2 class="text-xl text-slate-900 font-bold">Ontology annotations</h2>
        <div class="my-6 flex gap-4">
            <TagCard
                v-for="keyword in tool.keywords"
                :name="keyword"
            />
        </div>
    </div>
    </div>
    <p v-else class="text-slate-600">Tool not found.</p>
</template>