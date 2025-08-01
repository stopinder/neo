from pathlib import Path

# Here's the complete, working version of generate-report.vue
generate_report_vue = """
<template>
  <div class="min-h-screen bg-gradient-to-br from-ink-night via-midnight to-celestial text-starlight font-poetic p-6">
    <div class="max-w-3xl mx-auto space-y-10">
      <!-- Header -->
      <div class="text-center space-y-2">
        <h2 class="text-4xl font-display text-celestial drop-shadow-lg tracking-wide">✨ Your Inner Constellation</h2>
        <p class="text-starlight/70 italic">A symbolic synthesis of your IFS system, Enneagram type, attachment style, and relational dynamics.</p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-starlight text-lg text-center font-medium animate-pulse">
        Illuminating your internal landscape...
      </div>

      <!-- Report Display -->
      <div
          v-else-if="report && !report.error"
          id="report-content"
          class="bg-moon-glow/10 backdrop-blur-md text-starlight rounded-2xl p-6 space-y-10 shadow-halo border border-white/10"
      >
        <TransitionGroup name="fade" tag="div" class="space-y-10">
          <div v-for="(value, section) in report" :key="section">
            <h3 class="text-2xl font-display text-sun-gold border-b border-starlight/20 pb-1 mb-3">
              {{ formatTitle(section) }}
            </h3>
            <p class="whitespace-pre-wrap leading-relaxed text-starlight/90 tracking-wide">
              {{ value }}
            </p>
          </div>
        </TransitionGroup>

        <!-- Quote Footer -->
        <div class="pt-10 border-t border-starlight/10 mt-8">
          <p class="italic text-starlight/60 text-center text-sm mt-6">
            “You do not have to be good. You only have to let the soft animal of your body love what it loves.”<br />
            — Mary Oliver
          </p>
        </div>

        <!-- Actions -->
        <div class="flex flex-col items-center space-y-4 pt-8">
          <input
              v-model="userEmail"
              type="email"
              placeholder="Enter your email"
              class="bg-white/5 text-white placeholder-white/40 border border-white/20 px-4 py-2 rounded-full w-full max-w-sm focus:outline-none focus:ring focus:ring-periwinkle"
          />
          <button
              :disabled="!isEmailValid"
              @click="emailReport"
              class="bg-celestial hover:bg-periwinkle text-ink-night font-semibold px-6 py-3 rounded-full shadow-aura transition disabled:opacity-50"
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

      <!-- Error -->
      <div v-else class="text-rose-300 font-medium text-center">
        {{ report.error || 'Something went wrong while illuminating your inner terrain.' }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import html2pdf from 'html2pdf.js';

const report = ref({});
const loading = ref(true);
const userEmail = ref('');

const sectionTitles = {
  "✨ Core Profile": "✨ Core Profile",
  "🛡️ IFS Dynamics": "🛡️ IFS Dynamics",
  "🌿 Enneagram Pattern": "🌿 Enneagram Pattern",
  "🕊️ Attachment Style": "🕊️ Attachment Style",
  "🧠 Transactional Analysis": "🧠 Transactional Analysis",
  "🔄 Relational Patterning": "🔄 Relational Patterning",
  "🌗 Mythic Reflection": "🌗 Mythic Reflection",
  "🪞 A Gentle Invitation": "🪞 A Gentle Invitation"
};

const formatTitle = (key) => sectionTitles[key] || key;

const isEmailValid = computed(() =>
    /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/.test(userEmail.value.trim())

);

const plainTextReport = computed(() =>
    Object.entries(report.value).map(([k, v]) =>
        `${formatTitle(k)}:\\n${v}\\n\\n`
    ).join('')
);

onMounted(async () => {
  const storedAnswersRaw = localStorage.getItem('quizAnswers');
  let storedAnswers;

  try {
    storedAnswers = JSON.parse(storedAnswersRaw);
    if (!Array.isArray(storedAnswers) || storedAnswers.length === 0) throw new Error();
  } catch (e) {
    report.value = { error: 'No quiz data found. Please retake the quiz.' };
    loading.value = false;
    return;
  }

  try {
    const response = await axios.post('/api/generate-report', { answers: storedAnswers });
    report.value = response.data;
  } catch (error) {
    console.error(error);
    report.value = { error: 'Something went wrong while illuminating your inner terrain.' };
  } finally {
    loading.value = false;
  }
});

const downloadPDF = () => {
  const element = document.getElementById('report-content');
  const footer = document.createElement('div');
  footer.innerHTML = '<p style="margin-top: 2em; font-style: italic; text-align: center; font-size: 12px;">🔮 Generated with GPT-4 insight and inner constellation mapping.</p>';
  element.appendChild(footer);

  html2pdf().set({
    margin: 0.5,
    filename: 'inner-constellation.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  }).from(element).save();

  element.removeChild(footer);
};

const emailReport = async () => {
  try {
    await axios.post('/api/send-report', {
      email: userEmail.value.trim(),
      content: plainTextReport.value
    });
    alert('Report sent to your inbox!');
  } catch (err) {
    alert('Sending failed. Try again soon.');
    console.error(err);
  }
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.6s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
"""

# Save to file
path = Path("/mnt/data/generate-report.vue")
path.write_text(generate_report_vue.strip())
path.name
