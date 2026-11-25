<script setup lang="ts">
    import { ref } from 'vue'
    import { createBiosphereInstallScript } from '~/composables/buildCatalog'

    const props = defineProps<{
        launchUrl?: string
        biocondaPackage?: string | null
    }>()

    const isToolLaunchPanelOpened = useState("isToolLaunchPanelOpened")
    const quickLauncherDatasetsList = useState("quickLauncherDatasetsList", () => [])
    const installScript = ref<string | null>(null)
    const copyMessage = ref('')

    /****** State modifier functions ************************************************************************************** /
     * 
     * Allows to modify the states used the page or the states of the included components
     * 
     * changeQuickLauncherDatasets (function): @param dataset: Allows to add or remove a tool id in the quickLauncherDatasetsList
     * 
     *  
    */

    function displayToolLaunchPanel(event) {
        if(event.currentTarget === event.target) {
            isToolLaunchPanelOpened.value = true
        }
    }

    function generateInstallScript() {
        installScript.value = createBiosphereInstallScript(props.biocondaPackage ?? null)
        copyMessage.value = ''
    }

    async function copyInstallScript() {
        if (!installScript.value) return

        try {
            await navigator.clipboard.writeText(installScript.value)
            copyMessage.value = 'Script copied.'
        } catch {
            copyMessage.value = 'Could not copy the script. Select and copy it manually.'
        }
    }

    function changeQuickLauncherDatasetsList(dataset) {
        const index = quickLauncherDatasetsList.value.findIndex(item => item.id === dataset.id);
        if (index !== -1) {
            quickLauncherDatasetsList.value.splice(index, 1);
        } else {
            quickLauncherDatasetsList.value.push(dataset)
        }
        console.log(quickLauncherDatasetsList.value)
    }

</script>

<template>
    <div class="w-full">
        <h2 class="text-xl text-slate-900 font-bold">Quick launch</h2>
        <p class="my-4 text-slate-600 text-md line-clamp-4">
            You can launch an instance of this tool with the selected datasets you choosed
        </p>
        <div 
            v-for="dataset in quickLauncherDatasetsList"
            class="my-6"
        >
            <div class="my-1 px-4 py-2 bg-slate-100 text-slate-800 flex justify-between rounded-md hover:bg-slate-200">
                <span>{{ dataset.name }}</span>
                <input @click="changeQuickLauncherDatasetsList(dataset)" type="checkbox" class="accent-blue-500" checked />
            </div>
        </div>
        <button
            v-if="props.biocondaPackage"
            type="button"
            @click="generateInstallScript"
            class="px-4 py-2 w-full block text-center bg-slate-900 hover:bg-slate-800 text-white text-sm rounded-md"
        >
            Generate Biosphere install script
        </button>
        <a
            v-else-if="props.launchUrl"
            :href="launchUrl"
            class="px-4 py-2 w-full block text-center bg-slate-900 hover:bg-slate-800 text-white text-sm rounded-md"
        >
            Launch the tool
        </a>
        <button
            v-else
            @click="displayToolLaunchPanel"
            class="px-4 py-2 w-full bg-slate-900 hover:bg-slate-800 text-white text-sm rounded-md"
        >
            Launch the tool
        </button>
        <div v-if="installScript" class="mt-5">
            <div class="mb-2 flex items-center justify-between gap-3">
                <h3 class="font-semibold text-slate-900">Biosphere install script</h3>
                <button
                    type="button"
                    @click="copyInstallScript"
                    class="px-3 py-1 border border-slate-300 text-slate-700 text-sm rounded-md hover:bg-slate-100"
                >
                    Copy
                </button>
            </div>
            <p class="mb-2 text-sm text-amber-800">
                This script is intended for a Biosphere VM and changes system configuration.
                Review it before running.
            </p>
            <pre class="max-h-96 overflow-auto whitespace-pre-wrap break-words rounded-md bg-slate-950 p-4 text-xs text-slate-100"><code>{{ installScript }}</code></pre>
            <p v-if="copyMessage" role="status" class="mt-2 text-sm text-slate-600">
                {{ copyMessage }}
            </p>
        </div>
    </div>
</template>