<template>
  <!-- Modal transition for movie details -->
  <transition name="popup" enter-active-class="transition-transform transition-opacity duration-700 ease-out"
    leave-active-class="transition-transform transition-opacity duration-700 ease-in"
    enter-from-class="opacity-0 scale-90 rotate-3" enter-to-class="opacity-100 scale-100 rotate-0"
    leave-from-class="opacity-100 scale-100 rotate-0" leave-to-class="opacity-0 scale-90 rotate-3">

    <!-- Modal content -->
    <div v-if="movieId" class="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center p-4 z-50">

      <!-- Loading indicator shown while movie details are fetched -->
      <div v-if="isLoading" class="loader"></div>

      <!-- Movie details content -->
      <div v-else class="relative bg-gray-900 rounded-lg shadow-lg overflow-auto max-h-full p-4 text-white">

        <!-- Close button for the modal -->
        <button @click="closeModal"
          class="absolute top-4 right-4 bg-gray-700 text-gray-200 hover:bg-gray-600 p-2 rounded-full focus:outline-none">
          &times;
        </button>

        <!-- Movie title -->
        <h1 class="text-4xl md:text-5xl font-bold text-center mb-8">
          {{ movie.title }}
        </h1>

        <!-- Container for movie poster and details -->
        <div class="flex flex-col md:flex-row items-center justify-center gap-10">
          <div>
            <!-- Movie poster -->
            <img :src="getMoviePosterUrl(movie.poster_path)" :alt="movie.title"
              class="rounded-lg shadow-md w-44 h-60 object-cover mx-auto" />
          </div>

          <!-- Movie details: release date, genres, runtime -->
          <div class="bg-gray-800 rounded-lg shadow p-4 space-y-4 w-full md:w-2/5">
            <div class="text-lg">
              <strong class="font-semibold">Release Date:</strong><br> {{ formatDate(movie.release_date) }}
            </div>

            <div class="text-lg">
              <strong class="font-semibold">Genres:</strong><br>
              <span v-if="movie.genres && movie.genres.length > 0">
                {{ movie.genres.map(genre => genre.name).join(', ') }}
              </span>
              <span v-else>No Genre Info Available</span>
            </div>

            <div class="text-lg">
              <strong class="font-semibold">Runtime:</strong><br> {{ formatRuntime(movie.runtime) }}
            </div>
          </div>
        </div>

        <!-- Watch providers section -->
        <div class="mb-8">
          <hr class="my-10 border-gray-700">
          <h2 class="text-2xl text-center font-semibold mt-8 mb-4">Where to Watch</h2>
          <div v-if="watchProviders.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div v-for="provider in watchProviders" :key="provider.provider_id"
              class="flex flex-col items-center p-4 bg-gray-800 rounded-lg shadow">
              <img :src="getImageUrl(provider.logo_path)" :alt="provider.provider_name"
                class="w-24 h-24 rounded-md object-contain mb-2">
              <p class="text-sm">{{ provider.provider_name }}</p>
            </div>
          </div>
          <div v-else class="text-center">
            No streaming services available.
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
// Vue component setup for MovieDetailsModal
import { ref, watch } from 'vue';
import axiosClient from '../axiosClient';
import posterNotAvailable from '../assets/poster_not_available.png';

// Defining props for the component
const props = defineProps({
  movieId: Number
});
const emit = defineEmits(['close']);
const movie = ref(null);
const watchProviders = ref([]);
const isLoading = ref(false);

// Watcher to load movie details when movieId changes
watch(() => props.movieId, async (newMovieId) => {
  if (newMovieId) {
    isLoading.value = true;
    movie.value = null;
    watchProviders.value = [];
    await openModal(newMovieId);
  }
}, { immediate: true });

// Function to open the modal and fetch movie details
const openModal = async (movieId) => {
  // Fetching movie details and watch providers
  try {
    const movieResponse = await axiosClient.get(`/movie/${movieId}`);
    movie.value = movieResponse.data;
    const watchProviderResponse = await axiosClient.get(`/movie/${movieId}/watch/providers`);
    watchProviders.value = watchProviderResponse.data.results.US?.flatrate || [];
  } catch (error) {
    console.error("Error fetching movie details:", error);
  } finally {
    isLoading.value = false;
  }
};

// Function to close the modal
const closeModal = () => {
  movie.value = null;
  watchProviders.value = [];
  emit('close');
};

// Utility functions to format data for display
function getMoviePosterUrl(posterPath) {
  return posterPath ? 'https://image.tmdb.org/t/p/original' + posterPath : posterNotAvailable;
}
function formatDate(date) {
  if (!date) return '';
  const [year, month, day] = date.split('-');
  return `${month}/${day}/${year}`;
}
function formatRuntime(runtime) {
  if (!runtime) return 'Not Available';
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  return `${hours}h ${minutes}m`;
}
function getImageUrl(path) {
  return `https://image.tmdb.org/t/p/w500${path}`;
}

defineExpose({ openModal, closeModal });
</script>
  
<style>
/* Loader styles */
.loader {
  border: 4px solid rgba(255, 255, 255, 0.3);
  width: 50px;
  height: 50px;
  animation: spin 1.5s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>