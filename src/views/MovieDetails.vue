<template>
  <!-- Main container with a fixed width and centered -->
  <div class="max-w-4xl mx-auto p-4 bg-white shadow-lg rounded-lg mt-4 mb-4">

    <!-- Button to navigate back to the previous page -->
    <button @click="goBack" class="mb-6 text-lg font-semibold text-blue-700 hover:text-blue-900">
      ← Back to List
    </button>

    <!-- Movie title -->
    <h1 class="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-8">
      {{ movie.title }}
    </h1>

    <!-- Container for movie poster and movie details -->
    <div class="flex flex-row items-start justify-center ml-20">
      <div>
        <!-- Movie poster -->
        <img :src="getMoviePosterUrl(movie.poster_path)" :alt="movie.title"
          class="rounded-lg shadow-md w-44 h-60 object-cover mx-auto mr-5" />
      </div>

      <!-- Movie details: release date, genres, runtime -->
      <div class="flex flex-col bg-gray-100 rounded-lg shadow p-4 space-y-5 w-2/5 max-w-sm md:max-w-lg mr-10">

        <!-- Release Date -->
          <div class="ml-3 text-lg">
            <strong class="font-semibold">Release Date:</strong><br> {{ formatDate(movie.release_date) }}
          </div>

          <!-- Genres (displayed if available) -->
          <div class="ml-3 text-lg">
            <strong class="font-semibold">Genres:</strong><br>
            <span v-if="movie.genres && movie.genres.length > 0">
              {{ movie.genres.map(genre => genre.name).join(', ') }}
            </span>
            <span v-else class="text-gray-600">No Genre Info Available</span>
          </div>

          <!-- Runtime -->
          <div class="ml-3 text-lg">
            <strong class="font-semibold">Runtime:</strong><br> {{ formatRuntime(movie.runtime) }}
          </div>

      </div>
    </div>

    <!-- Watch Providers section -->
    <div class="mb-8">
      <hr class="mt-10">
      <h2 class="text-2xl text-center font-semibold mt-8 mb-4 text-gray-800">Where to Watch</h2>

      <div v-if="watchProviders.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div v-for="provider in watchProviders" :key="provider.provider_id"
          class="flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow">
          <img :src="getImageUrl(provider.logo_path)" :alt="provider.provider_name"
            class="w-24 h-24 rounded-md object-contain mb-2">
          <p class="text-sm font-medium text-center">{{ provider.provider_name }}</p>
        </div>
      </div>
      <!-- Message displayed if no watch providers are available -->
      <div v-else class="text-center text-gray-900">
        No streaming services available.
      </div>
    </div>
  </div>
</template>

<script setup>

import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import axiosClient from "../axiosClient";
import posterNotAvailable from '../assets/poster_not_available.png';

// Using Vue Router to access route and router instances
const route = useRoute();
const router = useRouter();

// Reactive states for movie and watch providers
const movie = ref({ genres: [] }); // Initialize genres as an empty array
const watchProviders = ref([]);

// Fetch movie details and watch providers on component mount
onMounted(async () => {
  // Fetch movie details
  axiosClient.get(`/movie/${route.params.id}`)
    .then(({ data }) => {
      movie.value = data || {}
    })
  // Fetch watch providers
  try {
    const watchProviderResponse = await axiosClient.get(`/movie/${route.params.id}/watch/providers`);
    const providersData = watchProviderResponse.data.results.US?.flatrate || [];
    watchProviders.value = providersData;
  } catch (error) {
    console.error("Error fetching watch providers:", error);
  }
});

function getMoviePosterUrl(posterPath) {
  // Returns URL for movie poster or a placeholder if not available
  return posterPath ? 'https://image.tmdb.org/t/p/original' + posterPath : posterNotAvailable;
}

function formatDate(date) {
  // Formats date string to MM/DD/YYYY format
  if (!date) return '';
  const [year, month, day] = date.split('-');
  return `${month}/${day}/${year}`;
}

function formatRuntime(runtime) {
  // Converts runtime in minutes to hours and minutes
  if (!runtime) return 'Not Available';
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  return `${hours}h ${minutes}m`;
}

function getImageUrl(path) {
  // Returns URL for the image
  return `https://image.tmdb.org/t/p/w500${path}`;
}

function goBack() {
  // Navigates back to the previous page
  router.back();
}
</script>
