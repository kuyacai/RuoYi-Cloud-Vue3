<template>
  <el-card shadow="never" class="mb16">
    <template #header
      ><b class="card-title"
        >SPU (当前版本:{{ revision?.revStatus.label }})-是否同步:{{
          revision?.revisionType.label
        }}&nbsp;&nbsp; Revision Id:&nbsp;&nbsp;
        <el-tooltip
          :content="` Revision id: ${spu?.revisionId}`"
          placement="top"
        >
          <span @click="handleCopyId(spu?.revisionId)">
            {{ spu?.revisionId }}
            <el-icon class="copy-icon"><CopyDocument /></el-icon>
          </span> </el-tooltip></b
    ></template>
    <el-descriptions :column="2" border>
      <el-descriptions-item label="原标题">{{
        spu?.title || "-"
      }}</el-descriptions-item>
      <el-descriptions-item label="原导购短标题">{{
        spu?.guideShortTitle || "-"
      }}</el-descriptions-item>
      <el-descriptions-item label="当前标题">{{
        spu?.newTitle || "-"
      }}</el-descriptions-item>
      <el-descriptions-item label="当前导购短标题">{{
        spu?.newGuideShortTitle || "-"
      }}</el-descriptions-item>
      <el-descriptions-item label="推荐语">{{
        spu?.recommendation || "-"
      }}</el-descriptions-item>
      <el-descriptions-item label="运费模板">{{
        spu?.freightTemplate || "-"
      }}</el-descriptions-item>
      <el-descriptions-item label="尺码表模板名称">{{
        spu?.sizeChartTemplateName || "-"
      }}</el-descriptions-item>
      <el-descriptions-item label="尺码表尺码标题">{{
        spu?.sizeChartSizeTitles || "-"
      }}</el-descriptions-item>
      <el-descriptions-item label="复制状态">{{
        spu?.copyStatus || "-"
      }}</el-descriptions-item>
      <el-descriptions-item label="复制失败原因">{{
        spu?.copyErrorReason || "-"
      }}</el-descriptions-item>
      <el-descriptions-item label="审核状态">{{
        spu?.reviewStatus || "-"
      }}</el-descriptions-item>
      <el-descriptions-item label="发货模式">{{
        spu?.shippingMode || "-"
      }}</el-descriptions-item>
      <el-descriptions-item label="搜索关键词">{{
        spu?.searchKeywords || "-"
      }}</el-descriptions-item>
      <el-descriptions-item label="视频脚本">{{
        spu?.videoScript || "-"
      }}</el-descriptions-item>
      <el-descriptions-item label="现货发货时间">{{
        spu?.inStockShipTime || "-"
      }}</el-descriptions-item>
      <el-descriptions-item label="预售发货时间">{{
        spu?.presaleShipTime || "-"
      }}</el-descriptions-item>
      <el-descriptions-item label="销量">{{
        spu?.sales || "-"
      }}</el-descriptions-item>
    </el-descriptions>

    <div class="image-sections mt20">
      <div
        v-for="(list, label) in imageGroups"
        :key="label"
        class="image-group"
      >
        <div class="group-label">{{ label }}：</div>
        <div class="group-content">
          <el-image
            v-for="img in list"
            :key="img.imageId"
            :src="img.sourceUrl"
            :preview-src-list="list.map((i) => i.sourceUrl)"
            class="preview-img"
          />
          <el-empty v-if="!list?.length" :image-size="40" description="暂无" />
        </div>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { computed } from "vue";
import { copyToClipboard } from "@/utils/ruoyi";
import { CopyDocument } from "@element-plus/icons-vue";

const props = defineProps({ detail: Object });

const revision = computed(() => props.detail?.revision);
const spu = computed(() => props.detail?.spu);
const imageGroups = computed(() => ({
  主图: props.detail?.mainImages,
  "3:4图": props.detail?.main34Images,
  白底图: props.detail?.whiteImages,
  导购图: props.detail?.guideImages,
}));

// 处理ID复制（通用复制函数）
const handleCopyId = async (id) => {
  if (!id) return;
  await copyToClipboard(id);
};
</script>

<style scoped>
.image-group {
  display: flex;
  align-items: flex-start;
  margin-bottom: 15px;
  border-bottom: 1px dashed #eee;
  padding-bottom: 10px;
}
.group-label {
  width: 80px;
  font-weight: bold;
  color: #606266;
  font-size: 14px;
}
.group-content {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.preview-img {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
}
:deep(.el-descriptions__body table) {
  table-layout: fixed !important;
  width: 100% !important;
}

:deep(.el-descriptions__label) {
  width: 130px; /* 标签固定 */
}

:deep(.el-descriptions__content) {
  /* 此时内容区会自动平分剩余的 50% 宽度 */
  word-wrap: break-word;
  word-break: break-all;
}
</style>
