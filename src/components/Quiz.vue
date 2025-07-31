<template>
  <div class="min-h-screen bg-gradient-to-br from-navy to-space-gray text-white font-body px-6 py-20 flex flex-col items-center justify-center">
    <transition name="fade" mode="out-in">
      <div :key="currentIndex" class="w-full max-w-xl text-center space-y-8">
        <h2 class="text-3xl md:text-4xl font-display leading-snug animate-fadeIn">
          {{ currentQuestion.text }}
        </h2>
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
  { text: 'What draws you in the most?', options: ['Harmony', 'Challenge', 'Insight'] },
  { text: 'Which energy describes you best?', options: ['Grounded', 'Fiery', 'Fluid'] },
  // Add more questions as needed
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
    router.push('/quiz-extended')
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
