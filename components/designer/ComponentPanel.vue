<template>
  <div class="flex h-full flex-col">
    <!-- 面板标题 -->
    <div class="border-b border-gray-200 p-4">
      <h2 class="text-sm font-semibold text-gray-800">
        组件库
      </h2>
    </div>

    <!-- 搜索和分类 -->
    <div class="space-y-3 p-4">
      <!-- 搜索框 -->
      <UInput
        v-model="searchKeyword"
        placeholder="搜索组件..."
        icon="lucide:search"
        size="sm"
        @input="handleSearch"
      />

      <!-- 分类选择 -->
      <div class="flex flex-wrap gap-1">
        <UButton
          v-for="category in allCategories"
          :key="category"
          :variant="selectedCategory === category ? 'solid' : 'ghost'"
          size="xs"
          @click="selectCategory(category)"
        >
          {{ category }}
        </UButton>
      </div>
    </div>

    <!-- 组件列表 -->
    <div class="flex-1 overflow-y-auto">
      <div class="space-y-4 p-4">
        <!-- 按分类显示组件 -->
        <div
          v-for="(components, category) in displayedComponents"
          :key="category"
          class="space-y-2"
        >
          <!-- 分类标题 -->
          <h3 class="text-xs font-medium tracking-wide text-gray-500 uppercase">
            {{ category }}
          </h3>

          <!-- 组件网格 -->
          <div class="grid grid-cols-2 gap-2">
            <div
              v-for="component in components"
              :key="component.type"
              class="
                component-item group relative cursor-grab rounded-lg border
                border-gray-200 p-3 transition-all duration-200
                hover:border-blue-300 hover:shadow-sm
              "
              :draggable="true"
              @dragstart="handleDragStart($event, component)"
              @dragend="handleDragEnd"
              @dblclick="handleDoubleClick(component)"
            >
              <!-- 组件图标 -->
              <div class="flex flex-col items-center space-y-2">
                <div
                  class="
                    flex h-8 w-8 items-center justify-center rounded-md
                    bg-gray-100 transition-colors
                    group-hover:bg-blue-50
                  "
                >
                  <UIcon
                    :name="component.icon"
                    class="
                      h-5 w-5 text-gray-600
                      group-hover:text-blue-600
                    "
                  />
                </div>

                <!-- 组件名称 -->
                <span class="text-center text-xs leading-tight text-gray-700">
                  {{ component.name }}
                </span>
              </div>

              <!-- 拖拽提示 -->
              <div
                class="
                  bg-opacity-10 absolute inset-0 flex items-center
                  justify-center rounded-lg bg-blue-500 opacity-0
                  transition-opacity duration-200
                  group-hover:opacity-100
                "
              >
                <span class="text-xs font-medium text-blue-600">拖拽到画布</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div
          v-if="Object.keys(displayedComponents).length === 0"
          class="py-8 text-center text-gray-500"
        >
          <UIcon
            name="lucide:search-x" class="mx-auto mb-2 h-8 w-8 text-gray-400"
          />
          <p class="text-sm">
            没有找到匹配的组件
          </p>
          <UButton
            variant="ghost"
            size="sm"
            class="mt-2"
            @click="clearSearch"
          >
            清空搜索
          </UButton>
        </div>
      </div>
    </div>

    <!-- 底部统计信息 -->
    <div class="border-t border-gray-200 bg-gray-50 p-4">
      <div class="space-y-1 text-xs text-gray-500">
        <div>共 {{ totalComponents }} 个组件</div>
        <div v-if="searchKeyword">
          找到 {{ filteredCount }} 个匹配项
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ComponentLibraryItem } from '~/types/designer'
import { computed, ref } from 'vue'
import { useCanvasStore } from '~/stores/canvas'
import { useComponentLibraryStore } from '~/stores/componentLibrary'
import { useHistoryStore } from '~/stores/history'

const componentLibraryStore = useComponentLibraryStore()
const canvasStore = useCanvasStore()
const historyStore = useHistoryStore()

// 搜索关键词
const searchKeyword = ref('')

// 选中的分类
const selectedCategory = ref('全部')

// 所有分类（包含"全部"）
const allCategories = computed(() => {
  return ['全部', ...componentLibraryStore.categories]
})

// 显示的组件（按分类分组）
const displayedComponents = computed(() => {
  let components = componentLibraryStore.components

  // 按分类过滤
  if (selectedCategory.value !== '全部') {
    components = components.filter(c => c.category === selectedCategory.value)
  }

  // 按搜索关键词过滤
  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.toLowerCase().trim()
    components = components.filter(c =>
      c.name.toLowerCase().includes(keyword)
      || c.description.toLowerCase().includes(keyword),
    )
  }

  // 按分类分组
  const grouped: Record<string, ComponentLibraryItem[]> = {}
  components.forEach((component) => {
    if (!grouped[component.category]) {
      grouped[component.category] = []
    }
    grouped[component.category].push(component)
  })

  return grouped
})

// 总组件数
const totalComponents = computed(() => {
  return componentLibraryStore.components.length
})

// 过滤后的组件数
const filteredCount = computed(() => {
  return Object.values(displayedComponents.value).flat().length
})

// 选择分类
function selectCategory(category: string) {
  selectedCategory.value = category
}

// 处理搜索
function handleSearch() {
  // 搜索逻辑已在计算属性中处理
}

// 清空搜索
function clearSearch() {
  searchKeyword.value = ''
  selectedCategory.value = '全部'
}

// 拖拽开始
function handleDragStart(event: DragEvent, component: ComponentLibraryItem) {
  if (!event.dataTransfer)
    return

  // 设置拖拽数据
  event.dataTransfer.setData('application/json', JSON.stringify({
    type: 'component',
    componentType: component.type,
    componentData: component,
  }))

  // 设置拖拽效果
  event.dataTransfer.effectAllowed = 'copy'

  // 创建拖拽预览
  const dragImage = createDragPreview(component)
  event.dataTransfer.setDragImage(dragImage, 50, 25)

  // 开始拖拽组件: ${component.name}
}

// 拖拽结束
function handleDragEnd(_event: DragEvent) {
  // 清理拖拽状态
  // 拖拽结束
}

// 创建拖拽预览
function createDragPreview(component: ComponentLibraryItem) {
  const preview = document.createElement('div')
  preview.className = 'bg-white border border-blue-300 rounded-lg p-2 shadow-lg'
  preview.style.position = 'absolute'
  preview.style.top = '-1000px'
  preview.style.left = '-1000px'
  preview.style.width = '100px'
  preview.style.height = '50px'
  preview.style.display = 'flex'
  preview.style.alignItems = 'center'
  preview.style.justifyContent = 'center'
  preview.style.fontSize = '12px'
  preview.style.color = '#374151'
  preview.textContent = component.name

  document.body.appendChild(preview)

  // 延迟删除预览元素
  setTimeout(() => {
    document.body.removeChild(preview)
  }, 0)

  return preview
}

// 双击添加组件到画布中心
function handleDoubleClick(component: ComponentLibraryItem) {
  const canvasCenter = {
    x: canvasStore.canvasState.width / 2 - (component.defaultTransform.width || 100) / 2,
    y: canvasStore.canvasState.height / 2 - (component.defaultTransform.height || 50) / 2,
  }

  const _newComponent = canvasStore.addComponent({
    type: component.type,
    name: component.name,
    locked: false,
    visible: true,
    opacity: 1,
    props: { ...component.defaultProps },
    style: { ...component.defaultStyle },
    transform: {
      x: canvasCenter.x,
      y: canvasCenter.y,
      width: component.defaultTransform.width || 100,
      height: component.defaultTransform.height || 50,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
    },
  })

  // 记录历史
  historyStore.pushHistory(`添加${component.name}`, canvasStore.canvasState)

  // 添加组件到画布中心: ${newComponent.id}
}
</script>

<style scoped>
.component-item {
  transition: all 0.2s ease;
}

.component-item:hover {
  transform: translateY(-1px);
}

.component-item:active {
  transform: translateY(0);
}

/* 拖拽时的样式 */
.component-item.dragging {
  opacity: 0.5;
  transform: rotate(5deg);
}

/* 自定义滚动条 */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
