<template>
  <div
    class="text-component flex h-full w-full items-center"
    :style="textStyle"
    @dblclick="startEditing"
  >
    <!-- 编辑模式 -->
    <textarea
      v-if="isEditing"
      ref="textareaRef"
      v-model="editingText"
      class="h-full w-full resize-none border-none bg-transparent outline-none"
      :style="textStyle"
      @blur="finishEditing"
      @keydown="handleKeydown"
    ></textarea>

    <!-- 显示模式 -->
    <div
      v-else
      class="flex h-full w-full items-center"
      :style="alignmentStyle"
    >
      <span
        class="break-words whitespace-pre-wrap"
        :style="textStyle"
      >
        {{ text || '双击编辑文字' }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'

interface Props {
  text?: string
  fontSize?: number
  fontFamily?: string
  fontWeight?: string
  color?: string
  textAlign?: 'left' | 'center' | 'right'
  lineHeight?: number
  letterSpacing?: number
}

interface Emits {
  (e: 'update', updates: Partial<Props>): void
}

const props = withDefaults(defineProps<Props>(), {
  text: '双击编辑文字',
  fontSize: 16,
  fontFamily: 'Arial, sans-serif',
  fontWeight: 'normal',
  color: '#333333',
  textAlign: 'left',
  lineHeight: 1.5,
  letterSpacing: 0,
})

const emit = defineEmits<Emits>()

// 编辑状态
const isEditing = ref(false)
const editingText = ref('')
const textareaRef = ref<HTMLTextAreaElement>()

// 计算样式
const textStyle = computed(() => ({
  fontSize: `${props.fontSize}px`,
  fontFamily: props.fontFamily,
  fontWeight: props.fontWeight,
  color: props.color,
  lineHeight: props.lineHeight,
  letterSpacing: `${props.letterSpacing}px`,
  width: '100%',
  height: '100%',
}))

const alignmentStyle = computed(() => ({
  justifyContent: props.textAlign === 'center' ? 'center' : props.textAlign === 'right' ? 'flex-end' : 'flex-start',
  textAlign: props.textAlign,
}))

// 开始编辑
function startEditing() {
  isEditing.value = true
  editingText.value = props.text || ''

  nextTick(() => {
    if (textareaRef.value) {
      textareaRef.value.focus()
      textareaRef.value.select()
    }
  })
}

// 完成编辑
function finishEditing() {
  isEditing.value = false

  if (editingText.value !== props.text) {
    emit('update', { text: editingText.value })
  }
}

// 键盘事件处理
function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    // ESC 取消编辑
    isEditing.value = false
    editingText.value = props.text || ''
  }
  else if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
    // Ctrl+Enter 或 Cmd+Enter 完成编辑
    finishEditing()
  }

  // 阻止事件冒泡，避免触发画布的键盘事件
  event.stopPropagation()
}
</script>

<style scoped>
.text-component {
  cursor: text;
}

.text-component textarea {
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  color: inherit;
  line-height: inherit;
  letter-spacing: inherit;
}

.text-component textarea:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
</style>
