import type { ComponentLibraryItem, ComponentType } from '~/types/designer'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useComponentLibraryStore = defineStore('componentLibrary', () => {
  // 组件库数据
  const components = ref<ComponentLibraryItem[]>([
    // 文字组件
    {
      type: 'text',
      name: '文字',
      icon: 'lucide:type',
      category: '基础组件',
      description: '可编辑的文字组件',
      defaultProps: {
        text: '双击编辑文字',
        fontSize: 16,
        fontFamily: 'Arial, sans-serif',
        fontWeight: 'normal',
        color: '#333333',
        textAlign: 'left',
        lineHeight: 1.5,
        letterSpacing: 0,
      },
      defaultStyle: {
        backgroundColor: 'transparent',
        border: 'none',
        padding: '8px',
      },
      defaultTransform: {
        width: 200,
        height: 40,
      },
    },

    // 图片组件
    {
      type: 'image',
      name: '图片',
      icon: 'lucide:image',
      category: '基础组件',
      description: '图片展示组件',
      defaultProps: {
        src: 'https://via.placeholder.com/200x150?text=Image',
        alt: '图片',
        fit: 'cover',
        borderRadius: 0,
      },
      defaultStyle: {
        border: 'none',
      },
      defaultTransform: {
        width: 200,
        height: 150,
      },
    },

    // 容器组件
    {
      type: 'container',
      name: '容器',
      icon: 'lucide:square',
      category: '布局组件',
      description: '可包含其他组件的容器',
      defaultProps: {
        backgroundColor: '#f5f5f5',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        padding: 16,
      },
      defaultStyle: {},
      defaultTransform: {
        width: 300,
        height: 200,
      },
    },

    // 按钮组件
    {
      type: 'button',
      name: '按钮',
      icon: 'lucide:mouse-pointer-click',
      category: '交互组件',
      description: '可点击的按钮组件',
      defaultProps: {
        text: '按钮',
        fontSize: 14,
        fontWeight: 'bold',
        color: '#ffffff',
        backgroundColor: '#007bff',
        borderRadius: 4,
        padding: '8px 16px',
      },
      defaultStyle: {
        cursor: 'pointer',
        border: 'none',
      },
      defaultTransform: {
        width: 100,
        height: 36,
      },
    },

    // 输入框组件
    {
      type: 'input',
      name: '输入框',
      icon: 'lucide:edit-3',
      category: '表单组件',
      description: '文本输入框组件',
      defaultProps: {
        placeholder: '请输入内容',
        value: '',
        fontSize: 14,
        color: '#333',
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        padding: '8px 12px',
      },
      defaultStyle: {},
      defaultTransform: {
        width: 200,
        height: 36,
      },
    },
  ])

  // 组件分类
  const categories = computed(() => {
    const categorySet = new Set(components.value.map(c => c.category))
    return Array.from(categorySet)
  })

  // 当前选中的分类
  const selectedCategory = ref<string>('全部')

  // 搜索关键词
  const searchKeyword = ref<string>('')

  // 过滤后的组件列表
  const filteredComponents = computed(() => {
    let filtered = components.value

    // 按分类过滤
    if (selectedCategory.value !== '全部') {
      filtered = filtered.filter(c => c.category === selectedCategory.value)
    }

    // 按关键词搜索
    if (searchKeyword.value.trim()) {
      const keyword = searchKeyword.value.toLowerCase().trim()
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(keyword)
        || c.description.toLowerCase().includes(keyword),
      )
    }

    return filtered
  })

  // 按分类分组的组件
  const componentsByCategory = computed(() => {
    const grouped: Record<string, ComponentLibraryItem[]> = {}

    filteredComponents.value.forEach((component) => {
      if (!grouped[component.category]) {
        grouped[component.category] = []
      }
      grouped[component.category].push(component)
    })

    return grouped
  })

  // 获取组件模板
  const getComponentTemplate = (type: ComponentType): ComponentLibraryItem | undefined => {
    return components.value.find(c => c.type === type)
  }

  // 添加自定义组件到库
  const addCustomComponent = (component: ComponentLibraryItem) => {
    // 检查是否已存在相同类型的组件
    const existingIndex = components.value.findIndex(c => c.type === component.type && c.name === component.name)

    if (existingIndex > -1) {
      // 更新现有组件
      components.value[existingIndex] = component
    }
    else {
      // 添加新组件
      components.value.push(component)
    }
  }

  // 删除自定义组件
  const removeCustomComponent = (type: ComponentType, name: string) => {
    const index = components.value.findIndex(c => c.type === type && c.name === name)
    if (index > -1) {
      components.value.splice(index, 1)
    }
  }

  // 设置选中的分类
  const setSelectedCategory = (category: string) => {
    selectedCategory.value = category
  }

  // 设置搜索关键词
  const setSearchKeyword = (keyword: string) => {
    searchKeyword.value = keyword
  }

  // 清空搜索
  const clearSearch = () => {
    searchKeyword.value = ''
    selectedCategory.value = '全部'
  }

  // 获取组件统计信息
  const getComponentStats = () => {
    const stats: Record<string, number> = {}

    components.value.forEach((component) => {
      stats[component.category] = (stats[component.category] || 0) + 1
    })

    return {
      total: components.value.length,
      byCategory: stats,
      categories: categories.value.length,
    }
  }

  // 导出组件库配置
  const exportLibrary = () => {
    return {
      version: '1.0.0',
      components: components.value,
      exportTime: Date.now(),
    }
  }

  // 导入组件库配置
  const importLibrary = (libraryData: any, merge = false) => {
    if (!libraryData.components || !Array.isArray(libraryData.components)) {
      throw new Error('Invalid library data format')
    }

    if (merge) {
      // 合并模式：添加新组件，更新现有组件
      libraryData.components.forEach((component: ComponentLibraryItem) => {
        addCustomComponent(component)
      })
    }
    else {
      // 替换模式：完全替换组件库
      components.value = libraryData.components
    }
  }

  // 重置为默认组件库
  const resetToDefault = () => {
    // 这里可以重新加载默认组件
    // 当前实现中，默认组件已经在初始化时定义
    // Reset to default library
  }

  // 验证组件配置
  const validateComponent = (component: ComponentLibraryItem): boolean => {
    return !!(
      component.type
      && component.name
      && component.category
      && component.defaultProps
      && component.defaultTransform
    )
  }

  return {
    // 状态
    components: readonly(components),
    selectedCategory: readonly(selectedCategory),
    searchKeyword: readonly(searchKeyword),

    // 计算属性
    categories,
    filteredComponents,
    componentsByCategory,

    // 核心方法
    getComponentTemplate,
    addCustomComponent,
    removeCustomComponent,

    // 过滤和搜索
    setSelectedCategory,
    setSearchKeyword,
    clearSearch,

    // 工具方法
    getComponentStats,
    exportLibrary,
    importLibrary,
    resetToDefault,
    validateComponent,
  }
})
