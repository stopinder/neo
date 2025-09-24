<template>
  <div
      class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white font-body px-6 py-16 flex flex-col items-center justify-center relative overflow-hidden"
  >
    <!-- Decorative glow -->
    <div aria-hidden="true" class="pointer-events-none absolute inset-0">
      <div
          class="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl"
      ></div>
      <div
          class="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-fuchsia-500/10 blur-3xl"
      ></div>
    </div>

    <!-- Branding -->
    <a
        href="https://robormiston.com"
        target="_blank"
        rel="noopener noreferrer"
        class="absolute top-6 left-6 inline-flex items-center gap-3 text-sky-300/90 hover:text-sky-100 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-400 focus:ring-offset-slate-900 rounded"
    >
      <img
          src="/but.png"
          alt="Chrysalis Therapy Services — butterfly emblem"
          class="w-10 h-10 rounded transition-transform duration-300 hover:scale-105"
          loading="lazy"
      />
      <span class="text-base font-semibold">Chrysalis Therapy Services</span>
    </a>

    <!-- Disclaimer -->
    <div
        class="mt-20 mb-8 w-full max-w-3xl rounded-xl border border-indigo-300/30 bg-indigo-900/30 px-4 py-3 text-indigo-100 shadow-sm"
        role="note"
        aria-live="polite"
    >
      <p class="text-sm">
        <span class="font-semibold">Friendly note:</span>
        This is reflective entertainment inspired by Internal Family Systems
        (IFS). It is not therapy, diagnosis, or medical advice.
      </p>
    </div>

    <!-- Headline -->
    <h1
        class="text-center text-5xl md:text-6xl font-bold leading-tight tracking-tight drop-shadow-sm"
    >
      Discover Your Inner Constellation
    </h1>

    <!-- Subheadline -->
    <p class="mt-4 text-center text-sky-200/90 max-w-2xl text-lg">
      A short IFS-inspired mirror of your inner world—naming protectors, exiles,
      and Self energy with a light mythopoetic touch.
    </p>

    <!-- Feature bullets -->
    <ul
        class="mt-8 grid grid-cols-1 gap-4 text-center sm:grid-cols-3 w-full max-w-3xl"
    >
      <li class="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
        <div class="text-2xl">🛡️</div>
        <p class="mt-1 text-sm text-slate-200">
          Notice how your protectors try to help
        </p>
      </li>
      <li class="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
        <div class="text-2xl">🌿</div>
        <p class="mt-1 text-sm text-slate-200">
          Meet the younger parts that carry feeling
        </p>
      </li>
      <li class="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
        <div class="text-2xl">✨</div>
        <p class="mt-1 text-sm text-slate-200">
          Touch Self—calm, curious, compassionate
        </p>
      </li>
    </ul>

    <!-- Microcopy -->
    <p class="mt-4 text-xs text-slate-300">
      ~3 minutes • no signup • private by default
    </p>

    <!-- CTA -->
    <div class="mt-6 flex flex-col items-center gap-4">
      <router-link
          to="/quiz"
          class="inline-flex items-center justify-center rounded-full bg-amber-600 px-8 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-400 focus:ring-offset-slate-900"
      >
        Begin the Reflection
      </router-link>

      <button
          class="text-sky-300/90 hover:text-sky-100 text-sm underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-400 focus:ring-offset-slate-900 rounded"
          @click="showMore = !showMore"
          :aria-expanded="showMore.toString()"
          aria-controls="what-is-this"
      >
        What is this?
      </button>
    </div>

    <!-- Explainer -->
    <section
        id="what-is-this"
        v-show="showMore"
        class="mt-6 w-full max-w-3xl rounded-2xl bg-white/5 p-6 ring-1 ring-white/10"
    >
      <h2 class="text-xl font-semibold">How it works</h2>
      <p class="mt-2 text-slate-200 text-sm leading-relaxed">
        You’ll answer a handful of brief prompts. We generate a short
        IFS-inspired reflection that may name a few
        <em>protectors</em> (managers/firefighters), possible
        <em>exiles</em> (younger parts that carry intense feelings), and the
        presence of <em>Self</em>—the calm, curious awareness that can relate to
        all parts with compassion.
      </p>
      <p class="mt-2 text-slate-300 text-sm">
        It’s imaginative and symbolic—designed to spark reflection, not to label
        or diagnose.
      </p>

      <div
          class="mt-4 rounded-xl bg-amber-500/10 border border-amber-400/30 px-4 py-3 text-amber-200 text-sm"
      >
        <strong>Why this exists:</strong> This playful mirror helps fund a
        larger, clinician-led project: an AI-assisted “container” where
        therapists and clients work together—AI as a <em>mirror</em>, not a
        replacement.
      </div>
    </section>

    <!-- Footer -->
    <footer class="mt-12 w-full max-w-3xl text-center text-xs text-slate-400">
      <p>
        © {{ year }} Notes on Ordinary Madness • Made with care.
        Privacy-respecting by design.
      </p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showMore = ref(false)
const year = new Date().getFullYear()
</script>

<style scoped>
:root {
  --ring-offset-shadow: 0 0 #0000;
  --ring-shadow: 0 0 #0000;
}

/* Fallback if Tailwind isn’t present */
.font-body {
  font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto,
  'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji',
  'Segoe UI Symbol', sans-serif;
}
</style>

