<template>
  <div class="min-h-screen bg-gradient-to-br from-navy to-space-gray text-white font-body px-6 py-20 flex flex-col items-center justify-center overflow-y-auto">
    <transition name="fade" mode="out-in">
      <div :key="currentIndex" class="w-full max-w-xl text-center space-y-8">
        <h2 class="text-lg text-indigo-200 uppercase tracking-widest" aria-live="polite">
          Question {{ currentIndex + 1 }} of {{ questions.length }}
        </h2>
        <h3 class="text-3xl md:text-4xl font-display leading-snug animate-fadeIn" id="question-text">
          {{ currentQuestion.text }}
        </h3>
        <div class="space-y-4" role="group" :aria-labelledby="'question-text'">
          <button
              v-for="option in currentQuestion.options"
              :key="option"
              @click="selectOption(option)"
              @keyup.enter="selectOption(option)"
              :disabled="isLocked"
              :class="[
              'block w-full py-3 px-6 text-lg rounded-full transition shadow-aura',
              selected === option ? 'bg-sun-gold text-navy ring-2 ring-white' : 'bg-periwinkle text-white hover:bg-indigo-400',
              isLocked ? 'opacity-50 cursor-not-allowed' : ''
            ]"
              tabindex="0"
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
  {
    text: "What do you instinctively move toward in moments of uncertainty?",
    options: ["Harmony", "Challenge", "Clarity", "Escape"]
  },
  {
    text: "When energy rises in you, what does it most often feel like?",
    options: ["Grounded momentum", "Electric fire", "Waves and moods", "Sharp focus"]
  },
  {
    text: "In a partner, what trait both draws you in and unsettles you?",
    options: ["Unwavering loyalty", "Adventurous unpredictability", "Depth of feeling", "Steady control"]
  },
  {
    text: "When emotional vulnerability arises, what’s your first inner move?",
    options: ["Guard up—stay safe", "Lean in—I want connection", "Analyze—I need to understand", "Retreat—I get quiet"]
  },
  {
    text: "Your communication becomes most distorted when you feel...",
    options: ["Ignored", "Cornered", "Misunderstood", "Unseen"]
  },
  {
    text: "When hurt, your first instinct is to...",
    options: ["Shut down", "Push back", "Prove yourself", "Disappear emotionally"]
  },
  {
    text: "What’s the hunger just beneath your daily life?",
    options: ["A meaningful role", "Peace with others", "Freedom from pressure", "True intimacy"]
  },
  {
    text: "Which kind of people stir both admiration and tension in you?",
    options: ["Silent strength", "Wild charisma", "Warm nurturance", "Relentless ambition"]
  },
  {
    text: "Your inner tug-of-war is most often between...",
    options: ["Duty and desire", "Control and surrender", "Closeness and space", "Truth and approval"]
  },
  {
    text: "In relationships, you’re most drained by those who...",
    options: ["Need too much", "Push too far", "Shift too fast", "Take control"]
  },
  {
    text: "When conflict erupts, what part of you leads?",
    options: ["The fixer", "The protector", "The vanisher", "The truth-teller"]
  },
  {
    text: "In a group, you tend to carry the energy of the...",
    options: ["Visionary leader", "Peace-keeper", "Wise outsider", "Connector of hearts"]
  },
  {
    text: "You restore yourself best through...",
    options: ["Stillness and solitude", "One-on-one soul talk", "Movement and action", "Creative immersion"]
  },
  {
    text: "Which inner archetype rises in you under pressure?",
    options: ["The Seeker—driven to find what's missing", "The Healer—drawn to soothe others’ wounds", "The Warrior—called to act, no matter the cost", "The Sage—detached and watchful"]
  },
  {
    text: "Which voice whispers loudest in hard moments?",
    options: ["Be perfect", "Be safe", "Be needed", "Be strong"]
  }
];


const answers = ref([])
const currentIndex = ref(0)
const isLocked = ref(false)
const selected = ref(null)
const currentQuestion = computed(() => questions[currentIndex.value])

function selectOption(option) {
  if (isLocked.value) return
  isLocked.value = true
  selected.value = option

  answers.value.push({ question: currentQuestion.value.text, answer: option })

  setTimeout(() => {
    selected.value = null
    if (currentIndex.value < questions.length - 1) {
      currentIndex.value++
      isLocked.value = false
    } else {
      localStorage.setItem('quizAnswers', JSON.stringify(answers.value))
      router.push('/full-report')


    }
  }, 400)
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
