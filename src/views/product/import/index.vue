<!-- ImportDataPage.vue -->
<template>
  <div class="app-container">
    <ElCard shadow="hover">
      <template #header>
        <div class="flex items-center justify-between">
          <ElText size="large" tag="b">数据导入中心</ElText>
        </div>
      </template>

      <!-- 数据类型卡片网格 -->
      <ElRow :gutter="16">
        <ElCol class="import-col"
          v-for="item in importTypes"
          :key="item.type"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="8"
          :xl="8"
        >
          <ElCard
            class="type-card mb-4 cursor-pointer transition-all duration-300"
            shadow="hover"
            @click="openImportDialog(item)"
          >
            <template #header>
              <div class="flex items-center justify-between">
                <ElText size="small" tag="b" truncated>
                  <ElIcon :class="item.iconClass" class="mr-2">
                    <component :is="item.icon" />
                  </ElIcon>
                  {{ item.title }}
                </ElText>
              </div>
            </template>

            <ElDescriptions :column="1" size="small">
              <ElDescriptionsItem label="模板">
                <ElButton
                  type="primary"
                  link
                  size="small"
                  @click.stop="downloadTemplateByType(item.type)"
                >
                  下载模板
                </ElButton>
              </ElDescriptionsItem>
              <ElDescriptionsItem label="最后导入">
                <ElText type="info" size="small">
                  {{ lastImportTime[item.type] || "-" }}
                </ElText>
              </ElDescriptionsItem>
            </ElDescriptions>

            <ElButton
              type="primary"
              class="w-full mt-4"
              @click.stop="openImportDialog(item)"
            >
              <ElIcon><Upload /></ElIcon>导入数据
            </ElButton>
          </ElCard>
        </ElCol>
      </ElRow>
    </ElCard>

    <!-- 导入弹窗 -->
    <ElDialog
      v-model="importDialogVisible"
      :title="`导入${currentType?.title}`"
      width="60%"
      top="5vh"
      :destroy-on-close="true"
      @closed="handleDialogClose"
    >
      <ImportPanel
        v-if="currentType"
        :type="currentType.type"
        :title="currentType.title"
        :import-api="currentType.importApi"
        :download-api="downloadTemplateByType"
        :extra-fields="currentType.extraFields"
        :extra-params="currentType.extraParams"
        @import-success="handleImportSuccess"
      />
    </ElDialog>

    <!-- 导入结果弹窗 -->
    <ElDialog
      v-model="resultDialogVisible"
      title="导入结果"
      width="60%"
      :center="false"
    >
      <ElResult
        v-if="importResult"
        :icon="importResult.success ? 'success' : 'error'"
        :title="importResult.title"
        :sub-title="importResult.message"
      >
        <template #extra>
          <ElSpace v-if="importResult.data" direction="vertical" class="w-full">
            <ElAlert
              :title="`总计: ${importResult.data.total} 条 | 成功: ${importResult.data.success} 条 | 失败: ${importResult.data.failure} 条`"
              :type="importResult.data.failure > 0 ? 'warning' : 'success'"
              :closable="false"
              show-icon
            />

            <!-- 错误详情折叠面板 -->
            <ElCollapse v-if="importResult.data.errors?.length">
              <ElCollapseItem
                :title="`查看错误详情 (${importResult.data.errors.length})`"
              >
                <div class="max-h-60 overflow-y-auto">
                  <ElAlert
                    v-for="(error, idx) in importResult.data.errors"
                    :key="idx"
                    :title="error"
                    type="error"
                    :closable="false"
                    class="mb-2 text-xs"
                  />
                </div>
              </ElCollapseItem>
            </ElCollapse>
          </ElSpace>
        </template>
      </ElResult>

      <template #footer>
        <ElButton type="primary" @click="resultDialogVisible = false">
          确定
        </ElButton>
      </template>
    </ElDialog>
  </div>
</template>

<script setup>
import { ref, computed, h, onMounted } from "vue";
import { ElMessage } from "element-plus";
import {
  Upload,
  Refresh,
  Document,
  PriceTag,
  Tickets,
  User,
  ShoppingCart,
  Promotion,
  Coin,
  Edit,
} from "@element-plus/icons-vue";
import ImportPanel from "@/components/ImportPanel/index.vue";
import * as importApi from "@/api/product/import";

// 导入类型配置
const importTypes = [
  {
    type: "spu",
    title: "SPU数据",
    icon: Document,
    iconClass: "text-blue-500",
    importApi: importApi.importSpu,
    extraFields: [
      { key: "shopId", label: "商店ID", placeholder: "请输入商店ID（可选）" },
    ],
    extraParams: {},
  },
  {
    type: "sku",
    title: "SKU数据",
    icon: Tickets,
    iconClass: "text-green-500",
    importApi: importApi.importSku,
    extraFields: [
      { key: "shopId", label: "商店ID", placeholder: "请输入商店ID（可选）" },
    ],
    extraParams: {},
  },
  {
    type: "price",
    title: "价格文件",
    icon: PriceTag,
    iconClass: "text-purple-500",
    importApi: importApi.importPrice,
    extraFields: [
      { key: "shopId", label: "商店ID", placeholder: "请输入商店ID（可选）" },
    ],
    extraParams: {},
  },
  {
    type: "title",
    title: "标题文件",
    icon: Edit,
    iconClass: "text-orange-500",
    importApi: importApi.importTitle,
    extraFields: [
      { key: "shopId", label: "商店ID", placeholder: "请输入商店ID（可选）" },
    ],
    extraParams: {},
  },
  {
    type: "single_discount",
    title: "单品直降",
    icon: Coin,
    iconClass: "text-red-500",
    importApi: importApi.importSingleDiscount,
    extraFields: [
      { key: "shopId", label: "商店ID", placeholder: "请输入商店ID（可选）" },
      {
        key: "activityId",
        label: "活动ID",
        placeholder: "请输入活动ID（如适用）",
      },
    ],
    extraParams: {},
  },
  {
    type: "new_user",
    title: "新人礼金",
    icon: User,
    iconClass: "text-indigo-500",
    importApi: importApi.importNewUser,
    extraFields: [
      { key: "shopId", label: "商店ID", placeholder: "请输入商店ID（可选）" },
    ],
    extraParams: {},
  },
  {
    type: "product_discount",
    title: "商品通用优惠",
    icon: ShoppingCart,
    iconClass: "text-cyan-500",
    importApi: importApi.importProductDiscount,
    extraFields: [
      { key: "shopId", label: "商店ID", placeholder: "请输入商店ID（可选）" },
    ],
    extraParams: {},
  },
  {
    type: "promotion",
    title: "平台大促",
    icon: Promotion,
    iconClass: "text-pink-500",
    importApi: importApi.importPromotion,
    extraFields: [
      { key: "shopId", label: "商店ID", placeholder: "请输入商店ID（可选）" },
      {
        key: "activityId",
        label: "活动ID",
        placeholder: "请输入活动ID（如适用）",
      },
    ],
    extraParams: {},
  },
  {
    type: "repurchase",
    title: "复购券优惠",
    icon: Promotion,
    iconClass: "text-teal-500",
    importApi: importApi.importRepurchase,
    extraFields: [
      { key: "shopId", label: "商店ID", placeholder: "请输入商店ID（可选）" },
    ],
    extraParams: {},
  },
];

// 状态管理
const importDialogVisible = ref(false);
const resultDialogVisible = ref(false);
const currentType = ref(null);
const importResult = ref(null);
const lastImportTime = ref({});

// 打开导入弹窗
const openImportDialog = (typeConfig) => {
  currentType.value = typeConfig;
  importDialogVisible.value = true;
};

// 下载模板
const downloadTemplateByType = (type) => {
  return importApi.downloadTemplate(type);
};

// 导入成功回调
const handleImportSuccess = (response) => {
  importDialogVisible.value = false;

  // 记录导入时间
  lastImportTime.value[currentType.value.type] = new Date().toLocaleString(
    "zh-CN"
  );

  // 显示结果
  importResult.value = {
    success: response.code === 200,
    title: `${currentType.value.title}导入`,
    message: response.msg || (response.code === 200 ? "导入成功" : "导入失败"),
    data: response.data,
  };
  resultDialogVisible.value = true;

  // 清理状态
  currentType.value = null;
};

// 关闭弹窗清理
const handleDialogClose = () => {
  currentType.value = null;
};

// 初始化加载历史状态
onMounted(() => {
  // 可从localStorage或接口加载最后导入时间
  const saved = localStorage.getItem("importTimes");
  if (saved) {
    lastImportTime.value = JSON.parse(saved);
  }
});

// 持久化导入时间
watch(
  lastImportTime,
  (val) => {
    localStorage.setItem("importTimes", JSON.stringify(val));
  },
  { deep: true }
);
</script>

<style scoped>
.import-col {
  margin-bottom: 20px;
}
.type-card {
  @apply border border-gray-200 hover:border-blue-400;
}

.type-card:hover {
  @apply transform -translate-y-1 shadow-lg;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .type-card {
    @apply mb-3;
  }
}
</style>
