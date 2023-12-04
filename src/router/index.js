import { createRouter, createWebHistory } from "vue-router"
import DefaultLayout from "../components/DefaultLayout.vue"
import Home from "../views/Home.vue"
import MoviesByTitle from "../views/MoviesByTitle.vue"
import MoviesByLetter from "../views/MoviesByLetter.vue"
import MoviesByCast from "../views/MoviesByCast.vue"

const routes = [
    {
        path: "/",
        component: DefaultLayout,
        children: [
            {
                path: "/",
                name: "home",
                component: Home,
            },
            {
                path: "/by-title/:title?",
                name: "byTitle",
                component: MoviesByTitle,
            },
            {
                path: "/by-letter/:letter?",
                name: "byLetter",
                component: MoviesByLetter,
            },
            {
                path: "/by-cast/:cast?",
                name: "byCast",
                component: MoviesByCast,
            },
        ]
    },
];


const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;