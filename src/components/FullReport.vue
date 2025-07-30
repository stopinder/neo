<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="max-w-xl text-center">
      <h2 class="text-3xl font-bold mb-4">Your Full Report</h2>
      <p class="text-gray-600 mb-6">Generating insights based on your answers...</p>
      <div v-if="loading" class="text-indigo-500">Loading...</div>
      <pre v-else class="text-left whitespace-pre-wrap">{{ report }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const report = ref('')
const loading = ref(true)

onMounted(async () => {
  const quizAnswers = [
    { question: "How do you typically react to stress?", answer: "Withdraw" },
    { question: "What motivates you the most?", answer: "Growth" },
    { question: "How do you respond to criticism?", answer: "Reflective" },
    { question: "What’s your default emotional state?", answer: "Calm" },
    { question: "What role do you often take in group settings?", answer: "Supporter" },
    { question: "How do you deal with conflict?", answer: "Avoid it" },
    { question: "What do you fear most in relationships?", answer: "Rejection" },
    { question: "What quality do you most seek in a partner?", answer: "Emotional depth" },
    { question: "How do you handle emotional vulnerability?", answer: "Overthink it" },
    { question: "Which best describes your communication style?", answer: "Reserved" },
    { question: "When hurt, you tend to...", answer: "Shut down" },
    { question: "What do you crave most in life?", answer: "Connection" },
    { question: "What kind of people are you drawn to?", answer: "Nurturing and caring" },
    { question: "Your biggest internal conflict is between...", answer: "Logic and emotion" },
    { question: "What kind of relationship dynamic drains you?", answer: "Too controlling" },
  ]

  const prompt = `
You are a psychological profiler using IFS, Enneagram, and attachment theory.
Analyze the following responses and generate a warm, insightful, full personality report.
${JSON.stringify(quizAnswers, null, 2)}
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

    report.value = response.data.choices[0].message.content
  } catch (error) {
    report.value = 'Error generating report.'
    console.error(error)
  } finally {
    loading.value = false
  }
})
</script>
