import axios from "axios";

export default axios.create({
    baseURL: "https://api.themoviedb.org/3",
    headers:{
        Accept: "application/json"
    },
    params: {
        api_key: "5c084284e8f87abbcc0dea174ab8e2b6"
    }
})