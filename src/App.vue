<template>
  <div class="flex min-h-screen flex-col">
    <!-- <header
      class="bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-700 px-4 py-3"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <img alt="Vue logo" src="@/assets/logo.svg" width="32" height="32" />
          <h1 class="text-xl font-bold text-surface-700 dark:text-surface-200">Vue 可视化设计器</h1>
        </div>

        <nav class="hidden md:flex items-center gap-4">
          <RouterLink
            to="/"
            class="px-3 py-2 rounded-lg text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
            active-class="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 font-semibold"
          >
            首页
          </RouterLink>
          <RouterLink
            to="/designer"
            class="px-3 py-2 rounded-lg text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
            active-class="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 font-semibold"
          >
            设计器
          </RouterLink>
          <RouterLink
            to="/about"
            class="px-3 py-2 rounded-lg text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
            active-class="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 font-semibold"
          >
            关于
          </RouterLink>
        </nav>

        <Button
          icon="pi pi-bars"
          class="md:hidden"
          severity="secondary"
          text
          @click="isMenuVisible = !isMenuVisible"
        />
      </div>

      <div
        v-if="isMenuVisible"
        class="md:hidden mt-4 pb-4 border-t border-surface-200 dark:border-surface-700 pt-4"
      >
        <nav class="flex flex-col gap-2">
          <RouterLink
            to="/"
            class="px-3 py-2 rounded-lg text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
            active-class="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 font-semibold"
            @click="isMenuVisible = false"
          >
            首页
          </RouterLink>
          <RouterLink
            to="/designer"
            class="px-3 py-2 rounded-lg text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
            active-class="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 font-semibold"
            @click="isMenuVisible = false"
          >
            设计器
          </RouterLink>
          <RouterLink
            to="/about"
            class="px-3 py-2 rounded-lg text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
            active-class="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 font-semibold"
            @click="isMenuVisible = false"
          >
            关于
          </RouterLink>
        </nav>
      </div>
    </header> -->

    <main class="flex-1">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
// const isMenuVisible = ref(false)
</script>
