<script setup>
import { ref, computed } from "vue"
import { useRouter } from "vue-router"
import { ifsQuestions } from "../data/ifsQuestions.js"

const router = useRouter()

const quiz = ifsQuestions
const current = ref(0)
const answers = ref([])

// progress bar %
const progress = computed(() => ((current.value + 1) / quiz.length) * 100)

function selectAnswer(value) {
  answers.value[current.value] = value
}

function next() {
  if (current.value < quiz.length - 1) {
    current.value++
  } else {
    // ✅ Calculate tally of responses
    const tally = answers.value.reduce(
        (acc, val) => {
          if (val) acc[val]++
          return acc
        },
        { protector: 0, manager: 0, exile: 0, self: 0 }
    )

    // ✅ Save answers + tally locally
    localStorage.setItem("quizAnswers", JSON.stringify(answers.value))
    localStorage.setItem("quizTally", JSON.stringify(tally))

    // ✅ Navigate to report with both
    router.push({
      name: "Report",
      query: {
        answers: JSON.stringify(answers.value),
        tally: JSON.stringify(tally),
        quizType: "IFS Multiple Choice",
      },
    })
  }
}

function back() {
  if (current.value > 0) current.value--
}
</script>

<template>
  <div class="h-screen flex flex-col items-center justify-center bg-midnight text-white p-6">
    <div v-if="quiz.length" class="w-full max-w-xl bg-slate-800 border border-slate-600 rounded-lg p-6">
      <!-- Quiz title -->
      <h1 class="text-2xl font-poetic text-sun-gold mb-4">IFS Multiple Choice Quiz</h1>

      <!-- Progress -->
      <div class="mb-6">
        <div class="flex justify-between text-sm text-slate-400 mb-1">
          <span>Question {{ current + 1 }} of {{ quiz.length }}</span>
          <span>{{ Math.round(progress) }}%</span>
        </div>
        <div class="w-full h-2 bg-slate-700 rounded">
          <div
              class="h-2 bg-sun-gold rounded transition-all duration-300"
              :style="{ width: progress + '%' }"
          ></div>
        </div>
      </div>

      <!-- Question text -->
      <h2 class="text-lg mb-6">{{ quiz[current].text }}</h2>

      <!-- Options -->
      <div class="flex flex-col gap-3 mb-6">
        <button
            v-for="opt in quiz[current].options"
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
          {{ current === quiz.length - 1 ? "Finish" : "Next" }}
        </button>
      </div>
    </div>
    <div v-else>
      <p>No questions found.</p>
    </div>
  </div>
</template>

