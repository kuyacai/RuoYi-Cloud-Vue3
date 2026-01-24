<template>
  <el-switch
    v-if="activeCode !== undefined"
    v-model="selectedValue"
    :loading="loading"
    :disabled="disabled || loading"
    :active-value="activeCode"
    :inactive-value="inactiveCode"
    :active-text="activeLabel"
    :inactive-text="inactiveLabel"
    inline-prompt
    v-bind="$attrs"
  />
  <el-skeleton-item v-else variant="rect" style="width: 40px; height: 20px" />
</template>

<script setup>
import { computed } from 'vue'
import { useEnumData } from '@/api/hooks/useEnumData'

const props = defineProps({
  // 枚举名称，例如 "ActiveStatus"
  enumName: {
    type: String,
    required: true
  },
  // 双向绑定值
  modelValue: {
    type: [String, Number, Boolean],
    default: ''
  },
  // 哪些 code 代表“开启”状态，默认是 'active' 或 'enable'
  // 支持传入自定义 code
  activeValue: {
    type: String,
    default: 'enable' 
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

// 使用你封装的 Hook 获取枚举数据
const { options, loading } = useEnumData(props.enumName)

// 计算“开启”项的配置
const activeOption = computed(() => {
  // 优先匹配 props 传入的 activeValue，匹配不到则默认取第一项
  return options.value.find(opt => opt.value === props.activeValue) || options.value[0]
})

// 计算“关闭”项的配置
const inactiveOption = computed(() => {
  return options.value.find(opt => opt.value !== activeOption.value?.value) || options.value[1]
})

// 绑定值处理
const selectedValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// 暴露给 el-switch 的参数
const activeCode = computed(() => activeOption.value?.value || undefined)
const activeLabel = computed(() => activeOption.value?.label)
const inactiveCode = computed(() => inactiveOption.value?.value || undefined)
const inactiveLabel = computed(() => inactiveOption.value?.label)
</script>