<script setup>

    defineProps({
        name: String,
        url: String,
        description: String,
    })

</script>


<template>
    <NuxtLink :to="url" class="p-4 bg-slate-50 hover:bg-slate-100 w-96 rounded-md cursor-pointer">
        <span class="px-4 py-1 text-md bg-sky-200 text-sky-500 rounded-sm">
            {{ name }}
        </span>
        <p class="mt-4 text-slate-800 line-clamp-3">
            {{ description }}
            <NuxtLink 
                :to="url"
                class="text-slate-900 font-semibold hover:underline"
            >
                more
            </NuxtLink> 
        </p>
    </NuxtLink>
</template>
