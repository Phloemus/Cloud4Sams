<script setup>
    import { useTaxProfiling } from '~/composables/useTaxProfiling'
    import Sidebar from "../components/Sidebar.vue"
    import Navbar from "../components/Navbar.vue"
    import ToolStats from "../components/ToolStats.vue"
    import QuickToolLaunch from "../components/QuickToolLaunch.vue"
    import MoreInformation from "../components/MoreInformation.vue"
    import { useRoute } from 'vue-router'
    
    const route = useRoute()

    const { getToolById, getDatabasesByTool } = useTaxProfiling()

    // Get tool synchronously (data is already cached)
    const toolId = route.params.id as string

    const tool = computed(() => getToolById(toolId))

    const associatedDatabases = computed(() =>
        tool.value ? getDatabasesByTool(toolId) : []
    )

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
                <div class="mx-auto w-max flex gap-6">
                    <div class="my-10 max-w-screen-xl">
                        <main class="p-8 bg-white border border-slate-200 rounded-md">
                            <slot />
                        </main>
                    </div>
                    <div class="my-10 w-96">
                        <div class="p-8 bg-white border border-slate-200 rounded-md">
                            <ToolStats />
                        </div>
                        <div class="mt-6 p-8 bg-white border border-slate-200 rounded-md">
                            <QuickToolLaunch />
                        </div>
                        <div class="mt-6 p-8 bg-white border border-slate-200 rounded-md">
                            <h2 class="text-lg font-semibold text-slate-900 mb-4">More Information</h2>
                            <MoreInformation
                                :repo="tool.repo"
                                :doi="tool.doi"
                                :documentation="tool.documentation"
                                :id="tool['@id']"
                            />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>