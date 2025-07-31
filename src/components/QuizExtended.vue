<template>
  <div class="min-h-screen bg-gradient-to-br from-navy to-space-gray text-white font-body px-6 py-20 flex flex-col items-center justify-center">
    <transition name="fade" mode="out-in">
      <div :key="currentIndex" class="w-full max-w-2xl text-center space-y-10">
        <h2 class="text-xl text-sky-soft">Question {{ currentIndex + 1 }} of {{ questions.length }}</h2>
        <p class="text-3xl md:text-4xl font-display leading-snug">
          {{ currentQuestion.text }}
        </p>
        <div class="space-y-4">
          <button
              v-for="(option, i) in currentQuestion.options"
              :key="i"
              @click="selectOption(option)"
              class="block w-full py-3 px-6 bg-periwinkle text-white text-lg rounded-full shadow-aura hover:bg-indigo-400 transition"
          >
            {{ option }}
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const questions = [
  { text: "What quality do you most seek in a partner?", options: ["Loyalty", "Excitement", "Emotional depth", "Stability"] },
  { text: "How do you handle emotional vulnerability?", options: ["Avoid it", "Embrace it", "Overthink it", "Downplay it"] },
  { text: "Which best describes your communication style?", options: ["Direct", "Diplomatic", "Reserved", "Expressive"] },
  { text: "When hurt, you tend to...", options: ["Withdraw", "Confront", "Overcompensate", "Shut down"] },
  { text: "What do you crave most in life?", options: ["Purpose", "Harmony", "Freedom", "Connection"] },
  { text: "What kind of people are you often drawn to?", options: ["Strong and silent", "Outgoing and fun", "Nurturing and caring", "Ambitious and driven"] },
  { text: "Your biggest internal conflict is between...", options: ["Self and others", "Logic and emotion", "Freedom and safety", "Control and surrender"] },
  { text: "What kind of relationship dynamic drains you?", options: ["Too clingy", "Too distant", "Too chaotic", "Too controlling"] }
]

const answers = ref([])
const currentIndex = ref(0)
const currentQuestion = computed(() => questions[currentIndex.value])

function selectOption(option) {
  answers.value.push({ question: currentQuestion.value.text, answer: option })

  if (currentIndex.value < questions.length - 1) {
    currentIndex.value++
  } else {
    const stored = JSON.parse(localStorage.getItem('quizAnswers')) || []
    const combined = [...stored, ...answers.value]
    localStorage.setItem('quizAnswers', JSON.stringify(combined))
    router.push('/payment')
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Playfair+Display:wght@600&display=swap');

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>

