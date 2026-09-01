```vue
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

    sample: {
        type: [Object, Array],
        default: null,
    },

    origin: {
        type: [Object, Array],
        default: null,
    },
})
</script>

<template>
    <div class="flex justify-between items-start">
        <div>
            <h1 class="mb-1 text-2xl text-slate-900 font-bold">
                {{ name }}
            </h1>

            <div class="mt-4 flex gap-2">
                <span
                    class="px-4 py-1 bg-emerald-200 text-emerald-600 rounded-sm"
                >
                    Database
                </span>

                <span
                    v-if="latest_release"
                    class="px-4 py-1 bg-sky-200 text-sky-500 rounded-sm"
                >
                    v{{ latest_release }}
                </span>
            </div>
        </div>

        <a
            v-if="homepage"
            :href="homepage"
            target="_blank"
            rel="noopener noreferrer"
            class="px-4 py-1 bg-sky-200 text-sky-500 hover:underline rounded-sm"
        >
            {{ name }}
        </a>
    </div>

    <!-- Description -->
    <div v-if="description">
        <p class="my-8 text-lg text-slate-700 line-clamp-6">
            {{ description }}
        </p>
    </div>

    <!-- Sample / Origin -->
    <div
        v-if="sample || origin"
        class="my-6 flex gap-8 flex-wrap"
    >
        <!-- Sample -->
        <div
            v-if="sample"
            class="flex items-start gap-2"
        >
            <span class="text-lg">🧫</span>

            <div>
                <span class="text-xs text-slate-600">
                    Sample
                </span>

                <!-- Si sample est un objet -->
                <p
                    v-if="!Array.isArray(sample)"
                    class="text-sm font-semibold text-slate-900"
                >
                    {{ sample.label }}
                </p>

                <!-- Si sample est une liste -->
                <template v-else>
                    <p
                        v-for="s in sample"
                        :key="s['@id'] || s.label"
                        class="text-sm font-semibold text-slate-900"
                    >
                        {{ s.label }}
                    </p>
                </template>
            </div>
        </div>

        <!-- Origin -->
        <div
            v-if="origin"
            class="flex items-start gap-2"
        >
            <span class="text-lg">🌍</span>

            <div>
                <span class="text-xs text-slate-600">
                    Origin
                </span>

                <!-- Si origin est un objet -->
                <p
                    v-if="!Array.isArray(origin)"
                    class="text-sm font-semibold text-slate-900"
                >
                    {{ origin.label }}
                </p>

                <!-- Si origin est une liste -->
                <template v-else>
                    <p
                        v-for="o in origin"
                        :key="o['@id'] || o.label"
                        class="text-sm font-semibold text-slate-900"
                    >
                        {{ o.label }}
                    </p>
                </template>
            </div>
        </div>
    </div>

    <!-- Taxonomic Scope -->
    <div
        v-if="taxonomic_scope && taxonomic_scope.length > 0"
        class="my-6"
    >
        <h3 class="text-md text-slate-800 font-semibold mb-3">
            Taxonomic Scope
        </h3>

        <div class="flex gap-2 flex-wrap">
            <span
                v-for="scope in taxonomic_scope"
                :key="scope['@id'] || scope.label"
                class="px-3 py-1 bg-purple-200 text-purple-600 text-sm rounded-sm"
            >
                {{ scope.label }}
            </span>
        </div>
    </div>

    <!-- Compatible Tools -->
    <div
        v-if="compatible_tools && compatible_tools.length > 0"
        class="my-6"
    >
        <h3 class="text-md text-slate-800 font-semibold mb-3">
            Compatible Tools ({{ compatible_tools.length }})
        </h3>

        <div class="flex gap-2 flex-wrap">
            <NuxtLink
                v-for="tool in compatible_tools"
                :key="tool['@id']"
                :to="`/taxprofiling/tool/${tool['@id']}`"
                class="px-3 py-1 bg-teal-200 text-teal-600 text-sm rounded-sm hover:underline hover:cursor-pointer"
            >
                {{ tool.name || tool['@id'] }}
            </NuxtLink>
        </div>
    </div>

    <!-- DOI -->
    <div v-if="doi" class="my-6">
        <a
            :href="doi"
            target="_blank"
            rel="noopener noreferrer"
            class="text-sky-600 hover:underline"
        >
            Publication / DOI
        </a>
    </div>
</template>
```