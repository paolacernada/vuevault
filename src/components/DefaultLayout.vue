<template>
    <NavBar />
    <main class="bg-gray-900 text-white min-h-screen">
      <div class="container mx-auto px-5 py-8">
        <router-view />
      </div>
    </main>
  </template>
  
  <script setup>
  import NavBar from '../components/NavBar.vue'
  </script>
  