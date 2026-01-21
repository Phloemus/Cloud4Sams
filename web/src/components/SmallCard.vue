<script setup>

    defineProps({
        title: String,
        description: String,
        link: String
    })

</script>


<template>
    <div class="my-3 p-2 w-full bg-slate-50 rounded-md hover:bg-slate-100 hover:cursor-pointer">
        <NuxtLink 
            :to="link"
        >
            <h4 class="text-slate-800 text-md">
                <span class="font-medium text-slate-900">{{ title }}</span> 
                {{ description }}
            </h4>
        </NuxtLink>
    </div>
</template>
