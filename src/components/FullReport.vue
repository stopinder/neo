from pathlib import Path

# Define the full contents of the revised FullReport.vue
full_report_vue_code = '''
<template>
  <div class="min-h-screen bg-gradient-to-br from-moon-glow via-sky-soft to-ether text-space-gray font-poetic p-6 flex items-center justify-center">
    <div class="max-w-3xl w-full text-center space-y-8">
      <div>
        <h2 class="text-4xl font-display text-navy drop-shadow mb-2">Your Inner Constellation</h2>
        <p class="text-space-gray/80">A symbolic synthesis of your IFS system, Enneagram type, attachment style, and relational dynamics.</p>
      </div>

      <div v-if="loading" class="text-space-gray text-lg font-medium">
        Illuminating your internal landscape...
      </div>

      <div v-else-if="report && !report.error" id="report-content"
           class="text-left bg-white/60 backdrop-blur rounded-xl p-6 space-y-6 shadow-aura">
        <TransitionGroup name="fade" tag="div">
          <div v-for="(value, section) in report" :key="section">
            <h3 class="text-xl font-display font-semibold text-navy capitalize mt-4 drop-shadow">
              {{ formatTitle(section) }}
            </h3>
            <p class="mt-2 whitespace-pre-wrap leading-relaxed text-space-gray">{{ value }}</p>
          </div>
        </TransitionGroup>

        <div class="pt-8 border-t border-space-gray/20 mt-6">
          <p class="italic text-space-gray/70 text-sm mt-4">
            “You do not have to be good. You only have to let the soft animal of your body love what it loves.”<br />
            — Mary Oliver
          </p>
        </div>

        <div class="flex flex-col items-center space-y-4 pt-6">
          <input v-model="userEmail" type="email" placeholder="Enter your email"
                 class="bg-white/10 backdrop-blur border border-white/20 text-space-gray placeholder-space-gray/60 px-4 py-2 rounded-full w-full max-w-sm focus:outline-none focus:ring focus:ring-periwinkle" />
          <button :disabled="!isEmailValid" @click="emailReport"
                  class="bg-sun-gold hover:bg-periwinkle text-white font-semibold px-6 py-3 rounded-full shadow-aura transition disabled:opacity-50">
            Send to My Inbox
          </button>
          <button @click="downloadPDF"
                  class="bg-periwinkle hover:bg-navy text-white font-semibold px-6 py-3 rounded-full shadow-aura transition">
            Download Sacred Map (PDF)
          </button>
        </div>
      </div>

      <div v-else class="text-roseQuartz font-medium space-y-4">
        <p>{{ report.error || 'Something went wrong while illuminating your inner terrain.' }}</p>
        <button @click="generateAgain"
                class="bg-sun-gold text-white font-semibold px-4 py-2 rounded-full shadow-aura hover:bg-periwinkle transition">
          Try Again
        </button>
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

const sectionTitles = {
  core_profile: "✨ Core Profile",
  ifs_dynamics: "🛡️ IFS Dynamics",
  enneagram_pattern: "🌿 Enneagram Pattern",
  attachment_style: "🕊️ Attachment Style",
  transactional_analysis: "🧠 Transactional Analysis",
  relational_dynamics: "🔄 Relational Patterning",
  mythic_comparison: "🌓 Mythic Reflection",
  invitation: "🪞 A Gentle Invitation"
}

const formatTitle = (key) => sectionTitles[key] || key

const isEmailValid = computed(() =>
    /^[\\w.-]+@([\\w-]+\\.)+[\\w-]{2,4}$/.test(userEmail.value.trim())
)

const plainTextReport = computed(() =>
    Object.entries(report.value).map(([k, v]) =>
        `${formatTitle(k)}:\\n${v}\\n\\n`
    ).join('')
)

onMounted(() => generateAgain())

const generateAgain = async () => {
  loading.value = true
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
  } catch (error) {
    console.error(error)
    report.value = { error: 'Something went wrong while illuminating your inner terrain.' }
  } finally {
    loading.value = false
  }
}

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
  transition: opacity 0.6s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
'''

# Write to file and return path
path = Path("/mnt/data/FullReport.vue")
path.write_text(full_report_vue_code.strip())
path
