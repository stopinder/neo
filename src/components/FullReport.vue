<script setup>
import { useRoute } from "vue-router"

const route = useRoute()
const answers = JSON.parse(route.query.answers || "[]")

// Basic scoring: count how often each value appears
function calculateResult(answers) {
  const tally = {}
  for (const ans of answers) {
    if (!tally[ans]) tally[ans] = 0
    tally[ans]++
  }
  // Pick the highest-scoring value
  let top = null
  let max = 0
  for (const key in tally) {
    if (tally[key] > max) {
      max = tally[key]
      top = key
    }
  }
  return { top, tally }
}

const result = calculateResult(answers)
</script>

<template>
  <div class="h-screen flex flex-col items-center justify-center bg-midnight text-white p-6">
    <h1 class="text-3xl font-bold mb-6">Your Results</h1>

    <div v-if="answers.length">
      <p class="mb-6 text-xl">
        Your dominant type:
        <span class="font-semibold text-indigo-400">{{ result.top }}</span>
      </p>

      <h2 class="text-lg font-bold mb-2">Breakdown:</h2>
      <ul class="space-y-2">
        <li v-for="(count, key) in result.tally" :key="key" class="p-2 rounded bg-slate-700">
          {{ key }} → {{ count }}
        </li>
      </ul>
    </div>
    <div v-else>
      <p>No answers recorded.</p>
    </div>

    <router-link to="/" class="mt-6 px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-700">
      Restart Quiz
    </router-link>
  </div>
</template>

