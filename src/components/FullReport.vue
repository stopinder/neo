<script setup>
import { ref, onMounted } from "vue"
import html2pdf from "html2pdf.js"
import { generateReport } from "../services/gptService.js"

const reportText = ref("")
const moonPhase = ref("")
const reportRef = ref(null)
const isLoading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const savedAnswers = JSON.parse(localStorage.getItem("quizAnswers") || "[]")
    const tally = JSON.parse(localStorage.getItem("quizTally") || "{}")

    if (!savedAnswers.length) throw new Error("No quiz data found")

    moonPhase.value = getMoonPhaseName()

    const response = await generateReport("IFS Multiple Choice Quiz", {
      answers: savedAnswers,
      tally,
      moonPhase: moonPhase.value,
    })

    reportText.value = response
  } catch (err) {
    console.error(err)
    error.value = "⚠️ Sorry — we couldn’t generate your report. Please retake the quiz."
  } finally {
    isLoading.value = false
  }
})

function downloadAsPDF() {
  if (!reportRef.value) return
  const options = {
    margin: 0.5,
    filename: "inner-landscape-report.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
  }
  html2pdf().set(options).from(reportRef.value).save()
}

function getMoonPhaseName() {
  const now = new Date()
  const lp = 2551443
  const newMoon = new Date(1970, 0, 7, 20, 35, 0)
  const phase = ((now.getTime() - newMoon.getTime()) / 1000) % lp
  const phaseDay = Math.floor(phase / (24 * 3600) + 1)

  if (phaseDay < 2) return "New Moon"
  if (phaseDay < 7) return "Waxing Crescent"
  if (phaseDay < 9) return "First Quarter"
  if (phaseDay < 14) return "Waxing Gibbous"
  if (phaseDay < 16) return "Full Moon"
  if (phaseDay < 22) return "Waning Gibbous"
  if (phaseDay < 24) return "Last Quarter"
  return "Waning Crescent"
}
</script>

<template>
  <section class="bg-midnight px-6 py-10 max-w-3xl mx-auto rounded-2xl shadow-aura text-slate-100">
    <div class="border border-sun-gold/20 rounded-2xl p-6 relative z-10">

      <!-- 🌙 Moon phase intro -->
      <div v-if="moonPhase" class="text-sm text-slate-400 italic mb-6">
        The moon is currently in her
        <span class="text-sun-gold font-medium">{{ moonPhase }}</span> phase — a time for reflection and integration.
      </div>

      <!-- 🌀 Error -->
      <div v-if="error" class="text-red-400 italic mb-6">{{ error }}</div>

      <!-- ⏳ Loading -->
      <div v-else-if="isLoading" class="text-slate-400 italic mb-6">Generating your report…</div>

      <!-- 📝 Final report -->
      <article
          v-else
          ref="reportRef"
          v-html="reportText"
          class="font-poetic prose prose-celestial prose-lg max-w-none text-base leading-relaxed tracking-wide transition-opacity duration-700 ease-in opacity-0 animate-fade-in"
      />

      <!-- 📄 Download Button -->
      <div v-if="reportText" class="mt-10 text-center">
        <button
            class="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-sm shadow"
            @click="downloadAsPDF"
        >
          Download PDF
        </button>
      </div>

      <!-- 🌱 Footer CTA -->
      <p class="mt-12 text-sm text-slate-500 italic text-center">
        Report generated with care under the {{ moonPhase }} moon 🌙<br />
        <router-link to="/" class="underline hover:text-sun-gold">Retake the quiz</router-link>
      </p>
    </div>
  </section>
</template>

<style scoped>
:deep(h2) {
  @apply text-sun-gold text-xl font-semibold border-b border-slate-600 pb-2 mb-4 mt-8;
}
:deep(p) {
  @apply text-slate-100 leading-relaxed;
}
:deep(li) {
  @apply text-slate-200;
}
</style>
