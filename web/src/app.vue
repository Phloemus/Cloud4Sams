<script setup>

    const isLoginPanelOpened = useState('isLoginPanelOpened', () => false)
    const isToolLaunchPanelOpened = useState('isToolLaunchPanelOpened', () => false)

</script>

<template>
    <div>
        <LoginPanel v-show="isLoginPanelOpened"/>
        <ToolLaunchPanel v-show="isToolLaunchPanelOpened"/>
        <NuxtLayout>
            <NuxtPage/>
        </NuxtLayout>
    </div>
</template>
