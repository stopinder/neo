<template>
  <div class="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#2f3e58] to-[#1b1e33] text-white font-body px-6 py-16 flex flex-col items-center justify-center space-y-12 relative bg-fixed">

  <!-- Top Left Branding -->
    <a
        href="https://robormiston.com"
        target="_blank"
        rel="noopener noreferrer"
        class="absolute top-8 left-8 flex items-center space-x-3 text-sky-300 font-semibold text-lg hover:text-sky-100 transition group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sun-gold active:ring-0"
    >
      <img src="/but.png" alt="Chrysalis Icon" class="w-12 h-12 transition-transform duration-300 group-hover:scale-105" />
      <span>Chrysalis Therapy Services</span>
    </a>





    <!-- Headline with poetic font -->
    <h1 class="text-5xl md:text-6xl font-poetic text-center leading-tight text-white drop-shadow-lg">
      Discover Your Inner Landscape
    </h1>

    <!-- Subheadline with body font (optional: could also be poetic) -->
    <p class="text-xl font-semibold font-body text-sky-300 text-center">
      A symbolic synthesis of IFS, Enneagram, and Transactional Analysis — reflecting your unique inner world.
    </p>

    <!-- Main Description -->
    <p class="text-lg md:text-xl max-w-2xl font-body text-center text-sky-200">
      More than a personality test — this is a symbolic journey through the architecture of your psyche,
      revealing the deeper motives, roles, and dynamics that shape your life.
    </p>

    <!-- Call to Action -->
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
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Playfair+Display:wght@700&display=swap');
</style>
