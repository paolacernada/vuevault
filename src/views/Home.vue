<template>
    <div class="flex flex-col p-8 text-blue-500">
        <h1 class="text-4xl font-bold mb-4">Movies now playing in theatres</h1>
    </div>

    <!-- Display Movies -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <MovieCard v-for="movie in moviesNowPlaying" :key="movie.id" :movie="movie" />
    </div>

    <div class="flex justify-center mt-6">
        <!-- Load More Button -->
        <button v-if="totalPages > currentPage" @click="loadMoreMovies"
            class="w-1/4 px-4 py-2 bg-blue-500 text-white rounded-lg focus:outline-none hover:bg-blue-600 transition-all">
            Load More
        </button>
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import axiosClient from "../axiosClient.js";
import MovieCard from '../components/MovieCard.vue';

const moviesNowPlaying = ref([]);
const currentPage = ref(1);
const totalPages = ref(0);

const currentYear = new Date().getFullYear();

onMounted(async () => {
    await fetchNowPlayingMovies();
});

async function fetchNowPlayingMovies() {
    try {
        const response = await axiosClient.get("/movie/now_playing", {
            params: { page: currentPage.value }
        });
        const movies = response.data.results;
        const processedMovies = await processMovies(movies);
        moviesNowPlaying.value = [...moviesNowPlaying.value, ...processedMovies];

        totalPages.value = response.data.total_pages;
    } catch (error) {
        console.error("Error fetching now playing movies:", error);
    }
}

async function processMovies(movies) {
    return await Promise.all(
        movies
        .filter(movie => new Date(movie.release_date).getFullYear() === currentYear)
        .map(async (movie) => {
        return {
            ...movie,
            trailerAvailable: await checkTrailerAvailability(movie.id)
        };
    }));
}

async function checkTrailerAvailability(movieId) {
    try {
        const response = await axiosClient.get(`/movie/${movieId}/videos`);
        const videos = response.data.results;
        const trailerVideo = videos.find(video => video.type === 'Trailer' && video.site === 'YouTube');
        return !!trailerVideo;
    } catch (error) {
        console.error('Error checking trailer availability:', error);
        return false;
    }
}

function loadMoreMovies() {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
        fetchNowPlayingMovies();
    }
}
</script>