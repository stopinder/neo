<script setup>
import { onMounted } from 'vue'

onMounted(async () => {
  try {
    await fetch('/api/set-cookie', {
      method: 'POST',
      credentials: 'include',
    })
  } catch (e) {
    console.error('Cookie setting failed:', e)
  } finally {
    window.location.href = '/full-report'
  }
})
</script>

<template>
  <div class="text-center p-10 text-white">
    <h1 class="text-2xl font-bold">Processing your payment...</h1>
    <p>Redirecting to your full report...</p>
  </div>
</template>
