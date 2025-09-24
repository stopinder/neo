<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

/**
 * Prompts — 16 items with 3 reverse-scored
 * You can edit wording freely. Backend should accept 10–20 items.
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
  } catch {
    // ignore prefill errors
  }
})

// ---- Submit
async function handleSubmit () {
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

    // Use local API in dev if VITE_API_BASE is set
    const base = import.meta.env.VITE_API_BASE || ''
    const res = await fetch(`${base}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: payloadAnswers })
    })

    // Grab raw text so you can see real server errors
    const text = await res.text()
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText}\n${text || 'No server message'}`)
    }

    // Navigate to report (FullReport fetches again)
    router.push('/full-report')
  } catch (e) {
    errorMsg.value = e?.message || 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
  }
}

function resetAnswers () {
  answers.value = {}
  errorMsg.value = ''
}
</script>
