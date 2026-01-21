<script setup>
    import { ref } from 'vue'
    import { useRoute } from 'vue-router'

    import ActionButton from "../../components/ActionButton.vue"

    import datasets from "../../static/datasets.json"

    const route = useRoute()
    const datasetId = route.params.id
    const dataset = datasets.data.items[datasetId]

</script>

<template>
    <div class="flex justify-between items-start">
        <div>
            <h1 class="mb-1 text-2xl text-slate-900 font-bold">{{ dataset.name }}</h1>
            <span class="text-md text-slate-600">{{ dataset.type }}</span>
        </div>
        <div class="px-4 py-1 bg-sky-200 text-sky-500 rounded-sm">
            <NuxtLink :to="dataset.url">{{ dataset.url }}</NuxtLink>
        </div>
    </div>
    <div>
        <p class="my-6 text-lg text-slate-700">{{ dataset.description }}</p>
    </div>
    <div class="my-10">
        <h2 class="text-xl text-slate-900 font-bold">Ontologies involved</h2>
        <div class="my-6 flex gap-4">
            <OntologyCard 
                v-for="(ontology, index) in ontologies"
                :name="ontology.name"
                :shortName="ontology.shortName"
                :type="ontology.type"
                :description="ontology.description"
                :link="ontology.bioportalUrl"
            />
        </div>
    </div>
    <div class="mt-8 flex gap-6">
        <div class="w-3/5">
            <h2 class="text-xl text-slate-900 font-bold">Query</h2>
            <div class="my-4 w-full bg-slate-800 rounded-md">
                <div class="py-2 px-4 flex items-center justify-between border-b border-slate-700">
                    <span class="text-white">sparql</span>
                    <div class="flex items-center gap-2">
                        <div class="h-4 w-4 rounded-full bg-slate-700"></div>
                        <div class="h-4 w-4 rounded-full bg-slate-700"></div>
                        <div class="h-4 w-4 rounded-full bg-slate-700"></div>
                    </div>
                </div>
                <div class="p-4 w-full bg-slate-800 rounded-b-md">
                    <code>
                        <div v-html="queryHtml"></div>
                    </code>
                </div>
            </div>
        </div>
        <div>
            <h2 class="text-xl text-slate-900 font-bold">Datasources</h2>
            <div class="my-4">
                <div class="p-6 bg-slate-50 hover:bg-slate-100 rounded-md cursor-pointer">
                    <h3 class="text-slate-900 text-lg font-semibold">ABRomics database</h3>
                    <p class="my-4 text-slate-800">
                        <b>ABRomics</b> is a national platform designed to monitor the spread of antibiotic resistance genes in <b>human</b>, <b>animal</b> and <b>environmental</b>
                        reservoirs. 
                    </p>
                    <NuxtLink to="https://analysis.abromics.fr/" class="text-sky-500 font-semibold hover:underline">https://analysis.abromics.fr/</NuxtLink>
                </div>
            </div>
        </div>
    </div>
    <div class="w-full">
        <ActionButton
            content="Execute query"
            @click="fetchQueryResult(1)"
        >
        </ActionButton>
    </div>
    <div v-if="isQueryError" class="mt-6 py-2 px-4 bg-red-200 text-red-500 rounded-md">
        Error: {{ queryError }}
    </div>
    <div v-if="isQueryPerformed" class="my-6">
        <div class="flex justify-between items-center">
            <h2 class="text-xl text-slate-900 font-bold">Query result</h2>
        </div>
        <Table :data="queryResponse"/>
    </div>
</template>
