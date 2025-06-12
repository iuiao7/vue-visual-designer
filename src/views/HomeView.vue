<script setup lang="ts">
const router = useRouter()

const goToDesigner = () => {
  router.push('/designer')
}
</script>

<template>
  <main
    class="min-h-screen bg-gradient-to-br from-primary-50 to-surface-50 dark:from-surface-900 dark:to-surface-800"
  >
    <div class="container mx-auto px-4 py-16">
      <!-- 英雄区域 -->
      <div class="text-center mb-16">
        <h1 class="text-5xl font-bold text-surface-900 dark:text-surface-100 mb-6">
          Vue 可视化设计器
        </h1>
        <p class="text-xl text-surface-600 dark:text-surface-300 mb-8 max-w-2xl mx-auto">
          强大的拖拽式界面设计工具，让您轻松创建美观的用户界面。 使用 PrimeVue
          组件库，支持实时预览和代码生成。
        </p>
        <div class="flex gap-4 justify-center">
          <Button label="开始设计" icon="pi pi-play" size="large" @click="goToDesigner" />
          <Button label="查看文档" icon="pi pi-book" severity="secondary" size="large" outlined />
        </div>
      </div>

      <!-- 功能特性 -->
      <div class="grid md:grid-cols-3 gap-8 mb-16">
        <Card class="text-center">
          <template #content>
            <div class="p-6">
              <div
                class="bg-primary-100 dark:bg-primary-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <i class="pi pi-palette text-2xl text-primary-600 dark:text-primary-300"></i>
              </div>
              <h3 class="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-3">
                拖拽设计
              </h3>
              <p class="text-surface-600 dark:text-surface-300">
                直观的拖拽操作，快速构建界面布局，所见即所得的设计体验。
              </p>
            </div>
          </template>
        </Card>

        <Card class="text-center">
          <template #content>
            <div class="p-6">
              <div
                class="bg-primary-100 dark:bg-primary-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <i class="pi pi-cog text-2xl text-primary-600 dark:text-primary-300"></i>
              </div>
              <h3 class="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-3">
                属性编辑
              </h3>
              <p class="text-surface-600 dark:text-surface-300">
                实时编辑组件属性，支持样式、事件、数据绑定等全方位配置。
              </p>
            </div>
          </template>
        </Card>

        <Card class="text-center">
          <template #content>
            <div class="p-6">
              <div
                class="bg-primary-100 dark:bg-primary-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <i class="pi pi-code text-2xl text-primary-600 dark:text-primary-300"></i>
              </div>
              <h3 class="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-3">
                代码生成
              </h3>
              <p class="text-surface-600 dark:text-surface-300">
                自动生成高质量的 Vue 代码，支持导出和集成到现有项目中。
              </p>
            </div>
          </template>
        </Card>
      </div>

      <!-- 快速开始 -->
      <div class="bg-white dark:bg-surface-900 rounded-2xl p-8 shadow-lg">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-surface-900 dark:text-surface-100 mb-4">快速开始</h2>
          <p class="text-surface-600 dark:text-surface-300">三步即可开始您的设计之旅</p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center">
            <div
              class="bg-primary-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold"
            >
              1
            </div>
            <h4 class="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-2">
              选择组件
            </h4>
            <p class="text-surface-600 dark:text-surface-300">从左侧组件库中选择需要的 UI 组件</p>
          </div>

          <div class="text-center">
            <div
              class="bg-primary-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold"
            >
              2
            </div>
            <h4 class="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-2">
              拖拽布局
            </h4>
            <p class="text-surface-600 dark:text-surface-300">将组件拖拽到画布上，自由组合布局</p>
          </div>

          <div class="text-center">
            <div
              class="bg-primary-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold"
            >
              3
            </div>
            <h4 class="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-2">
              配置属性
            </h4>
            <p class="text-surface-600 dark:text-surface-300">在右侧面板中调整组件的样式和属性</p>
          </div>
        </div>

        <div class="text-center mt-8">
          <Button label="立即体验" icon="pi pi-arrow-right" size="large" @click="goToDesigner" />
        </div>
      </div>
    </div>
  </main>
</template>
