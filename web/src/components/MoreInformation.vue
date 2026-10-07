<script setup>

    defineProps({
        id: String,
        name: String,
        biotools_id: String,
        homepage: String,
        repository: String,
        publication: String,
    })

</script>
<template>
  <div class="w-full">
    <h2 class="text-xl text-slate-900 font-bold">More Information</h2>
    <ul class="space-y-2 my-4">
      <li><NuxtLink :to="repository" v-if="repository" target="_blank" class="text-black-600 hover:underline">GitHub Repository</NuxtLink></li>
      <li><NuxtLink :to="publication" v-if="publication" target="_blank" class="text-black-600 hover:underline">Publication</NuxtLink></li>
      <li><NuxtLink :to="homepage" v-if="homepage" target="_blank" class="text-black-600 hover:underline">Homepage</NuxtLink></li>
      <li><NuxtLink :to="`https://bio.tools/${biotools_id}`" v-if="biotools_id" target="_blank" class="text-black-600 hover:underline">bio.tools</NuxtLink></li>
      <li> <NuxtLink :to="download" v-if="download" target="_blank" class="text-black-600 hover:underline">download</NuxtLink>
      </li>
    </ul>
  </div>
</template>