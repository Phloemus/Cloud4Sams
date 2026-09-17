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

            <div class="mt-4 flex gap-2">
                <span class="px-4 py-1 bg-sky-200 text-sky-500 hover:underline rounded-sm">
                    {{ type }}
                </span>
            </div>
        </div>

        <div class="flex gap-3">
            <NuxtLink 
                class="px-4 py-1 bg-purple-200 text-purple-500 hover:underline rounded-sm"
                v-if="repo"
                :to="repo"
            >
                Github
            </NuxtLink>

            <NuxtLink 
                class="px-4 py-1 bg-purple-200 text-purple-500 hover:underline rounded-sm"
                v-if="id"
                :to="`https://bio.tools/${id}`"
            >
                bio.tools
            </NuxtLink>
            <Nuxtlink
                class="px-4 py-1 bg-purple-200 text-purple-500 hover:underline rounded-sm"
                v-if="publication"
                :to="publication"
            >
                Publication
            </Nuxtlink>
        </div>
    </div>

    <div>
        <p class="my-8 text-lg text-slate-700 line-clamp-6">
            {{ description }}
        </p>
    </div>
</template>

