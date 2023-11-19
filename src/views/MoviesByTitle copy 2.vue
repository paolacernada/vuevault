<template>
  <!-- Main container for search input -->
  <div class="flex flex-col p-8 pb-0">
    <!-- Search input binds to the keyword data property and calls searchMovies on change -->
    <MovieSearch @search="searchMovies" />
  </div>

  <!-- Container for displaying movies -->
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 p-8">
    <!-- Loops through filteredMovies array and displays each movie using MovieCard component -->
    <MovieCard v-for="movie in filteredMovies" :key="movie.id" :movie="movie" />
  </div>
</template>

<script setup>

import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import store from '../store';
import MovieCard from '../components/MovieCard.vue';
import MovieSearch from '../components/MovieSearch.vue';

const route = useRoute();
const keyword = ref('');
const movies = computed(() => store.state.searchedMovies);
const filteredMovies = computed(() => {
  return movies.value.filter(movie => !(movie.poster_path === null && movie.overview === ""));
});

function searchMovies(searchTerm) {
  keyword.value = searchTerm;
  store.dispatch('searchMovies', keyword.value);
}

onMounted(() => {
  // Initialize search if there's a keyword in the route params
  keyword.value = route.params.title;
  if (keyword.value) {
    searchMovies();
  }
})
</script>
