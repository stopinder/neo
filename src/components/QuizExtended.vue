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
    text: "What quality do you most seek in a partner?",
    options: ["Loyalty", "Excitement", "Emotional depth", "Stability"]
  },
  {
    text: "How do you handle emotional vulnerability?",
    options: ["Avoid it", "Embrace it", "Overthink it", "Downplay it"]
  },
  {
    text: "Which best describes your communication style?",
    options: ["Direct", "Diplomatic", "Reserved", "Expressive"]
  },
  {
    text: "When hurt, you tend to...",
    options: ["Withdraw", "Confront", "Overcompensate", "Shut down"]
  },
  {
    text: "What do you crave most in life?",
    options: ["Purpose", "Harmony", "Freedom", "Connection"]
  },
  {
    text: "What kind of people are you often drawn to?",
    options: ["Strong and silent", "Outgoing and fun", "Nurturing and caring", "Ambitious and driven"]
  },
  {
    text: "Your biggest internal conflict is between...",
    options: ["Self and others", "Logic and emotion", "Freedom and safety", "Control and surrender"]
  },
  {
    text: "What kind of relationship dynamic drains you?",
    options: ["Too clingy", "Too distant", "Too chaotic", "Too controlling"]
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
    router.push('/payment')
  }
}
</script>
