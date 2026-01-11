<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="店铺名称" prop="shopName">
        <el-input
          v-model="queryParams.shopName"
          placeholder="请输入店铺名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="平台" prop="platform">
        <el-input
          v-model="queryParams.platform"
          placeholder="请输入平台"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所有者ID" prop="ownerId">
        <el-input
          v-model="queryParams.ownerId"
          placeholder="请输入所有者ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建时间" prop="createdAtUtc">
        <el-date-picker clearable
          v-model="queryParams.createdAtUtc"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择创建时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="修改时间" prop="updatedAtUtc">
        <el-date-picker clearable
          v-model="queryParams.updatedAtUtc"
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
          v-hasPermi="['product:shop:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['product:shop:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['product:shop:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['product:shop:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="shopList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="店铺ID" align="center" prop="shopId" />
      <el-table-column label="店铺名称" align="center" prop="shopName" />
      <el-table-column label="平台" align="center" prop="platform" />
      <el-table-column label="所有者ID" align="center" prop="ownerId" />
      <el-table-column label="店铺状态" align="center" prop="shopStatus" />
      <el-table-column label="店铺描述" align="center" prop="shopDescription" />
      <el-table-column label="创建时间" align="center" prop="createdAtUtc" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createdAtUtc, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" align="center" prop="updatedAtUtc" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.updatedAtUtc, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['product:shop:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['product:shop:remove']">删除</el-button>
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

    <!-- 添加或修改店铺对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="shopRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="店铺名称" prop="shopName">
          <el-input v-model="form.shopName" placeholder="请输入店铺名称" />
        </el-form-item>
        <el-form-item label="平台" prop="platform">
          <el-input v-model="form.platform" placeholder="请输入平台" />
        </el-form-item>
        <el-form-item label="所有者ID" prop="ownerId">
          <el-input v-model="form.ownerId" placeholder="请输入所有者ID" />
        </el-form-item>
        <el-form-item label="店铺描述" prop="shopDescription">
          <el-input v-model="form.shopDescription" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="创建时间" prop="createdAtUtc">
          <el-date-picker clearable
            v-model="form.createdAtUtc"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择创建时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="修改时间" prop="updatedAtUtc">
          <el-date-picker clearable
            v-model="form.updatedAtUtc"
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

<script setup name="Shop">
import { listShop, getShop, delShop, addShop, updateShop } from "@/api/product/shop"

const { proxy } = getCurrentInstance()

const shopList = ref([])
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
    shopName: null,
    platform: null,
    ownerId: null,
    shopStatus: null,
    shopDescription: null,
    createdAtUtc: null,
    updatedAtUtc: null
  },
  rules: {
    shopName: [
      { required: true, message: "店铺名称不能为空", trigger: "blur" }
    ],
    platform: [
      { required: true, message: "平台不能为空", trigger: "blur" }
    ],
    ownerId: [
      { required: true, message: "所有者ID不能为空", trigger: "blur" }
    ],
    shopStatus: [
      { required: true, message: "店铺状态不能为空", trigger: "change" }
    ],
    createdAtUtc: [
      { required: true, message: "创建时间不能为空", trigger: "blur" }
    ],
    updatedAtUtc: [
      { required: true, message: "修改时间不能为空", trigger: "blur" }
    ]
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询店铺列表 */
function getList() {
  loading.value = true
  listShop(queryParams.value).then(response => {
    shopList.value = response.rows
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
    shopId: null,
    shopName: null,
    platform: null,
    ownerId: null,
    shopStatus: null,
    shopDescription: null,
    createdAtUtc: null,
    updatedAtUtc: null
  }
  proxy.resetForm("shopRef")
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
  ids.value = selection.map(item => item.shopId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加店铺"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _shopId = row.shopId || ids.value
  getShop(_shopId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改店铺"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["shopRef"].validate(valid => {
    if (valid) {
      if (form.value.shopId != null) {
        updateShop(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addShop(form.value).then(response => {
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
  const _shopIds = row.shopId || ids.value
  proxy.$modal.confirm('是否确认删除店铺编号为"' + _shopIds + '"的数据项？').then(function() {
    return delShop(_shopIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('product/shop/export', {
    ...queryParams.value
  }, `shop_${new Date().getTime()}.xlsx`)
}

getList()
</script>
