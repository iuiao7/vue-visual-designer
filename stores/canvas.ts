import type {
  BaseComponent,
  BaseComponentOptions,
  CanvasState,
  DragState,
  Position,
  SelectionState,
} from '~/types/designer'
import { cloneDeep } from 'es-toolkit'
import { defineStore } from 'pinia'
import { typeid } from 'typeid-js'
import { computed, readonly, ref } from 'vue'

export const useCanvasStore = defineStore('canvas', () => {
  // 画布状态
  const canvasState = ref<CanvasState>({
    width: 1200,
    height: 740,
    backgroundColor: '#ffffff',
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    components: [],
    selectedComponentIds: [],
    showGrid: true,
    showRuler: true,
    snapToGrid: true,
    gridSize: 10,
    clipboard: [],
  })

  // 选择状态
  const selectionState = ref<SelectionState>({
    selectedIds: [],
    isMultiSelect: false,
  })

  // 拖拽状态
  const dragState = ref<DragState>({
    isDragging: false,
    dragType: 'move',
  })

  // 计算属性
  const selectedComponents = computed(() => {
    return canvasState.value.components.filter(component =>
      canvasState.value.selectedComponentIds.includes(component.id),
    )
  })

  const hasSelection = computed(() => {
    return canvasState.value.selectedComponentIds.length > 0
  })

  const isMultiSelection = computed(() => {
    return canvasState.value.selectedComponentIds.length > 1
  })

  // 画布操作方法
  const setCanvasSize = (width: number, height: number) => {
    canvasState.value.width = width
    canvasState.value.height = height
  }

  const setCanvasBackground = (color: string, image?: string) => {
    canvasState.value.backgroundColor = color
    if (image !== undefined) {
      canvasState.value.backgroundImage = image
    }
  }

  const setCanvasScale = (scale: number) => {
    canvasState.value.scale = Math.max(0.1, Math.min(5, scale))
  }

  const setCanvasOffset = (offsetX: number, offsetY: number) => {
    canvasState.value.offsetX = offsetX
    canvasState.value.offsetY = offsetY
  }

  // 选择操作方法
  const selectComponent = (id: string, multiple = false) => {
    if (multiple) {
      if (canvasState.value.selectedComponentIds.includes(id)) {
        canvasState.value.selectedComponentIds = canvasState.value.selectedComponentIds.filter(cid => cid !== id)
      }
      else {
        canvasState.value.selectedComponentIds.push(id)
      }
    }
    else {
      canvasState.value.selectedComponentIds = [id]
    }
    selectionState.value.selectedIds = canvasState.value.selectedComponentIds
    selectionState.value.isMultiSelect = canvasState.value.selectedComponentIds.length > 1
  }

  const deselectComponent = (id?: string) => {
    if (id) {
      canvasState.value.selectedComponentIds = canvasState.value.selectedComponentIds.filter(cid => cid !== id)
    }
    else {
      canvasState.value.selectedComponentIds = []
    }
    selectionState.value.selectedIds = canvasState.value.selectedComponentIds
    selectionState.value.isMultiSelect = canvasState.value.selectedComponentIds.length > 1
  }

  // 组件操作方法
  const addComponent = (componentData: BaseComponentOptions) => {
    const newComponent: BaseComponent = {
      id: typeid(componentData.type).toString(),
      type: componentData.type,
      name: componentData.name || `${componentData.type} ${canvasState.value.components.length + 1}`,
      transform: {
        x: 100,
        y: 100,
        width: 200,
        height: 100,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
      },
      zIndex: canvasState.value.components.length,
      locked: false,
      visible: true,
      opacity: 1,
      style: {},
      props: {},
      events: [],
      animations: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    canvasState.value.components.push(newComponent)
    selectComponent(newComponent.id)
    return newComponent
  }

  const removeComponent = (id: string) => {
    const index = canvasState.value.components.findIndex(c => c.id === id)
    if (index > -1) {
      canvasState.value.components.splice(index, 1)
      deselectComponent(id)
    }
  }

  const updateComponent = (id: string, updates: Partial<BaseComponent>) => {
    const component = canvasState.value.components.find(c => c.id === id)
    if (component) {
      Object.assign(component, updates, { updatedAt: Date.now() })
    }
  }

  const duplicateComponent = (id: string) => {
    const component = canvasState.value.components.find(c => c.id === id)
    if (component) {
      const duplicated = cloneDeep(component)
      duplicated.id = typeid(component.type).toString()
      duplicated.name = `${component.name} Copy`
      duplicated.transform.x += 20
      duplicated.transform.y += 20
      duplicated.createdAt = Date.now()
      duplicated.updatedAt = Date.now()

      canvasState.value.components.push(duplicated)
      selectComponent(duplicated.id)
      return duplicated
    }
  }

  const getComponent = (id: string) => {
    return canvasState.value.components.find(c => c.id === id)
  }

  const selectAll = () => {
    canvasState.value.selectedComponentIds = canvasState.value.components.map(c => c.id)
    selectionState.value.selectedIds = canvasState.value.selectedComponentIds
    selectionState.value.isMultiSelect = true
  }

  const clearSelection = () => {
    canvasState.value.selectedComponentIds = []
    selectionState.value.selectedIds = []
    selectionState.value.isMultiSelect = false
  }

  // 层级操作方法
  const bringToFront = (id: string) => {
    const component = getComponent(id)
    if (component) {
      const maxZIndex = Math.max(...canvasState.value.components.map(c => c.zIndex))
      component.zIndex = maxZIndex + 1
    }
  }

  const sendToBack = (id: string) => {
    const component = getComponent(id)
    if (component) {
      const minZIndex = Math.min(...canvasState.value.components.map(c => c.zIndex))
      component.zIndex = minZIndex - 1
    }
  }

  const bringForward = (id: string) => {
    const component = getComponent(id)
    if (component) {
      component.zIndex += 1
    }
  }

  const sendBackward = (id: string) => {
    const component = getComponent(id)
    if (component) {
      component.zIndex -= 1
    }
  }

  // 剪贴板操作
  const copyComponents = (ids?: string[]) => {
    const targetIds = ids || canvasState.value.selectedComponentIds
    const componentsToCopy = canvasState.value.components.filter(c => targetIds.includes(c.id))
    canvasState.value.clipboard = cloneDeep(componentsToCopy)
  }

  const pasteComponents = () => {
    const pastedComponents = canvasState.value.clipboard.map((component) => {
      const pasted = cloneDeep(component)
      pasted.id = typeid(component.type).toString()
      pasted.name = `${component.name} Copy`
      pasted.transform.x += 20
      pasted.transform.y += 20
      pasted.createdAt = Date.now()
      pasted.updatedAt = Date.now()
      return pasted
    })

    canvasState.value.components.push(...pastedComponents)
    canvasState.value.selectedComponentIds = pastedComponents.map(c => c.id)
    return pastedComponents
  }

  // 坐标转换方法
  const screenToCanvas = (screenX: number, screenY: number): Position => {
    return {
      x: (screenX - canvasState.value.offsetX) / canvasState.value.scale,
      y: (screenY - canvasState.value.offsetY) / canvasState.value.scale,
    }
  }

  const canvasToScreen = (canvasX: number, canvasY: number): Position => {
    return {
      x: canvasX * canvasState.value.scale + canvasState.value.offsetX,
      y: canvasY * canvasState.value.scale + canvasState.value.offsetY,
    }
  }

  // 拖拽状态管理
  const setDragState = (state: Partial<DragState>) => {
    Object.assign(dragState.value, state)
  }

  const clearDragState = () => {
    dragState.value = {
      isDragging: false,
      dragType: 'move',
    }
  }

  return {
    // 状态
    canvasState,
    selectionState: readonly(selectionState),
    dragState: readonly(dragState),

    // 计算属性
    selectedComponents,
    hasSelection,
    isMultiSelection,

    // 画布操作
    setCanvasSize,
    setCanvasBackground,
    setCanvasScale,
    setCanvasOffset,

    // 组件操作
    addComponent,
    removeComponent,
    updateComponent,
    duplicateComponent,
    getComponent,

    // 选择操作
    selectComponent,
    deselectComponent,
    selectAll,
    clearSelection,

    // 层级操作
    bringToFront,
    sendToBack,
    bringForward,
    sendBackward,

    // 剪贴板操作
    copyComponents,
    pasteComponents,

    // 坐标转换
    screenToCanvas,
    canvasToScreen,

    // 拖拽状态
    setDragState,
    clearDragState,
  }
})
