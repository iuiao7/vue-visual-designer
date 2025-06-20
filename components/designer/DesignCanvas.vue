<template>
  <div
    class="
      canvas-container relative flex h-full w-full items-center justify-center
    "
  >
    <!-- 画布背景和网格 -->
    <div
      ref="canvasWrapper"
      class="canvas-wrapper relative"
      :style="canvasWrapperStyle"
      @mousedown="handleCanvasMouseDown"
      @mousemove="handleCanvasMouseMove"
      @mouseup="handleCanvasMouseUp"
      @click="handleCanvasClick"
    >
      <!-- 网格背景 -->
      <div
        v-if="canvasStore.canvasState.showGrid"
        class="pointer-events-none absolute inset-0"
        :style="gridStyle"
      ></div>

      <!-- 主画布 -->
      <div
        ref="canvasElement"
        class="canvas relative border border-gray-300 shadow-lg"
        :style="canvasStyle"
        @drop="handleDrop"
        @dragover="handleDragOver"
        @dragenter="handleDragEnter"
        @dragleave="handleDragLeave"
      >
        <!-- 画布内容提示 -->
        <div
          v-if="canvasStore.canvasState.components.length === 0"
          class="
            pointer-events-none absolute inset-0 flex items-center
            justify-center text-gray-400
          "
        >
          <div class="text-center">
            <UIcon name="lucide:mouse-pointer-2" class="mx-auto mb-2 h-12 w-12" />
            <p class="text-lg">
              画布
            </p>
            <p class="text-sm">
              拖拽组件到这里开始设计
            </p>
          </div>
        </div>

        <!-- 渲染所有组件 -->
        <CanvasComponent
          v-for="component in sortedComponents"
          :key="component.id"
          :component="component"
          :selected="canvasStore.canvasState.selectedComponentIds.includes(component.id)"
          :scale="canvasStore.canvasState.scale"
          @select="handleComponentSelect"
          @update="handleComponentUpdate"
          @delete="handleComponentDelete"
        />

        <!-- 选择框 -->
        <div
          v-if="selectionBox"
          class="
            bg-opacity-10 pointer-events-none absolute border-2 border-blue-500
            bg-blue-500
          "
          :style="selectionBoxStyle"
        ></div>

        <!-- 辅助线 -->
        <div
          v-for="line in guideLines"
          :key="line.id"
          class="pointer-events-none absolute"
          :class="line.type === 'vertical' ? 'border-l-2' : 'border-t-2'"
          :style="line.style"
        ></div>
      </div>
    </div>

    <!-- 画布缩放控制 -->
    <div
      class="
        absolute right-4 bottom-4 flex items-center space-x-2 rounded-lg
        bg-white p-2 shadow-md
      "
    >
      <UButton
        variant="ghost"
        size="xs"
        icon="lucide:zoom-out"
        @click="zoomOut"
      />
      <span class="min-w-12 text-center text-xs text-gray-600">
        {{ Math.round(canvasStore.canvasState.scale * 100) }}%
      </span>
      <UButton
        variant="ghost"
        size="xs"
        icon="lucide:zoom-in"
        @click="zoomIn"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BaseComponent } from '~/types/designer'
import { computed, ref } from 'vue'
import CanvasComponent from '~/components/designer/CanvasComponent.vue'
import { useCanvasStore } from '~/stores/canvas'
import { useHistoryStore } from '~/stores/history'

const canvasStore = useCanvasStore()
const historyStore = useHistoryStore()
// const componentLibraryStore = useComponentLibraryStore()

// DOM 引用
const canvasWrapper = ref<HTMLElement>()
const canvasElement = ref<HTMLElement>()

// 选择框状态
const selectionBox = ref<{
  startX: number
  startY: number
  endX: number
  endY: number
} | null>(null)

// 鼠标状态
const mouseState = ref({
  isDown: false,
  startX: 0,
  startY: 0,
  isDragging: false,
})

// 拖拽状态
const dragState = ref({
  isDragOver: false,
})

// 辅助线状态
const guideLines = ref<Array<{
  id: string
  type: 'vertical' | 'horizontal'
  position: number
  style: any
}>>([])

// 吸附阈值
// const SNAP_THRESHOLD = 5

// 计算属性
const canvasWrapperStyle = computed(() => ({
  transform: `scale(${canvasStore.canvasState.scale})`,
  transformOrigin: 'center center',
}))

const canvasStyle = computed(() => ({
  width: `${canvasStore.canvasState.width}px`,
  height: `${canvasStore.canvasState.height}px`,
  backgroundColor: canvasStore.canvasState.backgroundColor,
  backgroundImage: canvasStore.canvasState.backgroundImage
    ? `url(${canvasStore.canvasState.backgroundImage})`
    : undefined,
}))

const gridStyle = computed(() => {
  const gridSize = canvasStore.canvasState.gridSize
  return {
    backgroundImage: `
      linear-gradient(to right, #e5e7eb 1px, transparent 1px),
      linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
    `,
    backgroundSize: `${gridSize}px ${gridSize}px`,
  }
})

const selectionBoxStyle = computed(() => {
  if (!selectionBox.value)
    return {}

  const { startX, startY, endX, endY } = selectionBox.value
  const left = Math.min(startX, endX)
  const top = Math.min(startY, endY)
  const width = Math.abs(endX - startX)
  const height = Math.abs(endY - startY)

  return {
    left: `${left}px`,
    top: `${top}px`,
    width: `${width}px`,
    height: `${height}px`,
  }
})

// 按 z-index 排序的组件
const sortedComponents = computed(() => {
  return [...canvasStore.canvasState.components].sort((a, b) => a.zIndex - b.zIndex)
})

// 画布鼠标事件处理
function handleCanvasMouseDown(event: MouseEvent) {
  if (event.target !== canvasElement.value)
    return

  mouseState.value.isDown = true
  mouseState.value.startX = event.offsetX
  mouseState.value.startY = event.offsetY

  // 开始选择框
  selectionBox.value = {
    startX: event.offsetX,
    startY: event.offsetY,
    endX: event.offsetX,
    endY: event.offsetY,
  }

  // 清除当前选择
  canvasStore.clearSelection()
}

function handleCanvasMouseMove(event: MouseEvent) {
  if (!mouseState.value.isDown || !selectionBox.value)
    return

  mouseState.value.isDragging = true

  // 更新选择框
  selectionBox.value.endX = event.offsetX
  selectionBox.value.endY = event.offsetY

  // 检查哪些组件在选择框内
  const selectedIds = getComponentsInSelectionBox()
  canvasStore.canvasState.selectedComponentIds = selectedIds
}

function handleCanvasMouseUp(_event: MouseEvent) {
  if (mouseState.value.isDragging && selectionBox.value) {
    // 完成框选
    const selectedIds = getComponentsInSelectionBox()
    canvasStore.canvasState.selectedComponentIds = selectedIds
  }

  // 重置状态
  mouseState.value.isDown = false
  mouseState.value.isDragging = false
  selectionBox.value = null
}

function handleCanvasClick(event: MouseEvent) {
  if (event.target === canvasElement.value) {
    canvasStore.clearSelection()
  }
}

// 获取选择框内的组件
function getComponentsInSelectionBox(): string[] {
  if (!selectionBox.value)
    return []

  const { startX, startY, endX, endY } = selectionBox.value
  const left = Math.min(startX, endX)
  const top = Math.min(startY, endY)
  const right = Math.max(startX, endX)
  const bottom = Math.max(startY, endY)

  return canvasStore.canvasState.components
    .filter((component) => {
      const { x, y, width, height } = component.transform
      return (
        x < right
        && x + width > left
        && y < bottom
        && y + height > top
      )
    })
    .map(component => component.id)
}

// 拖拽处理
function handleDragOver(event: DragEvent) {
  event.preventDefault()
  event.dataTransfer!.dropEffect = 'copy'
  dragState.value.isDragOver = true
}

function handleDragEnter(event: DragEvent) {
  event.preventDefault()
  dragState.value.isDragOver = true
}

function handleDragLeave(event: DragEvent) {
  event.preventDefault()
  dragState.value.isDragOver = false
}

function handleDrop(event: DragEvent) {
  event.preventDefault()
  dragState.value.isDragOver = false

  try {
    const data = JSON.parse(event.dataTransfer!.getData('application/json'))

    if (data.type === 'component') {
      // 计算放置位置
      const rect = canvasElement.value!.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      // 创建新组件
      const componentTemplate = data.componentData
      const _newComponent = canvasStore.addComponent({
        type: componentTemplate.type,
        name: componentTemplate.name,
        locked: false,
        visible: true,
        opacity: 1,
        props: { ...componentTemplate.defaultProps },
        style: { ...componentTemplate.defaultStyle },
        transform: {
          x: Math.max(0, x - (componentTemplate.defaultTransform.width || 100) / 2),
          y: Math.max(0, y - (componentTemplate.defaultTransform.height || 50) / 2),
          width: componentTemplate.defaultTransform.width || 100,
          height: componentTemplate.defaultTransform.height || 50,
          rotation: 0,
          scaleX: 1,
          scaleY: 1,
        },
      })

      // 记录历史
      historyStore.pushHistory(`添加${componentTemplate.name}`, canvasStore.canvasState)

      // 在画布上创建组件: ${newComponent.id}
    }
  }
  catch (error) {
    console.error('处理拖拽数据失败:', error)
  }
}

// 组件事件处理
function handleComponentSelect(componentId: string, multiple = false) {
  canvasStore.selectComponent(componentId, multiple)
}

function handleComponentUpdate(componentId: string, updates: Partial<BaseComponent>) {
  canvasStore.updateComponent(componentId, updates)
  historyStore.debouncedPushHistory('修改组件', canvasStore.canvasState)
}

function handleComponentDelete(componentId: string) {
  canvasStore.removeComponent(componentId)
  historyStore.pushHistory('删除组件', canvasStore.canvasState)
}

// 缩放控制
function zoomIn() {
  const newScale = Math.min(5, canvasStore.canvasState.scale + 0.1)
  canvasStore.setCanvasScale(newScale)
}

function zoomOut() {
  const newScale = Math.max(0.1, canvasStore.canvasState.scale - 0.1)
  canvasStore.setCanvasScale(newScale)
}
</script>

<style scoped>
.canvas-container {
  background: #f8fafc;
  background-image: radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.15) 1px, transparent 0);
  background-size: 20px 20px;
}

.canvas-wrapper {
  transition: transform 0.2s ease;
}

.canvas {
  position: relative;
  background: white;
  overflow: hidden;
}

.canvas.drag-over {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

/* 禁用文本选择 */
.canvas-container {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}
</style>
