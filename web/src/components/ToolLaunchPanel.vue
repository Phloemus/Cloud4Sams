<script setup>

    // Global states
    const isToolLaunchPanelOpened = useState('isToolLaunchPanelOpened')
    const quickLauncherDatasetsList = useState("quickLauncherDatasetsList", () => [])

    function changeQuickLauncherDatasetsList(dataset) {
        const index = quickLauncherDatasetsList.value.findIndex(item => item.id === dataset.id);
        if (index !== -1) {
            quickLauncherDatasetsList.value.splice(index, 1);
        } else {
            quickLauncherDatasetsList.value.push(dataset)
        }
        console.log(quickLauncherDatasetsList.value)
    }

    function hideToolLaunchPanel(event) {
        if(event.currentTarget === event.target) {
            isToolLaunchPanelOpened.value = false
        }
    }

</script>

<template>
    <div class="w-full h-full">
        <div class=" w-full h-full fixed top-0 left-0 bg-opacity-70 bg-slate-800 z-20" @click="hideToolLaunchPanel($event)">
            <div class="mx-auto my-14 p-4 py-6 bg-white rounded-md max-w-screen-sm">
                <h2 class="text-slate-900 text-2xl font-bold flex justify-center">Tool launcher summary</h2>
                <p class="mt-8 mb-4 mx-4 text-slate-800">
                    You are about to launch the MAGNETO tool. Verify that all the informations
                    are correct before proceeding cliking on launch
                </p>
                <div class="mb-6 px-4 w-full">
                    <div 
                        v-for="dataset in quickLauncherDatasetsList"
                        class="my-6 w-full"
                    >
                        <div class="my-1 px-4 py-2 bg-slate-100 text-slate-800 flex justify-between rounded-md hover:bg-slate-200">
                            <span>{{ dataset.name }}</span>
                            <input @click="changeQuickLauncherDatasetsList(dataset)" type="checkbox" class="accent-blue-500" checked />
                        </div>
                    </div>
                </div>
                <div class="pr-4 flex justify-end">
                    <ActionButton 
                        content="Launch the tool" 
                        @click="hideToolLaunchPanel($event)"
                    />
                </div>
            </div>
        </div>
    </div>
</template>