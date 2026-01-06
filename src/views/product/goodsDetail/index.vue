<template>
  <div class="standalone-detail">
    <div class="top-bar">
      <span>商品全宽详情视图</span>
    </div>

    <div class="main-content" v-loading="loading">
      <div v-if="detail.goods">
        <el-collapse v-model="activeNames" class="custom-collapse">
          
          <el-collapse-item name="basic">
            <template #title>
              <div class="collapse-title"><el-icon><Document /></el-icon>基础档案</div>
            </template>
            <BasicInfo :data="detail.goods" />
          </el-collapse-item>

          <el-collapse-item name="spu">
            <template #title>
              <div class="collapse-title"><el-icon><Goods /></el-icon>SPU 营销信息</div>
            </template>
            <SpuInfo :detail="detail" />
          </el-collapse-item>

          <el-collapse-item name="attributes">
            <template #title>
              <div class="collapse-title"><el-icon><List /></el-icon>规格参数</div>
            </template>
            <ProductAttributes :spu="detail.spu" />
          </el-collapse-item>

          <el-collapse-item name="sku">
            <template #title>
              <div class="collapse-title"><el-icon><Operation /></el-icon>SKU 规格及库存</div>
            </template>
            <SkuList :skuBundles="detail.skuBundles" />
          </el-collapse-item>

          <el-collapse-item name="description">
            <template #title>
              <div class="collapse-title"><el-icon><Picture /></el-icon>详情描述图</div>
            </template>
            <div class="desc-images">
              <img
                v-for="img in detail.descImages"
                :key="img.imageId"
                :src="img.sourceUrl"
                class="desc-img-full"
                loading="lazy" 
              />
            </div>
          </el-collapse-item>

        </el-collapse>
      </div>
      <el-empty v-else-if="!loading" description="未查找到相关商品数据" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
// 导入图标
import { Document, Goods, List, Operation, Picture } from "@element-plus/icons-vue";
import BasicInfo from "@/components/GoodsDetailBasicInfo/index.vue";
import SpuInfo from "@/components/SpuInfo/index.vue";
import SkuList from "@/components/SkuList/index.vue";
import ProductAttributes from "@/components/ProductAttributes/index.vue";
import { getDetail } from "@/api/product/goods";

const route = useRoute();
const loading = ref(false);
const detail = ref({});

// 控制折叠面板展开的项，放入对应的 name 即可默认展开
const activeNames = ref(['basic', 'spu', 'attributes', 'sku']);

onMounted(async () => {
  const id = route.query.id;
  const status = route.query.status;

  if (id) {
    loading.value = true;
    try {
      // 调用 API 获取数据
      const response = await getDetail(id, status);
      // RuoYi 返回的结果通常包裹在 data 属性中
      detail.value = response.data;
    } catch (error) {
      console.error("获取商品详情失败", error);
    } finally {
      loading.value = false;
    }
  } else {
    console.warn("参数缺失：未获取到商品 ID");
  }
});
</script>

<style scoped>
.standalone-detail {
  background: #f5f7fa;
  min-height: 100vh;
}
.top-bar {
  height: 50px;
  background: #304156;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}
.main-content {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}
.desc-img-full {
  width: 100%;
  display: block;
}
.mt16 {
  margin-top: 16px;
}

.custom-collapse {
  border: none;
  background-color: transparent;
}

:deep(.el-collapse-item__header) {
  padding-left: 15px;
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  background-color: #fff;
  border-radius: 4px;
  margin-bottom: 5px;
}

:deep(.el-collapse-item__wrap) {
  background-color: transparent;
  border: none;
  padding: 10px 0;
}

.collapse-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.desc-images {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
}
</style>
