<template>
    <MovieSearchBar @search="searchMoviesByCast" placeholder="Search for movies by cast" />

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 p-8">
        <MovieCard v-for="movie in cast" :key="movie.id" :movie="movie" />
    </div>
</template>

<script setup>
import { computed } from 'vue';
import store from '../store';
import MovieCard from '../components/MovieCard.vue';
import MovieSearchBar from '../components/MovieSearchBar.vue';

const cast = computed(() => store.state.moviesByCast);


function searchMoviesByCast(searchTerm) {
    store.dispatch('searchMoviesByCast', searchTerm);
}
</script>
