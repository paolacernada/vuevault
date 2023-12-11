<template>
  <!-- Search bar for movie title search -->
  <MovieSearchBar @search="searchMovies" placeholder="Search for movies" />

  <!-- Loading spinner displayed while fetching movie data -->
  <div v-if="isLoadingByTitle" class="flex justify-center my-4">
    <div class="loader"></div>
  </div>

  <!-- Grid layout for displaying movie cards -->
  <div v-if="!isLoadingByTitle"
    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 p-8">
    <!-- Display each movie using the MovieCard component -->
    <MovieCard v-for="movie in filteredMovies" :key="movie.id" :movie="movie" @click="handleMovieSelect(movie.id)" />
  </div>

  <!-- Message displayed when no movies are found for the search query -->
  <div v-if="filteredMovies.length === 0 && lastSearchQueryByTitle !== '' && !isLoadingByTitle" class="text-center">
    <p>Hmmm...</p>
    <p>We couldn't find any matches for "{{ lastSearchQueryByTitle }}".</p>
    <p>Double check your search for any typos or spelling errors - or try a different search.</p>
  </div>

  <!-- Modal for displaying movie details -->
  <MovieDetailsModal :movieId="selectedMovieId" :showModal="selectedMovieId !== null" @close="selectedMovieId = null" />
</template>

<script setup>
// Script setup for MoviesByTitle.vue component
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import store from '../store';
import MovieCard from '../components/MovieCard.vue';
import MovieSearchBar from '../components/MovieSearchBar.vue';
import MovieDetailsModal from '../components/MovieDetailsModal.vue';

// Reactive state variables and computed properties
const route = useRoute();
const keyword = ref('');
const movies = computed(() => store.state.searchedMovies);
const filteredMovies = computed(() => movies.value.filter(movie => !(movie.poster_path === null && movie.overview === "")));
const lastSearchQueryByTitle = computed(() => store.state.lastSearchQueryByTitle);
const isLoadingByTitle = computed(() => store.state.isLoadingByTitle);
const selectedMovieId = ref(null);

// Function to handle movie search
function searchMovies(searchTerm) {
  keyword.value = searchTerm;
  store.dispatch('searchMovies', keyword.value);
}

// Function to handle movie selection
function handleMovieSelect(movieId) {
  selectedMovieId.value = movieId;
}

// On component mount, trigger a search if the route contains a title parameter
onMounted(() => {
  if (route.params.title) {
    keyword.value = route.params.title;
    searchMovies(keyword.value);
  }
})
</script>

<style>
/* Styles for the loading spinner */
.loader {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #331197;
  width: 50px;
  height: 50px;
  animation: spin 1.5s linear infinite;
  /* Faster spin for a dynamic feel */
}

@keyframes spin {

  /* Keyframes for the loader spin animation */
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
