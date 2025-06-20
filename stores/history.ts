import type { CanvasState, HistoryState } from '~/types/designer'
import { cloneDeep, debounce } from 'es-toolkit'
import { defineStore } from 'pinia'
import { typeid } from 'typeid-js'
import { computed, ref } from 'vue'
import { useCanvasStore } from './canvas'

export const useHistoryStore = defineStore('history', () => {
  // 历史记录栈
  const historyStack = ref<HistoryState[]>([])
  const currentIndex = ref(-1)
  const maxHistorySize = ref(50)

  // 计算属性
  const canUndo = computed(() => currentIndex.value > 0)
  const canRedo = computed(() => currentIndex.value < historyStack.value.length - 1)

  const currentState = computed(() => {
    if (currentIndex.value >= 0 && currentIndex.value < historyStack.value.length) {
      return historyStack.value[currentIndex.value]
    }
    return null
  })

  // 创建历史记录项
  const createHistoryState = (action: string, canvasState: CanvasState): HistoryState => {
    return {
      id: typeid('history'),
      timestamp: Date.now(),
      action,
      canvasState: cloneDeep(canvasState),
    }
  }

  // 添加历史记录
  const pushHistory = (action: string, canvasState: CanvasState) => {
    // 如果当前不在历史记录的末尾，删除后面的记录
    if (currentIndex.value < historyStack.value.length - 1) {
      historyStack.value.splice(currentIndex.value + 1)
    }

    // 创建新的历史记录
    const historyState = createHistoryState(action, canvasState)
    historyStack.value.push(historyState)

    // 限制历史记录大小
    if (historyStack.value.length > maxHistorySize.value) {
      historyStack.value.shift()
    }
    else {
      currentIndex.value++
    }

    // History: ${action} (${historyStack.value.length} items, index: ${currentIndex.value})
  }

  // 防抖的历史记录添加
  const debouncedPushHistory = debounce((action: string, canvasState: CanvasState) => {
    pushHistory(action, canvasState)
  }, 300)

  // 恢复画布状态
  const restoreCanvasState = (state: CanvasState) => {
    const canvasStore = useCanvasStore()

    // 这里需要直接修改 canvasStore 的状态
    // 注意：这是一个特殊情况，通常不建议直接修改其他 store 的状态
    Object.assign(canvasStore.canvasState, cloneDeep(state))
  }

  // 撤销操作
  const undo = () => {
    if (!canUndo.value)
      return false

    currentIndex.value--
    const historyState = historyStack.value[currentIndex.value]

    if (historyState) {
      // 恢复画布状态
      // const canvasStore = useCanvasStore()
      restoreCanvasState(historyState.canvasState)
      // Undo: ${historyState.action}
      return true
    }

    return false
  }

  // 重做操作
  const redo = () => {
    if (!canRedo.value)
      return false

    currentIndex.value++
    const historyState = historyStack.value[currentIndex.value]

    if (historyState) {
      // 恢复画布状态
      restoreCanvasState(historyState.canvasState)
      // Redo: ${historyState.action}
      return true
    }

    return false
  }

  // 清空历史记录
  const clearHistory = () => {
    historyStack.value = []
    currentIndex.value = -1
    // History cleared
  }

  // 初始化历史记录
  const initHistory = (canvasState: CanvasState) => {
    clearHistory()
    pushHistory('初始化', canvasState)
  }

  // 获取历史记录列表（用于调试或显示）
  const getHistoryList = () => {
    return historyStack.value.map((item, index) => ({
      id: item.id,
      action: item.action,
      timestamp: item.timestamp,
      isCurrent: index === currentIndex.value,
    }))
  }

  // 跳转到指定历史记录
  const jumpToHistory = (index: number) => {
    if (index >= 0 && index < historyStack.value.length) {
      currentIndex.value = index
      const historyState = historyStack.value[index]
      restoreCanvasState(historyState.canvasState)
      // Jump to: ${historyState.action}
      return true
    }
    return false
  }

  // 设置最大历史记录数量
  const setMaxHistorySize = (size: number) => {
    maxHistorySize.value = Math.max(1, size)

    // 如果当前历史记录超过新的限制，删除旧的记录
    if (historyStack.value.length > maxHistorySize.value) {
      const removeCount = historyStack.value.length - maxHistorySize.value
      historyStack.value.splice(0, removeCount)
      currentIndex.value = Math.max(0, currentIndex.value - removeCount)
    }
  }

  // 获取历史记录统计信息
  const getHistoryStats = () => {
    return {
      total: historyStack.value.length,
      current: currentIndex.value,
      canUndo: canUndo.value,
      canRedo: canRedo.value,
      maxSize: maxHistorySize.value,
    }
  }

  // 批量操作支持
  const startBatch = () => {
    // 可以用于标记批量操作的开始，暂停历史记录
    // 这里可以添加批量操作的逻辑
  }

  const endBatch = (action: string, canvasState: CanvasState) => {
    // 批量操作结束，添加一条历史记录
    pushHistory(action, canvasState)
  }

  return {
    // 状态
    historyStack: readonly(historyStack),
    currentIndex: readonly(currentIndex),
    maxHistorySize: readonly(maxHistorySize),

    // 计算属性
    canUndo,
    canRedo,
    currentState,

    // 核心方法
    pushHistory,
    debouncedPushHistory,
    undo,
    redo,
    clearHistory,
    initHistory,

    // 辅助方法
    getHistoryList,
    jumpToHistory,
    setMaxHistorySize,
    getHistoryStats,

    // 批量操作
    startBatch,
    endBatch,
  }
})
