<template>
  <div class="p-6 max-w-xl mx-auto text-center">
    <h2 class="text-2xl font-bold mb-4">Here's a sneak peek at your results</h2>
    <p class="text-gray-700">We’ve analyzed your responses. Curious what it all means?</p>
    <button
        class="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
        @click="goDeeper"
    >
      Unlock Your Full Report
    </button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const goDeeper = () => router.push('/extended-quiz')
</script>
