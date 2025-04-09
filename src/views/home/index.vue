<template>
  <div>
    <header class="h-12 px-4 bg-white flex items-center gap-4">
      <Button variant="outline" size="sm">撤销</Button>
      <Button variant="outline" size="sm">重做</Button>
      <Button variant="outline" size="sm">预览</Button>
      <Button variant="outline" size="sm">保存</Button>
      <Button variant="outline" size="sm">清空画布</Button>
      <div class="ml-10 flex items-center gap-2">
        <span>画布大小：</span>
        <Input v-model="canvasWidth" class="w-16 h-8" />
        <span>x</span>
        <Input v-model="canvasHeight" class="w-16 h-8" />
      </div>
    </header>

    <div
      class="h-[calc(100vh-theme(height.12))] grid place-items-center grid-cols-[300px_1fr_400px] bg-gray-100 p-4 gap-4"
    >
      <div class="p-4 size-full bg-white rounded-lg grid grid-cols-2 place-content-start gap-4">
        <Button v-for="item in componentList" :key="item.id" variant="outline">
          <component :is="item.icon" class="mr-1" /> {{ item.label }}
        </Button>
      </div>
      <div class="overflow-hidden">
        <div :style="{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }" class="bg-white">
          <component
            :is="item.component"
            v-for="(item, index) in componentData"
            :key="index"
            :style="item.style"
            :prop-value="item.propValue"
          />
        </div>
      </div>
      <div class="p-4 size-full bg-white rounded-lg">
        <Tabs default-value="property">
          <TabsList class="w-full">
            <TabsTrigger value="property" class="flex-1"> 属性 </TabsTrigger>
            <TabsTrigger value="animation" class="flex-1"> 动画 </TabsTrigger>
            <TabsTrigger value="event" class="flex-1"> 事件 </TabsTrigger>
          </TabsList>
          <TabsContent value="property"></TabsContent>
          <TabsContent value="animation"></TabsContent>
          <TabsContent value="event"></TabsContent>
        </Tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const canvasWidth = ref<number>(1200)
const canvasHeight = ref<number>(1080)

type Component = {
  id: string
  label: string
  propValue: string
  icon: string
  component: string
  animations: object[]
  events: object[]
  style: object
}

const componentList = ref<Component[]>([
  {
    id: '1',
    label: '图片',
    propValue: '',
    icon: 'image',
    component: 'CptPicture',
    animations: [],
    events: [],
    style: {
      width: 200,
      height: 200,
    },
  },
  {
    id: '2',
    label: '按钮',
    propValue: '',
    icon: 'mouse-pointer-click',
    component: 'CptButton',
    animations: [],
    events: [],
    style: {
      width: 200,
      height: 200,
    },
  },
  {
    id: '3',
    label: '文本',
    propValue: '',
    icon: 'pen-line',
    component: 'CptText',
    animations: [],
    events: [],
    style: {
      width: 200,
      height: 200,
    },
  },
])

const componentData = ref<Component[]>([])
</script>
