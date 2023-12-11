<template>
    <!-- Main container for the MoviesByLetter page -->
    <div class="flex flex-col p-8">
        <!-- Alphabet Navigation Component -->
        <AlphabetNav />

        <!-- Loading Spinner displayed while movies are being fetched -->
        <div v-if="isLoading" class="flex justify-center my-4">
            <div class="loader"></div>
        </div>

        <!-- Container for displaying movies filtered by the selected letter -->
        <div v-if="!isLoading"
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 p-8">
            <!-- Loop through the movies array and display each movie using the MovieCard component -->
            <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie" @click="showMovieDetails(movie.id)" />
        </div>
    </div>

    <!-- Modal for displaying movie details -->
    <MovieDetailsModal :movieId="selectedMovieId" :showModal="selectedMovieId !== null" @close="selectedMovieId = null" />
</template>

<script setup>
// Script setup for MoviesByLetter.vue component
import { computed, ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import store from '../store';
import MovieCard from '../components/MovieCard.vue';
import AlphabetNav from "../components/AlphabetNav.vue";
import MovieDetailsModal from '../components/MovieDetailsModal.vue';

// Reactive state variables and computed properties
const route = useRoute();
const movies = computed(() => store.state.moviesByLetter);
const selectedMovieId = ref(null);
const isLoading = computed(() => store.state.isLoadingByLetter);

// Watcher for changes in the route
watch(route, () => {
    // Dispatch action to search movies by the selected letter
    store.dispatch("searchMoviesByLetter", route.params.letter);
});

// On component mount, trigger search if the route contains a letter parameter
onMounted(() => {
    if (route.params.letter) {
        store.dispatch("searchMoviesByLetter", route.params.letter);
    }
});

// Function to display movie details modal
const showMovieDetails = (movieId) => {
    selectedMovieId.value = movieId;
};
</script>

<style>
/* Styles for the loading spinner */
.loader {
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top: 4px solid #331197;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1.5s linear infinite;
}

@keyframes spin {

    /* Keyframes for the loader spin animation */
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>