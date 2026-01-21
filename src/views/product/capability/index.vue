<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="能力名称 (如: AI商机提取)" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入能力名称 (如: AI商机提取)"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="${comment}" prop="isActive">
        <el-input
          v-model="queryParams.isActive"
          placeholder="请输入${comment}"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="${comment}" prop="createdAtUtc">
        <el-date-picker clearable
          v-model="queryParams.createdAtUtc"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择${comment}">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['product:capability:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['product:capability:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['product:capability:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['product:capability:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="capabilityList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="能力唯一标识 (如: gemini_export)" align="center" prop="capabilityId" />
      <el-table-column label="能力名称 (如: AI商机提取)" align="center" prop="name" />
      <el-table-column label="执行器类型 (python_agent/java_local)" align="center" prop="handlerType" />
      <el-table-column label="功能描述" align="center" prop="description" />
      <el-table-column label="配置项定义 (UI根据此字段生成表单，如需要输入APIKey, Prompt等)" align="center" prop="configSchema" />
      <el-table-column label="${comment}" align="center" prop="isActive" />
      <el-table-column label="${comment}" align="center" prop="createdAtUtc" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createdAtUtc, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['product:capability:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['product:capability:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改节点能力元数据对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="capabilityRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="能力名称 (如: AI商机提取)" prop="name">
          <el-input v-model="form.name" placeholder="请输入能力名称 (如: AI商机提取)" />
        </el-form-item>
        <el-form-item label="功能描述" prop="description">
          <el-input v-model="form.description" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="${comment}" prop="isActive">
          <el-input v-model="form.isActive" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="createdAtUtc">
          <el-date-picker clearable
            v-model="form.createdAtUtc"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择${comment}">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Capability">
import { listCapability, getCapability, delCapability, addCapability, updateCapability } from "@/api/product/capability"

const { proxy } = getCurrentInstance()

const capabilityList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    name: null,
    handlerType: null,
    description: null,
    configSchema: null,
    isActive: null,
    createdAtUtc: null
  },
  rules: {
    name: [
      { required: true, message: "能力名称 (如: AI商机提取)不能为空", trigger: "blur" }
    ],
    handlerType: [
      { required: true, message: "执行器类型 (python_agent/java_local)不能为空", trigger: "change" }
    ],
    createdAtUtc: [
      { required: true, message: "$comment不能为空", trigger: "blur" }
    ]
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询节点能力元数据列表 */
function getList() {
  loading.value = true
  listCapability(queryParams.value).then(response => {
    capabilityList.value = response.rows
    total.value = response.total
    loading.value = false
  })
}

// 取消按钮
function cancel() {
  open.value = false
  reset()
}

// 表单重置
function reset() {
  form.value = {
    capabilityId: null,
    name: null,
    handlerType: null,
    description: null,
    configSchema: null,
    isActive: null,
    createdAtUtc: null
  }
  proxy.resetForm("capabilityRef")
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef")
  handleQuery()
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.capabilityId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加节点能力元数据"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _capabilityId = row.capabilityId || ids.value
  getCapability(_capabilityId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改节点能力元数据"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["capabilityRef"].validate(valid => {
    if (valid) {
      if (form.value.capabilityId != null) {
        updateCapability(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addCapability(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功")
          open.value = false
          getList()
        })
      }
    }
  })
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _capabilityIds = row.capabilityId || ids.value
  proxy.$modal.confirm('是否确认删除节点能力元数据编号为"' + _capabilityIds + '"的数据项？').then(function() {
    return delCapability(_capabilityIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('product/capability/export', {
    ...queryParams.value
  }, `capability_${new Date().getTime()}.xlsx`)
}

getList()
</script>
