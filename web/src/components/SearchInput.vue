<script setup>

    defineProps({
        searchTerm: String,
        placeholder:String,
        results: Array,
    })

</script>


<template>
    <div>
        <input 
            class="w-full px-3 py-1 bg-slate-200 placeholder:italic placeholder:text-slate-400 border focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 focus:bg-white text-slate-800 rounded-sm"
            :value="searchTerm"
            @input="$emit('input')"
            :placeholder="placeholder"
        />
        <div
            class="px-2 bg-white absolute top-16 shadow-lg rounded-md"
            v-if="searchTerm != ''"
        >
            <div
                class="my-2 p-2 rounded-md bg-slate-50 hover:bg-slate-100 hover:cursor-pointer"
                v-for="result in results"
            >
                <div class="flex justify-between items-center">
                    <p class="mb-1 font-medium">{{ result.name }}</p>
                    <div class="py-0.5 px-2 text-sm text-sky-500 bg-sky-200 rounded-sm">
                        UBERON
                    </div>
                </div>
                <NuxtLink class="hover:underline" :to="result.ontology">
                    {{ result.ontology }}
                </NuxtLink>
            </div>
        </div>
    </div>
</template>
