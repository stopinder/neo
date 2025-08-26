<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

/**
 * 🔧 Prompts — 16 items with 3 reverse-scored
 * You can edit wording freely. Keep 10–20 items total.
 * reverse: true means agreement indicates *lower* presence of that signal.
 */
const questions = [
  // Self energy
  { text: 'Beneath strong emotions, I can sense a calm, curious presence.', theme: 'self' },
  { text: 'I can offer myself kindness when I notice a struggle.', theme: 'self' },

  // Managers (protectors)
  { text: 'A “manager” part tries to plan, control, or keep things perfect.', theme: 'manager' },
  { text: 'An inner voice frequently scans for danger or what could go wrong.', theme: 'manager' },
  { text: 'When I’m hurt, a part of me works hard to prove my worth.', theme: 'manager' },

  // Firefighters (protectors)
  { text: 'When distress spikes, another part reaches for quick relief or distraction.', theme: 'firefighter' },
  { text: 'I sometimes soothe pain by numbing out or changing the subject quickly.', theme: 'firefighter' },

  // Exiles
  { text: 'A younger-feeling part in me carries intense emotions or memories.', theme: 'exile' },
  { text: 'When I picture that younger part, I can feel what it needs from me.', theme: 'exile' },

  // Relational / boundaries
  { text: 'It often feels easier to care for others than to ask for what I need.', theme: 'relational' },
  { text: 'Clear boundaries help me stay kind without overextending.', theme: 'boundaries' },

  // Mythic orientation
  { text: 'Symbols, dreams, myth, or poetry help me make sense of my inner life.', theme: 'myth' },
  { text: 'Solitude leaves me feeling nourished and creatively alive.', theme: 'solitude' },

  // Reverse-scored (agreement indicates less of the target quality)
  { text: 'I rarely notice any inner parts—my emotions feel single and simple.', theme: 'awareness', reverse: true },
  { text: 'I must resolve tension immediately; pausing only makes things worse.', theme: 'pacing', reverse: true },
  { text: 'Asking for help usually means I’ve failed.', theme: 'support', reverse: true }
]

// ---- State
const answers = ref({}) // { [qid]: 1..5 }
const loading = ref(false)
const errorMsg = ref('')

// ---- Derived
const totalQuestions = computed(() => questions.length)
const labels = ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
const qId = (q, idx) => q.id ?? (idx + 1)

const answeredCount = computed(() =>
    questions.reduce((n, q, i) => n + (answers.value[qId(q, i)] ? 1 : 0), 0)
)
const allAnswered = computed(() => answeredCount.value === totalQuestions.value)
const progressPct = computed(() =>
    Math.round((answeredCount.value / Math.max(1, totalQuestions.value)) * 100)
)

// ---- Prefill if returning
onMounted(() => {
  try {
    const raw = localStorage.getItem('quizAnswers')
    const prev = JSON.parse(raw || '[]')
    if (Array.isArray(prev) && prev.length) {
      const map = {}
      prev.forEach(({ id, value }) => { if (id != null) map[id] = value })
      answers.value = map
    }
  } catch {}
})

// ---- Submit
async function handleSubmit() {
  if (!allAnswered.value || loading.value) return
  loading.value = true
  errorMsg.value = ''

  const payloadAnswers = questions.map((q, i) => ({
    id: qId(q, i),
    value: Number(answers.value[qId(q, i)])
  }))

  try {
    // Persist locally so FullReport can reload on refresh
    localStorage.setItem('quizAnswers', JSON.stringify(payloadAnswers))

    // Local dev can target live API via VITE_API_BASE
    const base = import.meta.env.VITE_API_BASE || ''
    const res = await fetch(`${base}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: payloadAnswers })
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err?.error || `Request failed (${res.status})`)
    }

    // Navigate to report (FullReport fetches again)
    router.push('/full-report')
  } catch (e) {
    errorMsg.value = e?.message || 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
  }
}

function resetAnswers() {
  answers.value = {}
  errorMsg.value = ''
}
</script>

<template>
  <div class="min-h-screen relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
    <!-- Decorative starfield -->
    <div aria-hidden="true" class="pointer-events-none absolute inset-0 overflow-hidden">
      <div class="absolute -top-32 -left-40 h-80 w-80 rounded-full bg-indigo-500/15 blur-3xl"></div>
      <div class="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-fuchsia-500/10 blur-3xl"></div>
    </div>

    <div class="relative mx-auto max-w-3xl px-6 py-10">
      <!-- Header -->
      <header class="mb-6 text-center">
        <h1 class="text-3xl md:text-4xl font-semibold tracking-tight">Inner Constellation — Quiz</h1>
        <p class="mt-2 text-slate-300 text-sm">
          Reflective entertainment inspired by IFS. Not therapy or diagnosis.
        </p>
      </header>

      <!-- Glass card -->
      <div class="rounded-2xl bg-white/5 backdrop-blur-md text-slate-100 p-6 shadow-xl ring-1 ring-white/10">
        <!-- Micro-instruction -->
        <p class="mb-4 text-sm text-slate-300">
          Answer how it’s <span class="font-semibold">often true for you lately</span>, not ideally.
        </p>

        <!-- Progress -->
        <div class="mb-5">
          <div class="flex items-center justify-between text-xs text-slate-300">
            <span>Progress</span>
            <span>{{ answeredCount }} / {{ totalQuestions }} ({{ progressPct }}%)</span>
          </div>
          <div class="mt-2 h-2 w-full rounded-full bg-white/10 overflow-hidden">
            <div class="h-2 rounded-full bg-amber-400 transition-all duration-300" :style="{ width: progressPct + '%' }"></div>
          </div>
        </div>

        <form @submit.prevent="handleSubmit" aria-describedby="disclaimer">
          <ol class="space-y-6">
            <li
                v-for="(q, idx) in questions"
                :key="qId(q, idx)"
                class="border-b border-white/10 pb-6 last:border-b-0 last:pb-0"
            >
              <fieldset>
                <legend class="mb-3 font-medium text-white/95">
                  {{ idx + 1 }}. {{ q.text }}
                </legend>

                <div class="grid grid-cols-1 sm:grid-cols-5 gap-2">
                  <label
                      v-for="n in 5"
                      :key="n"
                      class="flex cursor-pointer items-center gap-3 rounded-lg border border-white/10 p-3 hover:bg-white/5 transition focus-within:ring-2 focus-within:ring-indigo-400"
                  >
                    <input
                        class="sr-only"
                        type="radio"
                        :name="`q-${qId(q, idx)}`"
                        :value="n"
                        v-model="answers[qId(q, idx)]"
                    />
                    <span
                        class="inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold"
                        :class="Number(answers[qId(q, idx)]) === n ? 'bg-indigo-500 text-white' : 'bg-white/10 text-white/90'"
                    >
                      {{ n }}
                    </span>
                    <span class="text-[11px] text-slate-200/85">
                      {{ labels[n - 1] }}
                    </span>
                  </label>
                </div>
              </fieldset>
            </li>
          </ol>

          <!-- Actions -->
          <div class="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <p id="disclaimer" class="text-xs text-slate-300">
              Your answers are stored locally so the full report can load on refresh.
            </p>

            <div class="flex gap-3">
              <button
                  type="button"
                  class="rounded-full border border-white/20 px-4 py-2 text-sm text-slate-100 hover:bg-white/10 transition"
                  @click="resetAnswers"
                  :disabled="loading"
              >
                Reset
              </button>
              <button
                  type="submit"
                  class="inline-flex items-center rounded-full bg-amber-600 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-500 transition disabled:cursor-not-allowed disabled:bg-amber-300"
                  :disabled="!allAnswered || loading"
              >
                <svg v-if="loading" class="-ml-1 mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                </svg>
                Generate Reflection
              </button>
            </div>
          </div>

          <p v-if="errorMsg" class="mt-4 rounded-lg bg-rose-500/10 p-3 text-sm text-rose-200" aria-live="polite">
            {{ errorMsg }}
          </p>
        </form>
      </div>

      <!-- Small print -->
      <p class="mt-4 text-center text-xs text-slate-400">
        Created for reflection and curiosity. Entertainment only.
      </p>
    </div>
  </div>
</template>

<style scoped>
button { cursor: pointer; }
</style>
