<template>
  <div
      class="min-h-screen bg-gradient-to-br from-moon-glow via-ether to-ink-night text-ink-night font-serif p-6 flex items-center justify-center"
  >
    <div class="max-w-3xl w-full text-center space-y-8">
      <div>
        <h2
            class="text-4xl font-display text-ink-night drop-shadow mb-2"
        >
          Your Inner Constellation
        </h2>
        <p class="text-ink-night/80">
          A clinical synthesis of your IFS system, Enneagram type, attachment style,
          and relational dynamics.
        </p>
      </div>

      <!-- Soft pulsing loader with brighter pulse color -->
      <div
          v-if="loading"
          class="flex flex-col items-center justify-center text-center space-y-4 animate-slowPulse text-sun-gold min-h-[40vh]"
      >
        <p class="text-lg font-poetic tracking-wide">
          Mapping your inner constellation...
        </p>
      </div>

      <div
          v-else-if="filteredReport && Object.keys(filteredReport).length && !filteredReport.error"
          id="report-content"
          class="text-left bg-white/80 text-ink-night shadow-glow rounded-xl p-6 space-y-6"
      >
        <TransitionGroup name="fade" tag="div">
          <div v-for="item in orderedSections" :key="item.section">
            <h3
                class="text-xl font-display font-semibold text-ink-night capitalize mt-4"
            >
              {{ formatTitle(item.section) }}
            </h3>
            <p class="mt-2 whitespace-pre-wrap leading-relaxed text-ink-night/90">
              {{ item.value }}
            </p>
          </div>
        </TransitionGroup>

        <!-- Mission paragraph -->
        <div
            class="mt-8 text-center text-sm text-ink-night/70 italic motion-safe:animate-fadeIn"
        >
          <p>
            Curious about the purpose behind this quiz?
            Visit
            <a
                href="https://yourwebsite.com/mission"
                target="_blank"
                class="underline hover:text-sun-gold"
            >my website</a
            >
            to learn about my mission to support therapists and seekers alike.
          </p>
        </div>

        <!-- Actions: Copy and Download only -->
        <div class="flex flex-col items-center space-y-4 pt-6">
          <button
              @click="copyReportToClipboard"
              class="bg-ink-night hover:bg-sun-gold text-white font-semibold px-6 py-3 rounded-full shadow-aura transition"
          >
            Copy Report to Clipboard
          </button>

          <button
              @click="downloadPDF"
              class="bg-ink-night hover:bg-sun-gold text-white font-semibold px-6 py-3 rounded-full shadow-aura transition"
          >
            Download Report (PDF)
          </button>
        </div>
      </div>

      <!-- Error state with Try Again button -->
      <div
          v-else
          class="text-rose-300 font-medium flex flex-col items-center space-y-4"
      >
        <p>
          {{ filteredReport.error ||
        "Something went wrong while illuminating your inner terrain." }}
        </p>
        <button
            @click="retryFetchReport"
            class="bg-rose-300 hover:bg-rose-400 text-white font-semibold px-6 py-3 rounded-full shadow-aura transition"
        >
          Try Again
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import html2pdf from "html2pdf.js";

const report = ref({});
const loading = ref(true);

const sectionTitles = {
  report: "📄 Full Report",
  core_profile: "✨ Core Profile",
  ifs_dynamics: "🛡️ IFS Dynamics",
  enneagram_pattern: "🌿 Enneagram Pattern",
  attachment_style: "🕊️ Attachment Style",
  transactional_analysis: "🧠 Transactional Analysis",
  relational_dynamics: "🔄 Relational Patterning",
  attraction_dynamics: "💞 Relational Magnetics & Attraction Patterns",
  mythic_comparison: "🌓 Mythic Reflection",
  invitation: "🪞 A Gentle Invitation",
};

const formatTitle = (key) => sectionTitles[key] || key;

function cleanReport(payload) {
  if (payload && typeof payload === "object") {
    const clone = { ...payload };
    delete clone.framework_sources;
    return clone;
  }
  if (typeof payload === "string") {
    let out = payload;
    out = out.replace(/\n```json[\s\S]*?```\s*$/i, "");
    out = out.replace(/\n?framework_sources\s*\{[\s\S]*?\}\s*$/i, "");
    out = out.replace(/```+/g, "");
    const trimmed = out.trim();
    return trimmed ? { report: trimmed } : { error: "Empty report received." };
  }
  return { error: "Unexpected report format." };
}

const filteredReport = computed(() => report.value);

const orderedSections = computed(() => {
  const obj = filteredReport.value || {};
  const keys = Object.keys(obj).filter((k) => k !== "error");
  const order = Object.keys(sectionTitles);
  keys.sort((a, b) => {
    const ia = order.indexOf(a);
    const ib = order.indexOf(b);
    return ia === -1 ? 999 : ia - (ib === -1 ? 999 : ib);
  });
  return keys.map((k) => ({ section: k, value: obj[k] }));
});

const plainTextReport = computed(() =>
    orderedSections.value
        .map(({ section, value }) => `${formatTitle(section)}:\n${value}\n`)
        .join("\n")
);

async function fetchReport() {
  const storedAnswersRaw = localStorage.getItem("quizAnswers");
  let storedAnswers;

  try {
    storedAnswers = JSON.parse(storedAnswersRaw);
    if (!Array.isArray(storedAnswers) || storedAnswers.length === 0) throw new Error();
  } catch {
    report.value = { error: "No quiz data found. Please retake the quiz." };
    loading.value = false;
    return;
  }

  try {
    const response = await axios.post("/api/generate-report", { answers: storedAnswers });
    report.value = cleanReport(response.data);
  } catch (error) {
    console.error(error);
    report.value = { error: "Something went wrong while illuminating your inner terrain." };
  } finally {
    loading.value = false;
  }
}

function downloadPDF() {
  const element = document.getElementById("report-content");
  if (!element) return;

  const footer = document.createElement("div");
  footer.innerHTML =
      '<p style="margin-top: 2em; font-style: italic; text-align: center; font-size: 12px;">🔮 Generated with GPT-4 insight and inner constellation mapping.</p>';
  element.appendChild(footer);

  html2pdf()
      .set({
        margin: 0.5,
        filename: "report.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      })
      .from(element)
      .save();

  element.removeChild(footer);
}

async function copyReportToClipboard() {
  try {
    await navigator.clipboard.writeText(plainTextReport.value);
    alert("Report copied to clipboard!");
  } catch (err) {
    alert("Failed to copy. Try again.");
    console.error(err);
  }
}

function retryFetchReport() {
  loading.value = true;
  fetchReport();
}

onMounted(() => {
  fetchReport();
});
</script>

<style>
/* Fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Soft pulsing loader with brighter colors */
@keyframes slowPulse {
  0% {
    opacity: 0.6;
    color: #fbbf24; /* sun gold */
  }
  50% {
    opacity: 1;
    color: #fcd34d; /* brighter sun gold */
  }
  100% {
    opacity: 0.6;
    color: #fbbf24;
  }
}
.animate-slowPulse {
  animation: slowPulse 2.4s ease-in-out infinite;
}
</style>
