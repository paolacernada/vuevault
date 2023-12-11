// Importing necessary functions from vue-router and components for the routes
import { createRouter, createWebHistory } from "vue-router"
import DefaultLayout from "../components/DefaultLayout.vue"
import Home from "../views/Home.vue"
import MoviesByTitle from "../views/MoviesByTitle.vue"
import MoviesByLetter from "../views/MoviesByLetter.vue"
import MoviesByCast from "../views/MoviesByCast.vue"

// Define the routes for the application
const routes = [
    {
        // Base path that uses the DefaultLayout component
        path: "/",
        component: DefaultLayout,
        children: [
            {
                // Root path mapped to the Home component
                path: "/",
                name: "home",
                component: Home,
            },
            {
                // Route for searching movies by title
                path: "/by-title/:title?",
                name: "byTitle",
                component: MoviesByTitle,
            },
            {
                // Route for browsing movies by letter
                path: "/by-letter/:letter?",
                name: "byLetter",
                component: MoviesByLetter,
            },
            {
                // Route for finding movies by cast member
                path: "/by-cast/:cast?",
                name: "byCast",
                component: MoviesByCast,
            },
        ]
    },
];

// Creating the router instance with the defined routes
// Using createWebHistory for HTML5 history mode
const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Exporting the router for use in the Vue application
export default router;
