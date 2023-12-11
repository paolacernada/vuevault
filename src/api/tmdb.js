// Importing the axios library for making HTTP requests.
import axios from "axios";

// Exporting a configured instance of axios.
export default axios.create({
    // Setting the base URL for all requests made using this instance.
    // This URL points to the version 3 of The Movie Database (TMDb) API.
    baseURL: "https://api.themoviedb.org/3",

    // Defining default headers for the requests.
    // 'Accept: application/json' tells the server to send data in JSON format.
    headers: {
        Accept: "application/json"
    },

    // Adding default parameters to each request.
    // 'api_key' is required for authentication with the TMDb API.
    params: {
        api_key: "5c084284e8f87abbcc0dea174ab8e2b6"
    }
})
