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
  
        <!-- Fullscreen Navigation Links -->
        <nav class="hidden md:flex items-center gap-4">
            <router-link :to="{ name: 'byTitle' }"
                class="text-sm font-medium text-gray-300 rounded-md hover:bg-blue-600 hover:text-white transition-colors">
                Search Movies
            </router-link>
            <router-link :to="{ name: 'byLetter' }"
                class="text-sm font-medium text-gray-300 rounded-md hover:bg-blue-600 hover:text-white transition-colors">
                Featured Movies
            </router-link>
            <router-link :to="{ name: 'byCast' }"
                class="text-sm font-medium text-gray-300 rounded-md hover:bg-blue-600 hover:text-white transition-colors">
                Movies By Cast
            </router-link>
        </nav>

        <!-- Mobile Navigation Links -->
        <nav :class="isMenuOpen ? 'flex' : 'hidden'" class="flex-col md:hidden absolute top-16 left-0 w-full bg-gray-800 z-10">
            <router-link :to="{ name: 'byTitle' }" @click="isMenuOpen = false"
                class="block px-4 py-2 text-gray-300 rounded-md hover:bg-blue-600 hover:text-white transition-colors">
                Search Movies
            </router-link>
            <router-link :to="{ name: 'byLetter' }" @click="isMenuOpen = false"
                class="block px-4 py-2 text-gray-300 rounded-md hover:bg-blue-600 hover:text-white transition-colors">
                Featured Movies
            </router-link>
            <router-link :to="{ name: 'byCast' }" @click="isMenuOpen = false"
                class="block px-4 py-2 text-gray-300 rounded-md hover:bg-blue-600 hover:text-white transition-colors">
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
@media (min-width: 768px) {
  header {
    height: auto;
    padding: 0.5rem;
  }
  .logo, .nav-links {
    flex: 1;
  }
  .nav-links {
    justify-self: end;
    align-items: center;
  }
  .nav-links a {
    padding: 0.5rem 1rem;
  }
}
  </style>
  