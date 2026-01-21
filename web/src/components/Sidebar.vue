<script setup>

    import SmallCard from '../components/SmallCard.vue'

    const isUserLoggedIn = useState("isUserLoggedIn")

</script>

<template>
    <div class="px-4 w-96 h-full block bg-white border-r border-slate-200 z-10">
            <div>

            </div>
            <div class="w-full relative">
                <h3 class="mx-1 my-4 text-slate-600 text-lg">Queries</h3>
            </div>
            <div v-show="isUserLoggedIn" class="w-full relative">
                <h3 class="mx-1 my-4 text-slate-600 text-lg">Admin actions</h3>
                <div class="my-2 p-2 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-md hover:cursor-pointer">
                    <NuxtLink to="/admin/delete-all">
                        <p>
                            delete all graph nodes
                        </p>
                    </NuxtLink>
                </div>
                <div class="my-2 p-2 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-md hover:cursor-pointer">
                    <NuxtLink to="/admin/recreate-graph">
                        <p>
                            recreate graph
                        </p>
                    </NuxtLink>
                </div>
                <div class="my-2 p-2 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-md hover:cursor-pointer">
                    <p>
                        delete graph content
                    </p>
                </div>
            </div>
            <div class="mx-12 px-6 pb-4 absolute bottom-0 left-0 border-t-2 border-slate-200">
                <div class="py-3 flex gap-2 text-slate-500">
                    <span>v0.0.2</span>
                    <span>ABRomicsKG</span>
                    <span>2025</span>
                </div>
            </div>
        </div>
</template>
