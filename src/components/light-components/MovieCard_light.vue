<template>
  <div class="bg-white shadow rounded-xl flex flex-col text-center justify-center items-center p-4">
    <!-- Link to movie details page with dynamic route -->
    <router-link :to="{ name: 'movieDetails', params: { id: movie.id } }">
      <!-- Movie poster image with dynamic source and alt text -->
      <img :src="getMoviePosterUrl(movie.poster_path)" :alt="movie.title" class="rounded-t-xl w-44 h-60 object-fill" />
    </router-link>

    <!-- Container for movie content -->
    <div class="flex flex-col h-full p-3">
      <!-- Movie title -->
      <h3 class="py-2 text-lg font-bold">{{ movie.title }}</h3>
      <!-- Movie overview -->
      <p class="flex-grow overflow-hidden">
        <!-- Displays overview text if available, with a 'Read all' link -->
        <template v-if="movie.overview">
          {{ truncateOverview(movie.overview, 113) }}
          <a @click="showFullOverview(movie)" class="text-blue-500 hover:underline">Read all</a>
        </template>

        <!-- Show a placeholder if no overview is available -->
        <template v-else>
          No Overview Available
        </template>
      </p>

      <!-- Container for movie release date -->
      <div class="mt-2 space-x-4">
        <!-- Display only the movie release year -->
        <p class="-mt-1 mb-2.5 text-gray-600">
          Release Year: {{ movie.release_date.substring(0, 4) || 'Not available' }}
        </p>

        <!-- Button to watch trailer -->
        <button @click="showTrailer"
          class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none"
          :class="{ 'bg-gray-400 text-gray-600 cursor-not-allowed hover:bg-gray-400': !movie.trailerAvailable }">
          {{ movie.trailerAvailable ? 'Watch Trailer' : 'Trailer Unavailable' }}
        </button>
      </div>
    </div>

    <!-- Popup for full movie overview -->
    <div v-if="showOverviewFlag" class="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center">
      <div class="bg-white p-5 rounded shadow-lg text-center w-1/2">
        <h2 class="text-xl font-semibold">Movie Overview</h2>
        <p class="mt-2">{{ selectedMovieOverview }}</p>
        <button @click="closeOverview"
          class="mt-4 bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring focus:ring-gray-200">
          Close
        </button>
      </div>
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
  </div>
</template>

<script setup>
import { ref } from 'vue';
import posterNotAvailable from '../assets/poster_not_available.png';
import axiosClient from '../axiosClient.js';

const props = defineProps({
  movie: Object
});

const selectedMovieOverview = ref('');
const showOverviewFlag = ref(false);
let scrollPosition = 0;

const showTrailerFlag = ref(false);
const trailerUrl = ref('');

function getMoviePosterUrl(posterPath) {
  return posterPath ? 'https://image.tmdb.org/t/p/w220_and_h330_face' + posterPath : posterNotAvailable;
}

function truncateOverview(text, maxLength) {
  return text.length <= maxLength ? text : text.slice(0, maxLength) + '...';
}

function showFullOverview(movie) {
  scrollPosition = window.scrollY;
  selectedMovieOverview.value = movie.overview;
  showOverviewFlag.value = true;
}

function closeOverview() {
  showOverviewFlag.value = false;
  window.scrollTo(0, scrollPosition);
}

function showTrailer() {
  fetchTrailerUrl(props.movie.id);
}

async function fetchTrailerUrl(movieId) {
  try {
    const response = await axiosClient.get(`/movie/${movieId}/videos`);
    const videos = response.data.results;
    const trailerVideo = videos.find(video => video.type === 'Trailer' && video.site === 'YouTube');
    if (trailerVideo) {
      trailerUrl.value = `https://www.youtube.com/embed/${trailerVideo.key}`;
      showTrailerFlag.value = true;
    } else {
      console.log('No trailer available for this movie.');
      showTrailerFlag.value = false;
    }
  } catch (error) {
    console.error('Error fetching trailer:', error);
    showTrailerFlag.value = false;
  }
}

function closeTrailer() {
  showTrailerFlag.value = false;
}
</script>
