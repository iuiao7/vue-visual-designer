<template>
  <div class="flex h-full flex-col">
    <!-- 面板标题 -->
    <div class="border-b border-gray-200 p-4">
      <h2 class="text-sm font-semibold text-gray-800">
        属性面板
      </h2>
    </div>

    <!-- 选项卡 -->
    <div class="border-b border-gray-200">
      <nav class="flex space-x-8 px-4" aria-label="Tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="border-b-2 px-1 py-2 text-sm font-medium" :class="[
            activeTab === tab.id
              ? 'border-blue-500 text-blue-600'
              : `
                border-transparent text-gray-500
                hover:border-gray-300 hover:text-gray-700
              `,
          ]"
          @click="activeTab = tab.id"
        >
          <UIcon :name="tab.icon" class="mr-1 h-4 w-4" />
          {{ tab.name }}
        </button>
      </nav>
    </div>

    <!-- 内容区域 -->
    <div class="flex-1 overflow-y-auto">
      <!-- 无选中组件时的提示 -->
      <div
        v-if="!hasSelection"
        class="p-8 text-center text-gray-500"
      >
        <UIcon
          name="lucide:mouse-pointer-click" class="
            mx-auto mb-4 h-12 w-12 text-gray-400
          "
        />
        <h3 class="mb-2 text-lg font-medium">
          请选择组件
        </h3>
        <p class="text-sm">
          选择画布中的组件来编辑其属性
        </p>
      </div>

      <!-- 多选时的提示 -->
      <div
        v-else-if="isMultiSelection"
        class="p-4"
      >
        <div class="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div class="flex items-center">
            <UIcon name="lucide:layers" class="mr-2 h-5 w-5 text-blue-600" />
            <span class="text-sm font-medium text-blue-800">
              已选中 {{ selectedComponents.length }} 个组件
            </span>
          </div>
          <p class="mt-1 text-xs text-blue-600">
            部分属性可以批量编辑
          </p>
        </div>

        <!-- 批量编辑选项 -->
        <div class="mt-4 space-y-4">
          <PropertySection title="水平对齐">
            <div class="grid grid-cols-3 gap-1">
              <UButton
                variant="outline"
                size="xs"
                @click="alignComponents('left')"
              >
                <UIcon name="lucide:align-left" class="h-3 w-3" />
              </UButton>
              <UButton
                variant="outline"
                size="xs"
                @click="alignComponents('center')"
              >
                <UIcon name="lucide:align-center-horizontal" class="h-3 w-3" />
              </UButton>
              <UButton
                variant="outline"
                size="xs"
                @click="alignComponents('right')"
              >
                <UIcon name="lucide:align-right" class="h-3 w-3" />
              </UButton>
            </div>
          </PropertySection>

          <PropertySection title="垂直对齐">
            <div class="grid grid-cols-3 gap-1">
              <UButton
                variant="outline"
                size="xs"
                @click="alignComponents('top')"
              >
                <UIcon name="lucide:align-start-vertical" class="h-3 w-3" />
              </UButton>
              <UButton
                variant="outline"
                size="xs"
                @click="alignComponents('middle')"
              >
                <UIcon name="lucide:align-center-vertical" class="h-3 w-3" />
              </UButton>
              <UButton
                variant="outline"
                size="xs"
                @click="alignComponents('bottom')"
              >
                <UIcon name="lucide:align-end-vertical" class="h-3 w-3" />
              </UButton>
            </div>
          </PropertySection>

          <PropertySection title="分布">
            <div class="grid grid-cols-2 gap-1">
              <UButton
                variant="outline"
                size="xs"
                @click="distributeComponents('horizontal')"
              >
                <UIcon name="lucide:distribute-horizontal" class="mr-1 h-3 w-3" />
                水平
              </UButton>
              <UButton
                variant="outline"
                size="xs"
                @click="distributeComponents('vertical')"
              >
                <UIcon name="lucide:distribute-vertical" class="mr-1 h-3 w-3" />
                垂直
              </UButton>
            </div>
          </PropertySection>
        </div>
      </div>

      <!-- 单选组件的属性编辑 -->
      <div
        v-else-if="selectedComponent"
        class="space-y-4 p-4"
      >
        <!-- 属性选项卡内容 -->
        <div v-if="activeTab === 'properties'">
          <!-- 基础信息 -->
          <PropertySection title="基础信息">
            <div class="space-y-3">
              <div>
                <label class="mb-1 block text-xs font-medium text-gray-700">组件名称</label>
                <UInput
                  v-model="selectedComponent.name"
                  size="sm"
                  @blur="updateComponent({ name: selectedComponent.name })"
                />
              </div>

              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="mb-1 block text-xs font-medium text-gray-700">可见</label>
                  <USwitch
                    v-model="selectedComponent.visible"
                    @change="updateComponent({ visible: selectedComponent.visible })"
                  />
                </div>
                <div>
                  <label class="mb-1 block text-xs font-medium text-gray-700">锁定</label>
                  <USwitch
                    v-model="selectedComponent.locked"
                    @change="updateComponent({ locked: selectedComponent.locked })"
                  />
                </div>
              </div>
            </div>
          </PropertySection>

          <!-- 位置和尺寸 -->
          <PropertySection title="位置和尺寸">
            <div class="space-y-3">
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="mb-1 block text-xs font-medium text-gray-700">X</label>
                  <UInput
                    v-model.number="selectedComponent.transform.x"
                    type="number"
                    size="sm"
                    @blur="updateTransform"
                  />
                </div>
                <div>
                  <label class="mb-1 block text-xs font-medium text-gray-700">Y</label>
                  <UInput
                    v-model.number="selectedComponent.transform.y"
                    type="number"
                    size="sm"
                    @blur="updateTransform"
                  />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="mb-1 block text-xs font-medium text-gray-700">宽度</label>
                  <UInput
                    v-model.number="selectedComponent.transform.width"
                    type="number"
                    size="sm"
                    @blur="updateTransform"
                  />
                </div>
                <div>
                  <label class="mb-1 block text-xs font-medium text-gray-700">高度</label>
                  <UInput
                    v-model.number="selectedComponent.transform.height"
                    type="number"
                    size="sm"
                    @blur="updateTransform"
                  />
                </div>
              </div>

              <div>
                <label class="mb-1 block text-xs font-medium text-gray-700">旋转角度</label>
                <UInput
                  v-model.number="selectedComponent.transform.rotation"
                  type="number"
                  size="sm"
                  @blur="updateTransform"
                />
              </div>

              <div>
                <label class="mb-1 block text-xs font-medium text-gray-700">透明度</label>
                <USlider
                  v-model="selectedComponent.opacity"
                  :min="0"
                  :max="1"
                  :step="0.01"
                  @change="updateComponent({ opacity: selectedComponent.opacity })"
                />
                <div class="mt-1 text-xs text-gray-500">
                  {{ Math.round(selectedComponent.opacity * 100) }}%
                </div>
              </div>
            </div>
          </PropertySection>

          <!-- 层级 -->
          <PropertySection title="层级">
            <div class="flex items-center space-x-2">
              <UButton
                variant="outline"
                size="xs"
                title="置于顶层"
                @click="bringToFront"
              >
                <UIcon name="lucide:bring-to-front" class="h-3 w-3" />
              </UButton>
              <UButton
                variant="outline"
                size="xs"
                title="上移一层"
                @click="bringForward"
              >
                <UIcon name="lucide:chevron-up" class="h-3 w-3" />
              </UButton>
              <UButton
                variant="outline"
                size="xs"
                title="下移一层"
                @click="sendBackward"
              >
                <UIcon name="lucide:chevron-down" class="h-3 w-3" />
              </UButton>
              <UButton
                variant="outline"
                size="xs"
                title="置于底层"
                @click="sendToBack"
              >
                <UIcon name="lucide:send-to-back" class="h-3 w-3" />
              </UButton>
            </div>
          </PropertySection>

          <!-- 组件特定属性 -->
          <component
            :is="getPropertyComponent(selectedComponent.type)"
            v-if="getPropertyComponent(selectedComponent.type)"
            :component="selectedComponent"
            @update="updateComponent"
          />
        </div>

        <!-- 动画选项卡内容 -->
        <div v-else-if="activeTab === 'animations'">
          <PropertySection title="动画效果">
            <div class="py-8 text-center text-gray-500">
              <UIcon
                name="lucide:zap" class="mx-auto mb-2 h-8 w-8 text-gray-400"
              />
              <p class="text-sm">
                动画功能开发中...
              </p>
            </div>
          </PropertySection>
        </div>

        <!-- 事件选项卡内容 -->
        <div v-else-if="activeTab === 'events'">
          <PropertySection title="交互事件">
            <div class="py-8 text-center text-gray-500">
              <UIcon
                name="lucide:mouse-pointer-click" class="
                  mx-auto mb-2 h-8 w-8 text-gray-400
                "
              />
              <p class="text-sm">
                事件功能开发中...
              </p>
            </div>
          </PropertySection>
        </div>
      </div>
    </div>

    <!-- 层级区域 -->
    <div class="border-t border-gray-200 p-4">
      <h3 class="mb-3 text-sm font-semibold text-gray-800">
        层级区域
      </h3>
      <div class="max-h-32 space-y-1 overflow-y-auto">
        <div
          v-for="component in sortedComponents"
          :key="component.id"
          class="
            flex cursor-pointer items-center justify-between rounded p-2
            hover:bg-gray-50
          "
          :class="{
            'border border-blue-200 bg-blue-50': canvasStore.canvasState.selectedComponentIds.includes(component.id),
          }"
          @click="selectComponent(component.id)"
        >
          <div class="flex items-center space-x-2">
            <UIcon
              :name="getComponentIcon(component.type)" class="
                h-4 w-4 text-gray-500
              "
            />
            <span class="truncate text-sm text-gray-700">{{ component.name }}</span>
          </div>
          <div class="flex items-center space-x-1">
            <UIcon
              v-if="!component.visible"
              name="lucide:eye-off"
              class="h-3 w-3 text-gray-400"
            />
            <UIcon
              v-if="component.locked"
              name="lucide:lock"
              class="h-3 w-3 text-red-500"
            />
          </div>
        </div>

        <div
          v-if="sortedComponents.length === 0"
          class="py-4 text-center text-sm text-gray-500"
        >
          暂无组件
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BaseComponent } from '~/types/designer'
import { computed, ref } from 'vue'
import PropertySection from '~/components/designer/PropertySection.vue'
import { useCanvasStore } from '~/stores/canvas'
import { useHistoryStore } from '~/stores/history'

const canvasStore = useCanvasStore()
const historyStore = useHistoryStore()

// 选项卡配置
const tabs = [
  { id: 'properties', name: '属性', icon: 'lucide:settings' },
  { id: 'animations', name: '动画', icon: 'lucide:zap' },
  { id: 'events', name: '事件', icon: 'lucide:mouse-pointer-click' },
]

const activeTab = ref('properties')

// 计算属性
const hasSelection = computed(() => canvasStore.hasSelection)
const isMultiSelection = computed(() => canvasStore.isMultiSelection)
const selectedComponents = computed(() => canvasStore.selectedComponents)
const selectedComponent = computed(() => {
  return selectedComponents.value.length === 1 ? selectedComponents.value[0] : null
})

const sortedComponents = computed(() => {
  return [...canvasStore.canvasState.components].sort((a, b) => b.zIndex - a.zIndex)
})

// 更新组件
function updateComponent(updates: Partial<BaseComponent>) {
  if (selectedComponent.value) {
    canvasStore.updateComponent(selectedComponent.value.id, updates)
    historyStore.debouncedPushHistory('修改属性', canvasStore.canvasState)
  }
}

// 更新变换属性
function updateTransform() {
  if (selectedComponent.value) {
    updateComponent({
      transform: { ...selectedComponent.value.transform },
    })
  }
}

// 层级操作
function bringToFront() {
  if (selectedComponent.value) {
    canvasStore.bringToFront(selectedComponent.value.id)
    historyStore.pushHistory('置于顶层', canvasStore.canvasState)
  }
}

function bringForward() {
  if (selectedComponent.value) {
    canvasStore.bringForward(selectedComponent.value.id)
    historyStore.pushHistory('上移一层', canvasStore.canvasState)
  }
}

function sendBackward() {
  if (selectedComponent.value) {
    canvasStore.sendBackward(selectedComponent.value.id)
    historyStore.pushHistory('下移一层', canvasStore.canvasState)
  }
}

function sendToBack() {
  if (selectedComponent.value) {
    canvasStore.sendToBack(selectedComponent.value.id)
    historyStore.pushHistory('置于底层', canvasStore.canvasState)
  }
}

// 对齐操作
function alignComponents(type: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') {
  if (selectedComponents.value.length < 2)
    return

  const components = selectedComponents.value

  // 计算对齐基准
  let alignValue: number

  switch (type) {
    case 'left':
      alignValue = Math.min(...components.map(c => c.transform.x))
      components.forEach((component) => {
        canvasStore.updateComponent(component.id, {
          transform: { ...component.transform, x: alignValue },
        })
      })
      break

    case 'right':
      alignValue = Math.max(...components.map(c => c.transform.x + c.transform.width))
      components.forEach((component) => {
        canvasStore.updateComponent(component.id, {
          transform: { ...component.transform, x: alignValue - component.transform.width },
        })
      })
      break

    case 'center': {
      const leftmost = Math.min(...components.map(c => c.transform.x))
      const rightmost = Math.max(...components.map(c => c.transform.x + c.transform.width))
      alignValue = (leftmost + rightmost) / 2
      components.forEach((component) => {
        canvasStore.updateComponent(component.id, {
          transform: { ...component.transform, x: alignValue - component.transform.width / 2 },
        })
      })
      break
    }

    case 'top':
      alignValue = Math.min(...components.map(c => c.transform.y))
      components.forEach((component) => {
        canvasStore.updateComponent(component.id, {
          transform: { ...component.transform, y: alignValue },
        })
      })
      break

    case 'bottom':
      alignValue = Math.max(...components.map(c => c.transform.y + c.transform.height))
      components.forEach((component) => {
        canvasStore.updateComponent(component.id, {
          transform: { ...component.transform, y: alignValue - component.transform.height },
        })
      })
      break

    case 'middle': {
      const topmost = Math.min(...components.map(c => c.transform.y))
      const bottommost = Math.max(...components.map(c => c.transform.y + c.transform.height))
      alignValue = (topmost + bottommost) / 2
      components.forEach((component) => {
        canvasStore.updateComponent(component.id, {
          transform: { ...component.transform, y: alignValue - component.transform.height / 2 },
        })
      })
      break
    }
  }

  historyStore.pushHistory(`对齐组件-${type}`, canvasStore.canvasState)
}

// 分布组件
function distributeComponents(direction: 'horizontal' | 'vertical') {
  if (selectedComponents.value.length < 3)
    return

  const components = [...selectedComponents.value]

  if (direction === 'horizontal') {
    // 按 x 坐标排序
    components.sort((a, b) => a.transform.x - b.transform.x)

    const first = components[0]
    const last = components[components.length - 1]
    const totalSpace = (last.transform.x + last.transform.width) - first.transform.x
    const totalWidth = components.reduce((sum, c) => sum + c.transform.width, 0)
    const spacing = (totalSpace - totalWidth) / (components.length - 1)

    let currentX = first.transform.x
    components.forEach((component, index) => {
      if (index > 0) {
        currentX += components[index - 1].transform.width + spacing
        canvasStore.updateComponent(component.id, {
          transform: { ...component.transform, x: currentX },
        })
      }
    })
  }
  else {
    // 按 y 坐标排序
    components.sort((a, b) => a.transform.y - b.transform.y)

    const first = components[0]
    const last = components[components.length - 1]
    const totalSpace = (last.transform.y + last.transform.height) - first.transform.y
    const totalHeight = components.reduce((sum, c) => sum + c.transform.height, 0)
    const spacing = (totalSpace - totalHeight) / (components.length - 1)

    let currentY = first.transform.y
    components.forEach((component, index) => {
      if (index > 0) {
        currentY += components[index - 1].transform.height + spacing
        canvasStore.updateComponent(component.id, {
          transform: { ...component.transform, y: currentY },
        })
      }
    })
  }

  historyStore.pushHistory(`分布组件-${direction}`, canvasStore.canvasState)
}

// 选择组件
function selectComponent(id: string) {
  canvasStore.selectComponent(id)
}

// 获取组件图标
function getComponentIcon(type: string) {
  const iconMap: Record<string, string> = {
    text: 'lucide:type',
    image: 'lucide:image',
    container: 'lucide:square',
    button: 'lucide:mouse-pointer-click',
    input: 'lucide:edit-3',
  }
  return iconMap[type] || 'lucide:square'
}

// 获取属性组件
function getPropertyComponent(type: string) {
  const componentMap: Record<string, string> = {
    text: 'TextProperties',
    image: 'ImageProperties',
    container: 'ContainerProperties',
  }
  return componentMap[type]
}
</script>
