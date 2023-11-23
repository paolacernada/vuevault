export function setSearchedMovies(state, movies) {
    state.searchedMovies = movies
}
export function setMoviesByLetter(state, movies) {
    state.moviesByLetter = movies
}
export function setMoviesByCast(state, movies) {
    state.moviesByCast = movies
}
export function setLastSearchQuery(state, query) {
    state.lastSearchQuery = query;
}
export function setSearchPerformed(state, value) {
    state.searchPerformed = value;
}
export function setIsLoading(state, isLoading) {
    state.isLoading = isLoading;
}