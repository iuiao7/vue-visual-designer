<template>
  <div
    ref="componentElement"
    class="canvas-component absolute"
    :class="{
      selected,
      locked: component.locked,
      dragging: isDragging,
    }"
    :style="componentStyle"
    @mousedown="handleMouseDown"
    @click="handleClick"
    @dblclick="handleDoubleClick"
  >
    <!-- 组件内容 -->
    <div class="component-content h-full w-full" :style="contentStyle">
      <component
        :is="componentType"
        v-bind="component.props"
        :style="component.style"
        @update="handleContentUpdate"
      />
    </div>

    <!-- 选中状态的边框和控制点 -->
    <div
      v-if="selected && !component.locked"
      class="selection-overlay pointer-events-none absolute inset-0"
    >
      <!-- 选中边框 -->
      <div class="absolute inset-0 rounded-sm border-2 border-blue-500"></div>

      <!-- 缩放控制点 -->
      <div
        v-for="handle in resizeHandles"
        :key="handle.type"
        class="
          resize-handle pointer-events-auto absolute h-2 w-2 rounded-sm border
          border-white bg-blue-500
        "
        :class="`
          resize-${handle.type}
        `"
        :style="handle.style"
        @mousedown.stop="handleResizeStart($event, handle.type)"
      ></div>

      <!-- 旋转控制点 -->
      <div
        class="
          rotate-handle pointer-events-auto absolute h-3 w-3 rounded-full border
          border-white bg-green-500
        "
        :style="rotateHandleStyle"
        @mousedown.stop="handleRotateStart"
      ></div>
    </div>

    <!-- 锁定状态指示器 -->
    <div
      v-if="component.locked"
      class="
        absolute top-1 right-1 flex h-4 w-4 items-center justify-center
        rounded-full bg-red-500
      "
    >
      <UIcon name="lucide:lock" class="h-2 w-2 text-white" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BaseComponent, ResizeHandle } from '~/types/designer'
import { computed, ref } from 'vue'

interface Props {
  component: BaseComponent
  selected: boolean
  scale: number
}

interface Emits {
  (e: 'select', id: string, multiple?: boolean): void
  (e: 'update', id: string, updates: Partial<BaseComponent>): void
  (e: 'delete', id: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// DOM 引用
const componentElement = ref<HTMLElement>()

// 拖拽状态
const isDragging = ref(false)
const dragState = ref({
  startX: 0,
  startY: 0,
  startComponentX: 0,
  startComponentY: 0,
})

// 缩放状态
const isResizing = ref(false)
const resizeState = ref({
  handle: '' as ResizeHandle,
  startX: 0,
  startY: 0,
  startWidth: 0,
  startHeight: 0,
  startComponentX: 0,
  startComponentY: 0,
})

// 旋转状态
const isRotating = ref(false)
const rotateState = ref({
  startAngle: 0,
  startRotation: 0,
  centerX: 0,
  centerY: 0,
})

// 计算属性
const componentStyle = computed(() => ({
  left: `${props.component.transform.x}px`,
  top: `${props.component.transform.y}px`,
  width: `${props.component.transform.width}px`,
  height: `${props.component.transform.height}px`,
  transform: `rotate(${props.component.transform.rotation}deg) scale(${props.component.transform.scaleX}, ${props.component.transform.scaleY})`,
  zIndex: props.component.zIndex,
  opacity: props.component.opacity,
  visibility: props.component.visible ? 'visible' as const : 'hidden' as const,
  cursor: props.component.locked ? 'not-allowed' : (isDragging.value ? 'grabbing' : 'grab'),
}))

const contentStyle = computed(() => ({
  pointerEvents: props.selected ? 'none' as const : 'auto' as const,
}))

const componentType = computed(() => {
  const typeMap: Record<string, string> = {
    text: 'TextComponent',
    image: 'ImageComponent',
    container: 'ContainerComponent',
    button: 'ButtonComponent',
    input: 'InputComponent',
  }
  return typeMap[props.component.type] || 'div'
})

// 缩放控制点
const resizeHandles = computed(() => {
  const handles: Array<{ type: ResizeHandle, style: any }> = [
    { type: 'nw', style: { top: '-4px', left: '-4px', cursor: 'nw-resize' } },
    { type: 'n', style: { top: '-4px', left: '50%', transform: 'translateX(-50%)', cursor: 'n-resize' } },
    { type: 'ne', style: { top: '-4px', right: '-4px', cursor: 'ne-resize' } },
    { type: 'e', style: { top: '50%', right: '-4px', transform: 'translateY(-50%)', cursor: 'e-resize' } },
    { type: 'se', style: { bottom: '-4px', right: '-4px', cursor: 'se-resize' } },
    { type: 's', style: { bottom: '-4px', left: '50%', transform: 'translateX(-50%)', cursor: 's-resize' } },
    { type: 'sw', style: { bottom: '-4px', left: '-4px', cursor: 'sw-resize' } },
    { type: 'w', style: { top: '50%', left: '-4px', transform: 'translateY(-50%)', cursor: 'w-resize' } },
  ]
  return handles
})

// 旋转控制点样式
const rotateHandleStyle = computed(() => ({
  top: '-20px',
  left: '50%',
  transform: 'translateX(-50%)',
  cursor: 'grab',
}))

// 鼠标事件处理
function handleMouseDown(event: MouseEvent) {
  if (props.component.locked)
    return

  event.stopPropagation()

  // 如果不是多选模式，先选中当前组件
  if (!event.ctrlKey && !event.metaKey) {
    emit('select', props.component.id)
  }

  // 开始拖拽
  startDrag(event)
}

function handleClick(event: MouseEvent) {
  event.stopPropagation()

  const multiple = event.ctrlKey || event.metaKey
  emit('select', props.component.id, multiple)
}

function handleDoubleClick(event: MouseEvent) {
  event.stopPropagation()

  // 双击进入编辑模式（如果是文字组件）
  if (props.component.type === 'text') {
    // TODO: 实现文字编辑模式
    // TODO: 进入文字编辑模式
  }
}

// 拖拽功能
function startDrag(event: MouseEvent) {
  isDragging.value = true

  dragState.value = {
    startX: event.clientX,
    startY: event.clientY,
    startComponentX: props.component.transform.x,
    startComponentY: props.component.transform.y,
  }

  document.addEventListener('mousemove', handleDragMove)
  document.addEventListener('mouseup', handleDragEnd)
}

function handleDragMove(event: MouseEvent) {
  if (!isDragging.value)
    return

  const deltaX = (event.clientX - dragState.value.startX) / props.scale
  const deltaY = (event.clientY - dragState.value.startY) / props.scale

  const newX = dragState.value.startComponentX + deltaX
  const newY = dragState.value.startComponentY + deltaY

  emit('update', props.component.id, {
    transform: {
      ...props.component.transform,
      x: Math.max(0, newX),
      y: Math.max(0, newY),
    },
  })
}

function handleDragEnd() {
  isDragging.value = false

  document.removeEventListener('mousemove', handleDragMove)
  document.removeEventListener('mouseup', handleDragEnd)
}

// 缩放功能
function handleResizeStart(event: MouseEvent, handle: ResizeHandle) {
  event.stopPropagation()

  isResizing.value = true
  resizeState.value = {
    handle,
    startX: event.clientX,
    startY: event.clientY,
    startWidth: props.component.transform.width,
    startHeight: props.component.transform.height,
    startComponentX: props.component.transform.x,
    startComponentY: props.component.transform.y,
  }

  document.addEventListener('mousemove', handleResizeMove)
  document.addEventListener('mouseup', handleResizeEnd)
}

function handleResizeMove(event: MouseEvent) {
  if (!isResizing.value)
    return

  const deltaX = (event.clientX - resizeState.value.startX) / props.scale
  const deltaY = (event.clientY - resizeState.value.startY) / props.scale

  const { handle } = resizeState.value
  let newWidth = resizeState.value.startWidth
  let newHeight = resizeState.value.startHeight
  let newX = resizeState.value.startComponentX
  let newY = resizeState.value.startComponentY

  // 根据控制点类型计算新的尺寸和位置
  if (handle.includes('e')) {
    newWidth = Math.max(20, resizeState.value.startWidth + deltaX)
  }
  if (handle.includes('w')) {
    newWidth = Math.max(20, resizeState.value.startWidth - deltaX)
    newX = resizeState.value.startComponentX + deltaX
  }
  if (handle.includes('s')) {
    newHeight = Math.max(20, resizeState.value.startHeight + deltaY)
  }
  if (handle.includes('n')) {
    newHeight = Math.max(20, resizeState.value.startHeight - deltaY)
    newY = resizeState.value.startComponentY + deltaY
  }

  emit('update', props.component.id, {
    transform: {
      ...props.component.transform,
      x: Math.max(0, newX),
      y: Math.max(0, newY),
      width: newWidth,
      height: newHeight,
    },
  })
}

function handleResizeEnd() {
  isResizing.value = false

  document.removeEventListener('mousemove', handleResizeMove)
  document.removeEventListener('mouseup', handleResizeEnd)
}

// 旋转功能
function handleRotateStart(event: MouseEvent) {
  event.stopPropagation()

  isRotating.value = true

  const rect = componentElement.value!.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2

  const startAngle = Math.atan2(event.clientY - centerY, event.clientX - centerX)

  rotateState.value = {
    startAngle,
    startRotation: props.component.transform.rotation,
    centerX,
    centerY,
  }

  document.addEventListener('mousemove', handleRotateMove)
  document.addEventListener('mouseup', handleRotateEnd)
}

function handleRotateMove(event: MouseEvent) {
  if (!isRotating.value)
    return

  const { centerX, centerY, startAngle, startRotation } = rotateState.value
  const currentAngle = Math.atan2(event.clientY - centerY, event.clientX - centerX)
  const deltaAngle = (currentAngle - startAngle) * (180 / Math.PI)

  let newRotation = startRotation + deltaAngle

  // 按住 Shift 键时，以 15 度为单位旋转
  if (event.shiftKey) {
    newRotation = Math.round(newRotation / 15) * 15
  }

  emit('update', props.component.id, {
    transform: {
      ...props.component.transform,
      rotation: newRotation % 360,
    },
  })
}

function handleRotateEnd() {
  isRotating.value = false

  document.removeEventListener('mousemove', handleRotateMove)
  document.removeEventListener('mouseup', handleRotateEnd)
}

// 内容更新处理
function handleContentUpdate(updates: any) {
  emit('update', props.component.id, {
    props: {
      ...props.component.props,
      ...updates,
    },
  })
}

// 键盘事件处理
function handleKeyDown(event: KeyboardEvent) {
  if (!props.selected)
    return

  switch (event.key) {
    case 'Delete':
    case 'Backspace':
      event.preventDefault()
      emit('delete', props.component.id)
      break
  }
}

// 组件挂载时添加键盘监听
onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
.canvas-component {
  transition: none;
}

.canvas-component.selected {
  z-index: 9999;
}

.canvas-component.locked {
  cursor: not-allowed !important;
}

.canvas-component.dragging {
  cursor: grabbing !important;
}

.selection-overlay {
  z-index: 10;
}

.resize-handle {
  transition: all 0.1s ease;
}

.resize-handle:hover {
  transform: scale(1.2);
  background-color: #3b82f6;
}

.rotate-handle {
  transition: all 0.1s ease;
}

.rotate-handle:hover {
  transform: translateX(-50%) scale(1.2);
  background-color: #10b981;
}

/* 禁用文本选择 */
.canvas-component {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}
</style>
