<script setup>

    import datasets from "../static/datasets.json"

    const filteredDatasetList = datasets.data.items.filter(
        item => item.description && item.description.trim() !== "" && item.global_id && item.global_id.trim() !== ""
    )

    console.log(filteredDatasetList)

</script>

<template>
    <div>
        <section>
            <h2 class="my-6 font-semibold text-slate-900 text-xl">Available metagenomics data</h2>
            <div class="grid grid-cols-3 gap-4">
                <NuxtLink
                    :to="`/dataset/${index + 1}`"
                    v-for="(dataset, index) in filteredDatasetList"
                    class="p-4 relative bg-slate-100 rounded-md border-2 border-slate-100 hover:border-sky-500 hover:cursor-pointer"
                >
                    <h3 class="font-semibold text-md text-slate-800 truncate">{{ dataset.name }}</h3>
                    <div class="mt-2 flex gap-2">
                        <div class="px-2 py-1 bg-sky-200 text-sky-500 text-sm rounded-sm">Dataset</div>
                        <NuxtLink 
                            :to="dataset.url"
                            v-if="dataset.global_id"
                            class="px-2 py-1 bg-purple-200 text-purple-500 text-sm hover:underline rounded-sm"
                        >
                            {{ dataset.global_id }}
                        </NuxtLink>
                    </div>
                    <p class="mt-6 mb-16 text-slate-600 text-md line-clamp-4">
                        {{ dataset.description }}
                    </p>
                    <div class="absolute bottom-4 flex gap-2">
                        <button class="px-4 py-2 bg-white hover:bg-slate-50 text-slate-900 text-sm border-2 border-slate-900 rounded-md">More info</button>
                        <button class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm rounded-md">Use the data</button>
                    </div>
                </NuxtLink>
            </div>
        </section>
        <section class="mt-14">
            <h2 class="my-6 font-semibold text-slate-900 text-xl">Analysis tools</h2>
            <div class="flex gap-2">
            </div>
        </section>
  </div>
</template>
