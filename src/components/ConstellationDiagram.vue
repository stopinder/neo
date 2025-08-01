<template>
  <svg viewBox="0 0 300 300" class="w-full h-64 mx-auto">
    <!-- Background ring -->
    <circle cx="150" cy="150" r="130" fill="none" stroke="url(#radial)" stroke-width="0.5" />

    <!-- Connect lines with animation -->
    <line
        v-for="(point, index) in coords"
        v-if="coords[index + 1]"
        :x1="point.x"
        :y1="point.y"
        :x2="coords[index + 1].x"
        :y2="coords[index + 1].y"
        stroke="white"
        stroke-opacity="0.3"
        stroke-width="1"
        class="line"
    />

    <!-- Nodes -->
    <g v-for="(point, index) in coords" :key="index">
      <circle
          :cx="point.x"
          :cy="point.y"
          r="6"
          fill="white"
          class="node"
          :style="{ animationDelay: `${index * 0.1}s` }"
      />
      <text
          :x="point.x + 8"
          :y="point.y - 8"
          class="font-body text-xs fill-indigo-200"
          :style="{ animationDelay: `${index * 0.1}s` }"
      >
        {{ point.label }}
      </text>
    </g>

    <defs>
      <radialGradient id="radial" cx="50%" cy="50%" r="100%">
        <stop offset="0%" stop-color="#6366f1" stop-opacity="0.3" />
        <stop offset="100%" stop-color="#0f172a" stop-opacity="0" />
      </radialGradient>
    </defs>
  </svg>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  labels: {
    type: Array,
    required: true
  }
})

const radius = 100
const centerX = 150
const centerY = 150

const coords = computed(() =>
    props.labels.map((label, i, all) => {
      const angle = (2 * Math.PI * i) / all.length
      return {
        label,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      }
    })
)
</script>

<style scoped>
.node, text {
  opacity: 0;
  animation: fadeIn 0.5s ease forwards;
}

.line {
  stroke-dasharray: 300;
  stroke-dashoffset: 300;
  animation: drawLine 1.2s ease forwards;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

@keyframes drawLine {
  to {
    stroke-dashoffset: 0;
  }
}
</style>
