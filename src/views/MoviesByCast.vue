
<template>
  <MovieSearchBar @search="searchMoviesByCast" @input="handleInput" placeholder="Search by cast member name" />

  <!-- Checks if there are movies to display -->

  <div v-if="cast.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 p-8">
    <MovieCard v-for="movie in cast" :key="movie.id" :movie="movie" />
  </div>

  <!-- Displays the message if no movies are found and a search has been performed -->
  <div v-else-if="lastSearchQuery !== '' && !isLoading" class="text-center p-8">
    <p>Hmmm...</p>
    <p>We couldn't find any matches for "{{ lastSearchQuery }}".</p>
    <p>Double check your search for any typos or spelling errors - or try a different cast member name.</p>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import store from '../store';
import MovieCard from '../components/MovieCard.vue';
import MovieSearchBar from '../components/MovieSearchBar.vue';

const route = useRoute();
const keyword = ref('');
const searchPerformed = computed(() => store.state.searchPerformed);
const cast = computed(() => store.state.moviesByCast);
const lastSearchQuery = computed(() => store.state.lastSearchQuery);
const isLoading = computed(() => store.state.isLoading);

function searchMoviesByCast(searchTerm) {
    if (searchTerm) {
        store.dispatch('searchMoviesByCast', searchTerm);
    } else {
        store.dispatch('resetSearch'); // Resets the search state when input is cleared
    }
}

function handleInput(event) {
    if (!event.target.value) {
        store.dispatch('resetSearch'); // Resets the search state when input is cleared
    }
}

onMounted(() => {
  // Initializes search if there's a keyword in the route params
  if (route.params.cast) {
    keyword.value = route.params.cast;
    searchMoviesByCast(keyword.value);
  }
})
</script>
