<template>
  <div class="image-component relative h-full w-full">
    <!-- 图片显示 -->
    <img
      v-if="src && !imageError"
      :src="src"
      :alt="alt"
      class="h-full w-full"
      :style="imageStyle"
      @load="handleImageLoad"
      @error="handleImageError"
      @dblclick="openImageSelector"
    />

    <!-- 占位符 -->
    <div
      v-else
      class="
        flex h-full w-full cursor-pointer items-center justify-center border-2
        border-dashed border-gray-300 bg-gray-100
      "
      @click="openImageSelector"
      @dblclick="openImageSelector"
    >
      <div class="text-center text-gray-500">
        <UIcon name="lucide:image" class="mx-auto mb-2 h-8 w-8" />
        <p class="text-sm">
          {{ imageError ? '图片加载失败' : '点击选择图片' }}
        </p>
        <p class="mt-1 text-xs text-gray-400">
          支持 JPG、PNG、GIF、SVG
        </p>
      </div>
    </div>

    <!-- 加载状态 -->
    <div
      v-if="isLoading"
      class="
        bg-opacity-75 absolute inset-0 flex items-center justify-center bg-white
      "
    >
      <div class="text-center">
        <div
          class="
            mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-b-2
            border-blue-500
          "
        ></div>
        <p class="text-xs text-gray-500">
          加载中...
        </p>
      </div>
    </div>

    <!-- 隐藏的文件输入 -->
    <input
      ref="fileInputRef"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handleFileSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  src?: string
  alt?: string
  fit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  borderRadius?: number
}

interface Emits {
  (e: 'update', updates: Partial<Props>): void
}

const props = withDefaults(defineProps<Props>(), {
  src: '',
  alt: '图片',
  fit: 'cover',
  borderRadius: 0,
})

const emit = defineEmits<Emits>()

// 状态
const isLoading = ref(false)
const imageError = ref(false)
const fileInputRef = ref<HTMLInputElement>()

// 计算样式
const imageStyle = computed(() => ({
  objectFit: props.fit,
  borderRadius: `${props.borderRadius}px`,
}))

// 图片加载成功
function handleImageLoad() {
  isLoading.value = false
  imageError.value = false
}

// 图片加载失败
function handleImageError() {
  isLoading.value = false
  imageError.value = true
}

// 打开图片选择器
function openImageSelector() {
  fileInputRef.value?.click()
}

// 处理文件选择
function handleFileSelect(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file)
    return

  // 检查文件类型
  if (!file.type.startsWith('image/')) {
    console.warn('请选择图片文件')
    return
  }

  // 检查文件大小（限制为 10MB）
  if (file.size > 10 * 1024 * 1024) {
    console.warn('图片文件不能超过 10MB')
    return
  }

  isLoading.value = true
  imageError.value = false

  // 读取文件并转换为 Data URL
  const reader = new FileReader()
  reader.onload = (e) => {
    const dataUrl = e.target?.result as string
    emit('update', {
      src: dataUrl,
      alt: file.name.replace(/\.[^/.]+$/, ''), // 移除文件扩展名作为 alt
    })
    isLoading.value = false
  }
  reader.onerror = () => {
    isLoading.value = false
    imageError.value = true
    console.error('图片读取失败')
  }
  reader.readAsDataURL(file)

  // 清空输入框，允许重复选择同一文件
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

// 监听 src 变化，重置错误状态
watch(() => props.src, (newSrc) => {
  if (newSrc) {
    imageError.value = false
  }
})
</script>

<style scoped>
.image-component {
  overflow: hidden;
}

.image-component img {
  transition: all 0.2s ease;
}

.image-component:hover img {
  transform: scale(1.02);
}

/* 拖拽样式 */
.image-component.drag-over {
  border-color: #3b82f6;
  background-color: rgba(59, 130, 246, 0.1);
}
</style>
