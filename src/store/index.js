// Importing necessary Vuex functions and store modules
import { createStore } from "vuex"
import state from "./state"
import * as actions from "./actions"
import * as mutations from "./mutations"
import * as getters from "./getters"

// Creating the Vuex store
const store = createStore({
    // Integrating the state object, which holds the application's state
    state,

    // Incorporating actions, which are asynchronous functions to handle side effects and commit mutations
    actions,

    // Adding mutations, which are synchronous functions to modify the state
    mutations,

    // Including getters, which are functions to derive and compute state values
    getters,
})

// Exporting the Vuex store for use across the Vue application
export default store;
