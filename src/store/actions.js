import axiosClient from "../axiosClient";

// Helper function to check trailer availability
async function checkTrailerAvailability(movie) {
    try {
        const response = await axiosClient.get(`/movie/${movie.id}/videos`);
        const videos = response.data.results;
        const trailerVideo = videos.find((video) => video.type === 'Trailer' && video.site === 'YouTube');
        movie.trailerAvailable = !!trailerVideo;
    } catch (error) {
        console.error('Error checking trailer availability:', error);
        movie.trailerAvailable = false;
    }
}

export async function searchMovies({ commit }, keyword) {
    try {
        const response = await axiosClient.get(`search/movie?query=${keyword}`);
        const movies = response.data.results;

        // Initialize trailer availability for each movie
        const trailerChecks = movies.map((movie) => checkTrailerAvailability(movie));
        await Promise.all(trailerChecks);

        commit("setSearchedMovies", movies);
    } catch (error) {
        console.error('Error searching movies:', error);
    }
}
