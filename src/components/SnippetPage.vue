<template>
  <div class="min-h-screen bg-gradient-to-br from-navy to-space-gray text-white font-body flex items-center justify-center px-4 py-20">
    <div class="w-full max-w-2xl backdrop-blur-md bg-white/5 border border-indigo-300 rounded-2xl shadow-2xl p-6 md:p-10 space-y-8">
      <h2 class="text-3xl font-display text-periwinkle text-center">
        ✨ Here’s a sneak peek at your results
      </h2>

      <div class="space-y-4 text-center">
        <p class="text-indigo-200">We analyzed your responses and found dominant psychological energies:</p>
        <ul class="list-disc list-inside text-white text-lg space-y-1">
          <li v-for="(insight, index) in insights" :key="index">
            <strong>{{ insight }}</strong>
          </li>
        </ul>
        <p v-if="insights.length === 1 && insights[0] === 'Complex Blend'" class="text-sm text-indigo-300">
          You show a rich combination of personality traits. This symbolic diagram represents your internal constellation.
        </p>
      </div>

      <div class="pt-4">
        <ConstellationDiagram :labels="insights" />
      </div>

      <div class="pt-6 border-t border-indigo-400 space-y-4 text-center">
        <h3 class="text-2xl font-display text-periwinkle">🔓 Unlock Your Full Report</h3>
        <p class="text-indigo-200 text-sm leading-relaxed">
          You've completed the full celestial quiz. Unlock your personalized symbolic report, crafted from your responses:
        </p>

        <ul class="list-disc list-inside text-indigo-200 space-y-1 text-sm">
          <li>Internal Family Systems (IFS) part mapping</li>
          <li>Attachment triggers and relational cycles</li>
          <li>Enneagram subtype & growth direction</li>
          <li>Shadow integration & healing themes</li>
        </ul>
        <button
            class="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            @click="goDeeper"
        >
          Unlock Your Full Report
        </button>

      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import ConstellationDiagram from '../components/ConstellationDiagram.vue'

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

  if (patterns.avoidant >= 2) insights.value.push("Avoidant")
  if (patterns.expressive >= 2) insights.value.push("Expressive")
  if (patterns.introspective >= 2) insights.value.push("Introspective")
  if (patterns.harmony >= 2) insights.value.push("Harmony-seeking")
  if (patterns.seeker >= 2) insights.value.push("Purpose-driven")

  if (insights.value.length === 0) {
    insights.value.push("Complex Blend")
  }
})

function goDeeper() {
  router.push('/payment')
}async function goDeeper() {
  const res = await fetch('/api/create-checkout-session', {
    method: 'POST'
  })
  const data = await res.json()
  if (data.url) {
    window.location.href = data.url
  } else {
    alert('Stripe checkout failed.')
  }
}

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Playfair+Display:wght@600&display=swap');
</style>

