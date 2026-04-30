<script setup>

    const isToolLaunchPanelOpened = useState("isToolLaunchPanelOpened")
    const quickLauncherDatasetsList = useState("quickLauncherDatasetsList", () => [])

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
            @click="displayToolLaunchPanel"
            class="px-4 py-2 w-full bg-slate-900 hover:bg-slate-800 text-white text-sm rounded-md"
        >
            Launch the tool
        </button>
    </div>
</template>