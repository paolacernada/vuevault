<template>
  <!-- Container for the alphabet navigation -->
  <div class="flex flex-col justify-center gap-2 mt-2">
    <!-- Iterating over letter groups to create rows of alphabet letters -->
    <div v-for="(group, index) in letterGroups" :key="index" class="flex flex-wrap justify-center gap-2">
      <!-- Creating a navigational link for each letter in the group -->
      <router-link :to="{ name: 'byLetter', params: { letter } }" v-for="letter in group" :key="letter"
        class="px-3 py-1 rounded-full text-gray-700 hover:text-white hover:bg-gray-400 hover:-translate-y-2 hover:scale-110 transition duration-500 ease-in-out text-sm font-semibold text-xl tracking-wide">
        {{ letter }}
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AlphabetNav',
  computed: {
    // Computed property to divide the alphabet into groups for display.
    letterGroups() {
      const groups = [];
      // Splitting the alphabet into chunks of 13 letters each.
      for (let i = 0; i < this.letters.length; i += 13) {
        groups.push(this.letters.slice(i, i + 13));
      }
      return groups;
    }
  },
  data() {
    return {
      // Defining the list of letters to be used in the navigation.
      letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
    };
  },
};
</script>
