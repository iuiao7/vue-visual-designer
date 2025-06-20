<template>
  <div class="flex h-screen flex-col bg-gray-50">
    <!-- 顶部工具栏 -->
    <TopToolbar />

    <!-- 主要内容区域 -->
    <div class="flex flex-1 overflow-hidden">
      <!-- 左侧组件面板 -->
      <div class="flex w-64 flex-col border-r border-gray-200 bg-white">
        <ComponentPanel />
      </div>

      <!-- 中间画布区域 -->
      <div class="flex flex-1 flex-col">
        <!-- 画布容器 -->
        <div class="flex-1 overflow-auto bg-gray-100 p-4">
          <DesignCanvas />
        </div>
      </div>

      <!-- 右侧属性面板 -->
      <div class="flex w-80 flex-col border-l border-gray-200 bg-white">
        <PropertyPanel />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { cloneDeep } from 'es-toolkit'
import { onMounted, onUnmounted } from 'vue'
import ComponentPanel from '~/components/designer/ComponentPanel.vue'
import DesignCanvas from '~/components/designer/DesignCanvas.vue'
import PropertyPanel from '~/components/designer/PropertyPanel.vue'
import TopToolbar from '~/components/designer/TopToolbar.vue'
import { useCanvasStore } from '~/stores/canvas'
import { useHistoryStore } from '~/stores/history'

// 设置页面标题
useHead({
  title: '可视化设计器 - Vue Visual Designer',
})

// 初始化 stores
const canvasStore = useCanvasStore()
const historyStore = useHistoryStore()

// 键盘快捷键处理
function handleKeydown(event: KeyboardEvent) {
  // 阻止默认的浏览器快捷键
  if (event.ctrlKey || event.metaKey) {
    switch (event.key.toLowerCase()) {
      case 'z':
        event.preventDefault()
        if (event.shiftKey) {
          // Ctrl+Shift+Z 或 Cmd+Shift+Z - 重做
          historyStore.redo()
        }
        else {
          // Ctrl+Z 或 Cmd+Z - 撤销
          historyStore.undo()
        }
        break

      case 'y':
        // Ctrl+Y - 重做 (Windows)
        event.preventDefault()
        historyStore.redo()
        break

      case 'c':
        // Ctrl+C 或 Cmd+C - 复制
        event.preventDefault()
        if (canvasStore.hasSelection) {
          canvasStore.copyComponents()
        }
        break

      case 'v':
        // Ctrl+V 或 Cmd+V - 粘贴
        event.preventDefault()
        if (canvasStore.canvasState.clipboard.length > 0) {
          canvasStore.pasteComponents()
        }
        break

      case 'a':
        // Ctrl+A 或 Cmd+A - 全选
        event.preventDefault()
        canvasStore.selectAll()
        break

      case 'd':
        // Ctrl+D 或 Cmd+D - 复制选中组件
        event.preventDefault()
        if (canvasStore.hasSelection) {
          canvasStore.selectedComponents.forEach((component) => {
            canvasStore.duplicateComponent(component.id)
          })
        }
        break
    }
  }

  // 删除键
  if (event.key === 'Delete' || event.key === 'Backspace') {
    event.preventDefault()
    if (canvasStore.hasSelection) {
      canvasStore.selectedComponents.forEach((component) => {
        canvasStore.removeComponent(component.id)
      })
      // 记录历史
      historyStore.pushHistory('删除组件', cloneDeep(canvasStore.canvasState))
    }
  }

  // ESC 键 - 取消选择
  if (event.key === 'Escape') {
    canvasStore.clearSelection()
  }
}

// 组件挂载时的初始化
onMounted(() => {
  // 添加键盘事件监听
  document.addEventListener('keydown', handleKeydown)

  // 初始化历史记录
  historyStore.initHistory(cloneDeep(canvasStore.canvasState))

  // 阻止页面的拖拽默认行为
  document.addEventListener('dragover', e => e.preventDefault())
  document.addEventListener('drop', e => e.preventDefault())
})

// 组件卸载时的清理
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('dragover', e => e.preventDefault())
  document.removeEventListener('drop', e => e.preventDefault())
})

// 监听画布状态变化，自动保存历史记录
watch(
  () => canvasStore.canvasState.components,
  (newComponents, oldComponents) => {
    // 使用防抖的历史记录保存
    if (oldComponents && newComponents !== oldComponents) {
      historyStore.debouncedPushHistory('修改组件', cloneDeep(canvasStore.canvasState))
    }
  },
  { deep: true },
)
</script>

<style scoped>
/* 确保设计器占满整个视口 */
.h-screen {
  height: 100vh;
}

/* 自定义滚动条样式 */
:deep(.overflow-auto::-webkit-scrollbar) {
  width: 8px;
  height: 8px;
}

:deep(.overflow-auto::-webkit-scrollbar-track) {
  background: #f1f1f1;
  border-radius: 4px;
}

:deep(.overflow-auto::-webkit-scrollbar-thumb) {
  background: #c1c1c1;
  border-radius: 4px;
}

:deep(.overflow-auto::-webkit-scrollbar-thumb:hover) {
  background: #a8a8a8;
}

/* 禁用文本选择，避免拖拽时选中文字 */
.designer-container {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

/* 确保拖拽时的视觉反馈 */
.dragging {
  cursor: grabbing !important;
}

.drag-over {
  background-color: rgba(59, 130, 246, 0.1);
  border: 2px dashed #3b82f6;
}
</style>
