import tmdb from "./api/tmdb";

const axiosClient = tmdb.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export default axiosClient;
