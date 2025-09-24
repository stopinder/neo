<!-- src/components/LandingPage.vue -->
<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-8 space-y-6">
    <h1 class="text-4xl font-bold">Welcome to Inner Alchemy</h1>
    <p class="text-slate-300">This is a simplified landing page for testing.</p>

    <router-link
        to="/quiz"
        class="px-6 py-3 rounded-lg bg-amber-600 hover:bg-amber-500 transition text-white font-semibold"
    >
      Begin Quiz
    </router-link>
  </div>
</template>

<script setup>
// no script needed for this minimal version
</script>

<style scoped>
/* minimal styling, no imports */
</style>
