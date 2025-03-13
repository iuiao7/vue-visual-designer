<template>
  <div>
    <header class="h-12 px-4 bg-white grid grid-cols-[40px,1fr,40px] items-center">
      <img alt="Vue logo" class="w-8" src="@/assets/logo.svg" />

      <nav class="flex justify-center gap-4">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>

      <div></div>
    </header>

    <div
      class="h-[calc(100vh-theme(height.12))] grid grid-cols-[400px,1fr,400px] bg-gray-100 p-4 gap-4"
    >
      <aside class="size-full bg-white rounded-lg"></aside>
      <main class="w-full h-[1080px] bg-white rounded-lg"></main>
      <aside class="size-full bg-white rounded-lg"></aside>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
