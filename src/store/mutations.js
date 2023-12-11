// Mutations for updating various parts of the Vuex state

// Sets the movies found by a title search
export function setSearchedMovies(state, movies) {
    // Updates the state with the list of movies found
    state.searchedMovies = movies;
}

// Sets the movies sorted by letter
export function setMoviesByLetter(state, movies) {
    // Updates the state with the list of movies sorted alphabetically by a specific letter
    state.moviesByLetter = movies;
}

// Sets the movies associated with a specific cast member
export function setMoviesByCast(state, movies) {
    // Updates the state with the list of movies related to a particular cast member
    state.moviesByCast = movies;
}

// Sets the last search query used in the title search
export function setLastSearchQueryByTitle(state, query) {
    // Stores the last query used to search movies by title
    state.lastSearchQueryByTitle = query;
}

// Sets the last search query used in the cast search
export function setLastSearchQueryByCast(state, query) {
    // Stores the last query used to search movies by cast
    state.lastSearchQueryByCast = query;
}

// Sets a flag indicating whether a search has been performed
export function setSearchPerformed(state, value) {
    // Updates the state to indicate if a search action has been performed
    state.searchPerformed = value;
}

// Sets the loading state for title search
export function setIsLoadingByTitle(state, isLoading) {
    // Updates the state to reflect the loading status for title-based search
    state.isLoadingByTitle = isLoading;
}

// Sets the loading state for cast search
export function setIsLoadingByCast(state, isLoading) {
    // Updates the state to reflect the loading status for cast-based search
    state.isLoadingByCast = isLoading;
}
