<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white px-6 py-12 flex items-center justify-center">
    <div class="w-full max-w-3xl">
      <!-- Header -->
      <header class="mb-8 text-center">
        <h1 class="text-4xl md:text-5xl font-semibold tracking-tight">Your Inner Constellation</h1>
        <p class="mt-2 text-slate-300">
          A reflective, IFS-inspired mirror of your inner world — imaginative, symbolic, and non-clinical.
        </p>
      </header>

      <!-- Loader -->
      <div
          v-if="loading"
          class="min-h-[40vh] flex flex-col items-center justify-center text-center space-y-4 text-amber-300 animate-pulse"
      >
        <svg class="h-8 w-8 animate-spin text-amber-300" viewBox="0 0 24 24" fill="none">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
        </svg>
        <p class="text-lg">Mapping your inner constellation…</p>
      </div>

      <!-- Error -->
      <div v-else-if="errorMsg" class="bg-rose-50/10 border border-rose-200/30 text-rose-200 rounded-xl p-6">
        <p>{{ errorMsg }}</p>
        <div class="mt-4">
          <button
              @click="retryFetchReport"
              class="inline-flex items-center rounded-full bg-rose-400 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-500 transition"
          >
            Try again
          </button>
        </div>
      </div>

      <!-- Report -->
      <section
          v-else-if="report"
          id="report-content"
          class="bg-white text-slate-900 rounded-2xl shadow-xl ring-1 ring-white/10 p-6 md:p-8 space-y-6"
      >
        <!-- Pull Quote / Archetype -->
        <div class="rounded-xl bg-indigo-50 text-indigo-900 p-4">
          <p class="italic text-sm">“{{ pullQuote }}”</p>
          <p class="mt-2 text-[11px] font-medium uppercase tracking-wider text-indigo-700">
            Archetype: {{ archetypeLabel }}
          </p>
        </div>

        <!-- Sections -->
        <div class="prose prose-slate max-w-none">
          <h2 class="!mb-2">✨ Core Reflection</h2>
          <p class="whitespace-pre-wrap">{{ report.core_reflection }}</p>

          <h2 class="!mt-8 !mb-2">🛡️ Parts Map</h2>
          <p class="whitespace-pre-wrap">{{ report.parts_map }}</p>

          <h2 class="!mt-8 !mb-2">🌙 Mythopoetic Image</h2>
          <p class="whitespace-pre-wrap">{{ report.mythopoetic_image }}</p>

          <h2 class="!mt-8 !mb-2">🪞 Gentle Invitations</h2>
          <ul class="list-disc pl-6">
            <li v-for="(inv, i) in report.gentle_invitations" :key="i">{{ inv }}</li>
          </ul>

          <h2 class="!mt-8 !mb-2">⚠️ Disclaimer</h2>
          <p class="text-sm text-slate-600">{{ report.disclaimer }}</p>
        </div>

        <!-- In Brief -->
        <div
            class="mt-4 rounded-xl border-l-8 border-amber-400 bg-amber-50 text-amber-900 p-5"
            role="region"
            aria-label="In Brief summary"
        >
          <h3 class="font-semibold mb-1 italic">In Brief</h3>
          <p class="italic">{{ inBrief }}</p>
        </div>

        <!-- Actions -->
        <div class="pt-4 flex flex-wrap items-center gap-3">
          <button
              @click="copyReportToClipboard"
              class="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-white text-sm font-semibold hover:bg-black/80 transition"
          >
            Copy Report
          </button>
          <button
              @click="downloadPDF"
              class="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-white text-sm font-semibold hover:bg-black/80 transition"
          >
            Download PDF
          </button>
          <router-link
              to="/"
              class="ml-auto inline-flex items-center rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
          >
            Back to Landing
          </router-link>
        </div>
      </section>

      <!-- Footnote -->
      <p class="mt-6 text-center text-xs text-slate-400">
        Reflective entertainment inspired by Internal Family Systems (IFS). Not therapy or diagnosis.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import html2pdf from 'html2pdf.js'

// ---- State
const loading = ref(true)
const errorMsg = ref('')
const report = ref(null) // expected keys: core_reflection, parts_map, mythopoetic_image, gentle_invitations[], disclaimer

// ---- Helpers
function firstSentence(text = '') {
  const s = (text || '').trim()
  if (!s) return ''
  const m = s.match(/.+?[.?!](\s|$)/)
  return m ? m[0].trim() : s.slice(0, 180) + (s.length > 180 ? '…' : '')
}

const pullQuote = computed(() => firstSentence(report.value?.core_reflection || ''))
const archetypeLabel = computed(() => {
  const s = (report.value?.mythopoetic_image || '').toLowerCase()
  if (s.includes('lighthouse')) return 'Lighthouse Keeper'
  if (s.includes('hearth') || s.includes('hestia')) return 'Hearth-Tender'
  if (s.includes('forest') || s.includes('path') || s.includes('wayfinder')) return 'Wayfinder'
  if (s.includes('forge') || s.includes('smith')) return 'Quiet Forge'
  if (s.includes('sea') || s.includes('shore') || s.includes('tide')) return 'Tide Listener'
  if (s.includes('garden') || s.includes('orchard') || s.includes('seed')) return 'Gardener of Small Lights'
  return 'Inner Cartographer'
})

const inBrief = computed(() => {
  // Lightweight synthesis; safe if API doesn’t return its own summary
  const core = report.value?.core_reflection || ''
  const parts = report.value?.parts_map || ''
  const lineA = firstSentence(core)
  const lineB = firstSentence(parts)
  return [lineA, lineB].filter(Boolean).join(' ')
})

const plainTextReport = computed(() => {
  if (!report.value) return ''
  const lines = [
    '✨ Core Reflection:',
    report.value.core_reflection || '',
    '',
    '🛡️ Parts Map:',
    report.value.parts_map || '',
    '',
    '🌙 Mythopoetic Image:',
    report.value.mythopoetic_image || '',
    '',
    '🪞 Gentle Invitations:',
    ...(Array.isArray(report.value.gentle_invitations) ? report.value.gentle_invitations.map((x, i) => `• ${x}`) : []),
    '',
    '⚠️ Disclaimer:',
    report.value.disclaimer || ''
  ]
  return lines.join('\n')
})

// ---- Fetch
async function fetchReport() {
  errorMsg.value = ''
  loading.value = true

  // Get answers from localStorage (ensure your Quiz.vue saves here)
  let storedAnswers
  try {
    const raw = localStorage.getItem('quizAnswers')
    storedAnswers = JSON.parse(raw)
    if (!Array.isArray(storedAnswers) || storedAnswers.length === 0) {
      throw new Error('No quiz data found. Please retake the quiz.')
    }
  } catch (e) {
    errorMsg.value = e?.message || 'No quiz data found. Please retake the quiz.'
    loading.value = false
    return
  }

  try {
    // Align with your live API path
    const { data } = await axios.post('/api/generate', { answers: storedAnswers })
    // Expect the correct JSON shape; accept only the keys we use
    report.value = {
      core_reflection: data.core_reflection || '',
      parts_map: data.parts_map || '',
      mythopoetic_image: data.mythopoetic_image || '',
      gentle_invitations: Array.isArray(data.gentle_invitations) ? data.gentle_invitations : [],
      disclaimer: data.disclaimer || 'This is reflective entertainment, not therapy or diagnosis.'
    }
  } catch (e) {
    console.error(e)
    errorMsg.value = 'Something went wrong while generating your reflection.'
  } finally {
    loading.value = false
  }
}

function retryFetchReport() {
  fetchReport()
}

// ---- Actions
async function copyReportToClipboard() {
  try {
    await navigator.clipboard.writeText(plainTextReport.value)
    alert('Report copied to clipboard!')
  } catch (e) {
    console.error(e)
    alert('Failed to copy. Please try again.')
  }
}

function downloadPDF() {
  const el = document.getElementById('report-content')
  if (!el) return

  // Append footer note for PDF only
  const footer = document.createElement('div')
  footer.innerHTML = `
    <p style="margin-top: 1.5rem; font-style: italic; text-align: center; font-size: 12px; color: #334155;">
      🔮 AI-assisted reflective entertainment inspired by IFS — not therapy or diagnosis.
    </p>
  `
  el.appendChild(footer)

  html2pdf()
      .set({
        margin: 0.5,
        filename: 'inner-constellation.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      })
      .from(el)
      .save()
      .finally(() => {
        el.removeChild(footer)
      })
}

onMounted(fetchReport)
</script>

<style scoped>
/* Minimal typography tweaks if Tailwind's prose isn't available */
.prose h2 { font-weight: 700; font-size: 1.125rem; }
.prose p { margin: 0.5rem 0; }
</style>
