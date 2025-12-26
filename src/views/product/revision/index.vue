<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="商品ID" prop="goodsId">
        <el-input
          v-model="queryParams.goodsId"
          placeholder="请输入商品ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否当前版本" prop="isCurrent">
        <el-input
          v-model="queryParams.isCurrent"
          placeholder="请输入是否当前版本"
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
          v-hasPermi="['product:revision:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['product:revision:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['product:revision:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['product:revision:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="revisionList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="版本ID" align="center" prop="revisionId" />
      <el-table-column label="商品ID" align="center" prop="goodsId" />
      <el-table-column label="版本状态" align="center" prop="revStatus" />
      <el-table-column label="版本类型" align="center" prop="revisionType" />
      <el-table-column label="是否当前版本" align="center" prop="isCurrent" />
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
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['product:revision:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['product:revision:remove']">删除</el-button>
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

    <!-- 添加或修改商品版本对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="revisionRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="商品ID" prop="goodsId">
          <el-input v-model="form.goodsId" placeholder="请输入商品ID" />
        </el-form-item>
        <el-form-item label="是否当前版本" prop="isCurrent">
          <el-input v-model="form.isCurrent" placeholder="请输入是否当前版本" />
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

<script setup name="Revision">
import { listRevision, getRevision, delRevision, addRevision, updateRevision } from "@/api/product/revision"

const { proxy } = getCurrentInstance()

const revisionList = ref([])
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
    goodsId: null,
    revStatus: null,
    revisionType: null,
    isCurrent: null,
    gmtCreate: null,
    gmtModified: null
  },
  rules: {
    goodsId: [
      { required: true, message: "商品ID不能为空", trigger: "blur" }
    ],
    isCurrent: [
      { required: true, message: "是否当前版本不能为空", trigger: "blur" }
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

/** 查询商品版本列表 */
function getList() {
  loading.value = true
  listRevision(queryParams.value).then(response => {
    revisionList.value = response.rows
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
    revisionId: null,
    goodsId: null,
    revStatus: null,
    revisionType: null,
    isCurrent: null,
    gmtCreate: null,
    gmtModified: null
  }
  proxy.resetForm("revisionRef")
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
  ids.value = selection.map(item => item.revisionId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加商品版本"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _revisionId = row.revisionId || ids.value
  getRevision(_revisionId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改商品版本"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["revisionRef"].validate(valid => {
    if (valid) {
      if (form.value.revisionId != null) {
        updateRevision(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addRevision(form.value).then(response => {
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
  const _revisionIds = row.revisionId || ids.value
  proxy.$modal.confirm('是否确认删除商品版本编号为"' + _revisionIds + '"的数据项？').then(function() {
    return delRevision(_revisionIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('product/revision/export', {
    ...queryParams.value
  }, `revision_${new Date().getTime()}.xlsx`)
}

getList()
</script>
