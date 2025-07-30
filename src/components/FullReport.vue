<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="max-w-xl text-center">
      <h2 class="text-3xl font-bold mb-4">Your Full Report</h2>
      <p class="text-gray-600 mb-6">Generating insights based on your answers...</p>
      <div v-if="loading" class="text-indigo-500">Loading...</div>

      <div v-else>
        <div id="report-content" class="text-left whitespace-pre-wrap border rounded p-4 bg-white shadow">
          {{ report }}
        </div>
        <div class="mt-6 flex gap-4 justify-center">
          <button class="bg-indigo-600 text-white px-4 py-2 rounded" @click="downloadPDF">Download PDF</button>
          <button class="bg-gray-600 text-white px-4 py-2 rounded" @click="emailReport">Email Report</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import html2pdf from 'html2pdf.js'

const report = ref('')
const loading = ref(true)

const storedAnswers = JSON.parse(localStorage.getItem('quizAnswers'))

const prompt = `
You are a psychological profiler using IFS, Enneagram, and attachment theory.
Analyze the following responses and generate a warm, insightful, full personality report.
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

    report.value = response.data.choices[0].message.content
  } catch (error) {
    report.value = 'Error generating report.'
    console.error(error)
  } finally {
    loading.value = false
  }
})

const downloadPDF = () => {
  const element = document.getElementById('report-content')
  html2pdf().from(element).save('your-personality-report.pdf')
}

const emailReport = async () => {
  try {
    await axios.post('/api/send-report', {
      email: 'user@example.com', // Replace with actual user email
      content: report.value
    })
    alert('Email sent!')
  } catch (err) {
    alert('Email failed.')
    console.error(err)
  }
}
</script>
