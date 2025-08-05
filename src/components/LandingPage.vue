<template>
  <div class="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#2f3e58] to-[#1b1e33] text-white font-body px-6 py-16 flex flex-col items-center justify-center space-y-12 relative">

    <!-- Branding -->
    <a href="https://robormiston.com" target="_blank" rel="noopener noreferrer"
       class="absolute top-8 left-8 flex items-center space-x-3 text-sky-300 font-semibold text-lg hover:text-sky-100 transition group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sun-gold active:ring-0">
      <img src="/but.png" alt="Chrysalis Icon" class="w-12 h-12 transition-transform duration-300 group-hover:scale-105" />
      <span>Chrysalis Therapy Services</span>
    </a>

    <!-- Headline -->
    <h1 class="text-5xl md:text-6xl font-poetic text-center leading-tight text-white drop-shadow-lg">
      Discover Your Inner Constellation
    </h1>

    <!-- Subheadline -->
    <p class="text-xl font-body text-sky-300 text-center max-w-2xl">
      A unique psychological profile that mirrors your internal world — shaped by IFS, Enneagram, and relational patterns.
    </p>

    <!-- Visual markers of depth -->
    <div class="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 text-sky-soft text-center">
      <div>
        <p class="text-2xl">🛡</p>
        <p class="text-sm">Understand your protective parts</p>
      </div>
      <div>
        <p class="text-2xl">🌿</p>
        <p class="text-sm">Decode your instinctual drives</p>
      </div>
      <div>
        <p class="text-2xl">🔄</p>
        <p class="text-sm">Reveal your relational patterns</p>
      </div>
    </div>

    <!-- Soft urgency -->
    <p class="text-sky-200 text-sm italic">
      Takes less than 5 minutes. No signup required.
    </p>

    <!-- CTA -->
    <router-link to="/quiz">
      <button
          class="bg-[#b37c3e] hover:bg-[#93622f] text-white font-semibold px-8 py-4 rounded-full shadow-none outline-none border-none transition-all duration-300 focus:outline-none focus:ring-0 active:outline-none active:ring-0 focus-visible:outline-none"
          style="box-shadow: none !important;"
      >
        Reveal My Symbolic Profile
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
