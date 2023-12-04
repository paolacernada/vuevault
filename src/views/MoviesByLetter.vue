<template>
    <div class="flex flex-col p-8">
        <!-- Alphabet Navigation -->
        <AlphabetNav />

        <!-- Loading Spinner -->
        <div v-if="isLoading" class="flex justify-center my-4">
            <div class="loader"></div>
        </div>

        <!-- Container for displaying movies -->
        <div v-if="!isLoading"
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 p-8">
            <!-- Loops through movies array and displays each movie using MovieCard component -->
            <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie" @click="showMovieDetails(movie.id)" />
        </div>
    </div>

    <!-- Movie Details Modal -->
    <MovieDetailsModal :movieId="selectedMovieId" :showModal="selectedMovieId !== null" @close="selectedMovieId = null" />
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import store from '../store';
import MovieCard from '../components/MovieCard.vue';
import AlphabetNav from "../components/AlphabetNav.vue";
import MovieDetailsModal from '../components/MovieDetailsModal.vue';

const route = useRoute();
const movies = computed(() => store.state.moviesByLetter);
const selectedMovieId = ref(null);

const isLoading = computed(() => store.state.isLoadingByLetter);

watch(route, () => {
    store.dispatch("searchMoviesByLetter", route.params.letter);
});

onMounted(() => {
    if (route.params.letter) {
        store.dispatch("searchMoviesByLetter", route.params.letter);
    }
});

const showMovieDetails = (movieId) => {
    selectedMovieId.value = movieId;
};
</script>
<style>
/* Loader styles */
.loader {
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top: 4px solid #331197;
    border-radius: 50%;
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
}</style>