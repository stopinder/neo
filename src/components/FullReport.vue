<template>
  <div class="min-h-screen bg-gradient-to-br from-moon-glow via-ether to-ink-night text-ink-night font-serif p-6 flex flex-col items-center justify-center">
    <div class="max-w-3xl w-full space-y-10">
      <div class="text-center">
        <h2 class="text-4xl font-display text-ink-night drop-shadow mb-2">Your Inner Constellation</h2>
        <p class="text-ink-night/80">A clinical synthesis of your IFS system, Enneagram type, attachment style, and relational dynamics.</p>
      </div>

      <div v-if="loading" class="flex flex-col items-center justify-center text-center space-y-4 animate-slowPulse text-space-gray min-h-[40vh]">
        <p class="text-lg font-poetic tracking-wide">Mapping your inner constellation...</p>
      </div>

      <div v-else-if="report && !report.error" id="report-content" class="space-y-6">
        <div
            v-for="(value, section) in report"
            :key="section"
            v-if="section !== 'mythic_comparison' && section !== 'invitation'"
            class="bg-white/80 shadow-glow rounded-xl p-6 transition"
        >
          <button @click="toggleSection(section)" class="w-full text-left flex justify-between items-center">
            <h3 class="text-xl font-display font-semibold text-ink-night capitalize">{{ formatTitle(section) }}</h3>
            <span class="text-ink-night/60 text-lg">{{ expandedSections[section] ? '–' : '+' }}</span>
          </button>
          <transition name="fade">
            <p v-if="expandedSections[section]" class="mt-2 whitespace-pre-wrap leading-relaxed text-ink-night/90">{{ value }}</p>
          </transition>
        </div>

        <!-- Archetype Card -->
        <div class="bg-indigo-100/60 text-ink-night rounded-2xl shadow-halo px-6 py-6 border border-ink-night/10">
          <h3 class="text-xl font-poetic tracking-wide text-ink-night mb-2">🌓 Archetypal Reflection</h3>
          <p class="leading-relaxed whitespace-pre-wrap text-ink-night/90">{{ report.mythic_comparison }}</p>
        </div>

        <!-- Gentle Invitation -->
        <div class="bg-moon-glow/60 rounded-xl p-6 shadow-aura space-y-4 border border-ink-night/10">
          <h3 class="text-lg font-semibold text-ink-night">🪞 A Gentle Invitation</h3>
          <p class="whitespace-pre-wrap text-ink-night/90">{{ report.invitation }}</p>

          <textarea
              v-model="userReflection"
              placeholder="What landed most deeply for you?"
              class="w-full p-4 rounded-xl bg-white/60 text-ink-night/90 border border-ink-night/20 placeholder-ink-night/50"
              rows="4"
          />
        </div>

        <!-- Footer Actions -->
        <div class="pt-6 border-t border-ink-night/20 mt-8 flex flex-col items-center space-y-4">
          <input
              v-model="userEmail"
              type="email"
              placeholder="Enter your email"
              class="bg-white/10 backdrop-blur border border-ink-night/20 text-ink-night placeholder-ink-night/60 px-4 py-2 rounded-full w-full max-w-sm focus:outline-none focus:ring focus:ring-sun-gold"
          />
          <button
              :disabled="!isEmailValid"
              @click="emailReport"
              class="bg-sun-gold hover:bg-ink-night text-white font-semibold px-6 py-3 rounded-full shadow-aura transition disabled:opacity-50"
          >
            Send to My Inbox
          </button>
          <button
              @click="downloadPDF"
              class="bg-ink-night hover:bg-sun-gold text-white font-semibold px-6 py-3 rounded-full shadow-aura transition"
          >
            Download Sacred Map (PDF)
          </button>
        </div>
      </div>

      <div v-else class="text-rose-300 font-medium">
        {{ report.error || 'Something went wrong while illuminating your inner terrain.' }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import html2pdf from 'html2pdf.js'

const report = ref({})
const loading = ref(true)
const userEmail = ref('')
const userReflection = ref('')
const expandedSections = ref({})

const sectionTitles = {
  core_profile: "✨ Core Profile",
  ifs_dynamics: "🛡️ IFS Dynamics",
  enneagram_pattern: "🌿 Enneagram Pattern",
  attachment_style: "🕊️ Attachment Style",
  transactional_analysis: "🧠 Transactional Analysis",
  relational_dynamics: "🔄 Relational Patterning",
  attraction_dynamics: "💞 Relational Magnetics & Attraction Patterns"
}

const formatTitle = (key) => sectionTitles[key] || key

const isEmailValid = computed(() =>
    /^[\\w.-]+@([\\w-]+\\.)+[\\w-]{2,4}$/.test(userEmail.value.trim())
)

const plainTextReport = computed(() =>
    Object.entries(report.value).map(([k, v]) =>
        `${formatTitle(k)}:\n${v}\n\n`
    ).join('')
)

const toggleSection = (key) => {
  expandedSections.value[key] = !expandedSections.value[key]
}

onMounted(async () => {
  const storedAnswersRaw = localStorage.getItem('quizAnswers')
  let storedAnswers

  try {
    storedAnswers = JSON.parse(storedAnswersRaw)
    if (!Array.isArray(storedAnswers) || storedAnswers.length === 0) throw new Error()
  } catch (e) {
    report.value = { error: 'No quiz data found. Please retake the quiz.' }
    loading.value = false
    return
  }

  try {
    const response = await axios.post('/api/generate-report', {
      answers: storedAnswers
    })
    report.value = response.data
    Object.keys(response.data).forEach(key => expandedSections.value[key] = true)
  } catch (error) {
    console.error(error)
    report.value = { error: 'Something went wrong while illuminating your inner terrain.' }
  } finally {
    loading.value = false
  }
})

const downloadPDF = () => {
  const element = document.getElementById('report-content')
  const footer = document.createElement('div')
  footer.innerHTML = '<p style="margin-top: 2em; font-style: italic; text-align: center; font-size: 12px;">🔮 Generated with GPT-4 insight and inner constellation mapping.</p>'
  element.appendChild(footer)

  html2pdf().set({
    margin: 0.5,
    filename: 'inner-constellation.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  }).from(element).save()

  element.removeChild(footer)
}

const emailReport = async () => {
  try {
    await axios.post('/api/send-report', {
      email: userEmail.value.trim(),
      content: plainTextReport.value
    })
    alert('Report sent to your inbox!')
  } catch (err) {
    alert('Sending failed. Try again soon.')
    console.error(err)
  }
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
