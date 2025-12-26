<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="上架SPU ID" prop="listingSpuId">
        <el-input
          v-model="queryParams.listingSpuId"
          placeholder="请输入上架SPU ID"
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
      <el-form-item label="店铺SKU ID" prop="shopSkuId">
        <el-input
          v-model="queryParams.shopSkuId"
          placeholder="请输入店铺SKU ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="SKU ID" prop="itemId">
        <el-input
          v-model="queryParams.itemId"
          placeholder="请输入SKU ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="市场价" prop="marketPrice">
        <el-input
          v-model="queryParams.marketPrice"
          placeholder="请输入市场价"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="渠道库存" prop="channelStock">
        <el-input
          v-model="queryParams.channelStock"
          placeholder="请输入渠道库存"
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
          v-hasPermi="['product:sku:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['product:sku:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['product:sku:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['product:sku:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="skuList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="上架SKU ID" align="center" prop="listingSkuId" />
      <el-table-column label="上架SPU ID" align="center" prop="listingSpuId" />
      <el-table-column label="店铺ID" align="center" prop="shopId" />
      <el-table-column label="店铺商品ID" align="center" prop="shopProductId" />
      <el-table-column label="店铺SKU ID" align="center" prop="shopSkuId" />
      <el-table-column label="SKU ID" align="center" prop="itemId" />
      <el-table-column label="市场价" align="center" prop="marketPrice" />
      <el-table-column label="渠道库存" align="center" prop="channelStock" />
      <el-table-column label="SKU状态" align="center" prop="skuStatus" />
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
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['product:sku:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['product:sku:remove']">删除</el-button>
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

    <!-- 添加或修改店铺商品SKU同步状态对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="skuRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="上架SPU ID" prop="listingSpuId">
          <el-input v-model="form.listingSpuId" placeholder="请输入上架SPU ID" />
        </el-form-item>
        <el-form-item label="店铺ID" prop="shopId">
          <el-input v-model="form.shopId" placeholder="请输入店铺ID" />
        </el-form-item>
        <el-form-item label="店铺商品ID" prop="shopProductId">
          <el-input v-model="form.shopProductId" placeholder="请输入店铺商品ID" />
        </el-form-item>
        <el-form-item label="店铺SKU ID" prop="shopSkuId">
          <el-input v-model="form.shopSkuId" placeholder="请输入店铺SKU ID" />
        </el-form-item>
        <el-form-item label="SKU ID" prop="itemId">
          <el-input v-model="form.itemId" placeholder="请输入SKU ID" />
        </el-form-item>
        <el-form-item label="市场价" prop="marketPrice">
          <el-input v-model="form.marketPrice" placeholder="请输入市场价" />
        </el-form-item>
        <el-form-item label="渠道库存" prop="channelStock">
          <el-input v-model="form.channelStock" placeholder="请输入渠道库存" />
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

<script setup name="Sku">
import { listSku, getSku, delSku, addSku, updateSku } from "@/api/product/sku"

const { proxy } = getCurrentInstance()

const skuList = ref([])
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
    listingSpuId: null,
    shopId: null,
    shopProductId: null,
    shopSkuId: null,
    itemId: null,
    marketPrice: null,
    channelStock: null,
    skuStatus: null,
    gmtCreate: null,
    gmtModified: null
  },
  rules: {
    listingSpuId: [
      { required: true, message: "上架SPU ID不能为空", trigger: "blur" }
    ],
    shopId: [
      { required: true, message: "店铺ID不能为空", trigger: "blur" }
    ],
    shopProductId: [
      { required: true, message: "店铺商品ID不能为空", trigger: "blur" }
    ],
    shopSkuId: [
      { required: true, message: "店铺SKU ID不能为空", trigger: "blur" }
    ],
    itemId: [
      { required: true, message: "SKU ID不能为空", trigger: "blur" }
    ],
    channelStock: [
      { required: true, message: "渠道库存不能为空", trigger: "blur" }
    ],
    skuStatus: [
      { required: true, message: "SKU状态不能为空", trigger: "change" }
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

/** 查询店铺商品SKU同步状态列表 */
function getList() {
  loading.value = true
  listSku(queryParams.value).then(response => {
    skuList.value = response.rows
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
    listingSkuId: null,
    listingSpuId: null,
    shopId: null,
    shopProductId: null,
    shopSkuId: null,
    itemId: null,
    marketPrice: null,
    channelStock: null,
    skuStatus: null,
    gmtCreate: null,
    gmtModified: null
  }
  proxy.resetForm("skuRef")
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
  ids.value = selection.map(item => item.listingSkuId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加店铺商品SKU同步状态"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _listingSkuId = row.listingSkuId || ids.value
  getSku(_listingSkuId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改店铺商品SKU同步状态"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["skuRef"].validate(valid => {
    if (valid) {
      if (form.value.listingSkuId != null) {
        updateSku(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addSku(form.value).then(response => {
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
  const _listingSkuIds = row.listingSkuId || ids.value
  proxy.$modal.confirm('是否确认删除店铺商品SKU同步状态编号为"' + _listingSkuIds + '"的数据项？').then(function() {
    return delSku(_listingSkuIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('product/sku/export', {
    ...queryParams.value
  }, `sku_${new Date().getTime()}.xlsx`)
}

getList()
</script>
