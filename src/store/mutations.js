export function setSearchedMovies(state, movies) {
    state.searchedMovies = movies;
}

export function setMoviesByLetter(state, movies) {
    state.moviesByLetter = movies;
}

export function setMoviesByCast(state, movies) {
    state.moviesByCast = movies;
}

export function setLastSearchQueryByTitle(state, query) {
    state.lastSearchQueryByTitle = query;
}

export function setLastSearchQueryByCast(state, query) {
    state.lastSearchQueryByCast = query;
}

export function setSearchPerformed(state, value) {
    state.searchPerformed = value;
}

export function setIsLoadingByTitle(state, isLoading) {
    state.isLoadingByTitle = isLoading;
}

export function setIsLoadingByCast(state, isLoading) {
    state.isLoadingByCast = isLoading;
}
