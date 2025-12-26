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
      <el-form-item label="商品ID" prop="goodsId">
        <el-input
          v-model="queryParams.goodsId"
          placeholder="请输入商品ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="SKU ID" prop="goodsSkuId">
        <el-input
          v-model="queryParams.goodsSkuId"
          placeholder="请输入SKU ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="排序位置" prop="position">
        <el-input
          v-model="queryParams.position"
          placeholder="请输入排序位置"
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
          v-hasPermi="['product:image:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['product:image:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['product:image:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['product:image:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="imageList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="图片ID" align="center" prop="imageId" />
      <el-table-column label="版本ID" align="center" prop="revisionId" />
      <el-table-column label="商品ID" align="center" prop="goodsId" />
      <el-table-column label="SKU ID" align="center" prop="goodsSkuId" />
      <el-table-column label="图片类型" align="center" prop="imageType" />
      <el-table-column label="来源URL" align="center" prop="sourceUrl" />
      <el-table-column label="自建URL" align="center" prop="selfUrl" />
      <el-table-column label="本地URI" align="center" prop="localUri" />
      <el-table-column label="排序位置" align="center" prop="position" />
      <el-table-column label="创建时间" align="center" prop="gmtCreate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.gmtCreate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['product:image:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['product:image:remove']">删除</el-button>
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

    <!-- 添加或修改goods 图片对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="imageRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="版本ID" prop="revisionId">
          <el-input v-model="form.revisionId" placeholder="请输入版本ID" />
        </el-form-item>
        <el-form-item label="商品ID" prop="goodsId">
          <el-input v-model="form.goodsId" placeholder="请输入商品ID" />
        </el-form-item>
        <el-form-item label="SKU ID" prop="goodsSkuId">
          <el-input v-model="form.goodsSkuId" placeholder="请输入SKU ID" />
        </el-form-item>
        <el-form-item label="来源URL" prop="sourceUrl">
          <el-input v-model="form.sourceUrl" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="自建URL" prop="selfUrl">
          <el-input v-model="form.selfUrl" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="本地URI" prop="localUri">
          <el-input v-model="form.localUri" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="排序位置" prop="position">
          <el-input v-model="form.position" placeholder="请输入排序位置" />
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

<script setup name="Image">
import { listImage, getImage, delImage, addImage, updateImage } from "@/api/product/image"

const { proxy } = getCurrentInstance()

const imageList = ref([])
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
    goodsId: null,
    goodsSkuId: null,
    imageType: null,
    sourceUrl: null,
    selfUrl: null,
    localUri: null,
    position: null,
    gmtCreate: null
  },
  rules: {
    revisionId: [
      { required: true, message: "版本ID不能为空", trigger: "blur" }
    ],
    goodsId: [
      { required: true, message: "商品ID不能为空", trigger: "blur" }
    ],
    imageType: [
      { required: true, message: "图片类型不能为空", trigger: "change" }
    ],
    sourceUrl: [
      { required: true, message: "来源URL不能为空", trigger: "blur" }
    ],
    position: [
      { required: true, message: "排序位置不能为空", trigger: "blur" }
    ],
    gmtCreate: [
      { required: true, message: "创建时间不能为空", trigger: "blur" }
    ]
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询goods 图片列表 */
function getList() {
  loading.value = true
  listImage(queryParams.value).then(response => {
    imageList.value = response.rows
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
    imageId: null,
    revisionId: null,
    goodsId: null,
    goodsSkuId: null,
    imageType: null,
    sourceUrl: null,
    selfUrl: null,
    localUri: null,
    position: null,
    gmtCreate: null
  }
  proxy.resetForm("imageRef")
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
  ids.value = selection.map(item => item.imageId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加goods 图片"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _imageId = row.imageId || ids.value
  getImage(_imageId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改goods 图片"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["imageRef"].validate(valid => {
    if (valid) {
      if (form.value.imageId != null) {
        updateImage(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addImage(form.value).then(response => {
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
  const _imageIds = row.imageId || ids.value
  proxy.$modal.confirm('是否确认删除goods 图片编号为"' + _imageIds + '"的数据项？').then(function() {
    return delImage(_imageIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('product/image/export', {
    ...queryParams.value
  }, `image_${new Date().getTime()}.xlsx`)
}

getList()
</script>
