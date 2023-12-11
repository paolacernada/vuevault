<template>
  <!-- Card component for displaying movie information -->
  <div @click="handleCardClick"
    class="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col text-center justify-center items-center p-2 pt-4 movie-card">

    <!-- Movie poster image -->
    <img :src="getMoviePosterUrl(movie.poster_path)" :alt="movie.title" class="rounded-t-xl w-44 h-60 object-fill" />

    <!-- Movie details section -->
    <div class="flex flex-col h-full p-3">
      <!-- Movie title -->
      <h3 class="py-2 text-lg font-bold cursor-pointer" @click.stop="handleClick">{{ movie.title }}</h3>

      <!-- Movie overview with truncation and 'Read all' link -->
      <p class="flex-grow overflow-hidden">
        <template v-if="movie.overview">
          {{ truncateOverview(movie.overview, 113) }}
          <a @click="event => handleReadAllClick(event, movie)" class="text-blue-500 hover:underline">Read all</a>
        </template>
        <template v-else>
          No Overview Available
        </template>
      </p>

      <!-- Movie release year and trailer button -->
      <div class="mt-2 space-x-4">
        <p class="-mt-1 mb-2.5 text-gray-600">
          Release Year: {{ movie.release_date.substring(0, 4) || 'Not available' }}
        </p>
        <button @click="event => handleWatchTrailerClick(event, movie.id)"
          class="bg-blue-500 text-white px-2 py-2 rounded-lg hover:bg-blue-600 focus:outline-none"
          :class="{ 'bg-gray-400 text-gray-600 cursor-not-allowed hover:bg-gray-400': !movie.trailerAvailable }">
          {{ movie.trailerAvailable ? 'Watch Trailer' : 'Trailer Unavailable' }}
        </button>
      </div>
    </div>
  </div>

  <!-- Popups for movie overview and trailer -->
  <!-- Include transitions for smooth opening and closing of popups -->
  <!-- Movie overview popup -->
  <transition name="popup" enter-active-class="transition-transform transition-opacity duration-700 ease-out"
    leave-active-class="transition-transform transition-opacity duration-700 ease-in"
    enter-from-class="opacity-0 scale-90 rotate-3" enter-to-class="opacity-100 scale-100 rotate-0"
    leave-from-class="opacity-100 scale-100 rotate-0" leave-to-class="opacity-0 scale-90 rotate-3">
    <div v-if="showOverviewFlag" @click.stop
      class="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-10">
      <div class="bg-gray-800 p-5 rounded-lg shadow-lg text-center w-full md:w-1/2 lg:w-1/3">
        <h2 class="text-xl font-semibold text-white">Movie Overview</h2>
        <p class="mt-2 text-gray-300">{{ selectedMovieOverview }}</p>
        <button @click="event => closeOverview(event)"
          class="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300">
          Close
        </button>
      </div>
    </div>
  </transition>

  <!-- Movie trailer popup -->
  <transition name="popup" enter-active-class="transition-transform transition-opacity duration-700 ease-out"
    leave-active-class="transition-transform transition-opacity duration-700 ease-in"
    enter-from-class="opacity-0 scale-90 rotate-3" enter-to-class="opacity-100 scale-100 rotate-0"
    leave-from-class="opacity-100 scale-100 rotate-0" leave-to-class="opacity-0 scale-90 rotate-3">
    <div v-if="showTrailerFlag" @click.stop
      class="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-10">
      <div class="bg-gray-800 p-5 rounded-lg shadow-lg text-center w-full md:w-2/3 lg:w-1/2">
        <h2 class="text-xl font-semibold text-white">Movie Trailer</h2>
        <!-- Embedding YouTube trailer iframe -->
        <iframe :src="trailerUrl" class="mt-2 w-full h-64 md:h-96" frameborder="0" allowfullscreen></iframe>
        <button @click="event => closeTrailer(event)"
          class="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300">
          Close
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
// Script section for handling movie card logic
import { ref } from 'vue';
import posterNotAvailable from '../assets/poster_not_available.png';
import axiosClient from '../axiosClient.js';

// Defining props for the component
const props = defineProps({
  movie: Object
});

const emit = defineEmits(['click']);

// Refs for handling dynamic content and visibility of popups
const selectedMovieOverview = ref('');
const showOverviewFlag = ref(false);
let scrollPosition = 0;
const showTrailerFlag = ref(false);
const trailerUrl = ref('');

// Event handlers for various interactions within the card
function handleCardClick(event) {
  if (!event.target.closest('.do-not-trigger-modal')) {
    emit('click', props.movie.id);
  }
}

// Function to get the correct URL for the movie poster
function getMoviePosterUrl(posterPath) {
  return posterPath ? 'https://image.tmdb.org/t/p/w220_and_h330_face' + posterPath : posterNotAvailable;
}

// Function to truncate the movie overview text
function truncateOverview(text, maxLength) {
  return text.length <= maxLength ? text : text.slice(0, maxLength) + '...';
}

// Functions to show and close the full movie overview
function showFullOverview(movie) {
  scrollPosition = window.scrollY;
  selectedMovieOverview.value = movie.overview;
  showOverviewFlag.value = true;
}

function closeOverview(event) {
  showOverviewFlag.value = false;
  window.scrollTo(0, scrollPosition);
  if (event) event.stopPropagation();
}

// Functions to fetch, show, and close the movie trailer
function showTrailer() {
  fetchTrailerUrl(props.movie.id);
}

async function fetchTrailerUrl(movieId) {
  // Fetching and displaying the movie trailer
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

function closeTrailer(event) {
  showTrailerFlag.value = false;
  if (event) event.stopPropagation();
}

// Event handlers for reading full overview and watching the trailer
function handleClick() {
  emit('click', props.movie.id);
}

function handleReadAllClick(event, movie) {
  event.stopPropagation();
  showFullOverview(movie);
}

function handleWatchTrailerClick(event, movieId) {
  event.stopPropagation();
  showTrailer(movieId);
}

function closePopup() {
  showOverviewFlag.value = false;
  showTrailerFlag.value = false;
}
</script>

<!-- Styling section for the movie card -->
<style>
.movie-card:hover {
  /* Scales the card slightly on hover */
  transform: scale(1.05);
}

.movie-card::after {
  /* Shine effect */
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.3) 50%, transparent 100%);
  transition: left 0.7s ease;
}

.movie-card {
  position: relative;
  overflow: visible;
  /* Allow the shine effect to show */
  transition: transform 0.3s ease;
}

.movie-card:hover::after {
  /* Shine effect */
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.3) 50%, transparent 100%);
  animation: shine 0.7s ease-in-out forwards;
}

@keyframes shine {
  to {
    left: 100%;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>