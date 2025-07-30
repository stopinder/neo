<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" v-if="visible">
    <div class="bg-white p-6 rounded shadow-lg max-w-sm w-full text-center">
      <h2 class="text-xl font-semibold mb-4">Welcome</h2>
      <p class="mb-4">Log in or sign up to access your report.</p>
      <div class="flex justify-center gap-4">
        <button class="bg-indigo-600 text-white px-4 py-2 rounded" @click="login">Login</button>
        <button class="bg-gray-600 text-white px-4 py-2 rounded" @click="signup">Sign Up</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({ visible: Boolean })

const login = () => window.Outseta.showLogin()
const signup = () => window.Outseta.showSignup()
</script>
