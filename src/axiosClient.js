import tmdb from "./api/tmdb";

const axiosClient = tmdb.create({
    baseURL: 'https://api.themoviedb.org/3',
  });

export default axiosClient;
