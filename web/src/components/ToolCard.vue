<script setup>

    defineProps({
        id: String,
        name: String,
        description: String,
        link: String,
        repo: String,
        publication: String,
        documentation: String,
        biotools_id: String,
        type: String,
        latest_release: String,
        curated_release: String,
        citations_count: Number,
        strain_level: Boolean,
        functional_profiling: Boolean,
        supports_long_reads: Boolean,
        supports_short_reads: Boolean,
        uses_databases: Array,
    })

</script>
<template>
    <div class="flex justify-between items-start">
        <div>
            <h1 class="mb-1 text-2xl text-slate-900 font-bold">{{ name }}</h1>
<!--             <div class="flex gap-2">
                <span 
                    class="text-md text-slate-600"
                    v-for="author in tool.authors"
                >
                    {{ author }}
                </span>
            </div> -->
            <div class="mt-4 flex gap-2">
                <span class="px-4 py-1 bg-sky-200 text-sky-500 hover:underline rounded-sm">{{ type }}</span>
            </div>
        </div>
        <NuxtLink 
            class="px-4 py-1 bg-sky-200 text-sky-500 hover:underline rounded-sm"
            v-if="repo"
            :to="repo"
        >
            "Github"
        </NuxtLink>
        <NuxtLink 
            class="px-4 py-1 bg-sky-200 text-sky-500 hover:underline rounded-sm"
            v-if="id"
            :to="`https://bio.tools/${id}`"
        >
            "Bio.tools"
        </NuxtLink>
    </div>
    <div>
        <p class="my-8 text-lg text-slate-700 line-clamp-6">{{ description }}</p>
    </div>
<!--     <div class="my-10">
        <h2 class="text-xl text-slate-900 font-bold">Ontology annotations</h2>
        <div class="my-6 flex gap-4">
            <TagCard
                v-for="keyword in tool.keywords"
                :name="keyword"
            />
        </div>
    </div> -->
</template>

