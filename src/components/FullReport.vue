<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 to-white p-6 flex items-center justify-center">
    <div class="max-w-3xl w-full text-center space-y-8">
      <div>
        <h2 class="text-4xl font-semibold text-indigo-800 mb-2">Your Inner Constellation</h2>
        <p class="text-gray-700">A symbolic synthesis of your IFS system, Enneagram type, attachment style, and relational dynamics.</p>
      </div>

      <div v-if="loading" class="text-indigo-600 text-lg font-medium">
        Illuminating your internal landscape...
      </div>

      <div v-else-if="report && !report.error" class="text-left bg-white shadow-xl rounded-xl p-6 space-y-6 text-gray-800" id="report-content">
        <div v-for="(value, section) in report" :key="section">
          <h3 class="text-xl font-semibold text-indigo-700 capitalize">{{ formatTitle(section) }}</h3>
          <p class="mt-2 whitespace-pre-wrap">{{ value }}</p>
        </div>

        <div class="flex justify-center gap-4 pt-4">
          <button class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-md transition" @click="downloadPDF">
            Download Sacred Map (PDF)
          </button>
          <button class="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded-md transition" @click="emailReport">
            Send to My Inbox
          </button>
        </div>
      </div>

      <div v-else class="text-red-600 font-medium">
        {{ report.error || 'Something went wrong while illuminating your inner terrain.' }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import html2pdf from 'html2pdf.js'

const report = ref({})
const loading = ref(true)

const storedAnswers = JSON.parse(localStorage.getItem('quizAnswers'))

const prompt = `
You are a skilled psychological guide, trained in Internal Family Systems, Enneagram, Attachment Theory, and Transactional Analysis. You are also fluent in myth, archetype, and symbolic language—able to speak to clients with warmth, insight, and poetic depth.

Analyze the user's responses below and return a JSON object with these keys:

{
  "core_profile": "...",
  "ifs_dynamics": "...",
  "enneagram_pattern": "...",
  "attachment_style": "...",
  "transactional_analysis": "...",
  "relational_dynamics": "...",
  "mythic_comparison": "...",
  "invitation": "..."
}

Each value should be 2-4 paragraphs. Be clear, poetic, and emotionally elegant. Invite curiosity. Use mythic comparisons gently (e.g., “You carry something of Persephone” or “Your protector echoes Athena”).

User Responses:
${JSON.stringify(storedAnswers, null, 2)}
`

onMounted(async () => {
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

const formatTitle = (key) => key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

const downloadPDF = () => {
  const element = document.getElementById('report-content')
  html2pdf().from(element).save('inner-constellation.pdf')
}

const emailReport = async () => {
  try {
    await axios.post('/api/send-report', {
      email: 'user@example.com',
      content: JSON.stringify(report.value, null, 2)
    })
    alert('Report sent to your inbox!')
  } catch (err) {
    alert('Sending failed. Try again soon.')
    console.error(err)
  }
}
</script>
