<script setup>

    // Global state
    const isUserLoggedIn = useState('isUserLoggedIn', () => false)
    const userAuthToken = useState('userAuthToken', () => "")
    const isLoginPanelOpened = useState('isLoginPanelOpened')

    // Local state
    const username = ref("")
    const password = ref("")
    const error = ref("")
    const isError = ref(false)

    function login() {
        fetch(
            "http://localhost:5000/graph-api/login", 
            { 
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({username: username.value, password: password.value})
            }
        )
        .then(response => { 
            if(response.status != 200) {
                isError.value = true
                error.value = response.json()
                isUserLoggedIn.value = false
                userAuthToken.value = ""
                return 
            } else {
                isError.value = false
            }
            return response.json()
        }).then((data) => {
            if(data.token != undefined || data.token != "") {
                isUserLoggedIn.value = true
                userAuthToken.value = data.token
                isLoginPanelOpened.value = false
            }
        }).catch(err => {
            isError.value = true
            error.value = err
            console.error("Error fetching data: ", err)
        })
    }

    function hideLoginPanel(event) {
        if(event.currentTarget === event.target) {
            isLoginPanelOpened.value = false
        }
    }

</script>

<template>
    <div class="w-full h-full">
        <div class=" w-full h-full fixed top-0 left-0 bg-opacity-70 bg-slate-800 z-20" @click="hideLoginPanel($event)">
            <div class="mx-auto my-14 p-4 bg-white rounded-md max-w-screen-sm">
                <h2 class="text-slate-900 text-2xl font-bold flex justify-center">Login</h2>
                <p class="mt-8 mb-4 mx-4 text-slate-800">
                    Login as an authentenficated user allows to get access to your personal queries and admin priviledge API routes for the knowledge graph maintenance.
                </p>
                <div class="mb-6 px-4 w-full">
                    <div class="w-full">
                        <h3 class="text-lg text-slate-900">Username</h3>
                        <div class="my-2">
                            <input 
                                class="w-full px-3 py-1 bg-slate-200 placeholder:italic placeholder:text-slate-400 border focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 focus:bg-white text-slate-800 rounded-sm"
                                v-model="username"
                                placeholder="username"
                            />
                        </div>
                    </div>
                    <div class="w-full">
                        <h3 class="text-lg text-slate-900">Password</h3>
                        <div class="my-2">
                            <input 
                                class="w-full px-3 py-1 bg-slate-200 placeholder:italic placeholder:text-slate-400 border focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 focus:bg-white text-slate-800 rounded-sm"
                                v-model="password"
                                type="password"
                                placeholder="password"
                            />
                        </div>
                    </div>
                    <div v-if="isError" class="py-2 px-4 my-4 bg-red-200 text-red-500 rounded-sm">
                        Wrong username or password
                        {{ error.message }}
                    </div>
                </div>
                <div class="pr-4 flex justify-end">
                    <ActionButton 
                        content="Login" 
                        @click="login"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
