<template>
  <div class="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-xl space-y-6 text-gray-800">
    <h2 class="text-2xl font-bold text-indigo-700">🎉 You’ve completed the free quiz!</h2>

    <div class="space-y-2">
      <p class="text-gray-700">Here’s what we’ve discovered so far:</p>
      <ul class="list-disc list-inside space-y-1">
        <li><strong>You likely align with Enneagram Type 4w5</strong></li>
        <li><strong>You may show signs of anxious-avoidant attachment</strong></li>
        <li><strong>A part of you seeks intimacy but fears vulnerability</strong></li>
      </ul>
    </div>

    <div class="border-t border-gray-200 pt-4">
      <h3 class="text-xl font-semibold">🔓 Unlock your full personality map</h3>
      <p class="mt-2">Get deeper insights with 5 more questions and a downloadable report:</p>
      <ul class="list-disc list-inside mt-2 space-y-1">
        <li>Your dominant and shadow parts (IFS)</li>
        <li>Attachment triggers and healing paths</li>
        <li>Enneagram subtype breakdown</li>
        <li>Relational strengths & growth areas</li>
      </ul>
    </div>

    <div class="border-t border-gray-200 pt-4 space-y-1 text-sm text-gray-500">
      <p>⭐ Based on Enneagram, IFS, and Attachment Theory</p>
      <p>🔒 Secure payment via Stripe</p>
    </div>

    <div class="flex flex-col sm:flex-row sm:justify-between gap-4 pt-4">
      <button class="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition">
        Unlock Full Report – $12
      </button>
      <button class="text-gray-500 hover:underline text-sm">Maybe later</button>
    </div>
  </div>
</template>

<script setup>
// No logic yet—this is purely static content until you integrate Stripe and routing
</script>

<style scoped>
/* No extra styles needed */
</style>
