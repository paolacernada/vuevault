<template>
    <div class="flex justify-center p-8 pb-0 text-blue-500">
        <h1 class="text-4xl font-bold">Movies now playing in theatres</h1>
    </div>

    <!-- Right-aligned Dropdown for selecting day range -->
    <div class="flex justify-end my-4 pr-8">
        <select v-model="selectedDays" class="rounded dropdown border-blue-500 text-blue-500">
            <option value="7">Last 7 days</option>
            <option value="15">Last 15 days</option>
            <option value="30">Last 30 days</option>
        </select>
    </div>

    <!-- Loading Spinner -->
    <div v-if="isLoading" class="flex justify-center my-4">
        <div class="loader"></div>
    </div>

    <!-- No Movies Available Message -->
    <div v-if="!isLoading && moviesNowPlaying.length === 0" class="flex justify-center my-4">
        <span>No movies currently playing in theaters.</span>
    </div>

    <!-- Display Movies -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 p-8">
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
import { onMounted, ref, watch } from "vue";
import axiosClient from "../axiosClient.js";
import MovieCard from '../components/MovieCard.vue';

const moviesNowPlaying = ref([]);
const currentPage = ref(1);
const totalPages = ref(0);
const selectedDays = ref(15); // default value

const isLoading = ref(false);

onMounted(async () => {
    await fetchNowPlayingMovies();
});

watch(selectedDays, async () => {
    currentPage.value = 1;
    moviesNowPlaying.value = [];
    await fetchNowPlayingMovies();
}, { immediate: true });

async function fetchNowPlayingMovies() {
    isLoading.value = true; // Sets loading to true when fetching movies
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
    } finally {
        isLoading.value = false; // Sets loading to false after fetching is complete
    }
}

async function processMovies(movies) {
    const currentYear = new Date().getFullYear();
    const currentDate = new Date();

    return await Promise.all(movies.map(async (movie) => {
        const releaseDate = new Date(movie.release_date);
        const differenceInDays = daysBetweenDates(currentDate, releaseDate);

        if (releaseDate.getFullYear() == currentYear && differenceInDays <= selectedDays.value) {
            return {
                ...movie,
                trailerAvailable: await checkTrailerAvailability(movie.id)
            };
        }
        return null;
    })).then(movies => movies.filter(movie => movie != null));
}

function daysBetweenDates(date1, date2) {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((date2 - date1) / oneDay));
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

<style>
.loader {
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top: 4px solid #3498db;
    width: 40px;
    height: 40px;
    animation: spin 2s linear infinite;
}

.dropdown {
    appearance: none;
    background-image: url('../assets/down-arrow-svgrepo-com.svg');
    background-position: right 0.5rem center;
    background-size: 13%;
    padding-right: 2rem;

}

/* This part ensures the dropdown arrow is visible across browsers */
.dropdown::-ms-expand {
    display: none;
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