<template>
    <header class="bg-white shadow h-16 flex justify-between items-center">
        <router-link :to="{ name: 'home' }" class="inline-flex items-center h-full px-5">
            Home
        </router-link>
        <div class="flex-items-center gap-1">
            <router-link :to="{ name: 'byTitle' }"
                class="inline-flex items-center px-2 h-full transition-colors hover:bg-purple-100">
                Search Movies
            </router-link>

            <router-link :to="{ name: 'byLetter' }"
                class="inline-flex items-center px-2 h-full transition-colors hover:bg-purple-100">
                Movies By Letter
            </router-link>

            <router-link :to="{ name: 'byCast' }"
                class="inline-flex items-center px-2 h-full transition-colors hover:bg-purple-100">
                Movies By Cast
            </router-link>
        </div>
    </header>
</template>