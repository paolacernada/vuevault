// Importing the Axios instance from the tmdb.js file
import tmdb from "./api/tmdb";

// Creating a customized Axios client
const axiosClient = tmdb.create({
  // Setting the base URL for the Axios client
  // The URL is retrieved from the environment variables for flexibility and security
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Exporting the customized Axios client
// This exported client can be used throughout the application to make HTTP requests to the API
export default axiosClient;
