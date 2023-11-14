<template>
  <!-- Main container for search input -->
  <div class="flex flex-col p-8 pb-0">
    <!-- Search input binds to the keyword data property and calls searchMovies on change -->
    <input type="text" v-model="keyword" class="rounded border-2 border-gray-200 w-full p-2"
      placeholder="Search for Movies" @change="searchMovies" />
  </div>

  <!-- Container for displaying movies -->
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 p-8">
    <!-- Loops through filteredMovies array and displays each movie -->
    <div v-for="movie of filteredMovies" :key="movie.id" class="bg-white shadow rounded-xl flex flex-col text-center  justify-center items-center p-4">

      <!-- Link to movie details page with dynamic route -->
      <router-link :to="{name: 'movieDetails', params: {id: movie.id}}">

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
          <button @click="showTrailer(movie)"
            class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none"
            :class="{ 'bg-gray-400 text-gray-600 cursor-not-allowed hover:bg-gray-400': !movie.trailerAvailable }">
            {{ movie.trailerAvailable ? 'Watch Trailer' : 'Trailer Unavailable' }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Popup for full movie overview -->
  <div v-if="showOverviewFlag" class="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center">
    <div class="bg-white p-5 rounded shadow-lg text-center w-1/2">
      <h2 class="text-xl font-semibold">Movie Overview</h2>
      <p class="mt-2">{{ selectedMovie }}</p>
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
</template>


<script setup>
import { useRoute } from 'vue-router';
import { computed, onMounted } from 'vue';
import { ref } from 'vue';
import axiosClient from '../axiosClient.js';
import store from '../store';
import posterNotAvailable from '../assets/poster_not_available.png';

// Using Vue Router's useRoute to get access to the current route
const route = useRoute();
// Reactive references for various states
const keyword = ref('');
const movies = computed(() => store.state.searchedMovies); // Computed property for movies
const selectedMovie = ref(null);
const showOverviewFlag = ref(false);
const showTrailerFlag = ref(false);
const trailerUrl = ref('');

// Computed property to out movies that don't have a poster and overview
const filteredMovies = computed(() => {
  return movies.value.filter(movie => !(movie.poster_path === null && movie.overview === ""));
});

let scrollPosition = 0;

// Function to trigger movie search
function searchMovies() {
  store.dispatch('searchMovies', keyword.value);
}

onMounted(() => {
  keyword.value = route.params.title
  if (keyword.value) {
    searchMovies()
  }
})

// Function to get the movie poster URL or a placeholder is no poster URL is available
function getMoviePosterUrl(posterPath) {
  if (posterPath) {
    return 'https://image.tmdb.org/t/p/w220_and_h330_face' + posterPath;
  } else {
    return posterNotAvailable;
  }
}

// Function to truncate movie overview text
function truncateOverview(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + '...';
}

// Function to display full movie overview in a popup
function showFullOverview(movie) {
  scrollPosition = window.scrollY;
  selectedMovie.value = movie.overview;
  showOverviewFlag.value = true;
}

// Function to close the overview popup
function closeOverview() {
  showOverviewFlag.value = false;
  window.scrollTo(0, scrollPosition);
}

// Function to show trailer popup
function showTrailer(movie) {
  const movieId = movie.id;
  fetchTrailerUrl(movieId);
}

// Async function to fetch the trailer URL from the API
async function fetchTrailerUrl(movieId) {
  try {
    const response = await axiosClient.get(`/movie/${movieId}/videos`);
    const videos = response.data.results;
    const trailerVideo = videos.find((video) => video.type === 'Trailer' && video.site === 'YouTube');
    if (trailerVideo) {
      trailerUrl.value = `https://www.youtube.com/embed/${trailerVideo.key}`;
      showTrailerFlag.value = true;
      // Debug helpers
    } else {
      console.log('No trailer available for this movie.');
    }
  } catch (error) {
    console.error('Error fetching trailer:', error);
  }
}

// Function to close the trailer popup
function closeTrailer() {
  showTrailerFlag.value = false;
}

</script>

