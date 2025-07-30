<template>
  <router-view />
  <LoginModal :visible="showLogin" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import LoginModal from './components/LoginModal.vue'

const showLogin = ref(false)

onMounted(() => {
  window.Outseta.getCurrentUser()
      .then(user => {
        localStorage.setItem('user', JSON.stringify(user))
      })
      .catch(() => {
        localStorage.removeItem('user')
        showLogin.value = true
      })
})
</script>
