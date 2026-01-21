<script setup>
    defineProps(['content'])
</script>

<template>
    <button class="px-8 py-2 bg-white hover:bg-slate-50 text-slate-900 text-md border-2 border-slate-900 rounded-md">
        {{ content }} 
    </button>
</template>
