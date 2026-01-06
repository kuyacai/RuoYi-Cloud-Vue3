<!-- components/EnumCheckboxGroup/index.vue -->
<template>
  <el-checkbox-group
    v-model="selectedValues"
    :disabled="disabled || loading"
    :size="size"
    :class="className"
    :style="style"
    :min="min"
    :max="max"
    v-bind="$attrs"
    @change="handleChange"
  >
    <template v-if="!$slots.default">
      <el-checkbox
        v-for="item in options"
        :key="item.value"
        :label="item.value"
        :disabled="item.disabled || disabled"
        :border="border"
        :size="size"
      >
        <slot name="label" :item="item">
          {{ item.label }}
        </slot>
      </el-checkbox>
    </template>
    
    <!-- 支持完全自定义 -->
    <slot />
  </el-checkbox-group>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useEnumData } from '@/api/hooks/useEnumData'

const props = defineProps({
  // 枚举名称（必需）
  enumName: {
    type: String,
    required: true
  },
  // 双向绑定值（数组）
  modelValue: {
    type: Array,
    default: () => []
  },
  // 默认值
  defaultValue: {
    type: Array,
    default: () => []
  },
  // 是否显示边框
  border: {
    type: Boolean,
    default: false
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false
  },
  // 组件尺寸
  size: {
    type: String,
    default: 'default'
  },
  // 自定义样式
  style: {
    type: [String, Object],
    default: ''
  },
  // 自定义类名
  className: {
    type: [String, Object, Array],
    default: ''
  },
  // 最少选择数量
  min: {
    type: Number,
    default: 0
  },
  // 最多选择数量
  max: {
    type: Number,
    default: 0
  },
  // 选项过滤函数
  filterFn: {
    type: Function,
    default: null
  },
  // 选项转换函数
  transformFn: {
    type: Function,
    default: null
  },
  // 是否立即加载
  immediate: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits([
  'update:modelValue',
  'change',
  'load-success',
  'load-error'
])

// 使用枚举数据 Hook
const { 
  options, 
  loading, 
  error, 
  load, 
  reload, 
  getLabel, 
  getOption 
} = useEnumData(
  props.enumName,
  {
    immediate: props.immediate,
    filterFn: props.filterFn,
    transformFn: props.transformFn
  }
)

// 选中的值（数组）
const selectedValues = computed({
  get: () => {
    const value = props.modelValue.length > 0 ? props.modelValue : props.defaultValue
    return Array.isArray(value) ? value : [value]
  },
  set: (value) => {
    emit('update:modelValue', value)
  }
})

// 监听数据加载完成
watch(() => options.value, (newOptions) => {
  if (newOptions && newOptions.length > 0) {
    emit('load-success', newOptions)
  }
})

// 监听错误
watch(() => error.value, (newError) => {
  if (newError) {
    emit('load-error', newError)
  }
})

// 事件处理
const handleChange = (values) => {
  emit('change', values)
}

// 获取选中的选项
const getSelectedOptions = () => {
  return selectedValues.value
    .map(value => getOption(value))
    .filter(Boolean)
}

// 暴露方法
defineExpose({
  load,
  reload,
  getLabel,
  getOption,
  getSelectedOptions
})
</script>