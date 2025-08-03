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
    text: "When life feels chaotic, what gives you a sense of stability?",
    options: ["Having a clear role or identity", "Pushing yourself to succeed", "Understanding what’s really going on"]
  },
  {
    text: "You’re drawn to people who…",
    options: ["Keep things calm and harmonious", "Challenge your thinking", "See the deeper layers of life"]
  },
  {
    text: "In relationships, what do you crave most consistently?",
    options: ["Loyalty through thick and thin", "Emotional intensity and passion", "Depth and mutual understanding", "Safety and predictability"]
  },
  {
    text: "When you feel emotionally exposed, what’s your instinct?",
    options: ["Keep things light or joke it off", "Pull back and protect yourself", "Analyze what just happened", "Try to connect more deeply"]
  },
  {
    text: "When someone misunderstands you, how do you usually respond?",
    options: ["Clarify calmly", "Get frustrated or withdrawn", "Over-explain or apologize", "Try to fix it quickly"]
  },
  {
    text: "When something painful happens, what helps you cope?",
    options: ["Being alone to process", "Taking action or staying busy", "Reassurance from someone you trust", "Making sense of it logically"]
  },
  {
    text: "Which of these energizes you most?",
    options: ["Feeling aligned with purpose", "Being in sync with others", "Freedom to explore", "Deep connection"]
  },
  {
    text: "You often find yourself attracted to people who…",
    options: ["Are steady and grounded", "Bring excitement and fun", "Feel nurturing and safe", "Are driven and ambitious"]
  },
  {
    text: "Your biggest internal conflict is usually between…",
    options: ["Self and others", "Logic and emotion", "Freedom and safety", "Control and surrender"]
  },
  {
    text: "What kind of dynamic drains you most?",
    options: ["Too clingy", "Too distant", "Too chaotic", "Too controlling"]
  },
  {
    text: "How do you usually respond to conflict?",
    options: ["Shut down", "Get defensive", "Try to fix it", "Seek space"]
  },
  {
    text: "In a group setting, you often feel like the…",
    options: ["Leader", "Mediator", "Outsider", "Connector"]
  },
  {
    text: "How do you recharge best?",
    options: ["Alone time", "Deep conversation", "Physical activity", "Creative expression"]
  },
  {
    text: "Which mythic figure resonates most with you?",
    options: ["The Seeker", "The Healer", "The Warrior", "The Sage"]
  },
  {
    text: "Which inner voice feels most familiar?",
    options: ["Be perfect", "Be safe", "Be needed", "Be strong"]
  }
]

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
      router.push('/results-snippet')
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
