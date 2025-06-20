<template>
  <div
    class="
      flex h-14 items-center justify-between border-b border-gray-200 bg-white
      px-4
    "
  >
    <!-- 左侧操作区 -->
    <div class="flex items-center space-x-2">
      <!-- 撤销重做 -->
      <div class="flex items-center space-x-1">
        <UButton
          :disabled="!historyStore.canUndo"
          variant="ghost"
          size="sm"
          icon="lucide:undo-2"
          title="撤销 (Ctrl+Z)"
          @click="handleUndo"
        />
        <UButton
          :disabled="!historyStore.canRedo"
          variant="ghost"
          size="sm"
          icon="lucide:redo-2"
          title="重做 (Ctrl+Y)"
          @click="handleRedo"
        />
      </div>

      <USeparator orientation="vertical" class="h-6" />

      <!-- 导入导出 -->
      <div class="flex items-center space-x-1">
        <UButton
          variant="ghost"
          size="sm"
          icon="lucide:upload"
          title="导入"
          @click="handleImport"
        >
          导入
        </UButton>
        <UButton
          variant="ghost"
          size="sm"
          icon="lucide:download"
          title="导出"
          @click="handleExport"
        >
          导出
        </UButton>
      </div>

      <USeparator orientation="vertical" class="h-6" />

      <!-- 预览和保存 -->
      <div class="flex items-center space-x-1">
        <UButton
          variant="ghost"
          size="sm"
          icon="lucide:eye"
          title="预览"
          @click="handlePreview"
        >
          预览
        </UButton>
        <UButton
          variant="ghost"
          size="sm"
          icon="lucide:save"
          title="保存 (Ctrl+S)"
          @click="handleSave"
        >
          保存
        </UButton>
      </div>
    </div>

    <!-- 中间标题和画布尺寸 -->
    <div class="flex items-center space-x-4">
      <h1 class="text-lg font-semibold text-gray-800">
        工具栏
      </h1>

      <!-- 画布尺寸设置 -->
      <div class="flex items-center space-x-2 text-sm">
        <span class="text-gray-600">画布大小:</span>
        <div class="flex items-center space-x-1">
          <UInput
            v-model="canvasWidth"
            type="number"
            size="xs"
            class="w-16"
            @blur="updateCanvasSize"
            @keyup.enter="updateCanvasSize"
          />
          <span class="text-gray-400">×</span>
          <UInput
            v-model="canvasHeight"
            type="number"
            size="xs"
            class="w-16"
            @blur="updateCanvasSize"
            @keyup.enter="updateCanvasSize"
          />
        </div>
      </div>
    </div>

    <!-- 右侧工具区 -->
    <div class="flex items-center space-x-2">
      <!-- 画布缩放 -->
      <div class="flex items-center space-x-2">
        <UButton
          variant="ghost"
          size="sm"
          icon="lucide:zoom-out"
          title="缩小"
          @click="zoomOut"
        />
        <span class="min-w-12 text-center text-sm text-gray-600">
          {{ Math.round(canvasStore.canvasState.scale * 100) }}%
        </span>
        <UButton
          variant="ghost"
          size="sm"
          icon="lucide:zoom-in"
          title="放大"
          @click="zoomIn"
        />
        <UButton
          variant="ghost"
          size="sm"
          title="重置缩放"
          @click="resetZoom"
        >
          1:1
        </UButton>
      </div>

      <USeparator orientation="vertical" class="h-6" />

      <!-- 视图选项 -->
      <div class="flex items-center space-x-1">
        <UButton
          :variant="canvasStore.canvasState.showGrid ? 'solid' : 'ghost'"
          size="sm"
          icon="lucide:grid-3x3"
          title="显示网格"
          @click="toggleGrid"
        />
        <UButton
          :variant="canvasStore.canvasState.showRuler ? 'solid' : 'ghost'"
          size="sm"
          icon="lucide:ruler"
          title="显示标尺"
          @click="toggleRuler"
        />
      </div>

      <USeparator orientation="vertical" class="h-6" />

      <!-- 帮助 -->
      <UButton
        variant="ghost"
        size="sm"
        icon="lucide:help-circle"
        title="帮助"
        @click="showHelp"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCanvasStore } from '~/stores/canvas'
import { useHistoryStore } from '~/stores/history'

const canvasStore = useCanvasStore()
const historyStore = useHistoryStore()

// 画布尺寸的响应式引用
const canvasWidth = ref(canvasStore.canvasState.width)
const canvasHeight = ref(canvasStore.canvasState.height)

// 监听画布状态变化，同步尺寸输入框
watch(
  () => canvasStore.canvasState.width,
  (newWidth) => {
    canvasWidth.value = newWidth
  },
)

watch(
  () => canvasStore.canvasState.height,
  (newHeight) => {
    canvasHeight.value = newHeight
  },
)

// 撤销操作
function handleUndo() {
  historyStore.undo()
}

// 重做操作
function handleRedo() {
  historyStore.redo()
}

// 导入功能
function handleImport() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = (event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const _data = JSON.parse(e.target?.result as string)
          // 这里可以添加导入逻辑
          // 导入数据: ${data.length} items
          // TODO: 实现导入功能
        }
        catch (error) {
          console.error('导入失败:', error)
          // TODO: 显示错误提示
        }
      }
      reader.readAsText(file)
    }
  }
  input.click()
}

// 导出功能
function handleExport() {
  const data = {
    version: '1.0.0',
    canvas: canvasStore.canvasState,
    exportTime: Date.now(),
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `design-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

// 预览功能
function handlePreview() {
  // TODO: 实现预览功能
  // 预览模式
}

// 保存功能
function handleSave() {
  // TODO: 实现保存功能
  // 保存设计
}

// 更新画布尺寸
function updateCanvasSize() {
  const width = Math.max(100, canvasWidth.value)
  const height = Math.max(100, canvasHeight.value)

  canvasStore.setCanvasSize(width, height)
  historyStore.pushHistory('修改画布尺寸', canvasStore.canvasState)
}

// 缩放操作
function zoomIn() {
  const newScale = Math.min(5, canvasStore.canvasState.scale + 0.1)
  canvasStore.setCanvasScale(newScale)
}

function zoomOut() {
  const newScale = Math.max(0.1, canvasStore.canvasState.scale - 0.1)
  canvasStore.setCanvasScale(newScale)
}

function resetZoom() {
  canvasStore.setCanvasScale(1)
}

// 切换网格显示
function toggleGrid() {
  canvasStore.canvasState.showGrid = !canvasStore.canvasState.showGrid
}

// 切换标尺显示
function toggleRuler() {
  canvasStore.canvasState.showRuler = !canvasStore.canvasState.showRuler
}

// 显示帮助
function showHelp() {
  // TODO: 实现帮助功能
  // 显示帮助
}
</script>
