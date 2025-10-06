<script setup>

    // Imports
    import SearchInput from './SearchInput.vue'
    import data from '../static/result-10k-first-classes.json'

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

    data.results.bindings.forEach((data) => {
        ontologyClasses.value.push({ "name": data.label.value, "ontology": data.class.value })
    })

    function filterOntologyList(event) {
        searchTerm.value = event.target.value
        const query= searchTerm.value.toLowerCase();
        ontologyClasses.value = []
        data.results.bindings.forEach(suggestion => {
            if(suggestion.label.value.toLowerCase().includes(query) && ontologyClasses.value.length <= 10) {
                const elem = {
                    "name": suggestion.label.value,
                    "ontology": suggestion.class.value
                }
                ontologyClasses.value.push(elem)
            }
        });
    }

</script>

<template>
    <nav class="px-6 py-3 w-full flex justify-between items-center bg-white border-b border-slate-200">
        <SearchInput 
            :searchTerm="searchTerm"
            @input="filterOntologyList"
            placeholder="Search for ontology term.."
            :results="ontologyClasses"
        />
        <div class="flex flex-row-reverse gap-4">
            <ActionButton @click="displayLoginPanel" v-show="!isUserLoggedIn" content="Login"/>
            <SecondaryButton @click="logout" v-show="isUserLoggedIn" content="Log out"/>
        </div>
    </nav>
</template>
