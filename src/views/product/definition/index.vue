<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="工作流名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入工作流名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="工作流描述" prop="description">
        <el-input
          v-model="queryParams.description"
          placeholder="请输入工作流描述"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="分类标签(AI选品, 竞品监控等)" prop="businessTag">
        <el-input
          v-model="queryParams.businessTag"
          placeholder="请输入分类标签(AI选品, 竞品监控等)"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="版本号" prop="version">
        <el-input
          v-model="queryParams.version"
          placeholder="请输入版本号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否启用" prop="isActive">
        <el-input
          v-model="queryParams.isActive"
          placeholder="请输入是否启用"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建人" prop="creator">
        <el-input
          v-model="queryParams.creator"
          placeholder="请输入创建人"
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
      <el-form-item label="${comment}" prop="updatedAtUtc">
        <el-date-picker clearable
          v-model="queryParams.updatedAtUtc"
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
          v-hasPermi="['product:definition:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['product:definition:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['product:definition:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['product:definition:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="definitionList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="定义ID (UUID)" align="center" prop="definitionId" />
      <el-table-column label="工作流名称" align="center" prop="name" />
      <el-table-column label="工作流描述" align="center" prop="description" />
      <el-table-column label="分类标签(AI选品, 竞品监控等)" align="center" prop="businessTag" />
      <el-table-column label="版本号" align="center" prop="version" />
      <el-table-column label="是否启用" align="center" prop="isActive" />
      <el-table-column label="创建人" align="center" prop="creator" />
      <el-table-column label="${comment}" align="center" prop="createdAtUtc" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createdAtUtc, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="${comment}" align="center" prop="updatedAtUtc" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.updatedAtUtc, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['product:definition:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['product:definition:remove']">删除</el-button>
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

    <!-- 添加或修改工作流定义主对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="definitionRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="工作流名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入工作流名称" />
        </el-form-item>
        <el-form-item label="工作流描述" prop="description">
          <el-input v-model="form.description" placeholder="请输入工作流描述" />
        </el-form-item>
        <el-form-item label="分类标签(AI选品, 竞品监控等)" prop="businessTag">
          <el-input v-model="form.businessTag" placeholder="请输入分类标签(AI选品, 竞品监控等)" />
        </el-form-item>
        <el-form-item label="版本号" prop="version">
          <el-input v-model="form.version" placeholder="请输入版本号" />
        </el-form-item>
        <el-form-item label="是否启用" prop="isActive">
          <el-input v-model="form.isActive" placeholder="请输入是否启用" />
        </el-form-item>
        <el-form-item label="创建人" prop="creator">
          <el-input v-model="form.creator" placeholder="请输入创建人" />
        </el-form-item>
        <el-form-item label="${comment}" prop="createdAtUtc">
          <el-date-picker clearable
            v-model="form.createdAtUtc"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择${comment}">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="${comment}" prop="updatedAtUtc">
          <el-date-picker clearable
            v-model="form.updatedAtUtc"
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

<script setup name="Definition">
import { listDefinition, getDefinition, delDefinition, addDefinition, updateDefinition } from "@/api/product/definition"

const { proxy } = getCurrentInstance()

const definitionList = ref([])
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
    description: null,
    businessTag: null,
    version: null,
    isActive: null,
    creator: null,
    createdAtUtc: null,
    updatedAtUtc: null
  },
  rules: {
    name: [
      { required: true, message: "工作流名称不能为空", trigger: "blur" }
    ],
    version: [
      { required: true, message: "版本号不能为空", trigger: "blur" }
    ],
    isActive: [
      { required: true, message: "是否启用不能为空", trigger: "blur" }
    ],
    createdAtUtc: [
      { required: true, message: "$comment不能为空", trigger: "blur" }
    ],
    updatedAtUtc: [
      { required: true, message: "$comment不能为空", trigger: "blur" }
    ]
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询工作流定义主列表 */
function getList() {
  loading.value = true
  listDefinition(queryParams.value).then(response => {
    definitionList.value = response.rows
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
    definitionId: null,
    name: null,
    description: null,
    businessTag: null,
    version: null,
    isActive: null,
    creator: null,
    createdAtUtc: null,
    updatedAtUtc: null
  }
  proxy.resetForm("definitionRef")
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
  ids.value = selection.map(item => item.definitionId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加工作流定义主"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _definitionId = row.definitionId || ids.value
  getDefinition(_definitionId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改工作流定义主"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["definitionRef"].validate(valid => {
    if (valid) {
      if (form.value.definitionId != null) {
        updateDefinition(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addDefinition(form.value).then(response => {
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
  const _definitionIds = row.definitionId || ids.value
  proxy.$modal.confirm('是否确认删除工作流定义主编号为"' + _definitionIds + '"的数据项？').then(function() {
    return delDefinition(_definitionIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('product/definition/export', {
    ...queryParams.value
  }, `definition_${new Date().getTime()}.xlsx`)
}

getList()
</script>
