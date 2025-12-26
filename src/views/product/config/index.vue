<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="最低价格" prop="priceMin">
        <el-input
          v-model="queryParams.priceMin"
          placeholder="请输入最低价格"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="最高价格" prop="priceMax">
        <el-input
          v-model="queryParams.priceMax"
          placeholder="请输入最高价格"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="门槛金额" prop="thresholdAmount">
        <el-input
          v-model="queryParams.thresholdAmount"
          placeholder="请输入门槛金额"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="折扣金额" prop="discountAmount">
        <el-input
          v-model="queryParams.discountAmount"
          placeholder="请输入折扣金额"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="折扣率" prop="discountRate">
        <el-input
          v-model="queryParams.discountRate"
          placeholder="请输入折扣率"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="折扣强度" prop="discountStrength">
        <el-input
          v-model="queryParams.discountStrength"
          placeholder="请输入折扣强度"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="优先级" prop="priority">
        <el-input
          v-model="queryParams.priority"
          placeholder="请输入优先级"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="配置ID" prop="configId">
        <el-input
          v-model="queryParams.configId"
          placeholder="请输入配置ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="配置名称" prop="configName">
        <el-input
          v-model="queryParams.configName"
          placeholder="请输入配置名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="推荐数量" prop="recommendedQuantity">
        <el-input
          v-model="queryParams.recommendedQuantity"
          placeholder="请输入推荐数量"
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
          v-hasPermi="['product:config:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['product:config:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['product:config:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['product:config:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="configList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="最低价格" align="center" prop="priceMin" />
      <el-table-column label="最高价格" align="center" prop="priceMax" />
      <el-table-column label="门槛金额" align="center" prop="thresholdAmount" />
      <el-table-column label="折扣金额" align="center" prop="discountAmount" />
      <el-table-column label="折扣率" align="center" prop="discountRate" />
      <el-table-column label="折扣强度" align="center" prop="discountStrength" />
      <el-table-column label="优先级" align="center" prop="priority" />
      <el-table-column label="配置ID" align="center" prop="configId" />
      <el-table-column label="配置名称" align="center" prop="configName" />
      <el-table-column label="折扣状态" align="center" prop="discountStatus" />
      <el-table-column label="折扣类型" align="center" prop="discountType" />
      <el-table-column label="推荐数量" align="center" prop="recommendedQuantity" />
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
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['product:config:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['product:config:remove']">删除</el-button>
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

    <!-- 添加或修改平台促销配置对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="configRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="最低价格" prop="priceMin">
          <el-input v-model="form.priceMin" placeholder="请输入最低价格" />
        </el-form-item>
        <el-form-item label="最高价格" prop="priceMax">
          <el-input v-model="form.priceMax" placeholder="请输入最高价格" />
        </el-form-item>
        <el-form-item label="门槛金额" prop="thresholdAmount">
          <el-input v-model="form.thresholdAmount" placeholder="请输入门槛金额" />
        </el-form-item>
        <el-form-item label="折扣金额" prop="discountAmount">
          <el-input v-model="form.discountAmount" placeholder="请输入折扣金额" />
        </el-form-item>
        <el-form-item label="折扣率" prop="discountRate">
          <el-input v-model="form.discountRate" placeholder="请输入折扣率" />
        </el-form-item>
        <el-form-item label="折扣强度" prop="discountStrength">
          <el-input v-model="form.discountStrength" placeholder="请输入折扣强度" />
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <el-input v-model="form.priority" placeholder="请输入优先级" />
        </el-form-item>
        <el-form-item label="配置ID" prop="configId">
          <el-input v-model="form.configId" placeholder="请输入配置ID" />
        </el-form-item>
        <el-form-item label="配置名称" prop="configName">
          <el-input v-model="form.configName" placeholder="请输入配置名称" />
        </el-form-item>
        <el-form-item label="推荐数量" prop="recommendedQuantity">
          <el-input v-model="form.recommendedQuantity" placeholder="请输入推荐数量" />
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

<script setup name="Config">
import { listConfig, getConfig, delConfig, addConfig, updateConfig } from "@/api/product/config"

const { proxy } = getCurrentInstance()

const configList = ref([])
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
    priceMin: null,
    priceMax: null,
    thresholdAmount: null,
    discountAmount: null,
    discountRate: null,
    discountStrength: null,
    priority: null,
    configId: null,
    configName: null,
    discountStatus: null,
    discountType: null,
    recommendedQuantity: null,
    gmtCreate: null,
    gmtModified: null
  },
  rules: {
    configId: [
      { required: true, message: "配置ID不能为空", trigger: "blur" }
    ],
    configName: [
      { required: true, message: "配置名称不能为空", trigger: "blur" }
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

/** 查询平台促销配置列表 */
function getList() {
  loading.value = true
  listConfig(queryParams.value).then(response => {
    configList.value = response.rows
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
    priceMin: null,
    priceMax: null,
    thresholdAmount: null,
    discountAmount: null,
    discountRate: null,
    discountStrength: null,
    priority: null,
    configId: null,
    configName: null,
    discountStatus: null,
    discountType: null,
    recommendedQuantity: null,
    gmtCreate: null,
    gmtModified: null
  }
  proxy.resetForm("configRef")
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
  title.value = "添加平台促销配置"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _id = row.id || ids.value
  getConfig(_id).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改平台促销配置"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["configRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateConfig(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addConfig(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除平台促销配置编号为"' + _ids + '"的数据项？').then(function() {
    return delConfig(_ids)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('product/config/export', {
    ...queryParams.value
  }, `config_${new Date().getTime()}.xlsx`)
}

getList()
</script>
