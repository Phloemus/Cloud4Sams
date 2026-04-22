<script setup>
    import { useRoute } from 'vue-router'

    import exampleTools from "../../static/example-tools.json"

    definePageMeta({
        layout: 'example-tool'
    })

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
    <div class="mt-16">
        <h2 class="text-xl text-slate-900 font-bold">Relevant data for {{ exampleTool.name }}</h2>
        <div class="my-6 flex gap-4">
            <div
                v-for="dataset in exampleTool.datasets"
                :to="dataset.url" 
                class="p-4 relative bg-slate-50 rounded-md border-2 border-slate-100"
            >
                <div class="flex justify-between">
                    <h3 class="font-semibold text-md text-slate-800 truncate">{{ dataset.name }}</h3>
                    <div class="px-2 py-1 bg-green-200 text-green-500 text-sm rounded-sm">Public</div>
                </div>
                <div class="mt-3 flex gap-2">
                    <div class="px-2 py-1 bg-sky-200 text-sky-500 text-sm rounded-sm">Dataset</div>
                    <div>
                        <NuxtLink
                            class="px-2 py-1 bg-purple-200 text-purple-500 text-sm rounded-sm hover:underline hover:cursor-pointer"
                            v-for="topic in dataset.topics"
                            :to="topic.url"
                        >
                            {{ topic.name }}
                        </NuxtLink>
                    </div>
                </div>
                <p class="mt-6 mb-16 text-slate-600 text-md line-clamp-4">
                    {{ dataset.description }}
                </p>
                <div class="absolute bottom-4 flex gap-2">
                    <NuxtLink
                        :to="dataset.url"
                        class="px-4 py-2 bg-white hover:bg-slate-50 text-slate-900 text-sm border-2 border-slate-900 rounded-md"
                    >
                         More info
                    </NuxtLink>
                    <button class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm rounded-md">Use this dataset</button>
                </div>
            </div>
        </div>
    </div>
    <div class="mt-10">
        <h2 class="text-xl text-slate-900 font-bold">Relevant data for {{ exampleTool.name }}</h2>
        <div class="mt-6 grid grid-cols-3 gap-4">
            <div
                v-for="(tool, index) in exampleTools"
                class="p-4 relative bg-slate-50 rounded-md border-2 border-slate-100"
            >
                <h3 class="font-semibold text-md text-slate-800 truncate">{{ tool.name }}</h3>
                <div class="mt-3 flex gap-2">
                    <div class="px-2 py-1 bg-sky-200 text-sky-500 text-sm rounded-sm">Tool</div>
                </div>
                <div class="mt-2 flex gap-2">
                    <NuxtLink
                        class="px-2 py-1 bg-purple-200 text-purple-500 text-sm rounded-sm hover:underline hover:cursor-pointer"
                        v-for="topic in tool.topics"
                        :to="topic.url"
                    >
                        {{ topic.name }}
                    </NuxtLink>
                </div>
                <div class="mt-2 flex gap-2 flex flex-wrap overflow-x-hidden">
                    <NuxtLink
                        class="px-2 py-1 bg-gray-200 text-gray-500 text-sm rounded-sm hover:underline hover:cursor-pointer"
                        v-for="tool in tool.tools"
                        :to="tool.url"
                    >
                        {{ tool.name }}
                    </NuxtLink>
                </div>
                <p class="mt-6 mb-16 text-slate-600 text-md line-clamp-4">
                    {{ tool.description }}
                </p>
                <div class="absolute bottom-4 flex gap-2">
                    <NuxtLink
                        :to="`/example-tool/${index + 1}`"
                        class="px-4 py-2 bg-white hover:bg-slate-50 text-slate-900 text-sm border-2 border-slate-900 rounded-md"
                    >
                        More info
                    </NuxtLink>
                    <button class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm rounded-md">Use this tool</button>
                </div>
            </div>
        </div>
    </div>
</template>

