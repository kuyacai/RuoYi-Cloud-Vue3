<template>
  <el-card shadow="never" class="attribute-card">
    <template #header>
      <div class="card-header">
        <el-icon><InfoFilled /></el-icon>
        <b class="ml5">商品参数</b>
      </div>
    </template>

    <el-descriptions :column="4" border class="attribute-content">
      <el-descriptions-item
        v-for="(item, index) in attributeList"
        :key="index"
        :label="item.key"
        label-align="right"
        label-class-name="attr-label"
      >
        {{ item.value || "-" }}
      </el-descriptions-item>
    </el-descriptions>
  </el-card>
</template>

<script setup>
import { computed, watch } from "vue";
import { InfoFilled } from "@element-plus/icons-vue";

const props = defineProps({ spu: Object });

// 1. 获取原始字符串
const rawAttributes = computed(() => props.spu?.attributes);

/**
 * 解析逻辑
 */
const attributeList = computed(() => {
  // 【关键修正】：使用 rawAttributes.value 获取实际字符串
  const attrStr = rawAttributes.value;

  console.log("[Debug] 开始解析 attributeList, 原始值:", attrStr);

  // 防御性校验
  if (typeof attrStr !== "string" || !attrStr) {
    console.log("[Debug] 解析终止: rawAttributes 并非字符串或为空");
    return [];
  }

  const result = attrStr
    .split(";")
    .filter((item) => item && item.includes(":"))
    .map((item) => {
      const [key, ...valueParts] = item.split(":");
      const value = valueParts.join(":");
      return {
        key: key.trim(),
        value: value.trim(),
      };
    });

  console.log("[Debug] 解析成功, 结果对象:", result);
  return result;
});

// 2. 添加监听日志，观察 props 数据流向
watch(
  () => props.spu,
  (newSpu) => {
    console.log("[Debug] props.spu 发生变化:", newSpu);
    console.log("[Debug] 提取到的 attributes:", newSpu?.attributes);
  },
  { immediate: true, deep: true }
);
</script>

<style scoped>
.attribute-card {
  margin-top: 20px;
}

.card-header {
  display: flex;
  align-items: center;
}

.ml5 {
  margin-left: 5px;
}

/* 统一控制标签宽度，防止因字数不同导致参差不齐 */
:deep(.attr-label) {
  width: 120px;
  background-color: #f5f7fa !important;
  font-weight: bold;
}

.attribute-content {
  padding: 10px;
}

/* 响应式调整：在小屏幕上自动切为单列 */
@media (max-width: 768px) {
  :deep(.el-descriptions__body table) {
    table-layout: auto !important;
  }
}
</style>
