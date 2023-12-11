export default {
   // Array to store movies searched by title
   searchedMovies: [],

   // Array to store movies filtered by a specific letter
   moviesByLetter: [],

   // Array to store movies associated with a specific cast member
   moviesByCast: [],

   // String to hold the last search query used in the title search
   lastSearchQueryByTitle: '',

   // String to hold the last search query used in the cast search
   lastSearchQueryByCast: '',

   // Boolean to indicate whether a search has been performed
   searchPerformed: false,

   // Boolean to indicate loading status for title-based searches
   isLoadingByTitle: false,

   // Boolean to indicate loading status for cast-based searches
   isLoadingByCast: false,
}
