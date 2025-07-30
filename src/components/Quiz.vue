<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="text-center max-w-xl w-full">
      <h2 class="text-2xl font-bold mb-6">Question {{ currentIndex + 1 }} of {{ questions.length }}</h2>
      <p class="text-lg text-gray-700 mb-6">{{ currentQuestion.text }}</p>
      <div class="space-y-4">
        <button
            v-for="(option, i) in currentQuestion.options"
            :key="i"
            @click="selectOption(option)"
            class="block w-full bg-white hover:bg-indigo-50 border border-gray-300 px-4 py-3 rounded shadow-sm text-left transition"
        >
          {{ option }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const questions = [
  {
    text: "How do you typically react to stress?",
    options: ["Withdraw", "Over-plan", "Seek comfort", "Blame others"]
  },
  {
    text: "What motivates you the most?",
    options: ["Growth", "Peace", "Recognition", "Security"]
  },
  {
    text: "How do you respond to criticism?",
    options: ["Defensive", "Reflective", "Dismissive", "Anxious"]
  },
  {
    text: "What’s your default emotional state?",
    options: ["Calm", "Tense", "Cheerful", "Unsettled"]
  },
  {
    text: "What role do you often take in group settings?",
    options: ["Leader", "Supporter", "Observer", "Mediator"]
  },
  {
    text: "How do you deal with conflict?",
    options: ["Avoid it", "Confront directly", "Please others", "Shut down"]
  },
  {
    text: "What do you fear most in relationships?",
    options: ["Rejection", "Abandonment", "Control", "Judgment"]
  }
]

const answers = ref([])
const currentIndex = ref(0)

const currentQuestion = computed(() => questions[currentIndex.value])

function selectOption(option) {
  answers.value.push({ question: currentQuestion.value.text, answer: option })

  if (currentIndex.value < questions.length - 1) {
    currentIndex.value++
  } else {
    router.push('/quiz-extended')
  }
}
</script>
