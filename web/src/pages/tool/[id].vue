<script setup>
    import { useRoute } from 'vue-router'

    import biotools from "../../static/biotools.json"

    definePageMeta({
        layout: 'example-tool'
    })

    const route = useRoute()
    const biotoolsId = String(route.params.id ?? '').toLowerCase()
    const tool = biotools.flat().find(
        item => item.biotoolsID?.toLowerCase() === biotoolsId
    )

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