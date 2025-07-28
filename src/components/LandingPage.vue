<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center text-center px-4">
    <div class="max-w-xl">
      <h1 class="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
        What if your inner voices had names?
      </h1>
      <p class="text-lg text-gray-600 mb-8">
        Discover your internal world through a 10-question quiz blending Enneagram and IFS.
      </p>
      <button
          @click="startQuiz"
          class="bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-semibold py-3 px-6 rounded-lg shadow-md transition"
      >
        Start Your Quiz
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const startQuiz = () => {
  router.push('/quiz')
}
</script>
