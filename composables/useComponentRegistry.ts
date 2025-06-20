import type { Component } from 'vue'
import type { ComponentType } from '~/types/designer'

// 动态导入所有UI组件
const componentModules = {
  text: () => import('~/components/ui/TextComponent.vue'),
  image: () => import('~/components/ui/ImageComponent.vue'),
  container: () => import('~/components/ui/ContainerComponent.vue'),
  button: () => import('~/components/ui/ButtonComponent.vue'),
  input: () => import('~/components/ui/InputComponent.vue'),
}

// 组件缓存
const componentCache = new Map<ComponentType, Component>()

/**
 * 组件注册表 Composable
 * 提供动态组件加载和缓存功能
 */
export function useComponentRegistry() {
  /**
   * 根据组件类型获取组件
   * @param type 组件类型
   * @returns Promise<Component | null>
   */
  const getComponent = async (type: ComponentType): Promise<Component | null> => {
    // 检查缓存
    if (componentCache.has(type)) {
      return componentCache.get(type)!
    }

    // 检查是否支持该组件类型
    if (!componentModules[type]) {
      console.warn(`Unsupported component type: ${type}`)
      return null
    }

    try {
      // 动态导入组件
      const module = await componentModules[type]()
      const component = module.default

      // 缓存组件
      componentCache.set(type, component)

      return component
    }
    catch (error) {
      console.error(`Failed to load component: ${type}`, error)
      return null
    }
  }

  /**
   * 同步获取已缓存的组件
   * @param type 组件类型
   * @returns Component | null
   */
  const getCachedComponent = (type: ComponentType): Component | null => {
    return componentCache.get(type) || null
  }

  /**
   * 预加载所有组件
   * @returns Promise<void>
   */
  const preloadAllComponents = async (): Promise<void> => {
    const types = Object.keys(componentModules) as ComponentType[]

    await Promise.all(
      types.map(type => getComponent(type)),
    )
  }

  /**
   * 获取所有支持的组件类型
   * @returns ComponentType[]
   */
  const getSupportedTypes = (): ComponentType[] => {
    return Object.keys(componentModules) as ComponentType[]
  }

  /**
   * 检查组件类型是否支持
   * @param type 组件类型
   * @returns boolean
   */
  const isTypeSupported = (type: string): type is ComponentType => {
    return type in componentModules
  }

  /**
   * 清空组件缓存
   */
  const clearCache = (): void => {
    componentCache.clear()
  }

  /**
   * 获取缓存统计信息
   */
  const getCacheStats = () => {
    return {
      cachedCount: componentCache.size,
      totalTypes: Object.keys(componentModules).length,
      cachedTypes: Array.from(componentCache.keys()),
    }
  }

  return {
    getComponent,
    getCachedComponent,
    preloadAllComponents,
    getSupportedTypes,
    isTypeSupported,
    clearCache,
    getCacheStats,
  }
}

// 创建全局实例
const globalRegistry = useComponentRegistry()

// 导出便捷方法
export const getComponent = globalRegistry.getComponent
export const getCachedComponent = globalRegistry.getCachedComponent
export const preloadAllComponents = globalRegistry.preloadAllComponents
export const getSupportedTypes = globalRegistry.getSupportedTypes
export const isTypeSupported = globalRegistry.isTypeSupported
