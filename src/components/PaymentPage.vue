<template>
  <div class="min-h-screen bg-gradient-to-br from-navy to-space-gray text-white font-body px-6 py-20 flex flex-col items-center justify-center text-center">
    <div class="max-w-md space-y-6">
      <h2 class="text-4xl font-display text-white drop-shadow-lg">
        Ready for Your Full Report?
      </h2>
      <p class="text-lg text-sky-soft leading-relaxed">
        Unlock all 15-question insights — including symbolic personality mapping, relational dynamics, and your unique IFS constellation.
      </p>
      <button
          @click="goToCheckout"
          class="bg-sun-gold hover:bg-ink-night text-white font-semibold py-3 px-8 rounded-full shadow-aura transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sun-gold"
      >
        Proceed to Payment
      </button>

    </div>
  </div>
</template>

<script setup>
async function goToCheckout() {
  const res = await fetch('/api/create-checkout-session', { method: 'POST' })
  const data = await res.json()
  window.location.href = data.url
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Playfair+Display:wght@600&display=swap');
</style>
