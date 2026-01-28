<script setup>
    import { ref } from 'vue'
    import { useRoute } from 'vue-router'

    import ActionButton from "../../components/ActionButton.vue"

    import datasets from "../../static/datasets.json"

    const filteredDatasetList = datasets.data.items.filter(
        item => item.description && item.description.trim() !== "" && item.global_id && item.global_id.trim() !== ""
    )
    console.log(filteredDatasetList)

    const route = useRoute()
    const datasetId = route.params.id - 1
    const dataset = filteredDatasetList[datasetId]

</script>

<template>
    <div class="flex justify-between items-start">
        <div>
            <h1 class="mb-1 text-2xl text-slate-900 font-bold">{{ dataset.name }}</h1>
            <div class="flex gap-2">
                <span 
                    class="text-md text-slate-600"
                    v-for="author in dataset.authors"
                >
                    {{ author }}
                </span>
            </div>
            <div class="mt-4 flex gap-2">
                <span class="px-4 py-1 bg-teal-200 text-teal-500 hover:underline rounded-sm">public</span>
                <span class="px-4 py-1 bg-sky-200 text-sky-500 hover:underline rounded-sm">{{ dataset.type }}</span>
            </div>
        </div>
        <NuxtLink 
            class="px-4 py-1 bg-sky-200 text-sky-500 hover:underline rounded-sm"
            v-if="dataset.global_id" 
            :to="dataset.url"
        >
            {{ dataset.global_id }}
        </NuxtLink>
    </div>
    <div>
        <p class="my-8 text-lg text-slate-700 line-clamp-6">{{ dataset.description }}</p>
    </div>
    <div class="my-10">
        <h2 class="text-xl text-slate-900 font-bold">Ontology annotations</h2>
        <div class="my-6 flex gap-4">
            <TagCard
                v-for="keyword in dataset.keywords"
                :name="keyword"
            />
        </div>
    </div>
    <div class="mt-8 flex gap-6">
        <div>
            <h2 class="text-xl text-slate-900 font-bold">Datasource</h2>
            <div class="my-4">
                <div class="p-6 bg-slate-50 hover:bg-slate-100 rounded-md cursor-pointer">
                    <h3 class="text-slate-900 text-lg font-semibold">Research data gouv</h3>
                    <p class="my-4 text-slate-800">
                        <b>Research data gouv</b> is a national platform that list publicly accessible datasets used in research. It's possible to reuse this data 
                        for reseach purposes. 
                    </p>
                    <NuxtLink to="https://entrepot.recherche.data.gouv.fr/" class="text-sky-500 font-semibold hover:underline">https://entrepot.recherche.data.gouv.fr/</NuxtLink>
                </div>
            </div>
        </div>
        <div class="w-3/5">
            <h2 class="text-xl text-slate-900 font-bold">Use the dataset</h2>
            <div class="my-4 p-4 border-2 border-slate-100 rounded-md cursor-pointer">
                <span class="px-4 py-1 bg-teal-200 text-teal-500 hover:underline rounded-sm">public</span>
                <p class="my-4 text-slate-800">
                    The data of this project can be analysed using a tool in the biosphere.
                </p>
                <div class="flex justify-end">
                    <ActionButton
                        content="Choose a tool"
                        @click=""
                    >
                    </ActionButton>
                </div>
            </div>
        </div>
    </div>
    <div v-if="isQueryPerformed" class="my-6">
        <div class="flex justify-between items-center">
            <h2 class="text-xl text-slate-900 font-bold">Query result</h2>
        </div>
        <Table :data="queryResponse"/>
    </div>
</template>
