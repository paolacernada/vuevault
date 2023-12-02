export function setSearchedMovies(state, movies) {
    state.searchedMovies = movies;
}

export function setMoviesByLetter(state, movies) {
    state.moviesByLetter = movies;
}

export function setMoviesByCast(state, movies) {
    state.moviesByCast = movies;
}

// Separate mutations for setting last search query for title and cast
export function setLastSearchQueryByTitle(state, query) {
    state.lastSearchQueryByTitle = query;
}

export function setLastSearchQueryByCast(state, query) {
    state.lastSearchQueryByCast = query;
}

export function setSearchPerformed(state, value) {
    state.searchPerformed = value;
}

// Separate mutations for setting isLoading for title and cast
export function setIsLoadingByTitle(state, isLoading) {
    state.isLoadingByTitle = isLoading;
}

export function setIsLoadingByCast(state, isLoading) {
    state.isLoadingByCast = isLoading;
}
