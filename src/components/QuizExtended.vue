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

const questions = ref([
  {
    text: "When you're trying to stay in control, what inner voice guides you most?",
    options: [
      "I must stay ahead of problems.",
      "People need me to be perfect.",
      "If I relax, things fall apart.",
      "No one else will handle this."
    ]
  },
  {
    text: "When you feel emotionally overwhelmed, what do you usually do?",
    options: [
      "Numb out with distractions",
      "Get angry or reactive",
      "Over-socialize to avoid being alone",
      "Shut down completely"
    ]
  },
  {
    text: "Deep down, what’s a part of you afraid others might see?",
    options: [
      "That I'm unlovable",
      "That I'm a burden",
      "That I'm weak or not enough",
      "That I'm too much"
    ]
  },
  {
    text: "When you're in conflict with someone close, how do you tend to act?",
    options: [
      "Like a parent — I criticize or control",
      "Like a child — I withdraw or act out",
      "Like an adult — I stay calm and discuss",
      "I freeze and don't know what to do"
    ]
  },
  {
    text: "Which of these is hardest for you in a relationship?",
    options: [
      "Asking for what I need",
      "Trusting people not to leave",
      "Letting others have space",
      "Believing I deserve love"
    ]
  },
  {
    text: "What type of person are you most drawn to?",
    options: [
      "Confident and dominant",
      "Emotionally intense and mysterious",
      "Sensitive and nurturing",
      "Independent and logical"
    ]
  },
  {
    text: "Which pattern have you repeated in past relationships?",
    options: [
      "I lose myself trying to please them",
      "I attract emotionally unavailable people",
      "I become controlling or anxious",
      "I ignore red flags to avoid being alone"
    ]
  }
])

const answers = ref([])
const currentIndex = ref(0)

const currentQuestion = computed(() => questions.value[currentIndex.value])

function selectOption(option) {
  answers.value.push({ question: currentQuestion.value.text, answer: option })

  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++
  } else {
    router.push('/payment')
  }
}
</script>
