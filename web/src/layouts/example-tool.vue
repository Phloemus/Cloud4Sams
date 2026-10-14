<script setup lang="ts">
    import { computed } from 'vue'
    import {
        getCatalogToolById,
        getTaxProfilingCatalog,
        getTaxProfilingDatabaseById
    } from '~/composables/buildCatalog'
    import Sidebar from "../components/Sidebar.vue"
    import Navbar from "../components/Navbar.vue"
    import ToolStats from "../components/ToolStats.vue"
    import QuickToolLaunch from "../components/QuickToolLaunch.vue"
    import MoreInformation from "../components/MoreInformation.vue"
    import { useRoute } from 'vue-router'
    
    const route = useRoute()

    const catalog = getTaxProfilingCatalog()
    const tool = computed(() =>
        getCatalogToolById(catalog, String(route.params.id ?? ''))
    )
    const database = computed(() =>
        getTaxProfilingDatabaseById(catalog, String(route.params.id ?? ''))
    )
    const databaseHomepage = computed(() =>
        typeof database.value?.homepage === 'string' ? database.value.homepage : null
    )
    const publicationUrl = computed(() => {
        const toolDoi = tool.value?.publication.doi
        if (toolDoi) return `https://doi.org/${toolDoi}`

        const databaseDoi = database.value?.doi
        if (typeof databaseDoi !== 'string' || !databaseDoi.trim()) return ''

        return /^https?:\/\//i.test(databaseDoi)
            ? databaseDoi
            : `https://doi.org/${databaseDoi}`
    })

    // Loading is immediate since data is cached
    const loading = ref(false)

</script>


<template>
    <div class="w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
    <div class="w-full bg-slate-50 flex">
        <Sidebar class="hidden" />
        <div class="w-full">
            <Navbar />
            <div class="relative w-full h-screen">
                <div class="mx-auto flex w-full max-w-screen-2xl gap-6 px-6">
                    <div class="my-10 min-w-0 max-w-screen-xl flex-1">
                        <main class="p-8 bg-white border border-slate-200 rounded-md">
                            <slot />
                        </main>
                    </div>
                    <div class="my-10 w-96 shrink-0">
                        <div class="p-8 bg-white border border-slate-200 rounded-md">
                            <ToolStats />
                        </div>
                        <div class="mt-6 p-8 bg-white border border-slate-200 rounded-md">
                            <QuickToolLaunch />
                        </div>
                        <div class="mt-6 p-8 bg-white border border-slate-200 rounded-md">
                            <MoreInformation
                                v-if="tool || database"
                                :biotools_id="tool?.biotoolsID"
                                :homepage="tool?.homepage || databaseHomepage"
                                :publication="publicationUrl"
                            />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>