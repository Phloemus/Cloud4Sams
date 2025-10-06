<script setup>

    import { Index, Charset } from 'flexsearch'

    import data from "../static/result-10k-first-classes.json"

    const query = ref("")
    const results = ref([])

    const index = new Index({
      encoder: Charset.LatinBalance,
      tokenize: "forward", 
      async: true, 
    });

    console.log(data.results.bindings.length)

    data.results.bindings.forEach((data) => {
        index.add(data.class.value, data.label.value)
    })

    function performSearch() {
        if(query.value.length > 0) {
            results.value = index.search(query.value)
        } else {
            results.value = []
        }
    }

</script>

<template>
    <div>
        <input v-model="query" @input="performSearch" placeholder="Search..." />
        
        <div v-if="results.length > 0">
            <ul>
                <li v-for="(result, index) in results" :key="index">
                    {{ result }}
                </li>
            </ul>
        </div>

        <div v-else>
            <p>No results found</p>
        </div>

        <section class="mt-6">
            <h2 class="my-6 font-semibold text-slate-900 text-xl">Available research data</h2>
            <div class="flex gap-2">
                <div class="p-4 bg-slate-100 rounded-md border-2 border-slate-100 hover:border-sky-500 hover:cursor-pointer">
                    <h3 class="font-semibold text-md text-slate-800">French gut</h3>
                    <p class="my-4 text-slate-600 text-md">
                        The French gut project has the ambition to sequence the microbiome of 100000 people
                        living in metropolitan France.
                    </p>
                    <div class="mt-6 flex gap-2">
                        <button class="px-4 py-2 bg-white hover:bg-slate-50 text-slate-900 text-sm border-2 border-slate-900 rounded-md">More info</button>

                        <button class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm rounded-md">Use the data</button>
                    </div>
                </div>
                <div class="p-4 bg-slate-100 rounded-md border-2 border-slate-100 hover:border-sky-500 hover:cursor-pointer">
                    <h3 class="font-semibold text-md text-slate-800">French gut</h3>
                    <p class="my-4 text-slate-600 text-md">
                        The French gut project has the ambition to sequence the microbiome of 100000 people
                        living in metropolitan France.
                    </p>
                    <div class="mt-6 flex gap-2">
                        <button class="px-4 py-2 bg-white hover:bg-slate-50 text-slate-900 text-sm border-2 border-slate-900 rounded-md">More info</button>

                        <button class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm rounded-md">Use the data</button>
                    </div>
                </div>
                <div class="p-4 bg-slate-100 rounded-md border-2 border-slate-100 hover:border-sky-500 hover:cursor-pointer">
                    <h3 class="font-semibold text-md text-slate-800">French gut</h3>
                    <p class="my-4 text-slate-600 text-md">
                        The French gut project has the ambition to sequence the microbiome of 100000 people
                        living in metropolitan France.
                    </p>
                    <div class="mt-6 flex gap-2">
                        <button class="px-4 py-2 bg-white hover:bg-slate-50 text-slate-900 text-sm border-2 border-slate-900 rounded-md">More info</button>

                        <button class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm rounded-md">Use the data</button>
                    </div>
                </div>

            </div>
        </section>
  </div>
</template>
