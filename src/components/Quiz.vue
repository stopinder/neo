<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { questions } from "../data/questions.js"

const router = useRouter()
const current = ref(0)
const answers = ref([])

function selectAnswer(value) {
  answers.value[current.value] = value
}

function next() {
  if (current.value < questions.length - 1) {
    current.value++
  } else {
    router.push({
      name: "Report",
      query: { answers: JSON.stringify(answers.value) },
    })
  }
}

function back() {
  if (current.value > 0) current.value--
}
</script>

<template>
  <div class="h-screen flex flex-col items-center justify-center bg-slate-800 text-white p-6">
    <!-- Guard to avoid blank screen if data not loaded -->
    <div v-if="questions.length">
      <h2 class="text-2xl font-bold mb-4">
        {{ questions[current].text }}
      </h2>

      <div class="flex flex-col gap-2 mb-6">
        <button
            v-for="opt in questions[current].options"
            :key="opt.value"
            @click="selectAnswer(opt.value)"
            class="px-4 py-2 rounded border hover:bg-indigo-600"
            :class="answers[current] === opt.value ? 'bg-indigo-600' : ''"
        >
          {{ opt.text }}
        </button>
      </div>

      <div class="flex gap-4">
        <button
            @click="back"
            :disabled="current === 0"
            class="px-4 py-2 bg-gray-600 rounded"
        >
          Back
        </button>
        <button @click="next" class="px-4 py-2 bg-indigo-600 rounded">
          {{ current === questions.length - 1 ? "Finish" : "Next" }}
        </button>
      </div>
    </div>

    <div v-else>
      <p>No questions found.</p>
    </div>
  </div>
</template>
