<script setup>
import { ref } from "vue"
import { useRouter, useRoute } from "vue-router"
import { quizConfig } from "../data/quizConfig.js"

const router = useRouter()
const route = useRoute()

const quizType = route.params.type || "default"
const quiz = quizConfig[quizType] || quizConfig.default

const current = ref(0)
const answers = ref([])

function selectAnswer(value) {
  answers.value[current.value] = value
}

function next() {
  if (current.value < quiz.questions.length - 1) {
    current.value++
  } else {
    router.push({
      name: "Report",
      query: { answers: JSON.stringify(answers.value), quizType },
    })
  }
}

function back() {
  if (current.value > 0) current.value--
}
</script>

<template>
  <div class="h-screen flex flex-col items-center justify-center bg-midnight text-white p-6">
    <div v-if="quiz.questions.length" class="w-full max-w-xl bg-slate-800 border border-slate-600 rounded-lg p-6">
      <!-- Quiz title -->
      <h1 class="text-3xl font-poetic text-sun-gold mb-4">{{ quiz.title }}</h1>

      <!-- Question text -->
      <h2 class="text-xl mb-6">{{ quiz.questions[current].text }}</h2>

      <!-- Options -->
      <div class="flex flex-col gap-3 mb-6">
        <button
            v-for="opt in quiz.questions[current].options"
            :key="opt.value"
            @click="selectAnswer(opt.value)"
            class="px-4 py-2 rounded border border-slate-600 bg-slate-700 hover:bg-slate-600 transition text-left"
            :class="answers[current] === opt.value ? 'bg-sun-gold text-ink-night font-semibold' : ''"
        >
          {{ opt.text }}
        </button>
      </div>

      <!-- Navigation -->
      <div class="flex justify-between">
        <button
            @click="back"
            :disabled="current === 0"
            class="px-4 py-2 bg-slate-700 border border-slate-600 rounded hover:bg-slate-600 disabled:opacity-40"
        >
          Back
        </button>
        <button
            @click="next"
            class="px-4 py-2 bg-sun-gold text-ink-night rounded hover:bg-slate-300"
        >
          {{ current === quiz.questions.length - 1 ? "Finish" : "Next" }}
        </button>
      </div>
    </div>
    <div v-else>
      <p>No questions found for "{{ quizType }}".</p>
    </div>
  </div>
</template>
