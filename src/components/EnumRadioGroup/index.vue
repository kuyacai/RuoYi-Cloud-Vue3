<!-- components/EnumRadioGroup/index.vue -->
<template>
  <el-radio-group
    v-model="selectedValue"
    :disabled="disabled || loading"
    :size="size"
    :class="className"
    :style="style"
    v-bind="$attrs"
    @change="handleChange"
  >
    <template v-if="!$slots.default">
      <component
        :is="button ? 'el-radio-button' : 'el-radio'"
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
      </component>
    </template>
    
    <!-- 支持完全自定义 -->
    <slot />
  </el-radio-group>
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
    type: [String, Number, Boolean],
    default: ''
  },
  // 默认值
  defaultValue: {
    type: [String, Number, Boolean],
    default: ''
  },
  // 是否显示为按钮样式
  button: {
    type: Boolean,
    default: false
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
})

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

// 暴露方法
defineExpose({
  load,
  reload,
  getLabel,
  getOption,
  getSelectedOption: () => getOption(selectedValue.value)
})
</script>