<template>
  <!-- Main container with a fixed width and centered -->
  <div class="w-[800px] mx-auto">

    <!-- Button to navigate back to the previous page -->
    <button @click="goBack" class="mb-4 text-lg font-semibold text-blue-600 hover:text-blue-800">
      ← Back
    </button>

    <!-- Movie title -->
    <h1 class="text-5xl font-bold text-center text-gray-800 mb-8">{{ movie.title }}</h1>
    
    <!-- Container for movie poster and movie details -->
    <div class="flex flex-col md:flex-row md:items-center gap-6 mb-6">
      <!-- Movie poster -->
      <img :src="getMoviePosterUrl(movie.poster_path)" :alt="movie.title" class="rounded-lg w-44 h-60 object-cover mx-auto" />
      
      <!-- Movie details: release date, genres, runtime -->
      <div class="grid grid-cols-1 md:grid-cols-3 text-lg gap-4">
        <!-- Release date -->
        <div>
          <strong class="font-bold">Release Date:</strong> {{ formatDate(movie.release_date) }}
        </div>

        <!-- Genres (displayed if available) -->
        <div v-if="movie.genres">
          <strong class="font-bold">Genres:</strong><br> {{ movie.genres ? movie.genres.map(genre => genre.name).join(', ') : '' }}
        </div>

        <!-- Runtime -->
        <div>
          <strong class="font-bold">Runtime:</strong><br> {{ formatRuntime(movie.runtime) }}
        </div>
      </div>
    </div>

    <!-- Watch Providers section -->
    <div class="my-8">
      <h2 class="text-2xl font-semibold mb-4 text-gray-700">Watch Providers</h2>
      <!-- Grid of watch providers (displayed if available) -->
      <div v-if="watchProviders.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div v-for="provider in watchProviders" :key="provider.provider_id" class="flex flex-col items-center">
          <!-- Provider name and logo -->
          <p class="text-sm font-medium mb-2">{{ provider.provider_name }}</p>
          <img :src="getImageUrl(provider.logo_path)" :alt="provider.provider_name" class="w-24 h-24 rounded-md object-contain border border-gray-300 shadow-sm">
        </div>
      </div>
      <!-- Message displayed if no watch providers are available -->
      <div v-else class="text-center text-gray-600">
        No information available.
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

// Utility functions for formatting data
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
