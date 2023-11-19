<template>
    <div class="flex flex-col p-8">

        <!-- Alphabet Navigation -->
        <AlphabetNav />

    </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import store from "../store";
import axiosClient from "../axiosClient.js";
import AlphabetNav from "../components/AlphabetNav.vue";


const movieCast = ref([])

onMounted(async () => {
    const response = await axiosClient.get("search/movie?query=")
    console.log(response.json)
    movieCast.value = response.data
})

</script>