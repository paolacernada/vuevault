<template>
    <div class="flex flex-col p-8 pb-0">
      <input
        type="text"
        v-model="keyword"
        @change="handleInput"
        class="border-none w-full p-2 rounded-full shadow-md focus:shadow-xl hover:shadow-lg focus:ring focus:ring-gray-200"
        placeholder="Search for Movies"
      />
    </div>
  </template>
  
  <script>
  export default {
    name: 'MovieSearch',
    data() {
      return {
        keyword: '',
      };
    },
    methods: {
      handleInput() {
        this.$emit('search', this.keyword);
      },
    },
  };
  </script>
  