<script setup>

</script>

<template>
    <div class="w-full">
        <h2 class="text-xl text-slate-900 font-bold">Quick launch</h2>
        <p class="my-4 text-slate-600 text-md line-clamp-4">
            You can launch an instance of this tool with the selected dataset you choosed
        </p>
        <div class="my-6">
            <div class="my-1 px-4 py-2 bg-slate-100 text-slate-800 flex justify-between rounded-md hover:bg-slate-200">
                <span>Magneto test data</span>
                <input type="checkbox" class="accent-blue-500" checked />
            </div>
            <div class="my-1 px-4 py-2 bg-slate-100 text-slate-800 flex justify-between rounded-md hover:bg-slate-200">
                <span>HMP dataset</span>
                <input type="checkbox" class="accent-blue-500" checked />
            </div>
            <div class="my-1 px-4 py-2 bg-slate-100 text-slate-800 flex justify-between rounded-md hover:bg-slate-200">
                <span>An other dataset</span>
                <input type="checkbox" class="accent-blue-500" checked />
            </div>
        </div>
        <button class="px-4 py-2 w-full bg-slate-900 hover:bg-slate-800 text-white text-sm rounded-md">Launch the tool</button>
    </div>
</template>