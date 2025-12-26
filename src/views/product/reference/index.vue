<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="原价" prop="originalPrice">
        <el-input
          v-model="queryParams.originalPrice"
          placeholder="请输入原价"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="倍数" prop="multiplier">
        <el-input
          v-model="queryParams.multiplier"
          placeholder="请输入倍数"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="原始标价" prop="originalMarkedPrice">
        <el-input
          v-model="queryParams.originalMarkedPrice"
          placeholder="请输入原始标价"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="有效标价" prop="effectiveMarkedPrice">
        <el-input
          v-model="queryParams.effectiveMarkedPrice"
          placeholder="请输入有效标价"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="参考运费" prop="referenceShippingFee">
        <el-input
          v-model="queryParams.referenceShippingFee"
          placeholder="请输入参考运费"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="实际折扣金额" prop="actualDiscountAmount">
        <el-input
          v-model="queryParams.actualDiscountAmount"
          placeholder="请输入实际折扣金额"
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
          v-hasPermi="['product:reference:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['product:reference:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['product:reference:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['product:reference:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="referenceList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="原价" align="center" prop="originalPrice" />
      <el-table-column label="倍数" align="center" prop="multiplier" />
      <el-table-column label="原始标价" align="center" prop="originalMarkedPrice" />
      <el-table-column label="有效标价" align="center" prop="effectiveMarkedPrice" />
      <el-table-column label="参考运费" align="center" prop="referenceShippingFee" />
      <el-table-column label="实际折扣金额" align="center" prop="actualDiscountAmount" />
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
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['product:reference:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['product:reference:remove']">删除</el-button>
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

    <!-- 添加或修改价格参考对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="referenceRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="原价" prop="originalPrice">
          <el-input v-model="form.originalPrice" placeholder="请输入原价" />
        </el-form-item>
        <el-form-item label="倍数" prop="multiplier">
          <el-input v-model="form.multiplier" placeholder="请输入倍数" />
        </el-form-item>
        <el-form-item label="原始标价" prop="originalMarkedPrice">
          <el-input v-model="form.originalMarkedPrice" placeholder="请输入原始标价" />
        </el-form-item>
        <el-form-item label="有效标价" prop="effectiveMarkedPrice">
          <el-input v-model="form.effectiveMarkedPrice" placeholder="请输入有效标价" />
        </el-form-item>
        <el-form-item label="参考运费" prop="referenceShippingFee">
          <el-input v-model="form.referenceShippingFee" placeholder="请输入参考运费" />
        </el-form-item>
        <el-form-item label="实际折扣金额" prop="actualDiscountAmount">
          <el-input v-model="form.actualDiscountAmount" placeholder="请输入实际折扣金额" />
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

<script setup name="Reference">
import { listReference, getReference, delReference, addReference, updateReference } from "@/api/product/reference"

const { proxy } = getCurrentInstance()

const referenceList = ref([])
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
    originalPrice: null,
    multiplier: null,
    originalMarkedPrice: null,
    effectiveMarkedPrice: null,
    referenceShippingFee: null,
    actualDiscountAmount: null,
    gmtCreate: null,
    gmtModified: null
  },
  rules: {
    gmtCreate: [
      { required: true, message: "创建时间不能为空", trigger: "blur" }
    ],
    gmtModified: [
      { required: true, message: "修改时间不能为空", trigger: "blur" }
    ]
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询价格参考列表 */
function getList() {
  loading.value = true
  listReference(queryParams.value).then(response => {
    referenceList.value = response.rows
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
    id: null,
    originalPrice: null,
    multiplier: null,
    originalMarkedPrice: null,
    effectiveMarkedPrice: null,
    referenceShippingFee: null,
    actualDiscountAmount: null,
    gmtCreate: null,
    gmtModified: null
  }
  proxy.resetForm("referenceRef")
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
  ids.value = selection.map(item => item.id)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加价格参考"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _id = row.id || ids.value
  getReference(_id).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改价格参考"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["referenceRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateReference(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addReference(form.value).then(response => {
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
  const _ids = row.id || ids.value
  proxy.$modal.confirm('是否确认删除价格参考编号为"' + _ids + '"的数据项？').then(function() {
    return delReference(_ids)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('product/reference/export', {
    ...queryParams.value
  }, `reference_${new Date().getTime()}.xlsx`)
}

getList()
</script>
