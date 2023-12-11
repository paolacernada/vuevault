<template>
  <!-- Container for the search input -->
  <div class="flex justify-center p-8 pb-0">
    <!-- Search input field -->
    <input type="text" v-model="keyword" @change="handleInput"
      class="w-full md:w-1/2 lg:w-1/3 p-2 rounded-full shadow-md focus:shadow-lg hover:shadow-lg focus:ring focus:ring-blue-500 bg-gray-800 text-white placeholder-gray-400"
      :placeholder="placeholder" />
  </div>
</template>
  
<script>
export default {
  // Component properties
  props: {
    // Placeholder text for the search input, with a default value
    placeholder: {
      type: String,
      default: 'Search'
    }
  },
  data() {
    return {
      keyword: '', // Data model for the search input
    };
  },
  methods: {
    // Method to handle input changes and emit an event
    handleInput() {
      // Emitting a custom event with the current keyword
      this.$emit('search', this.keyword);
    },
  },
};
</script>
