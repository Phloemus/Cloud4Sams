<script setup>

    defineProps({
        id: String,
        name: String,
        description: String,
        link: String,
        repo: String,
        doi: String,
        documentation: String,
        type: String,
        latest_release: String,
        curated_release: String,
        citations_count: Number,
        strain_level: Boolean,
        functional_profiling: Boolean,
        supports_long_reads: Boolean,
        supports_short_reads: Boolean,
        uses_databases: Array,
    })

</script>
<template>
  <div class="w-full">
    <h2 class="text-xl text-slate-900 font-bold">More Information</h2>
    <ul class="space-y-2 my-4">
      <li><NuxtLink :to="repo" v-if="repo" target="_blank" class="text-black-600 hover:underline">GitHub Repository</NuxtLink></li>
      <li><NuxtLink :to="doi" v-if="doi" target="_blank" class="text-black-600 hover:underline">Publication</NuxtLink></li>
      <li><NuxtLink :to="documentation" v-if="documentation" target="_blank" class="text-black-600 hover:underline">Documentation</NuxtLink></li>
      <li><NuxtLink :to="`https://bio.tools/${id}`" v-if="id" target="_blank" class="text-black-600 hover:underline">bio.tools</NuxtLink></li>
      <li> <NuxtLink :to="download" v-if="download" target="_blank" class="text-black-600 hover:underline">download</NuxtLink>
      </li>
    </ul>
  </div>
</template>