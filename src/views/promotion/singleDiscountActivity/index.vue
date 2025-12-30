<template>
  <div class="app-container">
    <div class="toolbar">
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <!-- 搜索条件 -->
        <el-form-item label="活动名称">
          <el-input
            v-model="queryParams.activityName"
            placeholder="活动名称"
            clearable
            @keyup.enter.native="handleQuery"
            style="width: 200px"
          />
        </el-form-item>

        <el-form-item label="店铺ID">
          <el-input
            v-model="queryParams.shopId"
            placeholder="店铺ID"
            clearable
            @keyup.enter.native="handleQuery"
            style="width: 150px"
          />
        </el-form-item>

        <el-form-item label="平台ID">
          <el-input
            v-model="queryParams.platformActivityId"
            placeholder="平台活动ID"
            clearable
            @keyup.enter.native="handleQuery"
            style="width: 250px"
          />
        </el-form-item>
        <!-- 操作按钮 -->
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery"
            >搜索</el-button
          >
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleAdd"
            v-hasPermi="['promotion:singleDiscountActivity:add']"
            >新增</el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <div class="card-view-container">
      <el-row :gutter="8">
        <el-col
          v-for="item in activityList"
          :key="item.activityId"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="8"
        >
          <single-activity-card
            :activity-data="item"
            @edit="handleUpdate"
            @exportProduct="handleExportProduct"
            @importProduct="handleImportProduct"
          />
        </el-col>
      </el-row>

      <div v-if="activityList.length === 0 && !loading" class="empty-state">
        <el-empty description="暂无数据" />
      </div>
    </div>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改单品直降活动对话框 -->
    <el-dialog :title="title" v-model="open" width="600px">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        size="large"
      >
        <el-form-item label="活动名称" prop="activityName">
          <el-input v-model="form.activityName" placeholder="请输入活动名称" />
        </el-form-item>

        <el-form-item label="店铺ID" prop="shopId">
          <el-input v-model="form.shopId" placeholder="请输入店铺ID" />
        </el-form-item>

        <!-- 优惠类型绑定到 form.discountType -->
        <el-form-item label="优惠类型" prop="discountType">
          <el-radio-group v-model="form.discountType">
            <el-radio-button value="fixed_price">一口价</el-radio-button>
            <el-radio-button value="direct_deduction">立减</el-radio-button>
            <el-radio-button value="discount">折扣</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <!-- 开始时间 -->
        <el-form-item label="开始时间" prop="startTime">
          <el-col :span="11">
            <el-date-picker
              v-model="startDate"
              type="date"
              placeholder="请选择日期"
              style="width: 100%"
              @change="updateStartTime"
            />
          </el-col>
          <el-col class="text-center" :span="1" style="margin: 0 0.5rem"
            >-</el-col
          >
          <el-col :span="11">
            <el-time-picker
              v-model="startTime"
              placeholder="请选择时间"
              style="width: 100%"
              @change="updateStartTime"
            />
          </el-col>
        </el-form-item>

        <!-- 结束时间 -->
        <el-form-item label="结束时间" prop="endTime">
          <el-col :span="11">
            <el-date-picker
              v-model="endDate"
              type="date"
              placeholder="请选择日期"
              style="width: 100%"
              @change="updateEndTime"
            />
          </el-col>
          <el-col class="text-center" :span="1" style="margin: 0 0.5rem"
            >-</el-col
          >
          <el-col :span="11">
            <el-time-picker
              v-model="endTime"
              placeholder="请选择时间"
              style="width: 100%"
              @change="updateEndTime"
            />
          </el-col>
        </el-form-item>

        <el-form-item label="平台活动ID" prop="platformActivityId">
          <el-input
            v-model="form.platformActivityId"
            placeholder="请输入平台活动ID"
          />
        </el-form-item>

        <el-form-item label="备注" prop="notes">
          <el-input
            v-model="form.notes"
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 导入弹窗 -->
    <ElDialog
      v-model="importDialogVisible"
      :title="importDialogTitle"
      width="60%"
      top="5vh"
      :destroy-on-close="true"
      @closed="handleImportDialogClose"
    >
      <ImportPanel
        v-if="importDialogVisible"
        :type="currentImportType.type"
        :title="currentImportType.title"
        :import-api="currentImportType.importApi"
        :download-api="handleDownloadTemplate"
        :extra-fields="currentImportType.extraFields"
        :extra-params="currentImportType.extraParams"
        @import-success="handleImportSuccess"
      />
    </ElDialog>

    <!-- 导入结果弹窗 -->
    <ElDialog
      v-model="resultDialogVisible"
      title="导入结果"
      width="60%"
      :center="false"
    >
      <ElResult
        v-if="importResult"
        :icon="importResult.success ? 'success' : 'error'"
        :title="importResult.title"
        :sub-title="importResult.message"
      >
        <template #extra>
          <ElSpace v-if="importResult.data" direction="vertical" class="w-full">
            <ElAlert
              :title="`总计: ${importResult.data.total} 条 | 成功: ${importResult.data.success} 条 | 失败: ${importResult.data.failure} 条`"
              :type="importResult.data.failure > 0 ? 'warning' : 'success'"
              :closable="false"
              show-icon
            />

            <!-- 错误详情折叠面板 -->
            <ElCollapse v-if="importResult.data.errors?.length">
              <ElCollapseItem
                :title="`查看错误详情 (${importResult.data.errors.length})`"
              >
                <div class="max-h-60 overflow-y-auto">
                  <ElAlert
                    v-for="(error, idx) in importResult.data.errors"
                    :key="idx"
                    :title="error"
                    type="error"
                    :closable="false"
                    class="mb-2 text-xs"
                  />
                </div>
              </ElCollapseItem>
            </ElCollapse>
          </ElSpace>
        </template>
      </ElResult>

      <template #footer>
        <ElButton type="primary" @click="resultDialogVisible = false">
          确定
        </ElButton>
      </template>
    </ElDialog>
  </div>
</template>

<script setup name="SingleActivity">
import { ElMessage } from "element-plus";
import {
  listActivity,
  getActivity,
  delActivity,
  addActivity,
  updateActivity,
} from "@/api/promotion/singleDiscountActivity";
import SingleActivityCard from "@/components/SingleActivityCard/index.vue";
import ImportPanel from "@/components/ImportPanel/index.vue";
import * as importApi from "@/api/product/import";
import dayjs from "dayjs";
import {exportSingleDiscountProduct} from "@/api/promotion/singleDiscountActivity";
const { proxy } = getCurrentInstance();

// 响应式变量
const activityList = ref([]);
const open = ref(false);
const loading = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const viewMode = ref("card");

// 日期和时间选择器的独立变量
const startDate = ref("");
const startTime = ref("");
const endDate = ref("");
const endTime = ref("");

// 导入相关状态
const importDialogVisible = ref(false);
const resultDialogVisible = ref(false);
const importResult = ref(null);

// 当前导入配置
const currentImportType = reactive({
  type: "singlediscountproduct",
  title: "单品直降活动商品",
  importApi: importApi.importSingleDiscount,
  extraFields: [],
  extraParams: {},
});

// 导入弹窗标题
const importDialogTitle = ref("导入活动商品");

// 列配置（保持原样）
const columnsPerRow = {
  xs: 24, // 手机：1列
  sm: 12, // 平板：2列
  md: 8, // 桌面：3列
  lg: 8, // 大桌面：3列
  xl: 6, // 超大屏：4列
};

// 响应式数据对象
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    activityName: null,
    shopId: null,
    discountType: null,
    startTime: null,
    endTime: null,
    discountStatus: null,
    platformActivityId: null,
    notes: null,
    gmtCreate: null,
    gmtModified: null,
  },
  rules: {
    activityName: [
      { required: true, message: "活动名称不能为空", trigger: "blur" },
    ],
    shopId: [{ required: true, message: "店铺ID不能为空", trigger: "blur" }],
    startTime: [
      { required: true, message: "开始时间不能为空", trigger: "blur" },
    ],
    endTime: [{ required: true, message: "结束时间不能为空", trigger: "blur" }],
  },
});

const { queryParams, form, rules } = toRefs(data);

// 更新开始时间（合并日期和时间）
const updateStartTime = () => {
  if (startDate.value && startTime.value) {
    const dateStr = dayjs(startDate.value).format("YYYY-MM-DD");
    const timeStr = dayjs(startTime.value).format("HH:mm:ss");
    form.value.startTime = `${dateStr} ${timeStr}`;
  } else {
    form.value.startTime = "";
  }
};

// 更新结束时间（合并日期和时间）
const updateEndTime = () => {
  if (endDate.value && endTime.value) {
    const dateStr = dayjs(endDate.value).format("YYYY-MM-DD");
    const timeStr = dayjs(endTime.value).format("HH:mm:ss");
    form.value.endTime = `${dateStr} ${timeStr}`;
  } else {
    form.value.endTime = "";
  }
};

// 当表单数据回填时，拆分日期和时间
const splitDateTimeToComponents = () => {
  if (form.value.startTime) {
    try {
      const start = dayjs(form.value.startTime);
      startDate.value = start.toDate();
      startTime.value = start.toDate();
    } catch (e) {
      console.warn("解析开始时间失败:", e);
    }
  }

  if (form.value.endTime) {
    try {
      const end = dayjs(form.value.endTime);
      endDate.value = end.toDate();
      endTime.value = end.toDate();
    } catch (e) {
      console.warn("解析结束时间失败:", e);
    }
  }
};

/** 查询单品直降活动列表 */
function getList() {
  loading.value = true;
  listActivity(queryParams.value).then((response) => {
    activityList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  console.log("reset start");
  form.value = {
    activityId: null,
    activityName: null,
    shopId: null,
    discountType: "fixed_price",
    startTime: null,
    endTime: null,
    discountStatus: null,
    platformActivityId: null,
    notes: null,
    gmtCreate: null,
    gmtModified: null,
  };
  // 清空日期时间组件
  startDate.value = "";
  startTime.value = "";
  endDate.value = "";
  endTime.value = "";
  // 这里保持原样
  // 确保清除验证
  nextTick(() => {
    proxy.$refs.form?.clearValidate();
  });
  proxy.resetForm("formRef");
  console.log("reset end");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  // 这里保持原样
  console.log("resetQuery");
  proxy.resetForm("queryForm");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map((item) => item.activityId);
  single.value = selection.length !== 1;
  multiple.value = !selection.length;
}

// 卡片选择处理
function handleCardSelectionChange(item) {
  // 卡片模式下也可以实现多选，这里简化处理
  // 实际可以根据需求添加复选框到卡片组件
}

/** 新增按钮操作 */
function handleAdd() {
  console.log("handleAdd");
  reset();
  open.value = true;
  console.log("open value after set:", open.value); // 添加这行
  title.value = "添加单品直降活动";
  // 确保清除所有验证状态
  nextTick(() => {
    proxy.$refs.form?.clearValidate();
  });
  console.log("dialog should open now");
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const activityId = row.activityId || ids.value[0];
  getActivity(activityId).then((response) => {
    form.value = response.data;
    open.value = true;
    splitDateTimeToComponents();
    title.value = "修改单品直降活动";
  });
}

// 处理导出商品
const handleExportProduct = async (activityId) => {
  try {
    ElMessage.info("正在导出，请稍候...");

    const response = await exportSingleDiscountProduct({ 'activityId':activityId });

    // 创建下载链接
    const url = window.URL.createObjectURL(new Blob([response]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `activity_${activityId}_products.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    ElMessage.success("导出成功");
  } catch (error) {
    ElMessage.error("导出失败: " + (error.message || error));
  }
};

// 处理导入商品
const handleImportProduct = (activityId) => {
  // 设置额外的参数（activityId）
  currentImportType.extraParams = {
    activityId: String(activityId),
  };

  // 更新弹窗标题
  importDialogTitle.value = `导入活动商品 (活动ID: ${activityId})`;

  importDialogVisible.value = true;
};

// 下载模板处理函数
const handleDownloadTemplate = (type) => {
  // 如果当前有activityId，传递给模板下载
  const params = currentImportType.extraParams.activityId
    ? { activityId: currentImportType.extraParams.activityId }
    : {};

  return downloadTemplate(type, params);
};

// 处理导入成功
const handleImportSuccess = (response, title) => {
  importDialogVisible.value = false;

  importResult.value = {
    success: response.code === 200,
    title: `${title}导入完成`,
    message: response.msg || "导入成功",
    data: response.data,
  };

  resultDialogVisible.value = true;

  // 可以在这里刷新活动列表
  // fetchActivityList()
};

// 关闭导入弹窗
const handleImportDialogClose = () => {
  currentImportType.extraParams = {};
};

const formatDateTimeForBackend = (datetime) => {
  if (!datetime) return null;
  // 格式化为 ISO 8601
  return dayjs(datetime).toISOString();

  // 或者格式化为：2025-12-25T00:00:00
  // return dayjs(datetime).format('YYYY-MM-DDTHH:mm:ss')
};
/** 提交按钮 */
function submitForm() {
  // 这里保持原样
  proxy.$refs["formRef"].validate((valid) => {
    if (valid) {
      // 准备提交的数据
      const submitData = {
        ...form.value,
        startTime: formatDateTimeForBackend(form.value.startTime),
        endTime: formatDateTimeForBackend(form.value.endTime),
      };
      if (submitData.activityId != null) {
        updateActivity(submitData).then((response) => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addActivity(submitData).then((response) => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const activityIds = row.activityId || ids.value;
  proxy.$modal
    .confirm('是否确认删除单品直降活动编号为"' + activityIds + '"的数据项？')
    .then(function () {
      return delActivity(activityIds);
    })
    .then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
    })
    .catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download(
    "product/activity/export",
    {
      ...queryParams.value,
    },
    `activity_${new Date().getTime()}.xlsx`
  );
}

// 复制平台活动ID（表格视图使用）
function copyPlatformId(id) {
  if (!id) return;

  const textarea = document.createElement("textarea");
  textarea.value = id;
  document.body.appendChild(textarea);
  textarea.select();

  try {
    const successful = document.execCommand("copy");
    if (successful) {
      proxy.$message.success("已复制到剪贴板");
    } else {
      proxy.$message.error("复制失败");
    }
  } catch (err) {
    proxy.$message.error("复制失败");
  }

  document.body.removeChild(textarea);
}

// 组件加载时获取数据
getList();
</script>
