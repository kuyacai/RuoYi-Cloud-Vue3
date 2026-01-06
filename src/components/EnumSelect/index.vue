<!-- components/EnumSelect/index.vue -->
<template>
  <el-select
    v-model="selectedValue"
    :placeholder="placeholder"
    :clearable="clearable"
    :filterable="filterable"
    :multiple="multiple"
    :disabled="disabled || loading"
    :loading="loading"
    :size="size"
    :style="style"
    :class="className"
    v-bind="$attrs"
    @change="handleChange"
    @clear="handleClear"
    @visible-change="handleVisibleChange"
  >
    <!-- 默认选项渲染 -->
    <template v-if="!$slots.default">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        :disabled="item.disabled"
      >
        <slot name="option" :item="item">
          {{ item.label }}
        </slot>
      </el-option>
    </template>
    
    <!-- 支持自定义所有选项 -->
    <slot />
  </el-select>
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
  // 双向绑定值
  modelValue: {
    type: [String, Number, Array],
    default: ''
  },
  // 默认值（当modelValue为空时使用）
  defaultValue: {
    type: [String, Number],
    default: ''
  },
  // 占位符
  placeholder: {
    type: String,
    default: '请选择'
  },
  // 是否可清空
  clearable: {
    type: Boolean,
    default: true
  },
  // 是否可搜索
  filterable: {
    type: Boolean,
    default: false
  },
  // 是否多选
  multiple: {
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
  'clear',
  'visible-change',
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

// 选中的值
const selectedValue = computed({
  get: () => props.modelValue || props.defaultValue,
  set: (value) => {
    emit('update:modelValue', value)
  }
})

// 监听数据加载完成
watch(() => options.value, (newOptions) => {
  if (newOptions && newOptions.length > 0) {
    emit('load-success', newOptions)
  }
}, { immediate: true })

// 监听错误
watch(() => error.value, (newError) => {
  if (newError) {
    emit('load-error', newError)
  }
})

// 事件处理
const handleChange = (value) => {
  emit('change', value)
}

const handleClear = () => {
  emit('clear')
}

const handleVisibleChange = (visible) => {
  emit('visible-change', visible)
}

// 暴露方法给父组件
defineExpose({
  load,
  reload,
  getLabel,
  getOption,
  getSelectedOption: () => getOption(selectedValue.value),
  focus: () => {
    // 可以通过 ref 调用原生的 focus 方法
    // 这里需要在实际使用时通过 ref 获取 el-select 实例
  },
  blur: () => {
    // 同上
  }
})
</script>

<style scoped>
/* 可以添加一些自定义样式 */
</style>