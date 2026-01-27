<template>
  <div
    class="parameter-config-container"
    :class="{ 'nested-level': depth > 0 }"
  >
    <template v-if="mode === 'definition'">
      <div
        v-for="(item, index) in localFields"
        :key="index"
        class="config-item-row"
      >
        <el-button
          class="delete-btn"
          link
          type="danger"
          icon="Delete"
          @click="removeField(index)"
        />

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="变量名" label-width="70px">
              <el-input
                v-model="item.name"
                placeholder="retry_count"
                @change="emitUpdate"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="描述" label-width="50px">
              <el-input
                v-model="item.label"
                placeholder="重试次数"
                @change="emitUpdate"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="类型" label-width="50px">
              <el-select
                v-model="item.type"
                style="width: 100%"
                @change="handleTypeChange(item)"
              >
                <el-option label="文本" value="text" />
                <el-option label="数字" value="number" />
                <el-option label="布尔" value="boolean" />
                <el-option label="对象(Object)" value="object" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <div v-if="item.type === 'object'" class="children-area">
          <div
            class="sub-title"
            style="margin-bottom: 10px; font-size: 13px; color: #409eff"
          >
            <el-icon><Operation /></el-icon> 子属性定义 ({{
              item.label || item.name
            }})
          </div>
          <ParameterConfig
            v-model="item.children"
            :mode="mode"
            :depth="depth + 1"
            @update:model-value="emitUpdate"
          />
        </div>
      </div>

      <el-button type="primary" plain icon="Plus" @click="addField">
        添加{{ depth > 0 ? "子" : "" }}参数
      </el-button>
    </template>

    <template v-if="mode === 'readonly'">
      <div
        v-for="(item, index) in localFields"
        :key="index"
        class="readonly-value"
      >
        <template v-if="item.type === 'object'">
          <ParameterConfig
            v-model="modelValue[item.name]"
            :schema="item"
            :mode="mode"
            :depth="depth + 1"
          />
        </template>

        <template v-else-if="item.type === 'boolean'">
          <el-tag
            :type="modelValue[item.name] ? 'success' : 'info'"
            size="small"
          >
            {{ modelValue[item.name] ? "是" : "否" }}
          </el-tag>
        </template>

        <template v-else>
          <span
            class="text-content"
            :class="{ 'is-expression': isExpression(modelValue[item.name]) }"
          >
            <span v-text="modelValue[item.name] ?? '-'"></span>
          </span>
        </template>
      </div>
    </template>

    <template v-else-if="mode === 'render'">
      <div v-for="field in schema.fields" :key="field.name" class="render-item">
        <el-form-item :label="field.label">
          <div v-if="field.type === 'object'" class="object-card-wrapper">
            <div class="object-header">
              <el-icon><InfoFilled /></el-icon> {{ field.label }} 配置
            </div>
            <ParameterConfig
              v-model="modelValue[item.name]"
              :schema="item"
              :mode="mode"
              :depth="depth + 1"
              @select-variable="(name) => emit('select-variable', name)"
            />
          </div>

          <div v-else class="input-with-append">
            <el-input-number
              v-if="field.type === 'number'"
              v-model="modelValue[field.name]"
              style="width: 100%"
            />
            <el-switch
              v-else-if="field.type === 'boolean'"
              v-model="modelValue[field.name]"
            />
            <template v-else>
              <el-input
                v-model="modelValue[field.name]"
                placeholder="请输入或引用变量"
              >
                <template #append>
                  <el-button
                    class="var-link-btn"
                    icon="Link"
                    @click="$emit('select-variable', field.name)"
                  />
                </template>
              </el-input>
            </template>
          </div>
        </el-form-item>
      </div>
    </template>
  </div>
</template>

<script setup name="ParameterConfig">
/**
 * 通用参数配置组件
 * 支持 Definition (定义Schema) 和 Render (根据Schema生成表单)
 * 支持递归嵌套对象结构
 */
import { ref, watch, onMounted, computed } from "vue";

const props = defineProps({
  modelValue: { type: [Object, Array], default: () => ({}) },
  schema: { type: Object, default: () => ({ fields: [] }) }, // Render模式必传
  mode: { type: String, default: "render" }, // 扩展：definition | render | readonly
  depth: { type: Number, default: 0 },
});

const emit = defineEmits(["update:modelValue", "selectVariable"]);

// 定义模式下的本地响应式数组
const localFields = ref([]);

// 1. 定义一个统一的同步函数
const syncLocalFields = () => {
  if (props.mode === "definition") {
    // 顶层是 {fields:[]}, 子层直接是 []
    const rawData =
      props.depth === 0
        ? props.modelValue?.fields || []
        : Array.isArray(props.modelValue)
        ? props.modelValue
        : [];

    // 使用 JSON 序列化实现深拷贝，切断引用关系，防止污染
    //localFields.value = JSON.parse(JSON.stringify(rawData));
    // 使用 structuredClone（现代浏览器支持）
    localFields.value = structuredClone(rawData) || [];
  }
};

// 2. 初始挂载时同步
onMounted(() => {
  syncLocalFields();
});

/** 结构定义变更逻辑 */
const addField = () => {
  localFields.value.push({ name: "", label: "", type: "text", children: [] });
  emitUpdate();
};

const removeField = (index) => {
  // 添加确认，特别是当有子属性时
  const field = localFields.value[index];
  const hasChildren = field.children?.length > 0;

  if (
    hasChildren &&
    !confirm(`确定删除 "${field.label || field.name}" 及其所有子属性？`)
  ) {
    return;
  }
  localFields.value.splice(index, 1);
  emitUpdate();
};

const handleTypeChange = (row) => {
  if (row.type === "object" && !row.children) row.children = [];
  emitUpdate();
};
// definition 模式下添加验证
const emitUpdate = () => {
  // 验证字段名唯一性
  const names = localFields.value.map((f) => f.name).filter(Boolean);
  const duplicates = names.filter(
    (item, index) => names.indexOf(item) !== index
  );

  if (duplicates.length > 0) {
    console.warn(`重复字段名: ${duplicates.join(", ")}`);
    // 或触发错误事件给父组件处理
  }

  const val =
    props.depth === 0 ? { fields: localFields.value } : localFields.value;
  emit("update:modelValue", val);
};

// 将复杂的模板逻辑提取
const displayValue = computed(() => {
  return (field) => {
    const val = props.modelValue?.[field.name];
    if (val === undefined || val === null) return "-";
    return val;
  };
});
// 增加判断是否为表达式的方法
const isExpression = (val) => {
  if (typeof val !== "string") return false;
  return val.includes("#{");
};

// 3. 关键修复：监听 modelValue 的变化，实现切换算子时的内容刷新

watch(
  () => props.modelValue,
  () => {
    if (props.mode === "definition") {
      syncLocalFields();
    }
  },
  { deep: true }
);

// ParameterConfig 内部建议增加对 mode 的监听（如果内部逻辑依赖 mode 初始化的化）
watch(
  () => props.mode,
  (newMode) => {
    console.log("ParameterConfig 切换模式为:", newMode);
    // 如果有内部初始化逻辑，在这里重新执行
  },
  { immediate: true }
);

// 4. 渲染模式下的初始化逻辑保持不变
// 使用 emit 更新父组件
watch(
  () => props.schema,
  (newSchema) => {
    if (props.mode === "render" && newSchema?.fields) {
      const updates = {};
      let hasUpdate = false;

      newSchema.fields.forEach((f) => {
        if (props.modelValue?.[f.name] === undefined) {
          updates[f.name] = f.type === "object" ? {} : null;
          hasUpdate = true;
        }
      });

      if (hasUpdate) {
        emit("update:modelValue", { ...props.modelValue, ...updates });
      }
    }
  },
  { immediate: true, deep: true }
);
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>
