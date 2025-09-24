<template>
  <section class="px-6 py-10 max-w-3xl mx-auto text-slate-100">
    <!-- 🌙 Optional Moon Phase Line -->
    <div v-if="moonPhase" class="text-sm text-slate-400 italic mb-4">
      The moon is currently in her
      <span class="text-sun-gold font-medium">{{ moonPhase }}</span>
      phase — a time for reflection and integration.
    </div>

    <!-- 🌀 Loading Spinner -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-12">
      <svg
          class="animate-spin h-8 w-8 text-sun-gold mb-3"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
      >
        <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
        />
        <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
      <p class="text-slate-400">Generating your reflective report…</p>
    </div>

    <!-- 📝 Render the formatted GPT report -->
    <article
        v-else
        ref="reportRef"
        v-html="reportText"
        class="prose prose-invert prose-slate max-w-none text-base leading-relaxed tracking-wide animate-fadeIn"
    />

    <!-- 📄 Download Button -->
    <div v-if="!loading" class="mt-8">
      <button
          class="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-sm border border-slate-600"
          @click="downloadAsPDF"
      >
        Download PDF
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import html2pdf from 'html2pdf.js'
import { useRoute } from 'vue-router'
import { quizConfig } from '../data/quizConfig.js'
import { generateReport } from '../services/gptService.js'

const route = useRoute()
const quizType = route.query.quizType || 'default'
const quiz = quizConfig[quizType] || quizConfig.default
const answers = JSON.parse(route.query.answers || '[]')

const reportText = ref('')
const moonPhase = ref('')
const reportRef = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const result = await generateReport(quizType, answers)
    reportText.value = result
  } catch (err) {
    console.error('Report generation failed:', err)
    reportText.value = '⚠️ Unable to generate report. Please try again later.'
  } finally {
    loading.value = false
  }

  // Set symbolic moon phase
  moonPhase.value = getMoonPhaseName()
})

function downloadAsPDF() {
  const options = {
    margin: 0.5,
    filename: 'inner-landscape-report.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  }
  html2pdf().set(options).from(reportRef.value).save()
}

function getMoonPhaseName() {
  const now = new Date()
  const lp = 2551443 // lunar period in ms
  const newMoon = new Date(1970, 0, 7, 20, 35, 0)
  const phase = ((now.getTime() - newMoon.getTime()) / 1000) % lp
  const phaseDay = Math.floor((phase / (24 * 3600)) + 1)

  if (phaseDay < 2) return 'New Moon'
  if (phaseDay < 7) return 'Waxing Crescent'
  if (phaseDay < 9) return 'First Quarter'
  if (phaseDay < 14) return 'Waxing Gibbous'
  if (phaseDay < 16) return 'Full Moon'
  if (phaseDay < 22) return 'Waning Gibbous'
  if (phaseDay < 24) return 'Last Quarter'
  return 'Waning Crescent'
}
</script>

<style scoped>
:deep(h2) {
  @apply text-sun-gold text-xl font-semibold border-b border-slate-600 pb-2 mb-4 mt-8;
}
</style>



