<template>
  <div class="min-h-screen flex items-center justify-center px-4 text-center">
    <div class="max-w-md">
      <h2 class="text-3xl font-bold mb-4 text-gray-800">Ready for your full report?</h2>
      <p class="text-lg text-gray-600 mb-6">
        Unlock all 15-question insights, including relational patterns and IFS-based profiles.
      </p>
      <button
          @click="goToCheckout"
          class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition"
      >
        Proceed to Payment
      </button>
    </div>
  </div>
</template>

<script setup>
function goToCheckout() {
  window.location.href = 'https://buy.stripe.com/dRmdR8dy2bWNg2855ic3m02S'
}
</script>

