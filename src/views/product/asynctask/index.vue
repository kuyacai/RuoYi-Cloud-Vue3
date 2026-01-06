<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryRef"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="任务编码" prop="taskCode">
        <el-input
          v-model="queryParams.taskCode"
          placeholder="请输入任务编码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="完成时间" prop="finishTime">
        <el-date-picker
          clearable
          v-model="queryParams.finishTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择完成时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="taskList">
      <!-- 1. 序号列 -->
      <el-table-column label="序号" align="center" width="70">
        <template #default="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>

      <!-- 任务名称 -->
      <el-table-column label="任务名称" align="center" prop="taskName" />

      <!-- 店铺ID -->
      <el-table-column label="店铺ID" align="center" prop="shopId" />

      <!-- 文件名（可下载） -->
      <el-table-column label="文件名" align="center" width="400">
        <template #default="scope">
          <a :href="scope.row.fileName" download>
            {{ scope.row.fileName.split("/").pop() }}
          </a>
        </template>
      </el-table-column>

      <!-- 其余统计列 -->
      <el-table-column label="总数" align="center" prop="total" />
      <el-table-column label="重复数" align="center" prop="duplicate" />
      <el-table-column label="成功数" align="center" prop="success" />
      <el-table-column label="跳过数" align="center" prop="skip" />
      <el-table-column label="失败数" align="center" prop="failure" />

      <!-- 失败文件URL（可下载） -->
      <el-table-column label="失败文件" align="center">
        <template #default="scope">
          <a
            v-if="scope.row.failFileUrl"
            :href="scope.row.failFileUrl"
            download
          >
            下载
          </a>
          <span v-else>-</span>
        </template>
      </el-table-column>

      <!-- 失败文件URL（可下载） -->
      <el-table-column label="导出文件" align="center">
        <template #default="scope">
          <a
            v-if="scope.row.exportedFileUrl"
            :href="scope.row.exportedFileUrl"
            download
          >
            下载
          </a>
          <span v-else>-</span>
        </template>
      </el-table-column>

      <!-- 任务状态 -->
      <el-table-column label="任务状态" align="center" prop="taskStatus">
        <template #default="scope">
          {{ formatTaskStatus(scope.row.taskStatus) }}
        </template>
      </el-table-column>
      <!-- 完成时间 -->
      <el-table-column
        label="完成时间"
        align="center"
        prop="finishTime"
        width="180"
      >
        <template #default="scope">
          <span>{{
            scope.row.finishTime ? parseTime(scope.row.finishTime) : "-"
          }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改异步任务对话框 -->
  </div>
</template>

<script setup name="Task">
import { listTask } from "@/api/product/asynctask";
import { productEnumService } from "@/api/product/enumService";
const { proxy } = getCurrentInstance();

const taskList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 100,
    taskCode: null,
    taskName: null,
    fileName: null,
    total: null,
    success: null,
    skip: null,
    failure: null,
    failFileUrl: null,
    taskStatus: null,
    finishTime: null,
  },
  rules: {
    taskCode: [
      { required: true, message: "任务编码不能为空", trigger: "blur" },
    ],
  },
});

const { queryParams, form, rules } = toRefs(data);

// 预加载枚举数据
const loadEnums = async () => {
  try {
    await productEnumService.preloadCommonEnums(["AsyncTaskStatus"]);
  } catch (error) {
    console.error("枚举数据加载失败:", error);
  }
};

loadEnums();

/** 查询异步任务列表 */
function getList() {
  loading.value = true;
  listTask(queryParams.value).then((response) => {
    taskList.value = response.rows;
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
  form.value = {
    taskId: null,
    taskCode: null,
    taskName: null,
    fileName: null,
    total: null,
    success: null,
    skip: null,
    failure: null,
    failFileUrl: null,
    taskStatus: null,
    createBy: null,
    createTime: null,
    finishTime: null,
  };
  proxy.resetForm("taskRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 格式化任务状态
function formatTaskStatus(status) {
  if (!status) return "-";

  // 如果是枚举对象
  if (typeof status === "object") {
    return status.label || status.desc || status.name || "";
  }

  // 如果是字符串/数字，尝试从枚举服务获取
  return productEnumService.getLabel("AsyncTaskStatus", String(status));
}

getList();
</script>
