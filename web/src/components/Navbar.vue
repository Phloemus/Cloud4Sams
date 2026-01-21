<script setup>

    // Imports
    import SearchInput from './SearchInput.vue'

    // Global state
    const isUserLoggedIn = useState('isUserLoggedIn')
    const userAuthToken = useState('userAuthToken')
    const isLoginPanelOpened = useState('isLoginPanelOpened')

    function displayLoginPanel() { 
        isLoginPanelOpened.value = true
    }

    async function logout() {
        isUserLoggedIn.value = false
        userAuthToken.value = ""
        await navigateTo("/")
    }

    const searchTerm = ref("")
    const ontologyClasses = ref([])

</script>

<template>
    <nav class="px-6 py-3 w-full sticky top-0 flex justify-between items-center bg-white border-b border-slate-200 z-10">
        <SearchInput 
            :searchTerm="searchTerm"
            @input="filterOntologyList"
            placeholder="Search for a dataset.."
            :results="ontologyClasses"
        />
        <div class="flex flex-row-reverse gap-4">
            <ActionButton @click="displayLoginPanel" v-show="!isUserLoggedIn" content="Login"/>
            <SecondaryButton @click="logout" v-show="isUserLoggedIn" content="Log out"/>
        </div>
    </nav>
</template>
