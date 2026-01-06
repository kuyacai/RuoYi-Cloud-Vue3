/**
 * hooks/useEnumData.js 
 *  
 */ 
import { ref, watch, computed } from 'vue'
import { productEnumService } from '@/api/product/enumService'

/**
 * 枚举数据 Hook
 * 负责枚举数据的获取、状态管理和转换
 */
export function useEnumData(enumName, options = {}) {
  const {
    immediate = true,
    filterFn = null,
    transformFn = null,
    valueKey = 'code',
    labelKey = 'label'
  } = options

  // 响应式状态
  const loading = ref(false)
  const data = ref([])
  const error = ref(null)
  const formattedOptions = ref([])

  /**
   * 加载枚举数据
   */
  const loadData = async () => {
    if (!enumName) {
      console.warn('useEnumData: enumName 不能为空')
      return
    }

    loading.value = true
    error.value = null

    try {
      // 调用服务层获取数据
      const result = await productEnumService.getEnum(enumName)
      
      // 数据处理流水线
      let processedData = [...result]
      
      // 1. 过滤
      if (filterFn && typeof filterFn === 'function') {
        processedData = processedData.filter(filterFn)
      }
      
      // 2. 转换
      if (transformFn && typeof transformFn === 'function') {
        processedData = processedData.map(transformFn)
      } else {
        // 默认转换：统一字段名
        processedData = processedData.map(item => ({
          ...item,
          value: item[valueKey] || item.code,
          label: item[labelKey] || item.label
        }))
      }
      
      data.value = processedData
      formattedOptions.value = processedData
      
      return processedData
    } catch (err) {
      error.value = err
      console.error(`useEnumData: 加载枚举 ${enumName} 失败`, err)
      data.value = []
      formattedOptions.value = []
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 重新加载数据
   */
  const reload = () => {
    productEnumService.clearEnumCache(enumName)
    return loadData()
  }

  /**
   * 获取指定值的标签
   */
  const getLabelByValue = (value) => {
    const item = formattedOptions.value.find(opt => opt.value === value)
    return item ? item.label : value || ''
  }

  /**
   * 获取指定值的完整选项
   */
  const getOptionByValue = (value) => {
    return formattedOptions.value.find(opt => opt.value === value) || null
  }

  // 自动加载
  if (immediate && enumName) {
    loadData()
  }

  // 监听 enumName 变化
  watch(() => enumName, (newName, oldName) => {
    if (newName && newName !== oldName) {
      loadData()
    }
  })

  return {
    // 状态
    loading,
    error,
    
    // 数据
    rawData: data,           // 原始数据
    options: formattedOptions, // 格式化后的选项
    data: computed(() => formattedOptions.value), // 兼容性别名
    
    // 方法
    load: loadData,
    reload,
    getLabel: getLabelByValue,
    getOption: getOptionByValue,
    
    // 快捷方法
    isEmpty: computed(() => formattedOptions.value.length === 0)
  }
}