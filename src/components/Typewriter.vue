<template>
  <Typewriter :text="value" :speed="25" />

  {{ displayedText }}

</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import Typewriter from '@/components/Typewriter.vue'

const props = defineProps({
  text: String,
  speed: { type: Number, default: 25 }
})

const displayedText = ref('')
let i = 0

const type = () => {
  if (i < props.text.length) {
    displayedText.value += props.text[i++]
    setTimeout(type, props.speed)
  }
}

watch(() => props.text, () => {
  displayedText.value = ''
  i = 0
  type()
})

onMounted(type)
</script>
