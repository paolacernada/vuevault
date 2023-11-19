<template>
    <div class="flex justify-center gap-2 mt-2">
        <router-link
            :to="{name: 'byLetter', params: {letter}}"
            v-for="letter in letters"
            :key="letter"
            class="px-3 py-1 rounded-full text-gray-700 hover:text-white hover:bg-gray-900 transition duration-300 ease-in-out text-sm font-semibold tracking-wide"
        >
            {{ letter }}
        </router-link>
    </div>
</template>

<script>
export default {
  name: 'AlphabetNav',
  data() {
    return {
      letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
    };
  },
};
</script>