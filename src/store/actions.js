import axiosClient from "../axiosClient";

// Helper function to check if a movie has a trailer available
async function checkTrailerAvailability(movie) {
    try {
        // Requesting video data for the movie
        const response = await axiosClient.get(`/movie/${movie.id}/videos`);
        const videos = response.data.results;

        // Checking for the presence of a trailer on YouTube
        const trailerVideo = videos.find((video) => video.type === 'Trailer' && video.site === 'YouTube');
        movie.trailerAvailable = !!trailerVideo;
    } catch (error) {
        console.error('Error checking trailer availability:', error);
        movie.trailerAvailable = false;
    }
}

// Action to search movies based on a keyword
export async function searchMovies({ commit }, keyword) {
    commit('setIsLoadingByTitle', true);  // Indicating the start of loading
    commit('setLastSearchQueryByTitle', keyword); // Storing the last search query

    try {
        // Fetching movies matching the search query
        const response = await axiosClient.get(`search/movie?query=${keyword}`);
        let movies = response.data.results;

        // Fetch releases for each movie and filtering out movies with 'NC-17' rating in the US
        const filteredMovies = [];
        for (const movie of movies) {
            const releasesResponse = await axiosClient.get(`movie/${movie.id}/releases`);
            const releases = releasesResponse.data.countries;
            const usRelease = releases.find(release => release.iso_3166_1 === 'US');
            if (usRelease && usRelease.certification !== 'NC-17') {
                filteredMovies.push(movie);
            }
        }

        // Checking trailer availability for each movie
        const trailerChecks = filteredMovies.map((movie) => checkTrailerAvailability(movie));
        await Promise.all(trailerChecks);

        commit("setSearchedMovies", filteredMovies); // Storing the filtered movies
    } catch (error) {
        console.error('Error searching movies:', error);
    } finally {
        commit('setIsLoadingByTitle', false);  // Indicating the end of loading
    }
}

// Action to search movies by the first letter of their title
export async function searchMoviesByLetter({ commit }, letter) {
    try {
        // Fetching movies that start with the specified letter
        const response = await axiosClient.get(`search/movie?query=${letter}`);
        let movies = response.data.results;

        // Filtering movies by the specified starting letter
        movies = movies.filter(movie => movie.title && movie.title.startsWith(letter));

        // Fetch releases for each movie and filtering out movies with 'NC-17' rating in the US
        const filteredMovies = [];
        for (const movie of movies) {
            const releasesResponse = await axiosClient.get(`movie/${movie.id}/releases`);
            const releases = releasesResponse.data.countries;
            const usRelease = releases.find(release => release.iso_3166_1 === 'US');
            if (usRelease && usRelease.certification !== 'NC-17') {
                filteredMovies.push(movie);
            }
        }

        // Checking trailer availability for each movie
        const trailerChecks = filteredMovies.map(movie => checkTrailerAvailability(movie));
        await Promise.all(trailerChecks);

        // Sort movies alphabetically by title
        filteredMovies.sort((a, b) => a.title.localeCompare(b.title));

        commit("setMoviesByLetter", filteredMovies); // Storing the filtered movies
    } catch (error) {
        console.error('Error searching movies by letter:', error);
    }
}

// Action to search movies based on a cast member's name
export async function searchMoviesByCast({ commit }, cast) {
    commit("setIsLoadingByCast", true);
    commit("setLastSearchQueryByCast", cast);

    try {
        commit("setSearchPerformed", true);

        const response = await axiosClient.get(`search/person?query=${cast}`);
        const persons = response.data.results;

        // Converts query to lowercase for case-insensitive comparison
        const normalizedQuery = cast.toLowerCase();

        // Filter persons whose name matches the query and get their known_for movies
        let movies = persons
            .filter(person => person.name.toLowerCase().includes(normalizedQuery))
            .flatMap(person => person.known_for.filter(item => item.media_type === 'movie'));

        // Fetch releases for each movie and filtering out movies with 'NC-17' rating in the US
        const filteredMovies = [];
        for (const movie of movies) {
            const releasesResponse = await axiosClient.get(`movie/${movie.id}/releases`);
            const releases = releasesResponse.data.countries;
            const usRelease = releases.find(release => release.iso_3166_1 === 'US');
            if (usRelease && usRelease.certification !== 'NC-17') {
                filteredMovies.push(movie);
            }
        }

        // Checking trailer availability for each movie
        const trailerChecks = filteredMovies.map(movie => checkTrailerAvailability(movie));
        await Promise.all(trailerChecks);

        commit("setMoviesByCast", filteredMovies); // Storing the filtered movies
    } catch (error) {
        console.error('Error searching movies by cast:', error);
    } finally {
        commit("setIsLoadingByCast", false);
    }
}

// Action to reset the search state for cast-based searches
export async function resetCastSearchState({ commit }) {
    commit('setMoviesByCast', []); // Clears the movies list
    commit('setLastSearchQueryByCast', ''); // Resets the last search query
    commit('setIsLoadingByCast', false); // Resets loading state
}

// Action to reset the search state for title-based searches
export async function resetTitleSearchState({ commit }) {
    commit('setSearchedMovies', []); // Clears the movies list
    commit('setLastSearchQueryByTitle', ''); // Resets the last search query
    commit('setIsLoadingByTitle', false); // Resets loading state
}
