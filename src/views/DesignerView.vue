<script setup lang="ts">
// 示例组件数据
const components = ref([
  { id: 1, name: '按钮', icon: 'pi pi-circle', type: 'Button' },
  { id: 2, name: '输入框', icon: 'pi pi-pencil', type: 'InputText' },
  { id: 3, name: '卡片', icon: 'pi pi-id-card', type: 'Card' },
  { id: 4, name: '表格', icon: 'pi pi-table', type: 'DataTable' },
  { id: 5, name: '图片', icon: 'pi pi-image', type: 'Image' },
  { id: 6, name: '文本', icon: 'pi pi-align-left', type: 'Text' },
])

// 搜索查询
const searchQuery = ref('')

// 示例属性数据 - 默认显示一个示例组件
const selectedComponent = ref({
  id: 'demo',
  name: '示例按钮',
  type: 'Button',
})
const properties = ref([
  { label: '宽度', key: 'width', value: '100px', type: 'text' },
  { label: '高度', key: 'height', value: '40px', type: 'text' },
  { label: '背景色', key: 'backgroundColor', value: '#ffffff', type: 'color' },
  { label: '文字颜色', key: 'color', value: '#000000', type: 'color' },
])
</script>

<template>
  <div class="h-screen flex flex-col font-sans">
    <!-- 顶部工具栏 -->
    <Toolbar class="border-b border-surface-200 dark:border-surface-700">
      <template #start>
        <div class="flex items-center gap-2">
          <Button icon="pi pi-save" label="保存" severity="success" size="small" />
          <Button icon="pi pi-eye" label="预览" severity="info" size="small" />
          <Divider layout="vertical" />
          <Button icon="pi pi-undo" severity="secondary" size="small" v-tooltip="'撤销'" />
          <Button icon="pi pi-refresh" severity="secondary" size="small" v-tooltip="'重做'" />
          <Divider layout="vertical" />
          <Button icon="pi pi-copy" severity="secondary" size="small" v-tooltip="'复制'" />
          <Button icon="pi pi-trash" severity="danger" size="small" v-tooltip="'删除'" />
        </div>
      </template>

      <template #center>
        <div class="flex items-center gap-4">
          <span class="text-lg font-semibold text-surface-700 dark:text-surface-200">
            可视化设计器
          </span>
        </div>
      </template>

      <template #end>
        <div class="flex items-center gap-2">
          <Button icon="pi pi-cog" severity="secondary" size="small" v-tooltip="'设置'" />
          <Button icon="pi pi-question-circle" severity="help" size="small" v-tooltip="'帮助'" />
        </div>
      </template>
    </Toolbar>

    <!-- 主体区域 -->
    <div class="flex-1 flex">
      <!-- 左侧组件库 -->
      <div
        class="w-64 bg-surface-50 dark:bg-surface-900 border-r border-surface-200 dark:border-surface-700 overflow-y-auto"
      >
        <div class="h-full p-4">
          <div class="mb-4">
            <h3 class="text-lg font-semibold text-surface-700 dark:text-surface-200 mb-3">
              组件库
            </h3>
            <InputText placeholder="搜索组件..." class="w-full" v-model="searchQuery" />
          </div>

          <div class="space-y-2">
            <div
              v-for="component in components"
              :key="component.id"
              class="p-3 border border-surface-200 dark:border-surface-700 rounded-lg cursor-pointer hover:bg-surface-100 dark:hover:bg-surface-800 transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-lg"
              draggable="true"
            >
              <div class="flex items-center gap-3">
                <i :class="component.icon" class="text-primary-500"></i>
                <span class="text-sm font-medium text-surface-700 dark:text-surface-200">
                  {{ component.name }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 中间画布区域 -->
      <div class="flex-1 bg-surface-100 dark:bg-surface-800 p-4">
        <div
          class="h-full bg-white dark:bg-surface-900 rounded-lg border-2 border-dashed border-surface-300 dark:border-surface-600 relative overflow-auto"
        >
          <!-- 画布网格背景 -->
          <div
            class="absolute inset-0 opacity-10"
            style="
              background-image: radial-gradient(circle, #6366f1 1px, transparent 1px);
              background-size: 20px 20px;
            "
          ></div>

          <!-- 画布内容区域 -->
          <div class="relative z-10 p-8 min-h-full">
            <div class="text-center text-surface-500 dark:text-surface-400 mt-20">
              <i class="pi pi-plus-circle text-4xl mb-4"></i>
              <p class="text-lg">拖拽组件到此处开始设计</p>
              <p class="text-sm mt-2">从左侧组件库中选择组件并拖拽到画布上</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧属性面板 -->
      <div
        class="w-80 bg-surface-50 dark:bg-surface-900 border-l border-surface-200 dark:border-surface-700 overflow-y-auto"
      >
        <div class="h-full p-4">
          <div class="flex items-center gap-2 mb-4">
            <i class="pi pi-sliders-h text-primary-500"></i>
            <h3 class="text-lg font-semibold text-surface-700 dark:text-surface-200">属性面板</h3>
          </div>

          <div
            v-if="!selectedComponent"
            class="text-center text-surface-500 dark:text-surface-400 mt-8"
          >
            <i class="pi pi-info-circle text-2xl mb-2"></i>
            <p>请选择一个组件</p>
            <p class="text-sm mt-1">点击画布中的组件来编辑属性</p>
          </div>

          <div v-else class="space-y-4">
            <Card>
              <template #title>
                <div class="flex items-center gap-2">
                  <i class="pi pi-cog text-primary-500"></i>
                  <span class="text-sm">基础属性</span>
                </div>
              </template>
              <template #content>
                <div class="space-y-3">
                  <div v-for="prop in properties" :key="prop.key">
                    <label
                      class="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-1"
                    >
                      {{ prop.label }}
                    </label>
                    <InputText
                      v-if="prop.type === 'text'"
                      v-model="prop.value"
                      class="w-full"
                      size="small"
                    />
                    <input
                      v-else-if="prop.type === 'color'"
                      type="color"
                      v-model="prop.value"
                      class="w-full h-8 rounded border border-surface-300 dark:border-surface-600"
                    />
                  </div>
                </div>
              </template>
            </Card>

            <Card>
              <template #title>
                <div class="flex items-center gap-2">
                  <i class="pi pi-palette text-primary-500"></i>
                  <span class="text-sm">样式设置</span>
                </div>
              </template>
              <template #content>
                <div class="space-y-3">
                  <div>
                    <label
                      class="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-1"
                    >
                      边距
                    </label>
                    <InputText placeholder="10px" class="w-full" size="small" />
                  </div>
                  <div>
                    <label
                      class="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-1"
                    >
                      内边距
                    </label>
                    <InputText placeholder="5px" class="w-full" size="small" />
                  </div>
                  <div>
                    <label
                      class="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-1"
                    >
                      边框
                    </label>
                    <InputText placeholder="1px solid #ccc" class="w-full" size="small" />
                  </div>
                </div>
              </template>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
