<template>
  <div class="flex justify-center p-8 pb-0">
    <input type="text" v-model="keyword" @change="handleInput"
      class="border-none w-1/2 p-2 rounded-full shadow-md focus:shadow-xl hover:shadow-lg focus:ring focus:ring-gray-200"
      :placeholder="placeholder" />
  </div>
</template>
  
<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: 'Search'
    }
  },
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
  