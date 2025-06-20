<template>
  <div
    class="container-component relative h-full w-full"
    :style="containerStyle"
  >
    <!-- 容器内容 -->
    <div
      class="h-full w-full"
      :style="contentStyle"
    >
      <!-- 子组件渲染区域 -->
      <slot></slot>

      <!-- 空容器提示 -->
      <div
        v-if="!hasChildren"
        class="
          pointer-events-none absolute inset-0 flex items-center justify-center
          text-gray-400
        "
      >
        <div class="text-center">
          <UIcon name="lucide:box" class="mx-auto mb-1 h-6 w-6" />
          <p class="text-xs">
            容器
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  backgroundColor?: string
  borderWidth?: number
  borderColor?: string
  borderRadius?: number
  padding?: number
  hasChildren?: boolean
}

interface Emits {
  (e: 'update', updates: Partial<Props>): void
}

const props = withDefaults(defineProps<Props>(), {
  backgroundColor: '#f5f5f5',
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 4,
  padding: 16,
  hasChildren: false,
})

const _emit = defineEmits<Emits>()

// 计算样式
const containerStyle = computed(() => ({
  backgroundColor: props.backgroundColor,
  border: `${props.borderWidth}px solid ${props.borderColor}`,
  borderRadius: `${props.borderRadius}px`,
  padding: `${props.padding}px`,
}))

const contentStyle = computed(() => ({
  width: '100%',
  height: '100%',
  position: 'relative' as const,
}))
</script>

<style scoped>
.container-component {
  box-sizing: border-box;
}

/* 容器悬停效果 */
.container-component:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 拖拽放置区域样式 */
.container-component.drop-zone {
  border-style: dashed;
  border-color: #3b82f6;
  background-color: rgba(59, 130, 246, 0.05);
}
</style>
