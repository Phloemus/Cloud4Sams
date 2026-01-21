<script setup>

    import datasets from "../static/datasets.json"

    console.log(datasets.data.items[0].name)

</script>

<template>
    <div>
        <section>
            <h2 class="my-6 font-semibold text-slate-900 text-xl">Available research data</h2>
            <div class="grid grid-cols-3 gap-4">
                <div
                    v-for="(dataset, index) in datasets.data.items"
                    class="p-4 relative bg-slate-100 rounded-md border-2 border-slate-100 hover:border-sky-500 hover:cursor-pointer"
                >
                    <h3 class="font-semibold text-md text-slate-800 truncate">{{ dataset.name }}</h3>
                    <p class="mt-4 mb-14 text-slate-600 text-md line-clamp-4">
                        {{ dataset.description }}
                    </p>
                    <div class="absolute bottom-4 flex gap-2">
                        <button class="px-4 py-2 bg-white hover:bg-slate-50 text-slate-900 text-sm border-2 border-slate-900 rounded-md">More info</button>
                        <button class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm rounded-md">Use the data</button>
                    </div>
                </div>
            </div>
        </section>
        <section class="mt-14">
            <h2 class="my-6 font-semibold text-slate-900 text-xl">Analysis tools</h2>
            <div class="flex gap-2">
            </div>
        </section>
  </div>
</template>
