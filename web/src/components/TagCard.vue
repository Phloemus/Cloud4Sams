<script setup>

    defineProps({
        name: String,
    })



</script>


<template>
    <div class="p-4 bg-slate-50 hover:bg-slate-100 w-96 rounded-md cursor-pointer">
        <span class="px-4 py-1 text-md bg-sky-200 text-sky-500 rounded-sm">
            {{ shortName }}: {{ name }}
        </span>
        <p class="mt-4 text-slate-800">
            {{ description }}
            <NuxtLink 
                :to="link"
                class="text-slate-900 font-semibold hover:underline"
            >
                more
            </NuxtLink> 
        </p>
    </div>
</template>
