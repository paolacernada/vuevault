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
    commit('setIsLoadingByTitle', true);  // Start loading
    commit('setLastSearchQueryByTitle', keyword);

    try {
        const response = await axiosClient.get(`search/movie?query=${keyword}`);
        let movies = response.data.results;

        // Fetches releases for each movie and filter out 'NC-17' rated movies
        const filteredMovies = [];
        for (const movie of movies) {
            const releasesResponse = await axiosClient.get(`movie/${movie.id}/releases`);
            const releases = releasesResponse.data.countries;

            // Finds US certification
            const usRelease = releases.find(release => release.iso_3166_1 === 'US');
            if (usRelease && usRelease.certification !== 'NC-17') {
                filteredMovies.push(movie);
            }
        }

        // Initializes trailer availability for each movie
        const trailerChecks = filteredMovies.map((movie) => checkTrailerAvailability(movie));
        await Promise.all(trailerChecks);

        commit("setSearchedMovies", filteredMovies);
    } catch (error) {
        console.error('Error searching movies:', error);
    } finally {
        commit('setIsLoadingByTitle', false);  // End loading
    }
}

export async function searchMoviesByLetter({ commit }, letter) {
    try {
        const response = await axiosClient.get(`search/movie?query=${letter}`);
        let movies = response.data.results;

        // Filters movies starting with the selected letter
        movies = movies.filter(movie => movie.title && movie.title.startsWith(letter));

        // Fetches releases for each movie and filter out 'NC-17' rated movies
        const filteredMovies = [];
        for (const movie of movies) {
            const releasesResponse = await axiosClient.get(`movie/${movie.id}/releases`);
            const releases = releasesResponse.data.countries;

            // Finds US certification
            const usRelease = releases.find(release => release.iso_3166_1 === 'US');
            if (usRelease && usRelease.certification !== 'NC-17') {
                filteredMovies.push(movie);
            }
        }

        // Initializes trailer availability for each movie
        const trailerChecks = filteredMovies.map(movie => checkTrailerAvailability(movie));
        await Promise.all(trailerChecks);

        // Sorts movies alphabetically by title
        filteredMovies.sort((a, b) => a.title.localeCompare(b.title));

        commit("setMoviesByLetter", filteredMovies);
    } catch (error) {
        console.error('Error searching movies by letter:', error);
    }
}

export async function searchMoviesByCast({ commit }, cast) {
    commit("setIsLoadingByCast", true);
    commit("setLastSearchQueryByCast", cast);

    try {
        commit("setSearchPerformed", true);

        const response = await axiosClient.get(`search/person?query=${cast}`);
        const persons = response.data.results;

        // Converts query to lowercase for case-insensitive comparison
        const normalizedQuery = cast.toLowerCase();

        // Filters persons whose name matches the query and get their known_for movies
        let movies = persons
            .filter(person => person.name.toLowerCase().includes(normalizedQuery))
            .flatMap(person => person.known_for.filter(item => item.media_type === 'movie'));

        // Fetches releases for each movie and filter out 'NC-17' rated movies
        const filteredMovies = [];
        for (const movie of movies) {
            const releasesResponse = await axiosClient.get(`movie/${movie.id}/releases`);
            const releases = releasesResponse.data.countries;

            // Finds US certification
            const usRelease = releases.find(release => release.iso_3166_1 === 'US');
            if (usRelease && usRelease.certification !== 'NC-17') {
                filteredMovies.push(movie);
            }
        }

        // Initializes trailer availability for each movie
        const trailerChecks = filteredMovies.map(movie => checkTrailerAvailability(movie));
        await Promise.all(trailerChecks);

        commit("setMoviesByCast", filteredMovies);
    } catch (error) {
        console.error('Error searching movies by cast:', error);
    } finally {
        commit("setIsLoadingByCast", false);
    }
}

export async function resetCastSearchState({ commit }) {
    commit('setMoviesByCast', []); // Clears the moviesByCast state
    commit('setLastSearchQueryByCast', ''); // Resets the last search query for cast
    commit('setIsLoadingByCast', false); // Ensures loading state is reset
}

export async function resetTitleSearchState({ commit }) {
    commit('setSearchedMovies', []);
    commit('setLastSearchQueryByTitle', '');
    commit('setIsLoadingByTitle', false);
}
