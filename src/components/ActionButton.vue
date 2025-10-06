<script setup>
    defineProps(['content'])
</script>

<template>
    <button class="px-8 py-2 bg-slate-900 hover:bg-slate-800 text-white text-md rounded-md">
        {{ content }} 
    </button>
</template>
