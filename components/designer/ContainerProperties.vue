<template>
  <div class="space-y-4">
    <!-- 背景设置 -->
    <PropertySection title="背景设置">
      <div class="space-y-3">
        <div>
          <label class="mb-1 block text-xs font-medium text-gray-700">背景颜色</label>
          <div class="flex items-center space-x-2">
            <input
              v-model="localProps.backgroundColor"
              type="color"
              class="h-8 w-8 cursor-pointer rounded border border-gray-300"
              @change="updateProps"
            />
            <UInput
              v-model="localProps.backgroundColor"
              size="sm"
              class="flex-1"
              @blur="updateProps"
            />
          </div>
        </div>
      </div>
    </PropertySection>

    <!-- 边框设置 -->
    <PropertySection title="边框设置">
      <div class="space-y-3">
        <div>
          <label class="mb-1 block text-xs font-medium text-gray-700">边框宽度</label>
          <div class="flex items-center space-x-2">
            <UInput
              v-model.number="localProps.borderWidth"
              type="number"
              min="0"
              size="sm"
              class="flex-1"
              @blur="updateProps"
            />
            <span class="text-xs text-gray-500">px</span>
          </div>
        </div>

        <div>
          <label class="mb-1 block text-xs font-medium text-gray-700">边框颜色</label>
          <div class="flex items-center space-x-2">
            <input
              v-model="localProps.borderColor"
              type="color"
              class="h-8 w-8 cursor-pointer rounded border border-gray-300"
              @change="updateProps"
            />
            <UInput
              v-model="localProps.borderColor"
              size="sm"
              class="flex-1"
              @blur="updateProps"
            />
          </div>
        </div>

        <div>
          <label class="mb-1 block text-xs font-medium text-gray-700">圆角</label>
          <div class="flex items-center space-x-2">
            <UInput
              v-model.number="localProps.borderRadius"
              type="number"
              min="0"
              size="sm"
              class="flex-1"
              @blur="updateProps"
            />
            <span class="text-xs text-gray-500">px</span>
          </div>
        </div>
      </div>
    </PropertySection>

    <!-- 内边距设置 -->
    <PropertySection title="内边距">
      <div class="space-y-3">
        <div>
          <label class="mb-1 block text-xs font-medium text-gray-700">内边距</label>
          <div class="flex items-center space-x-2">
            <UInput
              v-model.number="localProps.padding"
              type="number"
              min="0"
              size="sm"
              class="flex-1"
              @blur="updateProps"
            />
            <span class="text-xs text-gray-500">px</span>
          </div>
        </div>
      </div>
    </PropertySection>

    <!-- 快速样式 -->
    <PropertySection title="快速样式">
      <div class="grid grid-cols-2 gap-2">
        <UButton
          variant="outline"
          size="xs"
          @click="applyPreset('card')"
        >
          卡片样式
        </UButton>
        <UButton
          variant="outline"
          size="xs"
          @click="applyPreset('panel')"
        >
          面板样式
        </UButton>
        <UButton
          variant="outline"
          size="xs"
          @click="applyPreset('section')"
        >
          区块样式
        </UButton>
        <UButton
          variant="outline"
          size="xs"
          @click="applyPreset('transparent')"
        >
          透明容器
        </UButton>
      </div>
    </PropertySection>
  </div>
</template>

<script setup lang="ts">
import type { BaseComponent } from '~/types/designer'
import { reactive } from 'vue'

interface Props {
  component: BaseComponent
}

interface Emits {
  (e: 'update', updates: Partial<BaseComponent>): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 本地属性副本
const localProps = reactive({
  backgroundColor: props.component.props.backgroundColor || '#f5f5f5',
  borderWidth: props.component.props.borderWidth || 1,
  borderColor: props.component.props.borderColor || '#ddd',
  borderRadius: props.component.props.borderRadius || 4,
  padding: props.component.props.padding || 16,
})

// 更新属性
function updateProps() {
  emit('update', {
    props: { ...localProps },
  })
}

// 应用预设样式
function applyPreset(preset: string) {
  const presets = {
    card: {
      backgroundColor: '#ffffff',
      borderWidth: 1,
      borderColor: '#e5e7eb',
      borderRadius: 8,
      padding: 16,
    },
    panel: {
      backgroundColor: '#f9fafb',
      borderWidth: 1,
      borderColor: '#d1d5db',
      borderRadius: 6,
      padding: 20,
    },
    section: {
      backgroundColor: '#ffffff',
      borderWidth: 0,
      borderColor: 'transparent',
      borderRadius: 0,
      padding: 24,
    },
    transparent: {
      backgroundColor: 'transparent',
      borderWidth: 0,
      borderColor: 'transparent',
      borderRadius: 0,
      padding: 0,
    },
  }

  const presetStyle = presets[preset as keyof typeof presets]
  if (presetStyle) {
    Object.assign(localProps, presetStyle)
    updateProps()
  }
}

// 监听组件属性变化
watch(
  () => props.component.props,
  (newProps) => {
    Object.assign(localProps, newProps)
  },
  { deep: true },
)
</script>
