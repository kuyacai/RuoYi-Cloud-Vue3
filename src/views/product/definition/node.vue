<template>
  <div class="app-container">
    <div class="page-header">
      <el-page-header @back="goBack">
        <template #content>
          <span class="text-large font-600 mr-3"> 节点配置 </span>
          <el-tag type="primary" effect="plain">{{ workflowName }}</el-tag>
        </template>
      </el-page-header>
    </div>

    <el-divider />

    <div class="node-list-container">
      <el-row :gutter="20" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" icon="Plus" @click="openCapabilitySelect"
            >添加节点</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button type="success" icon="Sort" @click="handleAutoOrder"
            >自动排序</el-button
          >
        </el-col>
      </el-row>

      <div v-loading="loading" class="mt-4">
        <el-empty
          v-if="nodeList.length === 0"
          description="暂无节点，请点击上方按钮添加"
        />

        <div v-else class="nodes-wrapper">
          <div
            v-for="(node, index) in nodeList"
            :key="node.nodeDefId"
            class="node-item"
          >
            <div class="node-order-tag">{{ node.nodeOrder }}</div>
            <el-card class="node-card" shadow="hover">
              <template #header>
                <div class="card-header">
                  <span class="font-bold">{{ node.nodeName }}</span>
                  <div class="header-ops">
                    <el-tag size="small" type="info" class="mr-2">{{
                      node.capabilityId
                    }}</el-tag>
                    <el-button
                      link
                      type="primary"
                      icon="Edit"
                      @click="handleUpdate(node)"
                      >编辑</el-button
                    >
                    <el-button
                      link
                      type="danger"
                      icon="Delete"
                      @click="handleDelete(node)"
                      >删除</el-button
                    >
                  </div>
                </div>
              </template>
              <div class="node-body">
                <el-descriptions :column="2" size="small">
                  <el-descriptions-item label="执行类型">
                    <el-tag
                      :type="
                        node.handlerType?.code === 'python_agent'
                          ? 'success'
                          : 'warning'
                      "
                    >
                      {{ node.handlerType?.label || node.handlerType }}
                    </el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="人工干预">
                  <el-tag
                      :type="
                        node.manualStatus?.code === 'yes'
                          ? 'danger'
                          : 'success'
                      "
                    >
                      {{ node.manualStatus?.label || node.manualStatus }}
                    </el-tag>
                  
                </el-descriptions-item>
                </el-descriptions>
              </div>
            </el-card>
            <div v-if="index < nodeList.length - 1" class="node-connector">
              <el-icon><ArrowDown /></el-icon>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog title="选择能力" v-model="capSearchOpen" width="800px">
      <el-table
        :data="capabilityList"
        @row-click="onCapabilitySelected"
        highlight-current-row
        v-loading="capLoading"
      >
        <el-table-column property="capabilityId" label="能力标识" width="180" />
        <el-table-column property="name" label="能力名称" width="200" />
        <el-table-column
          property="handlerType"
          label="类型"
          width="120"
          align="center"
        />
        <el-table-column
          property="description"
          label="描述"
          show-overflow-tooltip
        />
      </el-table>
    </el-dialog>

    <el-dialog
      :title="nodeTitle"
      v-model="nodeEditOpen"
      width="650px"
      append-to-body
    >
      <el-form ref="nodeRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="节点名称" prop="nodeName">
          <el-input v-model="form.nodeName" placeholder="例如：翻译产品标题" />
        </el-form-item>
        <el-form-item label="排序序号" prop="nodeOrder">
          <el-input-number v-model="form.nodeOrder" :min="1" />
        </el-form-item>
        <el-form-item label="执行方式">
          <EnumRadioGroup
            v-model="form.handlerType"
            enum-name="HandlerType"
            button
          />
        </el-form-item>
        <el-form-item label="默认参数" prop="defaultParams">
          <el-input
            v-model="form.defaultParams"
            type="textarea"
            :rows="6"
            placeholder="JSON格式参数"
            style="font-family: monospace"
          />
        </el-form-item>
        <el-form-item label="输入映射" prop="inputMapping">
          <el-input
            v-model="form.inputMapping"
            type="textarea"
            :rows="3"
            placeholder='{"target": "prev_node.output"}'
            style="font-family: monospace"
          />
        </el-form-item>
        <el-form-item label="人工节点">
          <EnumRadioGroup
            v-model="form.manualStatus"
            enum-name="ManualStatus"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="nodeEditOpen = false">取 消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {
  listNode,
  getNode,
  addNode,
  updateNode,
  delNodeAndResort,
} from "@/api/product/nodeDefinition";
import { listCapability } from "@/api/product/capability";
import { useRoute, useRouter } from "vue-router";
import { ref, reactive, onMounted, getCurrentInstance, toRefs } from "vue";
import { ArrowDown } from "@element-plus/icons-vue";
import EnumRadioGroup from "@/components/EnumRadioGroup/index.vue";
const route = useRoute();
const router = useRouter();
const { proxy } = getCurrentInstance();

// 数据定义
const definitionId = ref(route.query.definitionId);
const workflowName = ref(route.query.workflowName);
const nodeList = ref([]);
const loading = ref(false);

const capabilityList = ref([]);
const capSearchOpen = ref(false);
const capLoading = ref(false);

const nodeEditOpen = ref(false);
const nodeTitle = ref("");

const data = reactive({
  form: {},
  rules: {
    nodeName: [
      { required: true, message: "节点名称不能为空", trigger: "blur" },
    ],
    nodeOrder: [{ required: true, message: "顺序不能为空", trigger: "blur" }],
  },
});
const { form, rules } = toRefs(data);

/** 1. 加载节点列表 */
function getList() {
  if (!definitionId.value) return;
  loading.value = true;
  listNode({ definitionId: definitionId.value }).then((res) => {
    nodeList.value = res.rows; // 后端已根据 nodeOrder 排序
    loading.value = false;
  });
}

/** 2. 添加节点 - 打开能力选择器 */
function openCapabilitySelect() {
  capLoading.value = true;
  capSearchOpen.value = true;
  listCapability().then((res) => {
    capabilityList.value = res.rows;
    capLoading.value = false;
  });
}

/** 3. 选中能力后的初始化 */
function onCapabilitySelected(cap) {
  reset();
  form.value.capabilityId = cap.capabilityId; // 必须传给后端
  form.value.definitionId = definitionId.value; // 必须传给后端
  form.value.nodeName = cap.name;

  // 继承能力算子的执行器类型和人工/自动状态
  //form.value.handlerType = cap.handlerType;
  //form.value.manualStatus = cap.manualStatus; // 初始设为能力算子的状态，用户可修改
  // 转换枚举对象为 code 字符串（你之前已处理）
  if (form.value.handlerType && typeof form.value.handlerType === "object") {
    cap.handlerType = cap.handlerType.code;
  }
  if (form.value.manualStatus && typeof form.value.manualStatus === "object") {
    cap.manualStatus = cap.manualStatus.code;
  }

  form.value.defaultParams = JSON.stringify(cap.configSchema || {}, null, 2);
  form.value.inputMapping = "{}";
  form.value.nodeOrder = nodeList.value.length + 1;

  capSearchOpen.value = false;
  nodeTitle.value = "新增节点配置";
  nodeEditOpen.value = true;
}

/** 4. 修改节点详情 */
/** 修改按钮操作 */
function handleUpdate(row) {
  reset(); // 重置表单，确保状态干净
  const nodeDefId = row.nodeDefId;
  
  getNode(nodeDefId).then(response => {
    const data = response.data;
    
    // 【核心修改】：处理枚举对象，提取 code 字符串
    // 处理执行类型
    if (data.handlerType && typeof data.handlerType === 'object') {
      data.handlerType = data.handlerType.code;
    }
    // 处理人工干预状态 (对应数据库 is_manual 字段)
    if (data.manualStatus && typeof data.manualStatus === 'object') {
      data.manualStatus = data.manualStatus.code;
    }
    // 如果有 activeStatus 也要处理
    if (data.activeStatus && typeof data.activeStatus === 'object') {
      data.activeStatus = data.activeStatus.code;
    }

    // 处理 JSON 字符串展示
    form.value = {
      ...data,
      defaultParams: JSON.stringify(data.defaultParams || {}, null, 2),
      inputMapping: JSON.stringify(data.inputMapping || {}, null, 2)
    };
    
    nodeTitle.value = "修改节点配置";
    nodeEditOpen.value = true;
  });
}

/** 5. 提交表单 (新增或修改) */
function submitForm() {
  proxy.$refs["nodeRef"].validate((valid) => {
    if (valid) {
      try {
        const postData = { ...form.value };
        // 确保这两个关键 ID 存在
        postData.definitionId = definitionId.value;
        postData.capabilityId = form.value.capabilityId;

        // 解析字符串回 JSON
        postData.defaultParams = JSON.parse(postData.defaultParams);
        postData.inputMapping = JSON.parse(postData.inputMapping);

        if (postData.nodeDefId != null) {
          updateNode(postData).then(() => {
            proxy.$modal.msgSuccess("修改成功");
            nodeEditOpen.value = false;
            getList();
          });
        } else {
          addNode(postData).then(() => {
            proxy.$modal.msgSuccess("新增成功");
            nodeEditOpen.value = false;
            getList();
          });
        }
      } catch (e) {
        proxy.$modal.msgError("JSON格式错误，请检查参数");
      }
    }
  });
}

/** 6. 删除节点 (调用重排接口) */
function handleDelete(node) {
  proxy.$modal
    .confirm(`是否确认删除节点 "${node.nodeName}"？删除后后续节点将自动前移。`)
    .then(() => {
      return delNodeAndResort(node.nodeDefId, definitionId.value);
    })
    .then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
    })
    .catch(() => {});
}

/** 7. 自动重排 (调用后端 resort 接口，如有) */
function handleAutoOrder() {
  // 此处可调用你之前在 Service 实现的 resort 逻辑
  proxy.$modal.msgInfo("系统已按当前顺序自动对齐");
  getList();
}

function reset() {
  form.value = {
    nodeDefId: undefined,
    definitionId: definitionId.value,
    nodeName: undefined,
    nodeOrder: 1,
    capabilityId: undefined,
    handlerType: "python_agent",
    manualStatus: "no",
    defaultParams: "{}",
    inputMapping: "{}",
  };
}

function goBack() {
  router.push("/workflow/definition");
}

onMounted(() => {
  getList();
});
</script>

<style scoped>
.node-list-container {
  padding: 20px;
  background: #f8f9fa;
  min-height: 500px;
  border-radius: 8px;
}
.nodes-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.node-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
.node-card {
  width: 600px;
  border-left: 5px solid #409eff;
}
.node-order-tag {
  background: #409eff;
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  text-align: center;
  line-height: 28px;
  margin-bottom: 10px;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.node-connector {
  margin: 10px 0;
  color: #c0c4cc;
  font-size: 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.mr-2 {
  margin-right: 8px;
}
</style>
