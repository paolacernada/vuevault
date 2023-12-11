<template>
  <!-- Main layout template of the application -->
  <!-- Including the NavBar component at the top of the page -->
  <NavBar />

  <!-- Main content area -->
  <main class="bg-gray-900 text-white min-h-screen">
    <!-- Container for the content, centered with padding -->
    <div class="container mx-auto px-5 py-8">
      <!-- Router view placeholder, where nested routes/components will be displayed -->
      <router-view />
    </div>
  </main>
</template>
  
<script setup>
// Importing the NavBar component to be used in this layout.
import NavBar from '../components/NavBar.vue'
</script>
