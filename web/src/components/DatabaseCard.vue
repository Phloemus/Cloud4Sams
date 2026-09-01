<script setup>

    defineProps({
        id: String,
        name: String,
        description: String,
        homepage: String,
        doi: String,
        latest_release: String,
        taxonomic_scope: Array,
        compatible_tools: Array,
        sample: Array | null,
        origin: Array | null,
    })

</script>
<template>
    <div class="flex justify-between items-start">
        <div>
            <h1 class="mb-1 text-2xl text-slate-900 font-bold">{{ name }}</h1>
            <div class="mt-4 flex gap-2">
                <span class="px-4 py-1 bg-emerald-200 text-emerald-600 hover:underline rounded-sm">Database</span>
                <span v-if="latest_release" class="px-4 py-1 bg-sky-200 text-sky-500 hover:underline rounded-sm">v{{ latest_release }}</span>
            </div>
        </div>
        <NuxtLink 
            class="px-4 py-1 bg-sky-200 text-sky-500 hover:underline rounded-sm"
            v-if="homepage"
            :to="homepage"
        >
            {{ name }}
        </NuxtLink>
    </div>
    <div>
        <p class="my-8 text-lg text-slate-700 line-clamp-6">{{ description }}</p>
    </div>
    <div v-if="sample || origin" class="my-6 flex gap-4 flex-wrap">
        <div v-if="sample" class="flex items-center gap-2">
            <span class="text-lg">🧫</span>
            <div>
                <span class="text-xs text-slate-600">Sample</span>
                <p v-for="s in sample" :key="s.label" class="text-sm font-semibold text-slate-900">{{ s.label }}</p>
            </div>
        </div>
        <div v-if="origin" class="flex items-center gap-2">
            <span class="text-lg">🌍</span>
            <div>
                <span class="text-xs text-slate-600">Origin</span>
                <p v-for="o in origin" :key="o.label" class="text-sm font-semibold text-slate-900">{{ o.label }}</p>
            </div>
        </div>
    </div>
    <div v-if="taxonomic_scope && taxonomic_scope.length > 0" class="my-6">
        <h3 class="text-md text-slate-800 font-semibold mb-3">Taxonomic Scope</h3>
        <div class="flex gap-2 flex-wrap">
            <span 
                v-for="scope in taxonomic_scope"
                class="px-3 py-1 bg-purple-200 text-purple-600 text-sm rounded-sm"
            >
                {{ scope.label }}
            </span>
        </div>
    </div>
    <div v-if="compatible_tools && compatible_tools.length > 0" class="my-6">
        <h3 class="text-md text-slate-800 font-semibold mb-3">Compatible Tools ({{ compatible_tools.length }})</h3>
        <div class="flex gap-2 flex-wrap">
            <NuxtLink 
                v-for="tool in compatible_tools"
                :to="`/taxprofiling/tool/${tool['@id']}`"
                class="px-3 py-1 bg-teal-200 text-teal-600 text-sm rounded-sm hover:underline hover:cursor-pointer"
            >
                {{ tool['@id'] }}
            </NuxtLink>
        </div>
    </div>
</template>
