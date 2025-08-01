<template>
  <div class="min-h-screen bg-gradient-to-br from-midnight to-celestial text-starlight font-serif p-6 flex items-center justify-center">
    <div class="max-w-3xl w-full text-center space-y-8">
      <div>
        <h2 class="text-4xl font-display text-starlight drop-shadow mb-2">Your Inner Constellation</h2>
        <p class="text-starlight/80">A symbolic synthesis of your IFS system, Enneagram type, attachment style, and relational dynamics.</p>
      </div>

      <div v-if="loading" class="text-starlight text-lg font-medium">
        Illuminating your internal landscape...
      </div>

      <div
          v-else-if="report && !report.error"
          id="report-content"
          class="text-left bg-gradient-to-br from-celestial to-midnight text-starlight shadow-glow rounded-xl p-6 space-y-6"
      >
        <TransitionGroup name="fade" tag="div">
          <div v-for="(value, section) in report" :key="section">
            <h3 class="text-xl font-display font-semibold text-starlight/90 capitalize mt-4">
              {{ formatTitle(section) }}
            </h3>
            <p class="mt-2 whitespace-pre-wrap leading-relaxed text-starlight/90">{{ value }}</p>
          </div>
        </TransitionGroup>

        <div class="pt-8 border-t border-starlight/20 mt-6 motion-safe:animate-fadeIn">
          <p class="italic text-starlight/70 text-sm mt-4">
            “You do not have to be good. You only have to let the soft animal of your body love what it loves.”<br />
            — Mary Oliver
          </p>
        </div>

        <div class="flex flex-col items-center space-y-4 pt-6">
          <input
              v-model="userEmail"
              type="email"
              placeholder="Enter your email"
              class="bg-white/10 backdrop-blur border border-white/20 text-white placeholder-white/60 px-4 py-2 rounded-full w-full max-w-sm focus:outline-none focus:ring focus:ring-periwinkle"
          />
          <button
              :disabled="!isEmailValid"
              @click="emailReport"
              class="bg-celestial hover:bg-midnight text-white font-semibold px-6 py-3 rounded-full shadow-aura transition disabled:opacity-50"
          >
            Send to My Inbox
          </button>
          <button
              @click="downloadPDF"
              class="bg-roseQuartz hover:bg-rose-400 text-white font-semibold px-6 py-3 rounded-full shadow-aura transition"
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
    /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(userEmail.value.trim())
)

const plainTextReport = computed(() =>
    Object.entries(report.value).map(([k, v]) =>
        `${formatTitle(k)}:\n${v}\n\n`
    ).join('')
)

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

  const prompt = `
You are a skilled psychological guide... (same full prompt body you already have)
User Responses:
${JSON.stringify(storedAnswers, null, 2)}
`

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }]
    }, {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    try {
      report.value = JSON.parse(response.data.choices[0].message.content)
    } catch (err) {
      report.value = { error: 'The report could not be parsed correctly.' }
    }
  } catch (error) {
    report.value = { error: 'Something went wrong while illuminating your inner terrain.' }
    console.error(error)
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
  transition: opacity 0.6s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>