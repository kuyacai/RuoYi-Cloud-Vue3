<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
      <el-form-item label="实例ID" prop="workflowInstanceId">
        <el-input v-model="queryParams.workflowInstanceId" placeholder="请输入实例ID" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="instanceList">
      <el-table-column label="工作流实例ID" align="center" prop="workflowInstanceId" />
      <el-table-column label="当前节点" align="center" prop="currentNodeId" />
      <el-table-column label="总体状态" align="center" prop="status">
        <template #default="scope">
          <el-tag :type="statusDict[scope.row.status]?.type">{{ statusDict[scope.row.status]?.label }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="View" @click="handleDetail(scope.row)">查看进度</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />

    <el-drawer v-model="detailOpen" title="工作流执行进度追踪" size="50%">
      <div v-if="activeInstanceNodes.length > 0" class="workflow-track">
        <el-steps :active="currentStepIndex" direction="vertical" finish-status="success">
          <el-step v-for="(node, index) in activeInstanceNodes" :key="node.taskNodeId">
            <template #title>
              <div class="step-title">
                <span>{{ node.nodeType }}</span>
                <el-tag size="small" :type="statusDict[node.status]?.type" style="margin-left: 10px">
                  {{ statusDict[node.status]?.label }}
                </el-tag>
              </div>
            </template>
            <template #description>
              <div class="step-content">
                <p>执行器: <el-tag size="small" effect="plain">{{ node.handlerType }}</el-tag></p>
                
                <el-collapse accordion>
                  <el-collapse-item title="输入参数 (Input)" name="1">
                    <pre class="json-box">{{ formatJson(node.inputParams) }}</pre>
                  </el-collapse-item>
                  <el-collapse-item title="输出结果 (Output)" name="2">
                    <pre class="json-box">{{ formatJson(node.outputData) }}</pre>
                  </el-collapse-item>
                  <el-collapse-item v-if="node.errorMsg" title="错误堆栈" name="3">
                    <p class="error-text">{{ node.errorMsg }}</p>
                  </el-collapse-item>
                </el-collapse>

                <div v-if="node.status === 'failed'" class="retry-bar">
                  <el-button type="danger" size="small" icon="Refresh" @click="handleRetry(node)">在该节点重试</el-button>
                </div>
              </div>
            </template>
          </el-step>
        </el-steps>
      </div>
      <el-empty v-else description="暂无节点数据" />
    </el-drawer>
  </div>
</template>

<script setup>
import { listInstance, retryNode } from "@/api/product/instance"; // 引用你提供的 JS 文件
const { proxy } = getCurrentInstance();

const loading = ref(true);
const instanceList = ref([]);
const detailOpen = ref(false);
const activeInstanceNodes = ref([]);
const total = ref(0);

// 状态字典映射
const statusDict = {
  'pending': { label: '等待中', type: 'info' },
  'running': { label: '运行中', type: 'warning' },
  'success': { label: '成功', type: 'success' },
  'failed': { label: '失败', type: 'danger' },
  'awaiting_human': { label: '待人工', type: 'primary' }
};

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  workflowInstanceId: undefined
});

/** 查询列表 */
function getList() {
  loading.value = true;
  listInstance(queryParams).then(response => {
    // 假设后端返回的是实例维度的聚合数据
    instanceList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

/** 查看详情：获取该实例下的所有节点明细 */
function handleDetail(row) {
  // 这里需要后端提供一个接口，根据 workflowInstanceId 返回其所有 WfNodeInstance
  // 临时使用列表数据模拟，实际应调用接口
  loading.value = true;
  listInstance({ workflowInstanceId: row.workflowInstanceId }).then(res => {
    activeInstanceNodes.value = res.rows.sort((a, b) => a.nodeOrder - b.nodeOrder);
    detailOpen.value = true;
    loading.value = false;
  });
}

/** 计算当前步骤激活索引 */
const currentStepIndex = computed(() => {
  const lastSuccess = activeInstanceNodes.value.findLastIndex(n => n.status === 'success');
  return lastSuccess + 1;
});

/** JSON 格式化展示 */
function formatJson(val) {
  if (!val) return "{}";
  try {
    return JSON.stringify(typeof val === 'string' ? JSON.parse(val) : val, null, 2);
  } catch (e) {
    return val;
  }
}

/** 重试节点操作 */
function handleRetry(node) {
  proxy.$modal.confirm('确认重新触发此算子执行吗？').then(() => {
    return retryNode(node.taskNodeId);
  }).then(() => {
    proxy.$modal.msgSuccess("重试指令已下发");
    detailOpen.value = false;
    getList();
  });
}

function handleQuery() { getList(); }
function resetQuery() { proxy.resetForm("queryRef"); handleQuery(); }

getList();
</script>

<style scoped>
.workflow-track {
  padding: 20px;
}
.json-box {
  background: #282c34;
  color: #abb2bf;
  padding: 10px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 12px;
  overflow-x: auto;
}
.error-text {
  color: #f56c6c;
  font-size: 13px;
  background: #fef0f0;
  padding: 8px;
  border-left: 4px solid #f56c6c;
}
.retry-bar {
  margin-top: 10px;
  text-align: right;
}
.step-title {
  display: flex;
  align-items: center;
}
</style>