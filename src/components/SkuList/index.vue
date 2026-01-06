<template>
  <el-card shadow="never">
    <template #header><b class="card-title">SKU 规格及库存</b></template>
    <el-table :data="skuBundles" border stripe style="width: 100%">
      <el-table-column label="规格图片" width="100">
        <template #default="scope">
          <div v-if="!scope.row.skuImage?.sourceUrl" class="image-slot">
            <el-tag type="info" size="small">未设置</el-tag>
          </div>

          <el-image
            v-else
            :src="scope.row.skuImage.sourceUrl"
            class="sku-img"
            :preview-src-list="[scope.row.skuImage.sourceUrl]"
            preview-teleported
          >
            <template #error>
              <div class="image-slot error-text">
                <el-icon><Picture /></el-icon>
                <span>加载失败</span>
              </div>
            </template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="sku.spec1" label="规格1">
        <template #default="scope">{{ scope.row.sku?.spec1 }}</template>
      </el-table-column>
      <el-table-column prop="sku.spec1Note" label="规格1备注">
        <template #default="scope">{{ scope.row.sku?.spec1Note }}</template>
      </el-table-column>
      <el-table-column prop="sku.spec2" label="规格2">
        <template #default="scope">{{ scope.row.sku?.spec2 }}</template>
      </el-table-column>
      <el-table-column prop="sku.spec2Note" label="规格2备注">
        <template #default="scope">{{ scope.row.sku?.spec2Note }}</template>
      </el-table-column>
      <el-table-column prop="sku.spec3OrLeadTime" label="规格3或前置时间">
        <template #default="scope">{{
          scope.row.sku?.spec3OrLeadTime
        }}</template>
      </el-table-column>
      <el-table-column prop="sku.spec3Note" label="规格3备注">
        <template #default="scope">{{ scope.row.sku?.spec3Note }}</template>
      </el-table-column>
      <el-table-column prop="sku.skuCode" label="编码" width="150">
        <template #default="scope">{{ scope.row.sku?.skuCode }}</template>
      </el-table-column>
      <el-table-column label="原价" width="120">
        <template #default="scope"
          >￥{{ scope.row.sku?.orignialPrice }}</template
        >
      </el-table-column>
      <el-table-column label="销售价" width="120">
        <template #default="scope">￥{{ scope.row.sku?.marketPrice }}</template>
      </el-table-column>
      <el-table-column prop="sku.stock" label="剩余库存" width="100">
        <template #default="scope">{{ scope.row.sku?.inStockQty }}</template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup>
defineProps({ skuBundles: Array });
</script>
<style scoped>
.sku-img {
  width: 60px;
  height: 60px;
}
</style>
