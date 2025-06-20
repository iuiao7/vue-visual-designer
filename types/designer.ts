// 设计器核心类型定义

import type { TypeID } from 'typeid-js'

export interface Position {
  x: number
  y: number
}

export interface Size {
  width: number
  height: number
}

export interface Transform {
  x: number
  y: number
  width: number
  height: number
  rotation: number
  scaleX: number
  scaleY: number
}

// 组件事件定义
export interface ComponentEvent {
  id: string
  type: 'click' | 'hover' | 'focus' | 'custom'
  action: 'navigate' | 'animate' | 'show' | 'hide' | 'custom'
  target?: string
  params?: Record<string, any>
}

// 组件动画定义
export interface ComponentAnimation {
  id: string
  type: 'fadeIn' | 'slideIn' | 'bounce' | 'rotate' | 'scale' | 'custom'
  duration: number
  delay: number
  easing: string
  loop: boolean
  autoplay: boolean
}

type CreateOptions<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// 基础组件接口
export interface BaseComponent {
  id: string
  type: ComponentType
  name: string
  // 位置和变换
  transform: Transform
  // 层级和状态
  zIndex: number
  locked: boolean
  visible: boolean
  opacity: number
  // 样式和属性
  style: Record<string, any>
  props: Record<string, any>
  // 交互
  events: ComponentEvent[]
  animations: ComponentAnimation[]
  // 元数据
  createdAt: number
  updatedAt: number
}

export type BaseComponentOptions = CreateOptions<BaseComponent, 'id' | 'zIndex' | 'createdAt' | 'updatedAt' | 'events' | 'animations'>

// 组件类型枚举
export type ComponentType = 'text' | 'image' | 'container' | 'chart' | 'button' | 'input'

// 文字组件特定属性
export interface TextComponent extends BaseComponent {
  type: 'text'
  props: {
    text: string
    fontSize: number
    fontFamily: string
    fontWeight: string
    color: string
    textAlign: 'left' | 'center' | 'right'
    lineHeight: number
    letterSpacing: number
  }
}

// 图片组件特定属性
export interface ImageComponent extends BaseComponent {
  type: 'image'
  props: {
    src: string
    alt: string
    fit: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
    borderRadius: number
  }
}

// 容器组件特定属性
export interface ContainerComponent extends BaseComponent {
  type: 'container'
  props: {
    backgroundColor: string
    borderWidth: number
    borderColor: string
    borderRadius: number
    padding: number
  }
  children: string[] // 子组件ID列表
}

// 画布状态接口
export interface CanvasState {
  // 画布基本属性
  width: number
  height: number
  backgroundColor: string
  backgroundImage?: string
  // 视图状态
  scale: number
  offsetX: number
  offsetY: number
  // 组件管理
  components: BaseComponent[]
  selectedComponentIds: string[]
  // 辅助功能
  showGrid: boolean
  showRuler: boolean
  snapToGrid: boolean
  gridSize: number
  // 剪贴板
  clipboard: BaseComponent[]
}

// 历史记录状态
export interface HistoryState {
  id: TypeID<'history'>
  timestamp: number
  action: string
  canvasState: CanvasState
}

// 组件库项目
export interface ComponentLibraryItem {
  type: ComponentType
  name: string
  icon: string
  category: string
  description: string
  defaultProps: Record<string, any>
  defaultStyle: Record<string, any>
  defaultTransform: Partial<Transform>
}

// 拖拽状态
export interface DragState {
  isDragging: boolean
  dragType: 'create' | 'move' | 'resize' | 'rotate'
  dragData?: any
  startPosition?: Position
  currentPosition?: Position
  targetComponent?: BaseComponent
}

// 选择状态
export interface SelectionState {
  selectedIds: string[]
  selectionBox?: {
    startX: number
    startY: number
    endX: number
    endY: number
  }
  isMultiSelect: boolean
}

// 工具栏状态
export interface ToolbarState {
  activeTool: 'select' | 'hand' | 'zoom'
  canUndo: boolean
  canRedo: boolean
}

// 属性面板状态
export interface PropertyPanelState {
  activeTab: 'properties' | 'animations' | 'events'
  expandedSections: string[]
}

// 事件类型定义
export interface CanvasMouseEvent {
  type: 'mousedown' | 'mousemove' | 'mouseup' | 'click' | 'dblclick'
  position: Position
  canvasPosition: Position
  target?: BaseComponent
  originalEvent: MouseEvent
}

export interface CanvasDragEvent {
  type: 'dragstart' | 'drag' | 'dragend' | 'drop'
  position: Position
  canvasPosition: Position
  data?: any
  originalEvent: DragEvent
}

// 操作手柄类型
export type ResizeHandle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w'

// 操作手柄信息
export interface HandleInfo {
  type: ResizeHandle
  cursor: string
  position: Position
}

// 导出配置
export interface ExportConfig {
  format: 'json' | 'png' | 'jpg' | 'svg' | 'pdf'
  quality?: number
  scale?: number
  backgroundColor?: string
}

// 导入配置
export interface ImportConfig {
  replaceExisting: boolean
  preserveIds: boolean
}
