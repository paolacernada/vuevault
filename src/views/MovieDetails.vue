<template>
    <div class="w-[800px] mx-auto">
        <pre>{{ movie }}</pre>
        <h1 class="text-5xl font-bold mb-5">{{ movie.title }}</h1>
        <img :src="getMoviePosterUrl(movie.poster_path)" :alt="movie.title" class="rounded-t-xl w-44 h-60 object-fill" />
        <div class="grid grid-cols-1 md:grid-cols-3 text-lg py-2">
            <div>
                <strong class="font-bold">Release Date:</strong> {{ formatDate(movie.release_date) }}
            </div>

            <div v-if="movie.genres">
                <strong class="font-bold">Genres:</strong> {{ movie.genres ? movie.genres.map(genre => genre.name).join(', ') : '' }}
            </div>

            <div>
                <strong class="font-bold">Runtime:</strong> {{ formatRuntime(movie.runtime) }}
            </div>
        </div>
    </div>

</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import axiosClient from "../axiosClient";
import posterNotAvailable from '../assets/poster_not_available.png';

const route = useRoute();
const movie = ref({ genres: [] }); // Initialize genres as an empty array

onMounted(() => {
    axiosClient.get(`/movie/${route.params.id}`)
    .then(({ data }) => {
        debugger;
        movie.value = data || {}
    })
})

function getMoviePosterUrl(posterPath) {
  if (posterPath) {
    return 'https://image.tmdb.org/t/p/w220_and_h330_face' + posterPath;
  } else {
    return posterNotAvailable;
  }
}

function formatDate(date) {
  if (!date) return '';
  const [year, month, day] = date.split('-');
  return `${month}/${day}/${year}`;
}

function formatRuntime(runtime) {
  if (!runtime) return 'Not Available';
  // Calculate hours and minutes from runtime
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  return `${hours}h ${minutes}m`;
}

</script>