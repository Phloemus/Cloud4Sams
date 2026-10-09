<script setup>

    defineProps({
        name: String,
        biotools_id: String,
        homepage: String,
        publication: String,
        description: String,
    })

</script>
<template>
  <div class="w-full">
    <h2 class="text-xl text-slate-900 font-bold">More Information</h2>
    <ul class="space-y-2 my-4">
      <li><NuxtLink :to="publication" v-if="publication" target="_blank" class="text-black-600 hover:underline">Publication</NuxtLink></li>
      <li><NuxtLink :to="homepage" v-if="homepage" target="_blank" class="text-black-600 hover:underline">Homepage</NuxtLink></li>
      <li><NuxtLink :to="`https://bio.tools/${biotools_id}`" v-if="biotools_id" target="_blank" class="text-black-600 hover:underline">bio.tools</NuxtLink></li>
    </ul>
  </div>
</template>