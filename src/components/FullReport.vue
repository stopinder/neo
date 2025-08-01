from pathlib import Path

# Final enhanced version of FullReport.vue with:
# - retry if OpenAI fails
# - email capture CTA section wired for Brevo (basic form)
# - graceful loading + fallback
# - future readiness for payment protection middleware

enhanced_full_report_vue = """
<template>
  <div class="min-h-screen bg-gradient-to-br from-ink-night via-midnight to-celestial text-starlight font-poetic p-8 flex items-center justify-center">
    <div class="w-full max-w-3xl space-y-10">
      <!-- Header -->
      <div class="text-center space-y-3">
        <h1 class="text-4xl font-display drop-shadow-lg text-celestial">🪐 Your Inner Constellation</h1>
        <p class="text-starlight/80 italic text-lg max-w-xl mx-auto">The map you are about to receive is drawn from patterns older than language, interpreted through symbolic insight and psychological care.</p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-20">
        <div class="animate-pulse text-lg italic text-starlight/80 mb-6">
          ✨ Drawing your chart from the starlit threads of psyche...
        </div>
        <div class="w-12 h-12 mx-auto border-4 border-celestial border-t-transparent rounded-full animate-spin"></div>
      </div>

      <!-- Error with retry -->
      <div v-else-if="report && report.error" class="text-center text-rose-300 font-medium space-y-4">
        <p>{{ report.error }}</p>
        <button @click="generateReport" class="bg-roseQuartz text-white px-5 py-2 rounded-full shadow-md hover:bg-rose-400 transition">
          🔄 Try Again
        </button>
        <p class="text-sm text-starlight/50">Still stuck? <a href="mailto:support@heliosynthesis.org" class="underline">Email support</a></p>
      </div>

      <!-- Report display -->
      <div v-else id="report-content" class="bg-white/5 backdrop-blur-lg rounded-xl shadow-halo p-6 space-y-10 border border-white/10">
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

        <!-- Footer Quote -->
        <div class="pt-10 border-t border-starlight/10 mt-8 text-center">
          <p class="italic text-starlight/60 text-sm mt-6">
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
              class="bg-white/10 text-white placeholder-white/40 border border-white/20 px-4 py-2 rounded-full w-full max-w-sm focus:outline-none focus:ring focus:ring-periwinkle"
          />
          <button
              :disabled="!isEmailValid"
              @click="emailReport"
              class="bg-celestial hover:bg-periwinkle text-ink-night font-semibold px-6 py-3 rounded-full shadow-aura transition disabled:opacity-50"
          >
            ✉️ Send to My Inbox
          </button>
          <button
              @click="downloadPDF"
              class="bg-roseQuartz hover:bg-rose-400 text-white font-semibold px-6 py-3 rounded-full shadow-aura transition"
          >
            ⬇️ Download Sacred Map (PDF)
          </button>
        </div>

        <!-- Brevo CTA -->
        <div class="pt-10 border-t border-starlight/10 mt-8 text-center">
          <p class="text-starlight/80 text-lg mb-2 font-semibold">🌌 Stay connected to the mythic thread</p>
          <p class="text-starlight/60 text-sm mb-4">Occasional insights, lunar reflections, and constellation updates—direct to your inbox.</p>
          <form action="https://YOUR-BREVO-ENDPOINT" method="POST" target="_blank" class="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3">
            <input type="email" name="EMAIL" required placeholder="Your email" class="bg-white/10 text-white placeholder-white/50 px-4 py-2 rounded-full w-full max-w-xs border border-white/20" />
            <button type="submit" class="bg-periwinkle hover:bg-celestial text-ink-night font-semibold px-5 py-2 rounded-full shadow-aura transition">
              🔭 Join the Orbit
            </button>
          </form>
        </div>
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
    /^[\\w.-]+@([\\w-]+\\.)+[\\w-]{2,4}$/.test(userEmail.value.trim())
);

const plainTextReport = computed(() =>
    Object.entries(report.value).map(([k, v]) =>
        `${formatTitle(k)}:\\n${v}\\n\\n`
    ).join('')
);

onMounted(async () => {
  await generateReport();
});

const generateReport = async () => {
  loading.value = true;
  try {
    const storedAnswersRaw = localStorage.getItem('quizAnswers');
    const storedAnswers = JSON.parse(storedAnswersRaw);
    if (!Array.isArray(storedAnswers) || storedAnswers.length === 0) throw new Error();
    const response = await axios.post('/api/generate-report', { answers: storedAnswers });
    report.value = response.data;
  } catch (error) {
    console.error(error);
    report.value = { error: 'Something went wrong while illuminating your inner terrain.' };
  } finally {
    loading.value = false;
  }
};

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

Path("/mnt/data/FullReport.vue").write_text(enhanced_full_report_vue.strip())
"FullReport.vue"
