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
        let movies = response.data.results;

        // Fetch releases for each movie and filter out 'NC-17' rated movies
        const filteredMovies = [];
        for (const movie of movies) {
            const releasesResponse = await axiosClient.get(`movie/${movie.id}/releases`);
            const releases = releasesResponse.data.countries;

            // Find US certification
            const usRelease = releases.find(release => release.iso_3166_1 === 'US');
            if (usRelease && usRelease.certification !== 'NC-17') {
                filteredMovies.push(movie);
            }
        }

        // Initialize trailer availability for each movie
        const trailerChecks = filteredMovies.map((movie) => checkTrailerAvailability(movie));
        await Promise.all(trailerChecks);

        commit("setSearchedMovies", filteredMovies);
    } catch (error) {
        console.error('Error searching movies:', error);
    }
}

export async function searchMoviesByLetter({ commit }, letter) {
    try {
        const response = await axiosClient.get(`search/movie?query=${letter}`);
        let movies = response.data.results;

        // Filter movies starting with the selected letter
        movies = movies.filter(movie => movie.title && movie.title.startsWith(letter));

        // Fetch releases for each movie and filter out 'NC-17' rated movies
        const filteredMovies = [];
        for (const movie of movies) {
            const releasesResponse = await axiosClient.get(`movie/${movie.id}/releases`);
            const releases = releasesResponse.data.countries;

            // Find US certification
            const usRelease = releases.find(release => release.iso_3166_1 === 'US');
            if (usRelease && usRelease.certification !== 'NC-17') {
                filteredMovies.push(movie);
            }
        }

        // Initialize trailer availability for each movie
        const trailerChecks = filteredMovies.map(movie => checkTrailerAvailability(movie));
        await Promise.all(trailerChecks);

        // Sort movies alphabetically by title
        filteredMovies.sort((a, b) => a.title.localeCompare(b.title));

        commit("setMoviesByLetter", filteredMovies);
    } catch (error) {
        console.error('Error searching movies by letter:', error);
    }
}

export async function searchMoviesByCast({ commit }, cast) {
    try {
        const response = await axiosClient.get(`search/person?query=${cast}`);
        const persons = response.data.results;

        // Take only the first person's results
        let movies = persons.length > 0 ? persons[0].known_for : [];

        // Fetch releases for each movie and filter out 'NC-17' rated movies
        const filteredMovies = [];
        for (const movie of movies) {
            const releasesResponse = await axiosClient.get(`movie/${movie.id}/releases`);
            const releases = releasesResponse.data.countries;

            // Find US certification
            const usRelease = releases.find(release => release.iso_3166_1 === 'US');
            if (usRelease && usRelease.certification !== 'NC-17') {
                filteredMovies.push(movie);
            }
        }

        // Initialize trailer availability for each movie
        const trailerChecks = filteredMovies.map(movie => checkTrailerAvailability(movie));
        await Promise.all(trailerChecks);

        commit("setMoviesByCast", filteredMovies);
    } catch (error) {
        console.error('Error searching movies by cast:', error);
    }
}

