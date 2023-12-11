<template>
  <!-- Search bar for finding movies by cast member -->
  <MovieSearchBar @search="searchMoviesByCast" @input="handleInput" placeholder="Search by cast member name" />

  <!-- Loading spinner displayed while fetching data -->
  <div v-if="isLoadingByCast" class="flex justify-center my-4">
    <div class="loader"></div>
  </div>

  <!-- Display movies related to the searched cast member -->
  <div v-if="cast.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 p-8">
    <MovieCard v-for="movie in cast" :key="movie.id" :movie="movie" @click="showMovieDetails(movie.id)" />
  </div>

  <!-- Message displayed when no movies are found for the given cast member -->
  <div v-else-if="lastSearchQueryByCast !== '' && !isLoadingByCast" class="text-center p-16">
    <p>Hmmm...</p>
    <p>We couldn't find any matches for "{{ lastSearchQueryByCast }}".</p>
    <p>Double check your search for any typos or spelling errors - or try a different cast member name.</p>
  </div>

  <!-- Modal for displaying movie details -->
  <MovieDetailsModal :movieId="selectedMovieId" :showModal="selectedMovieId !== null" @close="selectedMovieId = null" />
</template>

<script setup>
// Script setup for MoviesByCast.vue component
import { computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import store from '../store';
import MovieCard from '../components/MovieCard.vue';
import MovieSearchBar from '../components/MovieSearchBar.vue';
import MovieDetailsModal from '../components/MovieDetailsModal.vue';

// Reactive state variables and computed properties
const route = useRoute();
const keyword = ref('');
const cast = computed(() => store.state.moviesByCast);
const lastSearchQueryByCast = computed(() => store.state.lastSearchQueryByCast);
const isLoadingByCast = computed(() => store.state.isLoadingByCast);
const selectedMovieId = ref(null);

// Function to handle search action
function searchMoviesByCast(searchTerm) {
  if (searchTerm) {
    store.dispatch('searchMoviesByCast', searchTerm);
  } else {
    store.dispatch('resetCastSearchState');
  }
}

// Function to handle input event in search bar
function handleInput(event) {
  if (!event.target.value) {
    store.dispatch('resetCastSearchState');
  }
}

// Function to display movie details modal
function showMovieDetails(movieId) {
  selectedMovieId.value = movieId;
}

// On component mount, trigger search if route contains cast parameter
onMounted(() => {
  if (route.params.cast) {
    keyword.value = route.params.cast;
    searchMoviesByCast(keyword.value);
  }
});
</script>

<style>
/* Styles for the loader */
.loader {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #331197;
  border-radius: 50%;
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