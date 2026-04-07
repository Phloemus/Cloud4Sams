<script setup>

    import datasets from "../static/datasets.json"
    import biotools from "../static/biotools.json"
    import exampleTools from "../static/example-tools.json"
    import biosphereTools from "../static/biosphere-tools.json"

    const filteredDatasetList = datasets.data.items.filter(
        item => item.description && item.description.trim() !== "" && item.global_id && item.global_id.trim() !== ""
    )

    const filteredToolList = biotools.flat().filter(
        item => item.name && item.description.trim() !== ""
    )

    const filteredExampleToolList = exampleTools.flat().filter(
        item => item.name && item.description.trim() !== ""
    )

    /* Not working, getting the right values by fetching the list of appliances beforehand
    const response = await fetch(
        "https://cc-ifb-corecloud-vm002.in2p3.fr/api/appliances", 
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            mode: "no-cors"
        }
    ).then(response => {
        return response.json()
    }).then((data) => {
        biosphereTools.value = data
    }).catch(err => console.error("Error while fetching data from biosphere: ", err))
    */

</script>

<template>
    <div>
        <section class="mb-16">
            <h2 class="my-6 font-semibold text-slate-900 text-xl">Example tools</h2>
            <div class="grid grid-cols-3 gap-4">
                <div
                    v-for="(tool, index) in exampleTools"
                    class="p-4 relative bg-slate-100 rounded-md border-2 border-slate-100"
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
        </section>
    </div>
    <div>
        <section class="mb-16">
            <h2 class="my-6 font-semibold text-slate-900 text-xl">Biosphere tools</h2>
            <div class="grid grid-cols-3 gap-4">
                <div
                    v-for="(biosphereTool, toolName, index) in biosphereTools.appliances"
                    class="p-4 relative bg-slate-100 rounded-md border-2 border-slate-100"
                >
                    <h3 class="font-semibold text-md text-slate-800 truncate">{{ toolName }}</h3>
                    <div class="mt-3 flex gap-2">
                        <div class="px-2 py-1 bg-sky-200 text-sky-500 text-sm rounded-sm">Tool</div>
                        <div class="px-2 py-1 bg-sky-200 text-sky-500 text-sm rounded-sm">{{ biosphereTool.metadata.category }}</div>
                    </div>
                    <div class="mt-2 flex gap-2 flex flex-wrap overflow-x-hidden">
                        <NuxtLink
                            class="px-2 py-1 bg-purple-200 text-purple-500 text-sm rounded-sm hover:underline hover:cursor-pointer"
                            v-for="topic in biosphereTool.metadata.topics"
                            :to="topic.url"
                        >
                            {{ topic }}
                        </NuxtLink>
                    </div>
                    <div class="mt-2 flex gap-2 flex flex-wrap overflow-x-hidden">
                        <NuxtLink
                            class="px-2 py-1 bg-gray-200 text-gray-500 text-sm rounded-sm hover:underline hover:cursor-pointer"
                            v-for="tool in biosphereTool.metadata.tools"
                            :to="tool.url"
                        >
                            {{ tool.name }}
                        </NuxtLink>
                    </div>
                    <p class="mt-6 mb-16 text-slate-600 text-md line-clamp-4">
                        {{ biosphereTool.description }}
                    </p>
                    <div class="absolute bottom-4 flex gap-2">
                        <NuxtLink
                            :to="`/biospheretool/${index + 1}`"
                            class="px-4 py-2 bg-white hover:bg-slate-50 text-slate-900 text-sm border-2 border-slate-900 rounded-md"
                        >
                            More info
                        </NuxtLink>
                        <button class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm rounded-md">Use this tool</button>
                    </div>
                </div>
            </div>
        </section>
    </div>
    <div>
        <section>
            <h2 class="my-6 font-semibold text-slate-900 text-xl">Analysis tools</h2>
            <div class="grid grid-cols-3 gap-4">
                <NuxtLink
                    :to="`/tool/${index + 1}`"
                    v-for="(tool, index) in filteredToolList"
                    class="p-4 relative bg-slate-100 rounded-md border-2 border-slate-100 hover:border-sky-500 hover:cursor-pointer"
                >
                    <h3 class="font-semibold text-md text-slate-800 truncate">{{ tool.name }}</h3>
                    <div class="mt-2 flex gap-2">
                        <div class="px-2 py-1 bg-sky-200 text-sky-500 text-sm rounded-sm">Tool</div>
                    </div>
                    <p class="mt-6 mb-16 text-slate-600 text-md line-clamp-4">
                        {{ tool.description }}
                    </p>
                    <div class="absolute bottom-4 flex gap-2">
                        <button class="px-4 py-2 bg-white hover:bg-slate-50 text-slate-900 text-sm border-2 border-slate-900 rounded-md">More info</button>
                        <button class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm rounded-md">Use the data</button>
                    </div>
                </NuxtLink>

            </div>
        </section>
        <section class="mt-16">
            <h2 class="my-6 font-semibold text-slate-900 text-xl">Available metagenomics data</h2>
            <div class="grid grid-cols-3 gap-4">
                <NuxtLink
                    :to="`/dataset/${index + 1}`"
                    v-for="(dataset, index) in filteredDatasetList"
                    class="p-4 relative bg-slate-100 rounded-md border-2 border-slate-100 hover:border-sky-500 hover:cursor-pointer"
                >
                    <h3 class="font-semibold text-md text-slate-800 truncate">{{ dataset.name }}</h3>
                    <div class="mt-2 flex gap-2">
                        <div class="px-2 py-1 bg-sky-200 text-sky-500 text-sm rounded-sm">Dataset</div>
                        <NuxtLink 
                            :to="dataset.url"
                            v-if="dataset.global_id"
                            class="px-2 py-1 bg-purple-200 text-purple-500 text-sm hover:underline rounded-sm"
                        >
                            {{ dataset.global_id }}
                        </NuxtLink>
                    </div>
                    <p class="mt-6 mb-16 text-slate-600 text-md line-clamp-4">
                        {{ dataset.description }}
                    </p>
                    <div class="absolute bottom-4 flex gap-2">
                        <button class="px-4 py-2 bg-white hover:bg-slate-50 text-slate-900 text-sm border-2 border-slate-900 rounded-md">More info</button>
                        <button class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm rounded-md">Use the data</button>
                    </div>
                </NuxtLink>
            </div>
        </section>
    </div>
</template>
