<template>
  <div class="h-screen flex flex-col items-center justify-center bg-midnight text-white">
    <!-- Heading -->
    <h1 class="text-5xl font-poetic text-sun-gold mb-6">
      Welcome
    </h1>

    <p class="mb-8 text-lg text-slate-300 max-w-md text-center">
      Choose a quiz to begin your self-reflection journey.
    </p>

    <!-- Quiz buttons -->
    <div class="flex flex-col gap-4 w-64">
      <router-link
          to="/quiz/default"
          class="px-6 py-3 rounded-lg bg-slate-800 border border-slate-600 hover:bg-slate-700 transition text-center"
      >
        Elements Quiz
      </router-link>
      <router-link
          to="/quiz/enneagram"
          class="px-6 py-3 rounded-lg bg-slate-800 border border-slate-600 hover:bg-slate-700 transition text-center"
      >
        Enneagram Quiz
      </router-link>
    </div>
  </div>
</template>

