// Importing the necessary modules and components
import { createApp } from "vue" // Vue 3's createApp function
import router from "./router" // Router instance from router/index.js
import store from "./store" // Vuex store instance from store/index.js
import "./style.css" // Global styles for the application
import App from "./App.vue" // The root component of the Vue application

// Creating a Vue application instance with the root component App.vue
createApp(App)
    .use(router) // Integrating the Vue Router for handling routing
    .use(store) // Integrating the Vuex store for state management
    .mount("#app") // Mounting the app to the DOM element with id 'app'
