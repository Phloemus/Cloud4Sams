<!-- <template>
  <div class="w-full text-center">

    <div class="block text-3xl font-bold text-slate-900">
      Tools
    </div>

    <div class="block mt-4 text-lg text-slate-600">
      This page is not available yet.
    </div>

    <div class="block mt-6">
      <span class="inline-block px-4 py-2 bg-slate-100 border border-slate-200 rounded-md text-slate-600">
        Coming soon
      </span>
    </div>

  </div>
</template> -->
<script setup>

    import datasets from "../static/datasets.json"
    import biotools from "../static/biotools.json"
    import exampleTools from "../static/metagenomics_appliances.json"
    import biosphereTools from "../static/biosphere-tools.json"

    const filteredToolList = biotools.flat().filter(
        item => item.biotoolsID && item.name && item.description.trim() !== ""
    )



</script>

<template>
    <div>
        <section>
            <h2 class="my-6 font-semibold text-slate-900 text-xl">Metagenomics Tools</h2>
            <div class="grid grid-cols-3 gap-4">
                <NuxtLink
                    :to="`/tool/${encodeURIComponent(tool.biotoolsID)}`"
                    :key="tool.biotoolsID"
                    v-for="tool in filteredToolList"
                    class="p-4 relative bg-slate-100 rounded-md border-2 border-slate-100 hover:border-sky-500 hover:cursor-pointer"
                >
                    <h3 class="font-semibold text-md text-slate-800 truncate">{{ tool.name }}</h3>
                    <div class="mt-2 flex gap-2">
                        <div class="px-2 py-1 bg-sky-200 text-sky-500 text-sm rounded-sm">Tool</div>
                    </div>
                    <p class="mt-6 mb-16 text-slate-600 text-md line-clamp-4">
                        {{ tool.description }}
                    </p>
                    <div class="absolute bottom-4 flex gap-2">
                        <button class="px-4 py-2 bg-white hover:bg-slate-50 text-slate-900 text-sm border-2 border-slate-900 rounded-md">More info</button>
                        <button class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm rounded-md">Use the data</button>
                    </div>
                </NuxtLink>
            </div>
        </section>
    </div>
</template>