<script setup>

    defineProps({
        data: Array,
    })

</script>


<template>

        <table class="my-4 w-full">
            <tbody class="w-full bg-slate-50 border border-slate-100 rounded-md">
                <tr class="bg-white border border-slate-100 font-medium text-slate-900 text-lg rounded-t-md">
                    <th v-for="(key, index) in data[0].triples.keys" class="p-2 border border-slate-100">{{ key }}</th>
                </tr>
                <tr v-for="(row, index) in data">
                    <td v-for="(value, index) in row" class="p-2 border border-slate-100">{{ value }}</td>
                </tr>
            </tbody>
        </table>

</template>
