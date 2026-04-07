<script setup>
    import { useRoute } from 'vue-router'

    import exampleTools from "../../static/example-tools.json"

    //! Here
    const filteredExampleTools = exampleTools.flat().filter(
        item => item.name && item.description.trim() !== ""
    )

    const route = useRoute()
    const toolId = route.params.id - 1
    const exampleTool = filteredExampleTools[toolId]

</script>

<template>
    <div class="flex justify-between items-start">
        <div>
            <h1 class="mb-1 text-2xl text-slate-900 font-bold">{{ exampleTool.name }}</h1>
            <div class="flex gap-2">
                <span 
                    class="text-md text-slate-600"
                    v-for="author in exampleTool.developpers"
                >
                Developped by <NuxtLink :to="`mailto:${author.email}`" class="italic hover:underline hover:cursor-pointer">{{ author.name }}</NuxtLink><NuxtLink class="italic hover:underline hover:cursor-pointer" v-for="affiliation in author.affiliations" :to="affiliation.url">, {{ affiliation.name }}</NuxtLink>
                </span>
            </div>
            <div class="mt-4 flex gap-2">
                <span class="px-4 py-1 bg-sky-200 text-sky-500 hover:underline rounded-sm">tool</span>
            </div>
            <div class="my-2 flex gap-2">
                <NuxtLink v-for="topic in exampleTool.topics" :to="topic.url" class="px-4 py-1 bg-purple-200 text-purple-500 hover:underline rounded-sm">{{ topic.name }}</NuxtLink>
            </div>
            <div class="my-2 flex gap-2">
                <NuxtLink v-for="tool in exampleTool.tools" :to="tool.url" class="px-4 py-1 bg-gray-200 text-gray-500 hover:underline rounded-sm">{{ tool.name }}</NuxtLink>
            </div>
        </div>
    </div>
    <div>
        <p class="my-4 text-lg text-slate-700 line-clamp-6">{{ exampleTool.description }}</p>
    </div>
    <div class="my-10">
        <h2 class="text-xl text-slate-900 font-bold">Other tools bundled with {{ exampleTool.name }}</h2>
        <div class="my-6 flex gap-4">
            <TagCard
                v-for="tool in exampleTool.tools"
                :name="tool.name"
                :url="tool.url"
                :description="tool.description"
            />
        </div>
    </div>
    <div>
        <h2 class="text-xl text-slate-900 font-bold">Relevant data for {{ exampleTool.name }}</h2>

    </div>
</template>

