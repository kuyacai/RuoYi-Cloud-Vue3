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
      <el-form-item label="SKU编码" prop="skuCode">
        <el-input
          v-model="queryParams.skuCode"
          placeholder="请输入SKU编码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商家SKU" prop="sellerSku">
        <el-input
          v-model="queryParams.sellerSku"
          placeholder="请输入商家SKU"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="规格1" prop="spec1">
        <el-input
          v-model="queryParams.spec1"
          placeholder="请输入规格1"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="规格1备注" prop="spec1Note">
        <el-input
          v-model="queryParams.spec1Note"
          placeholder="请输入规格1备注"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="规格2" prop="spec2">
        <el-input
          v-model="queryParams.spec2"
          placeholder="请输入规格2"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="规格2备注" prop="spec2Note">
        <el-input
          v-model="queryParams.spec2Note"
          placeholder="请输入规格2备注"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="规格3或前置时间" prop="spec3OrLeadTime">
        <el-input
          v-model="queryParams.spec3OrLeadTime"
          placeholder="请输入规格3或前置时间"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="规格3备注" prop="spec3Note">
        <el-input
          v-model="queryParams.spec3Note"
          placeholder="请输入规格3备注"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="现货数量" prop="inStockQty">
        <el-input
          v-model="queryParams.inStockQty"
          placeholder="请输入现货数量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="全款预付数量" prop="fullPrepayQty">
        <el-input
          v-model="queryParams.fullPrepayQty"
          placeholder="请输入全款预付数量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="3天发货数量" prop="ship3dQty">
        <el-input
          v-model="queryParams.ship3dQty"
          placeholder="请输入3天发货数量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="4天发货数量" prop="ship4dQty">
        <el-input
          v-model="queryParams.ship4dQty"
          placeholder="请输入4天发货数量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="5天发货数量" prop="ship5dQty">
        <el-input
          v-model="queryParams.ship5dQty"
          placeholder="请输入5天发货数量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="7天发货数量" prop="ship7dQty">
        <el-input
          v-model="queryParams.ship7dQty"
          placeholder="请输入7天发货数量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="10天发货数量" prop="ship10dQty">
        <el-input
          v-model="queryParams.ship10dQty"
          placeholder="请输入10天发货数量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="15天发货数量" prop="ship15dQty">
        <el-input
          v-model="queryParams.ship15dQty"
          placeholder="请输入15天发货数量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="20天发货数量" prop="ship20dQty">
        <el-input
          v-model="queryParams.ship20dQty"
          placeholder="请输入20天发货数量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="25天发货数量" prop="ship25dQty">
        <el-input
          v-model="queryParams.ship25dQty"
          placeholder="请输入25天发货数量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="30天发货数量" prop="ship30dQty">
        <el-input
          v-model="queryParams.ship30dQty"
          placeholder="请输入30天发货数量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="35天发货数量" prop="ship35dQty">
        <el-input
          v-model="queryParams.ship35dQty"
          placeholder="请输入35天发货数量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="45天发货数量" prop="ship45dQty">
        <el-input
          v-model="queryParams.ship45dQty"
          placeholder="请输入45天发货数量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="原价" prop="orignialPrice">
        <el-input
          v-model="queryParams.orignialPrice"
          placeholder="请输入原价"
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
      <el-form-item label="最低价" prop="lowestPrice">
        <el-input
          v-model="queryParams.lowestPrice"
          placeholder="请输入最低价"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="最高价" prop="highestPrice">
        <el-input
          v-model="queryParams.highestPrice"
          placeholder="请输入最高价"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="条形码" prop="barcode">
        <el-input
          v-model="queryParams.barcode"
          placeholder="请输入条形码"
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
          v-hasPermi="['product:item:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['product:item:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['product:item:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['product:item:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="itemList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="SKU ID" align="center" prop="itemId" />
      <el-table-column label="版本ID" align="center" prop="revisionId" />
      <el-table-column label="SKU编码" align="center" prop="skuCode" />
      <el-table-column label="商家SKU" align="center" prop="sellerSku" />
      <el-table-column label="规格1" align="center" prop="spec1" />
      <el-table-column label="规格1备注" align="center" prop="spec1Note" />
      <el-table-column label="规格2" align="center" prop="spec2" />
      <el-table-column label="规格2备注" align="center" prop="spec2Note" />
      <el-table-column label="规格3或前置时间" align="center" prop="spec3OrLeadTime" />
      <el-table-column label="规格3备注" align="center" prop="spec3Note" />
      <el-table-column label="现货数量" align="center" prop="inStockQty" />
      <el-table-column label="全款预付数量" align="center" prop="fullPrepayQty" />
      <el-table-column label="3天发货数量" align="center" prop="ship3dQty" />
      <el-table-column label="4天发货数量" align="center" prop="ship4dQty" />
      <el-table-column label="5天发货数量" align="center" prop="ship5dQty" />
      <el-table-column label="7天发货数量" align="center" prop="ship7dQty" />
      <el-table-column label="10天发货数量" align="center" prop="ship10dQty" />
      <el-table-column label="15天发货数量" align="center" prop="ship15dQty" />
      <el-table-column label="20天发货数量" align="center" prop="ship20dQty" />
      <el-table-column label="25天发货数量" align="center" prop="ship25dQty" />
      <el-table-column label="30天发货数量" align="center" prop="ship30dQty" />
      <el-table-column label="35天发货数量" align="center" prop="ship35dQty" />
      <el-table-column label="45天发货数量" align="center" prop="ship45dQty" />
      <el-table-column label="原价" align="center" prop="orignialPrice" />
      <el-table-column label="市场价" align="center" prop="marketPrice" />
      <el-table-column label="最低价" align="center" prop="lowestPrice" />
      <el-table-column label="最高价" align="center" prop="highestPrice" />
      <el-table-column label="SKU状态" align="center" prop="skuStatus" />
      <el-table-column label="条形码" align="center" prop="barcode" />
      <el-table-column label="创建时间" align="center" prop="gmtCreate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.gmtCreate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['product:item:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['product:item:remove']">删除</el-button>
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

    <!-- 添加或修改SKU 快照对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="itemRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="版本ID" prop="revisionId">
          <el-input v-model="form.revisionId" placeholder="请输入版本ID" />
        </el-form-item>
        <el-form-item label="SKU编码" prop="skuCode">
          <el-input v-model="form.skuCode" placeholder="请输入SKU编码" />
        </el-form-item>
        <el-form-item label="商家SKU" prop="sellerSku">
          <el-input v-model="form.sellerSku" placeholder="请输入商家SKU" />
        </el-form-item>
        <el-form-item label="规格1" prop="spec1">
          <el-input v-model="form.spec1" placeholder="请输入规格1" />
        </el-form-item>
        <el-form-item label="规格1备注" prop="spec1Note">
          <el-input v-model="form.spec1Note" placeholder="请输入规格1备注" />
        </el-form-item>
        <el-form-item label="规格2" prop="spec2">
          <el-input v-model="form.spec2" placeholder="请输入规格2" />
        </el-form-item>
        <el-form-item label="规格2备注" prop="spec2Note">
          <el-input v-model="form.spec2Note" placeholder="请输入规格2备注" />
        </el-form-item>
        <el-form-item label="规格3或前置时间" prop="spec3OrLeadTime">
          <el-input v-model="form.spec3OrLeadTime" placeholder="请输入规格3或前置时间" />
        </el-form-item>
        <el-form-item label="规格3备注" prop="spec3Note">
          <el-input v-model="form.spec3Note" placeholder="请输入规格3备注" />
        </el-form-item>
        <el-form-item label="现货数量" prop="inStockQty">
          <el-input v-model="form.inStockQty" placeholder="请输入现货数量" />
        </el-form-item>
        <el-form-item label="全款预付数量" prop="fullPrepayQty">
          <el-input v-model="form.fullPrepayQty" placeholder="请输入全款预付数量" />
        </el-form-item>
        <el-form-item label="3天发货数量" prop="ship3dQty">
          <el-input v-model="form.ship3dQty" placeholder="请输入3天发货数量" />
        </el-form-item>
        <el-form-item label="4天发货数量" prop="ship4dQty">
          <el-input v-model="form.ship4dQty" placeholder="请输入4天发货数量" />
        </el-form-item>
        <el-form-item label="5天发货数量" prop="ship5dQty">
          <el-input v-model="form.ship5dQty" placeholder="请输入5天发货数量" />
        </el-form-item>
        <el-form-item label="7天发货数量" prop="ship7dQty">
          <el-input v-model="form.ship7dQty" placeholder="请输入7天发货数量" />
        </el-form-item>
        <el-form-item label="10天发货数量" prop="ship10dQty">
          <el-input v-model="form.ship10dQty" placeholder="请输入10天发货数量" />
        </el-form-item>
        <el-form-item label="15天发货数量" prop="ship15dQty">
          <el-input v-model="form.ship15dQty" placeholder="请输入15天发货数量" />
        </el-form-item>
        <el-form-item label="20天发货数量" prop="ship20dQty">
          <el-input v-model="form.ship20dQty" placeholder="请输入20天发货数量" />
        </el-form-item>
        <el-form-item label="25天发货数量" prop="ship25dQty">
          <el-input v-model="form.ship25dQty" placeholder="请输入25天发货数量" />
        </el-form-item>
        <el-form-item label="30天发货数量" prop="ship30dQty">
          <el-input v-model="form.ship30dQty" placeholder="请输入30天发货数量" />
        </el-form-item>
        <el-form-item label="35天发货数量" prop="ship35dQty">
          <el-input v-model="form.ship35dQty" placeholder="请输入35天发货数量" />
        </el-form-item>
        <el-form-item label="45天发货数量" prop="ship45dQty">
          <el-input v-model="form.ship45dQty" placeholder="请输入45天发货数量" />
        </el-form-item>
        <el-form-item label="原价" prop="orignialPrice">
          <el-input v-model="form.orignialPrice" placeholder="请输入原价" />
        </el-form-item>
        <el-form-item label="市场价" prop="marketPrice">
          <el-input v-model="form.marketPrice" placeholder="请输入市场价" />
        </el-form-item>
        <el-form-item label="最低价" prop="lowestPrice">
          <el-input v-model="form.lowestPrice" placeholder="请输入最低价" />
        </el-form-item>
        <el-form-item label="最高价" prop="highestPrice">
          <el-input v-model="form.highestPrice" placeholder="请输入最高价" />
        </el-form-item>
        <el-form-item label="条形码" prop="barcode">
          <el-input v-model="form.barcode" placeholder="请输入条形码" />
        </el-form-item>
        <el-form-item label="创建时间" prop="gmtCreate">
          <el-date-picker clearable
            v-model="form.gmtCreate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择创建时间">
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

<script setup name="Item">
import { listItem, getItem, delItem, addItem, updateItem } from "@/api/product/item"

const { proxy } = getCurrentInstance()

const itemList = ref([])
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
    skuCode: null,
    sellerSku: null,
    spec1: null,
    spec1Note: null,
    spec2: null,
    spec2Note: null,
    spec3OrLeadTime: null,
    spec3Note: null,
    inStockQty: null,
    fullPrepayQty: null,
    ship3dQty: null,
    ship4dQty: null,
    ship5dQty: null,
    ship7dQty: null,
    ship10dQty: null,
    ship15dQty: null,
    ship20dQty: null,
    ship25dQty: null,
    ship30dQty: null,
    ship35dQty: null,
    ship45dQty: null,
    orignialPrice: null,
    marketPrice: null,
    lowestPrice: null,
    highestPrice: null,
    skuStatus: null,
    barcode: null,
    gmtCreate: null
  },
  rules: {
    revisionId: [
      { required: true, message: "版本ID不能为空", trigger: "blur" }
    ],
    skuCode: [
      { required: true, message: "SKU编码不能为空", trigger: "blur" }
    ],
    gmtCreate: [
      { required: true, message: "创建时间不能为空", trigger: "blur" }
    ]
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询SKU 快照列表 */
function getList() {
  loading.value = true
  listItem(queryParams.value).then(response => {
    itemList.value = response.rows
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
    itemId: null,
    revisionId: null,
    skuCode: null,
    sellerSku: null,
    spec1: null,
    spec1Note: null,
    spec2: null,
    spec2Note: null,
    spec3OrLeadTime: null,
    spec3Note: null,
    inStockQty: null,
    fullPrepayQty: null,
    ship3dQty: null,
    ship4dQty: null,
    ship5dQty: null,
    ship7dQty: null,
    ship10dQty: null,
    ship15dQty: null,
    ship20dQty: null,
    ship25dQty: null,
    ship30dQty: null,
    ship35dQty: null,
    ship45dQty: null,
    orignialPrice: null,
    marketPrice: null,
    lowestPrice: null,
    highestPrice: null,
    skuStatus: null,
    barcode: null,
    gmtCreate: null
  }
  proxy.resetForm("itemRef")
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
  ids.value = selection.map(item => item.itemId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加SKU 快照"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _itemId = row.itemId || ids.value
  getItem(_itemId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改SKU 快照"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["itemRef"].validate(valid => {
    if (valid) {
      if (form.value.itemId != null) {
        updateItem(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addItem(form.value).then(response => {
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
  const _itemIds = row.itemId || ids.value
  proxy.$modal.confirm('是否确认删除SKU 快照编号为"' + _itemIds + '"的数据项？').then(function() {
    return delItem(_itemIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('product/item/export', {
    ...queryParams.value
  }, `item_${new Date().getTime()}.xlsx`)
}

getList()
</script>
