<template>
  <transition name="popup" enter-active-class="transition-transform transition-opacity duration-700 ease-out"
    leave-active-class="transition-transform transition-opacity duration-700 ease-in"
    enter-from-class="opacity-0 scale-90 rotate-3" enter-to-class="opacity-100 scale-100 rotate-0"
    leave-from-class="opacity-100 scale-100 rotate-0" leave-to-class="opacity-0 scale-90 rotate-3">
    <div v-if="movieId" class="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center p-4 z-50">
      <div v-if="isLoading" class="loader"></div> <!-- Shows loader when loading -->
      <div v-else class="relative bg-gray-900 rounded-lg shadow-lg overflow-auto max-h-full p-4 text-white">

        <!-- Loading Indicator -->
        <div v-if="isLoading" class="flex justify-center items-center">
          <div class="loader"></div>
        </div>


        <!-- Movie Content -->
        <div v-else>
          <!-- Close button -->
          <button @click="closeModal"
            class="absolute top-4 right-4 bg-gray-700 text-gray-200 hover:bg-gray-600 p-2 rounded-full focus:outline-none">
            &times;
          </button>

          <!-- Movie title -->
          <h1 class="text-4xl md:text-5xl font-bold text-center mb-8">
            {{ movie.title }}
          </h1>

          <!-- Container for movie poster and movie details -->
          <div class="flex flex-col md:flex-row items-center justify-center gap-10">
            <div>
              <!-- Movie poster -->
              <img :src="getMoviePosterUrl(movie.poster_path)" :alt="movie.title"
                class="rounded-lg shadow-md w-44 h-60 object-cover mx-auto" />
            </div>

            <!-- Movie details: release date, genres, runtime -->
            <div class="bg-gray-800 rounded-lg shadow p-4 space-y-4 w-full md:w-2/5">
              <!-- Release Date -->
              <div class="text-lg">
                <strong class="font-semibold">Release Date:</strong><br> {{ formatDate(movie.release_date) }}
              </div>

              <!-- Genres (displayed if available) -->
              <div class="text-lg">
                <strong class="font-semibold">Genres:</strong><br>
                <span v-if="movie.genres && movie.genres.length > 0">
                  {{ movie.genres.map(genre => genre.name).join(', ') }}
                </span>
                <span v-else>No Genre Info Available</span>
              </div>

              <!-- Runtime -->
              <div class="text-lg">
                <strong class="font-semibold">Runtime:</strong><br> {{ formatRuntime(movie.runtime) }}
              </div>
            </div>
          </div>

          <!-- Watch Providers section -->
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
            <!-- Message displayed if no watch providers are available -->
            <div v-else class="text-center">
              No streaming services available.
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
  
<script setup>
import { ref, watch } from 'vue';
import axiosClient from '../axiosClient';
import posterNotAvailable from '../assets/poster_not_available.png';

const props = defineProps({
  movieId: Number
});
const emit = defineEmits(['close']);
const movie = ref(null);
const watchProviders = ref([]);
const isLoading = ref(false);

watch(() => props.movieId, async (newMovieId) => {
  if (newMovieId) {
    isLoading.value = true;
    movie.value = null; // Reset movie data
    watchProviders.value = []; // Reset watch providers
    await openModal(newMovieId);
  }
}, { immediate: true });

const openModal = async (movieId) => {
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

const closeModal = () => {
  movie.value = null; // Reset movie data on close
  watchProviders.value = []; // Reset watch providers
  emit('close');
};
function getMoviePosterUrl(posterPath) {
  // Returns URL for movie poster or a placeholder if not available
  return posterPath ? 'https://image.tmdb.org/t/p/original' + posterPath : posterNotAvailable;
}

function formatDate(date) {
  // Format date string to MM/DD/YYYY format
  if (!date) return '';
  const [year, month, day] = date.split('-');
  return `${month}/${day}/${year}`;
}
function formatRuntime(runtime) {
  // Convert runtime in minutes to hours and minutes
  if (!runtime) return 'Not Available';
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  return `${hours}h ${minutes}m`;
}

function getImageUrl(path) {
  // Returns URL for the image
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