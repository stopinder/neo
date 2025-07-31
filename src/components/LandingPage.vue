<template>
  <div class="min-h-screen bg-gradient-to-br from-[#1e2a3a] to-[#2f3e58] text-white font-body px-6 py-20 flex flex-col items-center justify-center space-y-12">
    <h1 class="text-5xl md:text-6xl font-display text-center leading-tight text-white drop-shadow-lg">
      Discover Your Inner Cosmos
    </h1>
    <p class="text-lg md:text-xl max-w-2xl text-center text-sky-200">
      Begin a journey through personality, parts, and patterns. Our GPT-powered insight system reveals deep psychological maps across the Enneagram, Internal Family Systems, and Transactional Analysis.
    </p>
    <router-link to="/quiz">
      <button class="bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-8 py-4 rounded-full shadow-lg transition">
        Begin the Quiz
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
