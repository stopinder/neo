<template>
  <div class="min-h-screen bg-gradient-to-br from-navy to-space-gray text-white font-body flex items-center justify-center px-6 py-20">
    <div class="max-w-2xl w-full bg-opacity-10 backdrop-blur-md p-8 rounded-2xl border border-indigo-300 shadow-lg space-y-6">
      <h2 class="text-3xl font-display text-periwinkle">🎉 You’ve completed the free quiz!</h2>

      <div class="space-y-3">
        <p class="text-indigo-100">Here’s what we’ve discovered so far:</p>
        <ul class="list-disc list-inside text-white text-lg space-y-1">
          <li v-for="(insight, index) in insights" :key="index"><strong>{{ insight }}</strong></li>
        </ul>
      </div>

      <div class="pt-4 border-t border-indigo-400 space-y-4">
        <h3 class="text-2xl font-display text-periwinkle">🔓 Unlock your full personality map</h3>
        <p>Get deeper insights with 8 more questions and a downloadable, symbolic report:</p>
        <ul class="list-disc list-inside text-white space-y-1">
          <li>Your dominant and shadow parts (IFS)</li>
          <li>Attachment triggers and healing paths</li>
          <li>Enneagram subtype breakdown</li>
          <li>Relational strengths & growth areas</li>
        </ul>
      </div>

      <div class="pt-4 border-t border-indigo-400 text-sm text-indigo-200 space-y-1">
        <p>⭐ Based on Enneagram, IFS, and Attachment Theory</p>
        <p>🔒 Secure payment via Stripe</p>
      </div>

      <div class="flex flex-col sm:flex-row sm:justify-between gap-4 pt-6">
        <button @click="goToPayment" class="bg-periwinkle text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-500 transition">
          Unlock Full Report – £10.99
        </button>
        <button @click="maybeLater" class="text-indigo-300 hover:underline text-sm">Maybe later</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const insights = ref([])

onMounted(() => {
  const stored = localStorage.getItem('quizAnswers')
  if (!stored) return

  const answers = JSON.parse(stored).map(a => a.answer)

  const patterns = {
    avoidant: 0,
    expressive: 0,
    introspective: 0,
    harmony: 0,
    seeker: 0
  }

  for (const answer of answers) {
    if (['Withdraw', 'Too distant', 'Shut down', 'Freedom'].includes(answer)) patterns.avoidant++
    if (['Expressive', 'Outgoing and fun', 'Creative expression'].includes(answer)) patterns.expressive++
    if (['Insight', 'Be perfect', 'Alone time', 'The Seeker'].includes(answer)) patterns.introspective++
    if (['Harmony', 'Diplomatic', 'Be needed'].includes(answer)) patterns.harmony++
    if (['Purpose', 'The Warrior', 'Ambitious and driven'].includes(answer)) patterns.seeker++
  }

  if (patterns.avoidant >= 2) insights.value.push("You may show signs of avoidant attachment patterns")
  if (patterns.expressive >= 2) insights.value.push("You lead with emotional expressiveness and connection")
  if (patterns.introspective >= 2) insights.value.push("You seem deeply introspective and sensitive to meaning")
  if (patterns.harmony >= 2) insights.value.push("You value harmony and connection in relationships")
  if (patterns.seeker >= 2) insights.value.push("You’re driven by purpose and growth, always seeking deeper insight")

  // Fallback if none triggered
  if (insights.value.length === 0) {
    insights.value.push("You show a blend of traits, pointing to a complex inner landscape")
  }
})

function goToPayment() {
  router.push('/payment')
}

function maybeLater() {
  router.push('/')
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Playfair+Display:wght@600&display=swap');
</style>
