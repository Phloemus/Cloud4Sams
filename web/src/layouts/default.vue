<script>

    import Sidebar from "../components/Sidebar.vue"
    import Navbar from "../components/Navbar.vue"

</script>


<template>
    <div class="w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
    <div class="w-full bg-slate-50 flex">
        <Sidebar class="hidden" />
        <div class="w-full">
            <Navbar />
            <div class="px-10 my-10">
                <main class="mx-auto p-8 bg-white max-w-screen-xl border border-slate-200 rounded-md">
                    <slot />
                </main>
            </div>
        </div>
    </div>
</template>
