<template>
    <header class="bg-gray-800 h-16 flex justify-between items-center px-5 shadow-md">
      <router-link :to="{ name: 'home' }" class="inline-flex items-center h-full">
        <img src="../assets/VueVault_logo.png" alt="VueVault Logo" class="h-12 mr-2">
        <span class="text-2xl text-white font-shrikhand">VueVault</span>
      </router-link>
  
      <!-- Hamburger Icon for Mobile -->
      <button @click="isMenuOpen = !isMenuOpen" class="md:hidden text-white focus:outline-none">
        <span :class="isMenuOpen ? 'hidden' : 'block'">&#9776; Menu</span>
        <span :class="isMenuOpen ? 'block' : 'hidden'">&times; Close</span>
      </button>
  
      <!-- Navigation Links -->
      <nav :class="isMenuOpen ? 'block' : 'hidden'" class="md:flex md:items-center gap-4 absolute md:relative top-16 left-0 w-full md:w-auto bg-gray-800 md:bg-transparent z-10">
        <router-link :to="{ name: 'byTitle' }" @click="isMenuOpen = false"
          class="block px-4 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-blue-600 hover:text-white transition-colors md:text-base">
          Search Movies
        </router-link>
  
        <router-link :to="{ name: 'byLetter' }" @click="isMenuOpen = false"
          class="block px-4 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-blue-600 hover:text-white transition-colors md:text-base">
          Featured Movies
        </router-link>
  
        <router-link :to="{ name: 'byCast' }" @click="isMenuOpen = false"
          class="block px-4 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-blue-600 hover:text-white transition-colors md:text-base">
          Movies By Cast
        </router-link>
      </nav>
    </header>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const isMenuOpen = ref(false);
  </script>
  
  <style>
  @media (max-width: 768px) {
    .header {
      flex-wrap: wrap;
    }
    .header .nav {
      order: 3;
      width: 100%;
      display: none;
    }
    .header .nav.show {
      display: block;
    }
  }
  </style>
  