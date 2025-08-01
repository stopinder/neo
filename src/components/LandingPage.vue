<template>
  <div class="min-h-screen bg-gradient-to-br from-[#1e2a3a] to-[#2f3e58] text-white font-body px-6 py-20 flex flex-col items-center justify-center space-y-12">
    <h1 class="text-5xl md:text-6xl font-display text-center leading-tight text-white drop-shadow-lg">
      Constellation Mapping
    </h1>
    <p class="text-lg md:text-xl max-w-2xl text-center text-sky-200">
      Explore the layered voices within you. Hold up a symbolic mirror to your inner world through a series of imaginal questions. As you move through patterns, parts, and potentials, a resonant portrait begins to emerge—woven from archetypes, emotion, and meaning.
    </p>
    <router-link to="/quiz">
      <button class="bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-8 py-4 rounded-full shadow-lg transition">
        Start My Inner Journey
      </button>
    </router-link>
  </div>
</template>

<script setup>
// No logic needed
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Playfair+Display:wght@600&display=swap');
</style>
