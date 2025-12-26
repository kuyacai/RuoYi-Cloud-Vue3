<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="版本ID" prop="revisionId">
        <el-input
          v-model="queryParams.revisionId"
          placeholder="请输入版本ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="店铺ID" prop="shopId">
        <el-input
          v-model="queryParams.shopId"
          placeholder="请输入店铺ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="店铺商品ID" prop="shopProductId">
        <el-input
          v-model="queryParams.shopProductId"
          placeholder="请输入店铺商品ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="类目" prop="category">
        <el-input
          v-model="queryParams.category"
          placeholder="请输入类目"
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
          v-hasPermi="['product:spu:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['product:spu:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['product:spu:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['product:spu:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="spuList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="上架SPU ID" align="center" prop="listingSpuId" />
      <el-table-column label="版本ID" align="center" prop="revisionId" />
      <el-table-column label="店铺ID" align="center" prop="shopId" />
      <el-table-column label="店铺商品ID" align="center" prop="shopProductId" />
      <el-table-column label="类目" align="center" prop="category" />
      <el-table-column label="商品链接" align="center" prop="productUrl" />
      <el-table-column label="当前状态" align="center" prop="currStatus" />
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
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['product:spu:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['product:spu:remove']">删除</el-button>
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

    <!-- 添加或修改店铺商品同步状态对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="spuRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="版本ID" prop="revisionId">
          <el-input v-model="form.revisionId" placeholder="请输入版本ID" />
        </el-form-item>
        <el-form-item label="店铺ID" prop="shopId">
          <el-input v-model="form.shopId" placeholder="请输入店铺ID" />
        </el-form-item>
        <el-form-item label="店铺商品ID" prop="shopProductId">
          <el-input v-model="form.shopProductId" placeholder="请输入店铺商品ID" />
        </el-form-item>
        <el-form-item label="类目" prop="category">
          <el-input v-model="form.category" placeholder="请输入类目" />
        </el-form-item>
        <el-form-item label="商品链接" prop="productUrl">
          <el-input v-model="form.productUrl" type="textarea" placeholder="请输入内容" />
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

<script setup name="Spu">
import { listSpu, getSpu, delSpu, addSpu, updateSpu } from "@/api/product/spu"

const { proxy } = getCurrentInstance()

const spuList = ref([])
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
    revisionId: null,
    shopId: null,
    shopProductId: null,
    category: null,
    productUrl: null,
    currStatus: null,
    gmtCreate: null,
    gmtModified: null
  },
  rules: {
    revisionId: [
      { required: true, message: "版本ID不能为空", trigger: "blur" }
    ],
    shopId: [
      { required: true, message: "店铺ID不能为空", trigger: "blur" }
    ],
    shopProductId: [
      { required: true, message: "店铺商品ID不能为空", trigger: "blur" }
    ],
    currStatus: [
      { required: true, message: "当前状态不能为空", trigger: "change" }
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

/** 查询店铺商品同步状态列表 */
function getList() {
  loading.value = true
  listSpu(queryParams.value).then(response => {
    spuList.value = response.rows
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
    listingSpuId: null,
    revisionId: null,
    shopId: null,
    shopProductId: null,
    category: null,
    productUrl: null,
    currStatus: null,
    gmtCreate: null,
    gmtModified: null
  }
  proxy.resetForm("spuRef")
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
  ids.value = selection.map(item => item.listingSpuId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加店铺商品同步状态"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _listingSpuId = row.listingSpuId || ids.value
  getSpu(_listingSpuId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改店铺商品同步状态"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["spuRef"].validate(valid => {
    if (valid) {
      if (form.value.listingSpuId != null) {
        updateSpu(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addSpu(form.value).then(response => {
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
  const _listingSpuIds = row.listingSpuId || ids.value
  proxy.$modal.confirm('是否确认删除店铺商品同步状态编号为"' + _listingSpuIds + '"的数据项？').then(function() {
    return delSpu(_listingSpuIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('product/spu/export', {
    ...queryParams.value
  }, `spu_${new Date().getTime()}.xlsx`)
}

getList()
</script>
