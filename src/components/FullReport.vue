<script setup>
import { useRoute } from "vue-router"
import { quizConfig } from "../data/quizConfig.js"
import { ref, onMounted } from "vue"
import { generateReport } from "../services/gptService.js"

const route = useRoute()
const quizType = route.query.quizType || "default"
const quiz = quizConfig[quizType] || quizConfig.default
const answers = JSON.parse(route.query.answers || "[]")

const reportText = ref("Generating your reflective report...")
const loading = ref(true)

onMounted(async () => {
  try {
    // Call GPT service
    const result = await generateReport(quizType, answers)
    reportText.value = result
  } catch (e) {
    console.error(e)
    reportText.value = "There was a problem generating your report. Please try again."
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen flex flex-col items-center bg-midnight text-white p-6">
    <div class="w-full max-w-3xl bg-slate-800 border border-slate-600 rounded-lg p-8">
      <!-- Title -->
      <h1 class="text-3xl font-poetic text-sun-gold mb-4">{{ quiz.title }} Report</h1>
      <p class="text-slate-300 mb-6">{{ quiz.description }}</p>

      <!-- Report body -->
      <div v-if="loading" class="text-slate-400 italic">Loading...</div>
      <div v-else v-html="reportText" class="prose prose-invert prose-slate max-w-none"></div>

      <!-- Restart -->
      <div class="mt-8 flex justify-center">
        <router-link
            to="/"
            class="px-4 py-2 bg-slate-700 border border-slate-600 rounded hover:bg-slate-600"
        >
          Restart Quiz
        </router-link>
      </div>
    </div>
  </div>
</template>

