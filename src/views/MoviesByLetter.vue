<template>
    <div>
        <div class="flex justify-center gap-2 mt-2">
            <router-link :to="{ name: 'byLetter', params: { letter } }" 
            v-for="letter of letters" 
            :key="letter"
            >
                {{ letter }}
            </router-link>
        </div>

  <!-- Container for displaying movies -->
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 p-8">
    <!-- Loops through movies array and displays each movie using MovieCard component -->
    <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie" />
  </div>
    </div>
</template>

<script setup>

import { computed, onMounted, watch } from 'vue';
import store from '../store';
import { useRoute } from 'vue-router';
import MovieCard from '../components/MovieCard.vue';

const route = useRoute();
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const movies = computed(() => store.state.moviesByLetter)

watch(route, () => {
    store.dispatch("searchMoviesByLetter", route.params.letter)
})

onMounted(() => {
    store.dispatch("searchMoviesByLetter", route.params.letter)
})
</script>