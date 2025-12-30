<!-- ImportPanel.vue (修复版) -->
<template>
  <ElCard class="import-card" shadow="hover">
    <!-- 动态参数字段 -->
    <ElForm 
      v-if="extraFields.length"
      :model="formData" 
      label-width="100px"
      size="default"
      class="param-form mb-4"
    >
      <ElRow :gutter="16">
        <ElCol 
          v-for="field in extraFields" 
          :key="field.key"
          :xs="24" 
          :sm="24" 
          :md="24"
        >
          <ElFormItem 
            :label="field.label"
            :required="field.required"
            :prop="field.key"
          >
            <ElInput 
              v-model="formData[field.key]"
              :placeholder="field.placeholder"
              clearable
            />
          </ElFormItem>
        </ElCol>
      </ElRow>
    </ElForm>

    <!-- 操作区域 -->
    <ElSpace direction="vertical" :size="16" class="w-full">
      <!-- 提示信息 -->
      <ElText type="info" size="small">
        <ElIcon class="mr-1"><Warning /></ElIcon>
        请上传xlsx、xls或csv格式的文件，文件大小不超过10MB
      </ElText>

      <!-- 上传操作 -->
      <ElSpace wrap>
        <!-- 注意：这里使用 :http-request 自定义上传逻辑，避免 el-upload 默认序列化问题 -->
        <ElUpload
          ref="uploadRef"
          :http-request="customUploadRequest"
          :before-upload="beforeUpload"
          :on-change="handleChange"
          :on-remove="handleRemove"
          :file-list="fileList"
          :auto-upload="false"
          :limit="1"
          accept=".xlsx,.xls,.csv"
        >
          <ElButton type="primary">
            <ElIcon><Upload /></ElIcon>选择文件
          </ElButton>
        </ElUpload>

        <ElButton 
          type="success"
          :loading="loading"
          :disabled="!fileList.length"
          @click="submitUpload"
        >
          <ElIcon v-if="!loading"><Promotion /></ElIcon>
          {{ loading ? "导入中..." : `导入${title}` }}
        </ElButton>
      </ElSpace>

      <!-- 文件显示 -->
      <ElTag
        v-if="fileList.length"
        closable
        @close="handleRemove(fileList[0])"
        type="info"
        class="max-w-[200px] truncate"
      >
        {{ fileList[0].name }}
      </ElTag>
    </ElSpace>
  </ElCard>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getToken } from '@/utils/auth'
import { Upload, Promotion, Warning } from '@element-plus/icons-vue'

const props = defineProps({
  type: { type: String, required: true },
  title: { type: String, required: true },
  importApi: { type: Function, required: true },
  downloadApi: { type: Function, required: true },
  // 动态参数字段配置
  extraFields: {
    type: Array,
    default: () => []
  },
  // 固定额外参数（确保值都是字符串）
  extraParams: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['import-success'])

const uploadRef = ref()
// 关键修复：确保所有表单值都是字符串类型
const formData = reactive(
  Object.fromEntries(
    props.extraFields.map(f => [f.key, ''])
  )
)
const fileList = ref([])
const loading = ref(false)

const headers = ref({ 
  Authorization: "Bearer " + getToken() 
})

const beforeUpload = (file) => {
  const isLt10M = file.size / 1024 / 1024 < 10
  if (!isLt10M) {
    ElMessage.error("上传文件大小不能超过10MB!")
    return false
  }
  const isExcel = ['.xlsx', '.xls', '.csv'].some(ext => 
    file.name.toLowerCase().endsWith(ext)
  )
  if (!isExcel) {
    ElMessage.error("只支持上传xlsx、xls、csv格式的文件!")
    return false
  }
  return true
}

const handleChange = (uploadFile, uploadFiles) => {
  fileList.value = uploadFiles
}

const handleRemove = () => {
  fileList.value = []
  uploadRef.value?.clearFiles()
}

// 关键修复：自定义上传请求，避免 el-upload 默认序列化问题
const customUploadRequest = (options) => {
  // 这个方法不会被实际调用，因为我们使用手动提交
  // 但为了防止 el-upload 报错，需要提供一个空实现
  return Promise.resolve()
}

const submitUpload = () => {
  // 验证必填参数
  const requiredFields = props.extraFields.filter(f => f.required)
  const emptyFields = requiredFields.filter(f => !formData[f.key])
  
  if (emptyFields.length > 0) {
    ElMessage.warning(`请填写必填参数：${emptyFields.map(f => f.label).join('、')}`)
    return
  }

  if (!fileList.value.length) {
    ElMessage.warning("请先选择文件")
    return
  }

  // 构建确认消息
  const paramMessages = props.extraFields
    .map(f => formData[f.key] ? `${f.label}: ${formData[f.key]}` : null)
    .filter(Boolean)
  
  const extraMessages = Object.entries(props.extraParams)
    .map(([k, v]) => `${k}: ${v}`)
  
  const confirmMsg = [
    `确定要导入${props.title}数据吗？`,
    ...paramMessages,
    ...extraMessages
  ].join('\n')

  ElMessageBox.confirm(confirmMsg, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    whiteSpace: 'pre-line'
  }).then(() => {
    loading.value = true
    
    // 关键修复：构建 FormData
    const formDataObj = new FormData()
    formDataObj.append("file", fileList.value[0].raw)
    
    // 修复：确保所有参数值都是字符串，避免 [object Object]
    const allParams = {
      ...props.extraParams,
      ...Object.fromEntries(
        props.extraFields.map(f => [f.key, String(formData[f.key] || '')])
      )
    }
    
    // 将所有参数作为独立字段添加到 FormData
    Object.entries(allParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formDataObj.append(key, String(value))
      }
    })
    
    // 调用导入API（第一个参数是FormData，第二个是查询参数）
    //由于已经将所有参数添加到了FormData，所以这里传入空对象。避免重复传参。
    props.importApi(formDataObj, {})
      .then(response => {
        loading.value = false
        emit("import-success", response, props.title)
        handleRemove()
      })
      .catch(error => {
        loading.value = false
        ElMessage.error("导入失败：" + error.message)
      })
  }).catch(() => {})
}
</script>

<style scoped>
/* 仅保留必要的自定义样式 */
.import-card {
  @apply h-full min-h-[180px];
}

.param-form {
  @apply mb-4;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .param-form :deep(.el-form-item) {
    @apply mb-2;
  }
}
</style>