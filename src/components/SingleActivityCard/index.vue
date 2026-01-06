<template>
  <el-card shadow="hover" class="activity-card">
    <template #header>
      <div class="card-header">
        <div class="header-left">
          <el-tag :type="statusType" size="small" class="status-tag">
            {{ getEnumLabel('DiscountStatus', cardData.discountStatus) }}
          </el-tag>
          <h4 class="title">{{ cardData.activityName }}</h4>
        </div>
        <div class="header-right">
          <el-tooltip :content="`ID: ${cardData.activityId}`" placement="top">
            <span class="activity-id" @click="handleCopyId(cardData.activityId)">
              ID: {{ formatId(cardData.activityId, 4) }}
              <el-icon class="copy-icon"><CopyDocument /></el-icon>
            </span>
          </el-tooltip>
        </div>
      </div>
    </template>
    
    <div class="card-body">
      <el-descriptions :column="1" size="small" border>
        <el-descriptions-item label="店铺ID" label-class-name="description-label">
          <div class="copyable-id" @click="handleCopyId(cardData.shopId)">
            {{ formatId(cardData.shopId, 6) }}
            <el-icon class="copy-icon"><CopyDocument /></el-icon>
          </div>
        </el-descriptions-item>
        
        <el-descriptions-item label="折扣类型" label-class-name="description-label">
          {{ getEnumLabel('DiscountType',cardData.discountType) }}
        </el-descriptions-item>
        
        <el-descriptions-item label="活动时间" label-class-name="description-label">
          <div class="time-info">
            <div>{{ parseTime(cardData.startTime) }}</div>
            <div>{{ parseTime(cardData.endTime) }}</div>
          </div>
        </el-descriptions-item>
        
        <el-descriptions-item 
          v-if="cardData.platformActivityId" 
          label="平台活动ID" 
          label-class-name="description-label"
        >
          <div class="copyable-id" @click="handleCopyId(cardData.platformActivityId)">
            {{ formatId(cardData.platformActivityId, 8) }}
            <el-icon class="copy-icon"><CopyDocument /></el-icon>
          </div>
        </el-descriptions-item>
        
        <el-descriptions-item 
          v-if="cardData.notes" 
          label="备注" 
          label-class-name="description-label"
        >
          <el-tooltip :content="cardData.notes" placement="top">
            <el-text truncated>
              {{ cardData.notes }}
            </el-text>
          </el-tooltip>
        </el-descriptions-item>

        <el-descriptions-item label="创建时间" label-class-name="description-label">
          <div class="time-info">
            <div>{{ parseTime(cardData.gmtCreate) }}</div>
            <div>{{ parseTime(cardData.gmtModified) }}</div>
          </div>
        </el-descriptions-item>

      </el-descriptions>
      
      <div class="card-footer">
        <div class="action-buttons">
          <el-button
            type="primary"
            size="default"
            :icon="Edit"
            @click="handleEdit"
            v-hasPermi="['promotion:singleDiscountActivity:edit']"
            plain
          >
            修改
          </el-button>
          <el-button
            type="success"
            size="default"
            :icon="Download"
            @click="handleExport"
            v-hasPermi="['promotion:singleDiscountActivity:remove']"
            plain
          >
            导出商品
          </el-button>
          <el-button
            type="primary"
            size="default"
            :icon="Plus"
            @click="handleImport"
            v-hasPermi="['promotion:singleDiscountActivity:edit']"
          >
            添加商品
          </el-button>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  parseTime, 
  formatId, 
  copyToClipboard 
} from '@/utils/ruoyi'
import { productEnumService } from '@/api/product/enumService'
import { 
  CopyDocument,
  Edit,
  Delete,
  Plus,
  Download,
  Refresh 
} from '@element-plus/icons-vue'

const props = defineProps({
  activityData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['edit','delete','exportProduct', 'importProduct'])

const cardData = ref(props.activityData)

// 预加载枚举数据
const loadEnums = async () => {
  try {
    await productEnumService.preloadCommonEnums(['DiscountType', 'DiscountStatus'])
  } catch (error) {
    console.error('枚举数据加载失败:', error)
  }
}

loadEnums()

const statusType = computed(() => {
  const statusCode = cardData.value.discountStatus
  if (!statusCode) return 'primary'
})

// 通用枚举标签获取
const getEnumLabel = (enumName, code) => {
  if (!code) return ''
  const label = productEnumService.getLabel(enumName, code)
  return label || code
}


// 处理ID复制（通用复制函数）
const handleCopyId = async (id) => {
  if (!id) return
  await copyToClipboard(id)
}

// 处理编辑
const handleEdit = () => {
  emit('edit', cardData.value)
}

// 处理删除
const handleDelete = () => {
  emit('delete', cardData.value)
}

const handleExport = () =>{
  emit('exportProduct', cardData.value.activityId)
}

const handleImport = () =>{
  emit('importProduct', cardData.value.activityId)
}
// 监听props变化
watch(() => props.activityData, (newVal) => {
  cardData.value = newVal
}, { deep: true })
</script>

<style scoped lang="scss">
.activity-card {
  margin-bottom: 16px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--el-box-shadow-lighter);
  }
  :deep(.el-card__body) {
    padding: 8px !important; /* 默认是20px，可以调小 */
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 2px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 2px;
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.status-tag {
  flex-shrink: 0;
}

.header-right {
  flex-shrink: 0;
}

.activity-id {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  cursor: pointer;
  transition: color 0.2s;
  padding: 2px 4px;
  border-radius: 4px;
  
  &:hover {
    color: var(--el-color-primary);
    background-color: var(--el-fill-color-light);
  }
  
  .copy-icon {
    font-size: 12px;
    opacity: 0.6;
    transition: opacity 0.2s;
  }
  
  &:hover .copy-icon {
    opacity: 1;
  }
}

.card-body {
  .time-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }
  
  .copyable-id {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    cursor: pointer;
    padding: 2px 6px;
    border-radius: 4px;
    transition: all 0.2s;
    font-family: 'Consolas', 'Monaco', monospace;
    
    &:hover {
      background-color: var(--el-fill-color-light);
      color: var(--el-color-primary);
    }
    
    .copy-icon {
      font-size: 12px;
      opacity: 0.6;
      transition: opacity 0.2s;
    }
    
    &:hover .copy-icon {
      opacity: 1;
    }
  }
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--el-border-color-lighter);
  
  .time-meta {
    display: flex;
    gap: 16px;
    
    .el-text {
      display: flex;
      align-items: center;
      gap: 4px;
    }
  }
  
  .action-buttons {
    display: flex;
    gap: 2px;
  }
}

// 自定义描述列表标签样式
:deep(.description-label) {
  background-color: var(--el-fill-color-lighter);
  font-weight: 500;
  width: 100px;
}
</style>