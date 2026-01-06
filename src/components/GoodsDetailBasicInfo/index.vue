<template>
  <el-card shadow="never" class="mb16">
    <template #header><b class="card-title">基础档案</b></template>
    <el-descriptions :column="3" border>
      <el-descriptions-item label="来源标题">
        <el-link
          :href="data?.sourceUrl"
          target="_blank"
          type="primary"
          underline="always"
          >{{ data?.sourceTitle }}</el-link
        >
      </el-descriptions-item>
      <el-descriptions-item label="来源店铺">{{
        data?.sourceShopName
      }}</el-descriptions-item>
      <el-descriptions-item label="来源ID">{{
        data?.sourceId
      }}</el-descriptions-item>
      <el-descriptions-item label="来源分类">{{
        data?.sourceCategory
      }}</el-descriptions-item>
      <el-descriptions-item label="Goods_id">
        <el-tooltip :content="`Goods_id: ${data?.goodsId}`" placement="top">
          <span @click="handleCopyId(data?.goodsId)">
            {{ data?.goodsId }}
            <el-icon class="copy-icon"><CopyDocument /></el-icon>
          </span>
        </el-tooltip>
      </el-descriptions-item>
      <el-descriptions-item label="迁移来源">{{
        data?.migrateSource
      }}</el-descriptions-item>
      <el-descriptions-item label="客服电话">{{
        data?.customerPhone
      }}</el-descriptions-item>
      <el-descriptions-item label="来源货号">{{
        data?.sourceItemNo
      }}</el-descriptions-item>
      <el-descriptions-item label="品牌">{{
        data?.brand
      }}</el-descriptions-item>
      <el-descriptions-item label="店铺商品ID">
        <el-tooltip
          :content="`店铺商品ID: ${data?.shopProductId}`"
          placement="top"
        >
          <span @click="handleCopyId(data?.shopProductId)">
            {{ data?.shopProductId }}
            <el-icon class="copy-icon"><CopyDocument /></el-icon>
          </span>
        </el-tooltip>
      </el-descriptions-item>
      <el-descriptions-item label="店铺编号">{{
        data?.shopId
      }}</el-descriptions-item>
      <el-descriptions-item label="商品状态">{{
        data?.goodsStatus?.label
      }}</el-descriptions-item>
    </el-descriptions>
  </el-card>
</template>

<script setup>
import { copyToClipboard } from "@/utils/ruoyi";
import { CopyDocument } from "@element-plus/icons-vue";
defineProps({ data: Object });
// 处理ID复制（通用复制函数）
const handleCopyId = async (id) => {
  if (!id) return;
  await copyToClipboard(id);
};
</script>
