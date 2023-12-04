<template>
  <MovieSearchBar @search="searchMovies" placeholder="Search for movies"/>

  <!-- Loading Spinner -->
  <div v-if="isLoadingByTitle" class="flex justify-center my-4">
    <div class="loader"></div>
  </div>

  <!-- Grid for displaying movies -->
  <div v-if="!isLoadingByTitle" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 p-8">
    <MovieCard 
      v-for="movie in filteredMovies" 
      :key="movie.id" 
      :movie="movie" 
      @click="handleMovieSelect(movie.id)" 
    />
  </div>

  <!-- Message when no movies found -->
  <div v-if="filteredMovies.length === 0 && lastSearchQueryByTitle !== '' && !isLoadingByTitle" class="text-center">
    <p>Hmmm...</p>
    <p>We couldn't find any matches for "{{ lastSearchQueryByTitle }}".</p>
    <p>Double check your search for any typos or spelling errors - or try a different search.</p>
  </div>

  <!-- MovieDetailsModal Component -->
  <MovieDetailsModal 
    :movieId="selectedMovieId" 
    :showModal="selectedMovieId !== null" 
    @close="selectedMovieId = null"
  />
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import store from '../store';
import MovieCard from '../components/MovieCard.vue';
import MovieSearchBar from '../components/MovieSearchBar.vue';
import MovieDetailsModal from '../components/MovieDetailsModal.vue';

const route = useRoute();
const keyword = ref('');
const movies = computed(() => store.state.searchedMovies);
const filteredMovies = computed(() => movies.value.filter(movie => !(movie.poster_path === null && movie.overview === "")));
const lastSearchQueryByTitle = computed(() => store.state.lastSearchQueryByTitle);
const isLoadingByTitle = computed(() => store.state.isLoadingByTitle);
const selectedMovieId = ref(null);

function searchMovies(searchTerm) {
  keyword.value = searchTerm;
  store.dispatch('searchMovies', keyword.value);
}

function handleMovieSelect(movieId) {
  selectedMovieId.value = movieId;
}

onMounted(() => {
  if (route.params.title) {
    keyword.value = route.params.title;
    searchMovies(keyword.value);
  }
})
</script>

<style>
/* Loader styles */
.loader {
  border: 4px solid rgba(255, 255, 255, 0.3); /* Adjust the border color to match your site's theme */
  border-top: 4px solid #331197; /* Example: using a bright orange for the loader spinner */
  border-radius: 50%;
  width: 50px; /* Slightly larger for better visibility */
  height: 50px;
  animation: spin 1.5s linear infinite; /* Faster spin for a more dynamic feel */
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
