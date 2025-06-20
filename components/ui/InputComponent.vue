<template>
  <input
    v-model="inputValue"
    class="input-component h-full w-full"
    :style="inputStyle"
    :placeholder="placeholder"
    @input="handleInput"
    @focus="handleFocus"
    @blur="handleBlur"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  placeholder?: string
  value?: string
  fontSize?: number
  color?: string
  backgroundColor?: string
  borderWidth?: number
  borderColor?: string
  borderRadius?: number
  padding?: string
}

interface Emits {
  (e: 'update', updates: Partial<Props>): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '请输入内容',
  value: '',
  fontSize: 14,
  color: '#333',
  backgroundColor: '#ffffff',
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 4,
  padding: '8px 12px',
})

const emit = defineEmits<Emits>()

const inputValue = ref(props.value)

const inputStyle = computed(() => ({
  fontSize: `${props.fontSize}px`,
  color: props.color,
  backgroundColor: props.backgroundColor,
  border: `${props.borderWidth}px solid ${props.borderColor}`,
  borderRadius: `${props.borderRadius}px`,
  padding: props.padding,
  outline: 'none',
}))

function handleInput() {
  emit('update', { value: inputValue.value })
}

function handleFocus() {
  // 可以添加聚焦样式
}

function handleBlur() {
  // 可以添加失焦样式
}

// 监听外部 value 变化
watch(() => props.value, (newValue) => {
  inputValue.value = newValue || ''
})
</script>

<style scoped>
.input-component:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}
</style>
