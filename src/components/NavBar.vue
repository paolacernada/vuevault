<template>
    <header class="bg-gray-800 h-16 flex justify-between items-center px-5 shadow-md">
        <router-link :to="{ name: 'home' }" class="inline-flex items-center h-full">
            <img src="../assets/VueVault_logo.png" alt="VueVault Logo" class="h-12 mr-2">
            <span class="text-2xl text-white font-shrikhand">VueVault</span>
        </router-link>
        <nav class="flex items-center gap-4">
            <router-link :to="{ name: 'byTitle' }"
                class="px-4 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-blue-600 hover:text-white transition-colors">
                Search Movies
            </router-link>

            <router-link :to="{ name: 'byLetter' }"
                class="px-4 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-blue-600 hover:text-white transition-colors">
                Featured Movies
            </router-link>

            <router-link :to="{ name: 'byCast' }"
                class="px-4 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-blue-600 hover:text-white transition-colors">
                Movies By Cast
            </router-link>
        </nav>
    </header>
</template>