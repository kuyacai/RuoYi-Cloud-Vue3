<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true">
      <el-form-item label="工作流名称" prop="workflowName">
        <el-input
          v-model="queryParams.workflowName"
          placeholder="请输入工作流名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="instanceList">
      <el-table-column
        label="工作流名称"
        align="center"
        prop="workflowName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="业务标签"
        align="center"
        prop="businessTag"
        width="120"
      />
      <el-table-column
        label="启动人"
        align="center"
        prop="creator"
        width="100"
      />
      <el-table-column label="当前进度" align="center" min-width="160">
        <template #default="scope">
          <div
            style="display: flex; flex-direction: column; align-items: center"
          >
            <span style="font-size: 12px; color: #909399; margin-bottom: 5px">
              {{ scope.row.currentNodeName }}
            </span>
            <el-progress
              :percentage="parseProgressToPercent(scope.row.progressText)"
              :stroke-width="18"
              :text-inside="true"
              :format="() => scope.row.progressText"
              :status="getProgressStatus(scope.row.status)"
              style="width: 100%"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="总体状态"
        align="center"
        prop="status"
        width="120"
      >
        <template #default="scope">
          <el-tag :type="getTagType(scope.row.status)">
            {{ scope.row.status?.label || "未知" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="开始时间"
        align="center"
        prop="createdAtUtc"
        width="180"
      />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-button
            link
            type="primary"
            icon="View"
            @click="handleDetail(scope.row)"
            >查看进度</el-button
          >
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

    <el-drawer v-model="detailOpen" title="工作流执行进度追踪" size="50%">
      <div v-if="activeInstanceNodes.length > 0" class="workflow-track">
        <el-steps :active="currentStepIndex" direction="vertical">
          <el-step
            v-for="node in activeInstanceNodes"
            :key="node.nodeInstanceId"
          >
            <template #title>
              <div class="step-title">
                <span class="font-bold">{{ node.nodeName }}</span>
                <el-tag
                  size="small"
                  :type="getTagType(node.status)"
                  style="margin-left: 10px"
                >
                  {{ node.status?.label }}
                </el-tag>
              </div>
            </template>
            <template #description>
              <div class="step-content">
                <p>
                  执行算子:
                  <el-tag size="small" effect="plain" type="info">{{
                    node.handlerType?.label
                  }}</el-tag>
                </p>

                <div
                  class="parameter-section"
                  style="
                    margin: 15px 0;
                    border: 1px solid #ebeef5;
                    border-radius: 4px;
                    padding: 10px;
                  "
                >
                  <div
                    class="param-header-box"
                    style="
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                      margin-bottom: 10px;
                      border-bottom: 1px solid #f0f0f0;
                      padding-bottom: 5px;
                    "
                  >
                    <span
                      style="font-weight: bold; font-size: 13px; color: #606266"
                      >输入参数配置</span
                    >
                    <div class="ops-btn">
                      <el-button
                        v-if="!node.isEditing"
                        link
                        type="primary"
                        icon="Edit"
                        @click="node.isEditing = true"
                        >编辑参数</el-button
                      >
                      <template v-else>
                        <el-button
                          link
                          type="success"
                          icon="Check"
                          @click="saveInputParams(node)"
                          >保存</el-button
                        >
                        <el-button
                          link
                          type="info"
                          icon="Close"
                          @click="node.isEditing = false"
                          >取消</el-button
                        >
                      </template>
                    </div>
                  </div>

                  <ParameterConfig
                    v-if="node.configSchema"
                    :key="node.nodeInstanceId + '_' + node.isEditing"
                    v-model="node.inputParams"
                    :schema="node.configSchema"
                    :mode="node.isEditing ? 'render' : 'readonly'"
                  />
                </div>

                <el-collapse accordion>
                  <el-collapse-item
                    title="原始 JSON 视图 (Input Context)"
                    name="1"
                  >
                    <pre class="json-box">{{
                      formatJson(node.inputParams)
                    }}</pre>
                  </el-collapse-item>
                  <el-collapse-item title="输出结果 (Output Data)" name="2">
                    <pre class="json-box">{{
                      formatJson(node.outputData)
                    }}</pre>
                  </el-collapse-item>
                  <el-collapse-item
                    v-if="node.errorMsg"
                    title="错误日志"
                    name="3"
                  >
                    <p class="error-text" style="color: #f56c6c">
                      {{ node.errorMsg }}
                    </p>
                  </el-collapse-item>
                </el-collapse>

                <div
                  class="op-bar"
                  style="
                    margin-top: 15px;
                    padding-top: 10px;
                    border-top: 1px dashed #eee;
                  "
                >
                  <el-button
                    v-if="node.status?.code === 'failed'"
                    type="danger"
                    icon="Refresh"
                    @click="handleRetry(node)"
                    >回滚重试</el-button
                  >

                  <template v-if="node.status?.code === 'awaiting_human'">
                    <el-button
                      type="success"
                      icon="Check"
                      @click="openManualDialog(node, 'complete')"
                      >标记完成</el-button
                    >
                  </template>
                </div>
              </div>
            </template>
          </el-step>
        </el-steps>
      </div>
      <el-empty v-else description="暂无节点执行数据" />
    </el-drawer>

    <el-dialog
      :title="manualDialog.title"
      v-model="manualDialog.open"
      width="600px"
      append-to-body
    >
      <el-form label-position="top">
        <el-alert
          :title="manualDialog.hint"
          type="info"
          show-icon
          :closable="false"
        />
        <el-form-item
          v-if="manualDialog.needInput"
          label="请确认或录入参数 (JSON)"
          style="margin-top: 20px"
        >
          <el-input
            v-model="manualDialog.form.data"
            type="textarea"
            :rows="8"
            style="font-family: monospace"
          />
        </el-form-item>
        <div v-else style="padding: 30px; text-align: center; color: #606266">
          该步骤仅需人工确认，点击“确定”标记完成并进入下一环节。
        </div>
      </el-form>
      <template #footer>
        <el-button
          type="primary"
          @click="submitManualProcess"
          :loading="manualDialog.loading"
          >确 定</el-button
        >
        <el-button @click="manualDialog.open = false">取 消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, getCurrentInstance } from "vue";
import { listInstance } from "@/api/product/instance";
import { getCapability } from "@/api/product/capability";
import {
  listNodeInstance,
  retryNode,
  completeManualNode,
  resumeCooperation,
  updateNodeInstance,
} from "@/api/product/nodeInstance";
import ParameterConfig from "@/components/ParameterConfig";

const { proxy } = getCurrentInstance();
const loading = ref(true);
const loadingDetail = ref(false);
const total = ref(0);
const instanceList = ref([]);
const detailOpen = ref(false);
const activeInstanceNodes = ref([]);

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  workflowName: undefined,
});

const manualDialog = reactive({
  open: false,
  mode: "complete", // 'complete' 或 'resume'
  title: "",
  loading: false,
  needInput: false,
  node: null,
  hint: "",
  form: { data: "{}" },
});

/** 状态色映射函数，修复 Invalid prop: type 报错 */
function getTagType(status) {
  if (!status) return "info";
  const code = typeof status === "string" ? status : status.code;
  const map = {
    success: "success",
    failed: "danger",
    running: "primary",
    awaiting_human: "warning",
    init: "info",
  };
  return map[code] || "info";
}

/** 进度条状态转换 */
function getProgressStatus(status) {
  if (status?.code === "success") return "success";
  if (status?.code === "failed") return "exception";
  return "";
}

/** 打开人工处理弹窗 */
function openManualDialog(node, mode) {
  manualDialog.node = node;
  manualDialog.mode = mode;
  manualDialog.title =
    mode === "complete"
      ? `人工节点确认 - ${node.nodeName}`
      : `协同处理结果提交 - ${node.nodeName}`;
  manualDialog.open = true;

  // 根据当前节点已有参数填充模板
  const template = node.inputParams || "{}";
  const templateObj =
    typeof template === "string" ? JSON.parse(template) : template;

  const keys = Object.keys(templateObj);
  manualDialog.needInput = keys.length > 0;
  manualDialog.form.data = JSON.stringify(templateObj, null, 2);
  manualDialog.hint = manualDialog.needInput
    ? `算子需要回填以下参数: ${keys.join(", ")}`
    : "此动作为纯人工确认，无需输入数据。";
}

/** 提交人工/协同处理逻辑 */
async function submitManualProcess() {
  let postData = {};
  if (manualDialog.needInput) {
    try {
      const parsed = JSON.parse(manualDialog.form.data);
      // 清理空值数据
      Object.keys(parsed).forEach((k) => {
        if (parsed[k] !== "" && parsed[k] !== null) postData[k] = parsed[k];
      });
    } catch (e) {
      return proxy.$modal.msgError("JSON格式不正确，请检查");
    }
  }

  manualDialog.loading = true;
  try {
    const nodeId = manualDialog.node.nodeInstanceId;
    if (manualDialog.mode === "complete") {
      await completeManualNode(nodeId, postData);
      proxy.$modal.msgSuccess("节点已标记完成");
    } else {
      await resumeCooperation(nodeId, postData);
      proxy.$modal.msgSuccess("数据已提交，流程已恢复");
    }
    manualDialog.open = false;
    handleDetail({ workflowInstanceId: manualDialog.node.workflowInstanceId });
  } finally {
    manualDialog.loading = false;
  }
}

/** 重试节点操作 */
function handleRetry(node) {
  proxy.$modal
    .confirm(`确认回滚并重试节点 [${node.nodeName}] 吗？`)
    .then(() => {
      return retryNode(node.nodeInstanceId);
    })
    .then(() => {
      proxy.$modal.msgSuccess("重试指令已下发");
      handleDetail({ workflowInstanceId: node.workflowInstanceId });
    });
}

/** 列表查询相关 */
function getList() {
  loading.value = true;
  listInstance(queryParams).then((response) => {
    instanceList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

function handleQuery() {
  queryParams.pageNum = 1;
  getList();
}

function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

/** 2. 修改 handleDetail 逻辑，增加编辑状态初始化 */
/** 修复后的查看进度逻辑 */
async function handleDetail(row) {
  loadingDetail.value = true;
  detailOpen.value = true;
  try {
    const res = await listNodeInstance({
      workflowInstanceId: row.workflowInstanceId,
    });
    const rawNodes = res.rows.sort((a, b) => a.nodeOrder - b.nodeOrder);

    // 并发获取 Schema 并构建响应式对象
    const nodePromises = rawNodes.map(async (node) => {
      const capRes = await getCapability(node.capabilityId);
      // 使用扩展运算符确保所有属性都被 Vue 追踪
      return {
        ...node,
        isEditing: false, // 必须在这里显式定义
        configSchema: capRes.data?.configSchema || { fields: [] },
      };
    });

    activeInstanceNodes.value = await Promise.all(nodePromises);
  } catch (e) {
    proxy.$modal.msgError("初始化节点数据失败");
  } finally {
    loadingDetail.value = false;
  }
}

/** 进度计算逻辑 */
const currentStepIndex = computed(() => {
  const lastSuccess = activeInstanceNodes.value.findLastIndex(
    (n) => n.status?.code === "success"
  );
  return lastSuccess + 1;
});

/** 3. 新增保存函数 */
function saveInputParams(node) {
  updateNodeInstance({
    nodeInstanceId: node.nodeInstanceId,
    inputParams: node.inputParams,
  }).then(() => {
    proxy.$modal.msgSuccess("运行时参数修改成功");
    node.isEditing = false;
  });
}

function parseProgressToPercent(text) {
  if (!text || !text.includes("/")) return 0;
  const [curr, tot] = text.split("/").map(Number);
  return tot === 0 ? 0 : Math.round((curr / tot) * 100);
}

function formatJson(val) {
  if (!val) return "{}";
  try {
    return JSON.stringify(
      typeof val === "string" ? JSON.parse(val) : val,
      null,
      2
    );
  } catch (e) {
    return val;
  }
}

getList();
</script>

<style scoped>
.workflow-track {
  padding: 10px;
}
.json-box {
  background: #2d2d2d;
  color: #ccc;
  padding: 10px;
  border-radius: 4px;
  font-size: 12px;
  overflow: auto;
  max-height: 200px;
}
.error-text {
  color: #f56c6c;
  font-size: 13px;
  font-family: monospace;
}
.running-status {
  color: #409eff;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
