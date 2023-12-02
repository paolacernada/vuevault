<template>
  <MovieSearchBar @search="searchMovies" placeholder="Search for movies"/>

  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 p-8">
    <MovieCard v-for="movie in filteredMovies" :key="movie.id" :movie="movie" />
  </div>

  <div v-if="filteredMovies.length === 0 && lastSearchQueryByTitle !== '' && !isLoadingByTitle" class="text-center">
    <p>Hmmm...</p>
    <p>We couldn't find any matches for "{{ lastSearchQueryByTitle }}".</p>
    <p>Double check your search for any typos or spelling errors - or try a different search.</p>
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
const movies = computed(() => store.state.searchedMovies);
const filteredMovies = computed(() => {
  return movies.value.filter(movie => !(movie.poster_path === null && movie.overview === ""));
});
const lastSearchQueryByTitle = computed(() => store.state.lastSearchQueryByTitle);
const isLoadingByTitle = computed(() => store.state.isLoadingByTitle);

function searchMovies(searchTerm) {
  keyword.value = searchTerm;
  store.dispatch('searchMovies', keyword.value);
}

onMounted(() => {
  // Initialize search if there's a keyword in the route params
  if (route.params.title) {
    keyword.value = route.params.title;
    searchMovies(keyword.value);
  }
})
</script>
