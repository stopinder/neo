<template>
  <div class="min-h-screen bg-gradient-to-br from-navy to-space-gray text-white font-body px-6 py-20 flex flex-col items-center justify-center">
    <transition name="fade" mode="out-in">
      <div :key="currentIndex" class="w-full max-w-xl text-center space-y-8">
        <h2 class="text-lg text-indigo-200 uppercase tracking-widest">
          Question {{ currentIndex + 1 }} of {{ questions.length }}
        </h2>
        <h3 class="text-3xl md:text-4xl font-display leading-snug animate-fadeIn">
          {{ currentQuestion.text }}
        </h3>
        <div class="space-y-4">
          <button
              v-for="option in currentQuestion.options"
              :key="option"
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
  // First 2
  { text: 'What draws you in the most?', options: ['Harmony', 'Challenge', 'Insight'] },
  { text: 'Which energy describes you best?', options: ['Grounded', 'Fiery', 'Fluid'] },

  // Middle 7
  { text: "What quality do you most seek in a partner?", options: ["Loyalty", "Excitement", "Emotional depth", "Stability"] },
  { text: "How do you handle emotional vulnerability?", options: ["Avoid it", "Embrace it", "Overthink it", "Downplay it"] },
  { text: "Which best describes your communication style?", options: ["Direct", "Diplomatic", "Reserved", "Expressive"] },
  { text: "When hurt, you tend to...", options: ["Withdraw", "Confront", "Overcompensate", "Shut down"] },
  { text: "What do you crave most in life?", options: ["Purpose", "Harmony", "Freedom", "Connection"] },
  { text: "What kind of people are you often drawn to?", options: ["Strong and silent", "Outgoing and fun", "Nurturing and caring", "Ambitious and driven"] },
  { text: "Your biggest internal conflict is between...", options: ["Self and others", "Logic and emotion", "Freedom and safety", "Control and surrender"] },

  // Final 6
  { text: "What kind of relationship dynamic drains you?", options: ["Too clingy", "Too distant", "Too chaotic", "Too controlling"] },
  { text: "How do you respond to conflict?", options: ["Shut down", "Get defensive", "Try to fix it", "Seek space"] },
  { text: "In a group, you often feel like the...", options: ["Leader", "Mediator", "Outsider", "Connector"] },
  { text: "How do you recharge best?", options: ["Alone time", "Deep conversation", "Physical activity", "Creative expression"] },
  { text: "Which mythic figure resonates most with you?", options: ["The Seeker", "The Healer", "The Warrior", "The Sage"] },
  { text: "What inner voice do you hear most?", options: ["Be perfect", "Be safe", "Be needed", "Be strong"] }
]

const answers = ref([])
const currentIndex = ref(0)
const currentQuestion = computed(() => questions[currentIndex.value])

function selectOption(option) {
  answers.value.push({ question: currentQuestion.value.text, answer: option })

  if (currentIndex.value < questions.length - 1) {
    currentIndex.value++
  } else {
    localStorage.setItem('quizAnswers', JSON.stringify(answers.value))
    router.push('/results-snippet')

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
