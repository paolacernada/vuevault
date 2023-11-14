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
    <MovieCard v-for="movie in filteredMovies" :key="movie.id" :movie="movie" @showTrailer="showTrailer" />
  </div>

  <!-- Popup for movie trailer -->
  <div v-if="showTrailerFlag" class="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center">
    <div class="bg-white p-5 rounded shadow-lg text-center w-1/2">
      <h2 class="text-xl font-semibold">Movie Trailer</h2>
      <iframe :src="trailerUrl" class="mt-2 w-full" height="315" frameborder="0" allowfullscreen></iframe>
      <button @click="closeTrailer"
        class="mt-4 bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring focus:ring-gray-200">
        Close
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { computed, onMounted, ref } from 'vue';
import axiosClient from '../axiosClient.js';
import store from '../store';
import MovieCard from '../components/MovieCard.vue';

const route = useRoute();
const keyword = ref('');
const movies = computed(() => store.state.searchedMovies);
const showTrailerFlag = ref(false);
const trailerUrl = ref('');

const filteredMovies = computed(() => {
  return movies.value.filter(movie => !(movie.poster_path === null && movie.overview === ""));
});

function searchMovies() {
  store.dispatch('searchMovies', keyword.value);
}

onMounted(() => {
  keyword.value = route.params.title;
  if (keyword.value) {
    searchMovies();
  }
})

function showTrailer(movie) {
  const movieId = movie.id;
  fetchTrailerUrl(movieId);
}

async function fetchTrailerUrl(movieId) {
  try {
    const response = await axiosClient.get(`/movie/${movieId}/videos`);
    const videos = response.data.results;
    const trailerVideo = videos.find((video) => video.type === 'Trailer' && video.site === 'YouTube');
    if (trailerVideo) {
      trailerUrl.value = `https://www.youtube.com/embed/${trailerVideo.key}`;
      showTrailerFlag.value = true;
    } else {
      console.log('No trailer available for this movie.');
    }
  } catch (error) {
    console.error('Error fetching trailer:', error);
  }
}

function closeTrailer() {
  showTrailerFlag.value = false;
}
</script>
