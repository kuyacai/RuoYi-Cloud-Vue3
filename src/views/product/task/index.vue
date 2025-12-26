<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="任务代码" prop="taskCode">
        <el-input
          v-model="queryParams.taskCode"
          placeholder="请输入任务代码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="业务ID(revision_id)" prop="bizId">
        <el-input
          v-model="queryParams.bizId"
          placeholder="请输入业务ID(revision_id)"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建时间" prop="gmtCreate">
        <el-date-picker clearable
          v-model="queryParams.gmtCreate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择创建时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="修改时间" prop="gmtModified">
        <el-date-picker clearable
          v-model="queryParams.gmtModified"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择修改时间">
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
          v-hasPermi="['product:task:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['product:task:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['product:task:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['product:task:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="taskList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="任务ID" align="center" prop="taskId" />
      <el-table-column label="任务代码" align="center" prop="taskCode" />
      <el-table-column label="业务ID(revision_id)" align="center" prop="bizId" />
      <el-table-column label="任务状态" align="center" prop="taskStatus" />
      <el-table-column label="创建时间" align="center" prop="gmtCreate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.gmtCreate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" align="center" prop="gmtModified" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.gmtModified, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['product:task:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['product:task:remove']">删除</el-button>
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

    <!-- 添加或修改任务实例对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="taskRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="任务代码" prop="taskCode">
          <el-input v-model="form.taskCode" placeholder="请输入任务代码" />
        </el-form-item>
        <el-form-item label="业务ID(revision_id)" prop="bizId">
          <el-input v-model="form.bizId" placeholder="请输入业务ID(revision_id)" />
        </el-form-item>
        <el-form-item label="创建时间" prop="gmtCreate">
          <el-date-picker clearable
            v-model="form.gmtCreate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择创建时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="修改时间" prop="gmtModified">
          <el-date-picker clearable
            v-model="form.gmtModified"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择修改时间">
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

<script setup name="Task">
import { listTask, getTask, delTask, addTask, updateTask } from "@/api/product/task"

const { proxy } = getCurrentInstance()

const taskList = ref([])
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
    taskCode: null,
    bizId: null,
    taskStatus: null,
    gmtCreate: null,
    gmtModified: null
  },
  rules: {
    taskCode: [
      { required: true, message: "任务代码不能为空", trigger: "blur" }
    ],
    bizId: [
      { required: true, message: "业务ID(revision_id)不能为空", trigger: "blur" }
    ],
    taskStatus: [
      { required: true, message: "任务状态不能为空", trigger: "change" }
    ],
    gmtCreate: [
      { required: true, message: "创建时间不能为空", trigger: "blur" }
    ],
    gmtModified: [
      { required: true, message: "修改时间不能为空", trigger: "blur" }
    ]
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询任务实例列表 */
function getList() {
  loading.value = true
  listTask(queryParams.value).then(response => {
    taskList.value = response.rows
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
    taskId: null,
    taskCode: null,
    bizId: null,
    taskStatus: null,
    gmtCreate: null,
    gmtModified: null
  }
  proxy.resetForm("taskRef")
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
  ids.value = selection.map(item => item.taskId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加任务实例"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _taskId = row.taskId || ids.value
  getTask(_taskId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改任务实例"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["taskRef"].validate(valid => {
    if (valid) {
      if (form.value.taskId != null) {
        updateTask(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addTask(form.value).then(response => {
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
  const _taskIds = row.taskId || ids.value
  proxy.$modal.confirm('是否确认删除任务实例编号为"' + _taskIds + '"的数据项？').then(function() {
    return delTask(_taskIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('product/task/export', {
    ...queryParams.value
  }, `task_${new Date().getTime()}.xlsx`)
}

getList()
</script>
