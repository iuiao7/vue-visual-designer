<template>
  <div class="property-section">
    <!-- 标题栏 -->
    <div
      class="flex cursor-pointer items-center justify-between py-2"
      @click="toggleExpanded"
    >
      <h4 class="text-sm font-medium text-gray-800">
        {{ title }}
      </h4>
      <UIcon
        :name="isExpanded ? 'lucide:chevron-down' : 'lucide:chevron-right'"
        class="h-4 w-4 text-gray-500 transition-transform duration-200"
      />
    </div>

    <!-- 内容区域 -->
    <div
      v-if="isExpanded"
      class="pb-4"
    >
      <slot></slot>
    </div>

    <!-- 分割线 -->
    <div
      class="
        border-b border-gray-100
        last:border-b-0
      "
    ></div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  defaultExpanded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  defaultExpanded: true,
})

const isExpanded = ref(props.defaultExpanded)

function toggleExpanded() {
  isExpanded.value = !isExpanded.value
}
</script>

<style scoped>
.property-section:last-child .border-b {
  display: none;
}
</style>
