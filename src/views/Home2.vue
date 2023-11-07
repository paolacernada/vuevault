<template>
    <div class="flex flex-col p-8">
      <div class="flex justify-center gap-2 mt-2">
        <span v-for="letter in letters" :key="letter">
          <a :href="`http://localhost:3000/by-title/${letter.toLowerCase()}`">{{ letter }}</a>
        </span>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axiosClient from '../axiosClient.js';
  
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const movieCast = ref([]);
  
  onMounted(async () => {
    try {
      const response = await axiosClient.get('search/movie?query=');
      movieCast.value = response.data; // Assign the data to movieCast
    } catch (error) {
      console.error(error); // Log the error if there is one
    }
  });
  </script>
  