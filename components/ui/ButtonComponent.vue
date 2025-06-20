<template>
  <button
    class="button-component flex h-full w-full items-center justify-center"
    :style="buttonStyle"
    @click="handleClick"
  >
    {{ text || '按钮' }}
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  text?: string
  fontSize?: number
  fontWeight?: string
  color?: string
  backgroundColor?: string
  borderRadius?: number
  padding?: string
}

interface Emits {
  (e: 'update', updates: Partial<Props>): void
  (e: 'click'): void
}

const props = withDefaults(defineProps<Props>(), {
  text: '按钮',
  fontSize: 14,
  fontWeight: 'bold',
  color: '#ffffff',
  backgroundColor: '#007bff',
  borderRadius: 4,
  padding: '8px 16px',
})

const emit = defineEmits<Emits>()

const buttonStyle = computed(() => ({
  fontSize: `${props.fontSize}px`,
  fontWeight: props.fontWeight,
  color: props.color,
  backgroundColor: props.backgroundColor,
  borderRadius: `${props.borderRadius}px`,
  padding: props.padding,
  border: 'none',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
}))

function handleClick() {
  emit('click')
}
</script>

<style scoped>
.button-component:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.button-component:active {
  transform: translateY(0);
}
</style>
