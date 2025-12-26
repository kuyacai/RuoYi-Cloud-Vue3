<template>
  <div class="app-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>数据导入</span>
        </div>
      </template>
      
      <!-- 第一行 -->
      <el-row :gutter="20" class="import-row">
        <!-- SPU导入 -->
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <ImportCard
            type="spu"
            title="SPU"
            :import-api="importSpu"
            :download-api="handleDownloadTemplate"
            @import-success="showImportResult"
          />
        </el-col>
        
        <!-- SKU导入 -->
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <ImportCard
            type="sku"
            title="SKU"
            :import-api="importSku"
            :download-api="handleDownloadTemplate"
            @import-success="showImportResult"
          />
        </el-col>
      </el-row>
      
      <!-- 第二行 -->
      <el-row :gutter="20" class="import-row">
        <!-- 价格文件导入 -->
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <ImportCard
            type="price"
            title="价格文件"
            :import-api="importPrice"
            :download-api="handleDownloadTemplate"
            @import-success="showImportResult"
          />
        </el-col>

        <!-- 修改标题文件导入 -->
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <ImportCard
            type="title"
            title="标题文件"
            :import-api="importTitle"
            :download-api="handleDownloadTemplate"
            @import-success="showImportResult"
          />
        </el-col>

      </el-row>
      
      <!-- 第三行 -->
      <el-row :gutter="20" class="import-row">
        <!-- 单品直降文件导入 -->
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <ImportCard
            type="single_discount"
            title="单品直降文件"
            :import-api="importSingleDiscount"
            :download-api="handleDownloadTemplate"
            @import-success="showImportResult"
          />
        </el-col>
        
        <!-- 新人礼金文件导入 -->
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <ImportCard
            type="new_user"
            title="新人礼金文件"
            :import-api="importNewUser"
            :download-api="handleDownloadTemplate"
            @import-success="showImportResult"
          />
        </el-col>
      </el-row>
      
      <!-- 第四行 -->
      <el-row :gutter="20" class="import-row">
        <!-- 商品通用优惠文件导入 -->
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <ImportCard
            type="product_discount"
            title="商品通用优惠文件"
            :import-api="importProductDiscount"
            :download-api="handleDownloadTemplate"
            @import-success="showImportResult"
          />
        </el-col>
        
        <!-- 平台大促优惠导入 -->
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <ImportCard
            type="promotion"
            title="平台大促优惠"
            :import-api="importPromotion"
            :download-api="handleDownloadTemplate"
            @import-success="showImportResult"
          />
        </el-col>
      </el-row>


      <!-- 第五行 -->
      <el-row :gutter="20" class="import-row">
        <!-- 复购券优惠导入 -->
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <ImportCard
            type="repurchase"
            title="复购券优惠"
            :import-api="importRepurchase"
            :download-api="handleDownloadTemplate"
            @import-success="showImportResult"
          />
        </el-col>

      </el-row>
      
      <!-- 导入结果展示 -->
      <el-dialog
        v-model="resultDialogVisible"
        title="导入结果"
        width="50%"
      >
        <el-result
          v-if="importResult"
          :icon="importResult.success ? 'success' : 'error'"
          :title="importResult.title"
          :sub-title="importResult.message"
        >
          <template #extra>
            <div v-if="importResult.data">
              <el-descriptions :column="2" border>
                <el-descriptions-item label="总记录数">
                  {{ importResult.data.total }}
                </el-descriptions-item>
                <el-descriptions-item label="成功数">
                  <span style="color: #67c23a">{{ importResult.data.success }}</span>
                </el-descriptions-item>
                <el-descriptions-item label="失败数">
                  <span style="color: #f56c6c">{{ importResult.data.failure }}</span>
                </el-descriptions-item>
              </el-descriptions>
              
              <div v-if="importResult.data.errors && importResult.data.errors.length" class="mt-20">
                <h4>错误详情：</h4>
                <el-alert
                  v-for="(error, index) in importResult.data.errors"
                  :key="index"
                  :title="error"
                  type="error"
                  :closable="false"
                  class="mb-10"
                />
              </div>
            </div>
          </template>
        </el-result>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="resultDialogVisible = false">关闭</el-button>
            <el-button type="primary" @click="resultDialogVisible = false">
              确定
            </el-button>
          </span>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import ImportCard from '@/components/ImportCard/index.vue'
import {
  importSpu,
  importSku,
  importPrice,
  importTitle,
  importSingleDiscount,
  importProductDiscount,
  importNewUser,
  importRepurchase,
  importPromotion,
  downloadTemplate
} from '@/api/product/import'

// 导入结果弹窗
const resultDialogVisible = ref(false)
const importResult = ref(null)

// 显示导入结果
const showImportResult = (response, title) => {
  importResult.value = {
    success: response.code === 200,
    title: title,
    message: response.msg,
    data: response.data
  }
  resultDialogVisible.value = true
}

// 统一处理下载模板
const handleDownloadTemplate = (type) => {
  downloadTemplate(type).then(response => {
    const url = window.URL.createObjectURL(new Blob([response]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${type}_template.xlsx`)
    document.body.appendChild(link)
    link.click()
  }).catch(error => {
    ElMessage.error('下载模板失败：' + error.message)
  })
}
</script>

<style scoped>
.box-card {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  font-size: 18px;
  font-weight: bold;
  padding: 10px 0;
}

.import-row {
  margin-bottom: 20px;
}

:deep(.import-card) {
  height: 100%;
  min-height: 180px;
  transition: all 0.3s ease;
}

:deep(.import-card):hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.mt-20 {
  margin-top: 20px;
}

.mb-10 {
  margin-bottom: 10px;
}

/* 最后一个行不需要底部间距 */
.import-row:last-child {
  margin-bottom: 0;
}

/* 小屏幕适配 */
@media (max-width: 768px) {
  .import-row {
    margin-bottom: 15px;
  }
  
  /* 在小屏幕上，每行的两个col之间也需要间距 */
  .import-row .el-col {
    margin-bottom: 15px;
  }
  
  .import-row .el-col:last-child {
    margin-bottom: 0;
  }
}
</style>