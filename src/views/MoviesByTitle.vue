<template>
  <!-- Main container for search input -->
  <div class="flex flex-col p-8 pb-0">
    <!-- Search input binds to the keyword data property and calls searchMovies on change -->
    <input type="text" v-model="keyword" class="rounded border-2 border-gray-200 w-full p-2"
      placeholder="Search for Movies" @change="searchMovies" />
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

const route = useRoute();
const keyword = ref('');
const movies = computed(() => store.state.searchedMovies);
const filteredMovies = computed(() => {
  return movies.value.filter(movie => !(movie.poster_path === null && movie.overview === ""));
});

function searchMovies() {
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
