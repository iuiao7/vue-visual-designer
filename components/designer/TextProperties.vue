<template>
  <div class="space-y-4">
    <!-- 文字内容 -->
    <PropertySection title="文字内容">
      <div class="space-y-3">
        <div>
          <label class="mb-1 block text-xs font-medium text-gray-700">文字内容</label>
          <UTextarea
            v-model="localProps.text"
            placeholder="输入文字内容..."
            :rows="3"
            size="sm"
            @blur="updateProps"
          />
        </div>
      </div>
    </PropertySection>

    <!-- 字体样式 -->
    <PropertySection title="字体样式">
      <div class="space-y-3">
        <div>
          <label class="mb-1 block text-xs font-medium text-gray-700">字体大小</label>
          <div class="flex items-center space-x-2">
            <UInput
              v-model.number="localProps.fontSize"
              type="number"
              size="sm"
              class="flex-1"
              @blur="updateProps"
            />
            <span class="text-xs text-gray-500">px</span>
          </div>
        </div>

        <div>
          <label class="mb-1 block text-xs font-medium text-gray-700">字体族</label>
          <USelect
            v-model="localProps.fontFamily"
            :options="fontFamilyOptions"
            size="sm"
            @change="updateProps"
          />
        </div>

        <div>
          <label class="mb-1 block text-xs font-medium text-gray-700">字体粗细</label>
          <USelect
            v-model="localProps.fontWeight"
            :options="fontWeightOptions"
            size="sm"
            @change="updateProps"
          />
        </div>

        <div>
          <label class="mb-1 block text-xs font-medium text-gray-700">文字颜色</label>
          <div class="flex items-center space-x-2">
            <input
              v-model="localProps.color"
              type="color"
              class="h-8 w-8 cursor-pointer rounded border border-gray-300"
              @change="updateProps"
            />
            <UInput
              v-model="localProps.color"
              size="sm"
              class="flex-1"
              @blur="updateProps"
            />
          </div>
        </div>
      </div>
    </PropertySection>

    <!-- 文字对齐 -->
    <PropertySection title="文字对齐">
      <div class="space-y-3">
        <div>
          <label class="mb-1 block text-xs font-medium text-gray-700">水平对齐</label>
          <div class="flex space-x-1">
            <UButton
              v-for="align in textAlignOptions"
              :key="align.value"
              :variant="localProps.textAlign === align.value ? 'solid' : 'outline'"
              size="xs"
              @click="setTextAlign(align.value)"
            >
              <UIcon :name="align.icon" class="h-3 w-3" />
            </UButton>
          </div>
        </div>

        <div>
          <label class="mb-1 block text-xs font-medium text-gray-700">行高</label>
          <div class="flex items-center space-x-2">
            <UInput
              v-model.number="localProps.lineHeight"
              type="number"
              step="0.1"
              min="0.5"
              max="3"
              size="sm"
              class="flex-1"
              @blur="updateProps"
            />
            <span class="text-xs text-gray-500">倍</span>
          </div>
        </div>

        <div>
          <label class="mb-1 block text-xs font-medium text-gray-700">字间距</label>
          <div class="flex items-center space-x-2">
            <UInput
              v-model.number="localProps.letterSpacing"
              type="number"
              step="0.5"
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
          @click="applyPreset('title')"
        >
          标题样式
        </UButton>
        <UButton
          variant="outline"
          size="xs"
          @click="applyPreset('subtitle')"
        >
          副标题
        </UButton>
        <UButton
          variant="outline"
          size="xs"
          @click="applyPreset('body')"
        >
          正文样式
        </UButton>
        <UButton
          variant="outline"
          size="xs"
          @click="applyPreset('caption')"
        >
          说明文字
        </UButton>
      </div>
    </PropertySection>
  </div>
</template>

<script setup lang="ts">
import type { BaseComponent } from '~/types/designer'
import { reactive, watch } from 'vue'

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
  text: props.component.props.text || '双击编辑文字',
  fontSize: props.component.props.fontSize || 16,
  fontFamily: props.component.props.fontFamily || 'Arial, sans-serif',
  fontWeight: props.component.props.fontWeight || 'normal',
  color: props.component.props.color || '#333333',
  textAlign: props.component.props.textAlign || 'left',
  lineHeight: props.component.props.lineHeight || 1.5,
  letterSpacing: props.component.props.letterSpacing || 0,
})

// 字体族选项
const fontFamilyOptions = [
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Helvetica', value: 'Helvetica, sans-serif' },
  { label: 'Times New Roman', value: 'Times New Roman, serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Courier New', value: 'Courier New, monospace' },
  { label: '微软雅黑', value: 'Microsoft YaHei, sans-serif' },
  { label: '宋体', value: 'SimSun, serif' },
  { label: '黑体', value: 'SimHei, sans-serif' },
]

// 字体粗细选项
const fontWeightOptions = [
  { label: '细体', value: '300' },
  { label: '正常', value: 'normal' },
  { label: '中等', value: '500' },
  { label: '粗体', value: 'bold' },
  { label: '特粗', value: '800' },
]

// 文字对齐选项
const textAlignOptions = [
  { label: '左对齐', value: 'left', icon: 'lucide:align-left' },
  { label: '居中', value: 'center', icon: 'lucide:align-center' },
  { label: '右对齐', value: 'right', icon: 'lucide:align-right' },
]

// 更新属性
function updateProps() {
  emit('update', {
    props: { ...localProps },
  })
}

// 设置文字对齐
function setTextAlign(align: string) {
  localProps.textAlign = align
  updateProps()
}

// 应用预设样式
function applyPreset(preset: string) {
  const presets = {
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#1f2937',
      lineHeight: 1.2,
    },
    subtitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#374151',
      lineHeight: 1.3,
    },
    body: {
      fontSize: 14,
      fontWeight: 'normal',
      color: '#4b5563',
      lineHeight: 1.5,
    },
    caption: {
      fontSize: 12,
      fontWeight: 'normal',
      color: '#6b7280',
      lineHeight: 1.4,
    },
  }

  const presetStyle = presets[preset as keyof typeof presets]
  if (presetStyle) {
    Object.assign(localProps, presetStyle)
    updateProps()
  }
}

// 监听组件属性变化，同步到本地副本
watch(
  () => props.component.props,
  (newProps) => {
    Object.assign(localProps, newProps)
  },
  { deep: true },
)
</script>
