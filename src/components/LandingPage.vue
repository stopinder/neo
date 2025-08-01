<template>
  <div class="min-h-screen bg-gradient-to-br from-[#1e2a3a] to-[#2f3e58] text-white font-body px-6 py-20 flex flex-col items-center justify-center space-y-12">
    <h1 class="text-5xl md:text-6xl font-display text-center leading-tight text-white drop-shadow-lg">
      Inner Alchemy
    </h1>
    <p class="text-xl font-semibold text-sky-300 text-center">Decode your patterns. Reclaim your essence.</p>
    <p class="text-lg md:text-xl max-w-2xl text-center text-sky-200">
      Transform your psychological patterns into emotional clarity and relational gold. Inner Alchemy guides you through a poetic synthesis of depth psychology, symbolic insight, and relational dynamics — all drawn from your answers to a carefully designed quiz.
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
