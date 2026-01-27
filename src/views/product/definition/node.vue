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
                        node.manualStatus?.code === 'yes' ? 'danger' : 'success'
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
      width="700px"
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

        <el-divider content-position="left">业务参数配置</el-divider>
        <ParameterConfig
          v-model="form.defaultParams"
          :schema="currentCapabilitySchema"
          mode="render"
          @select-variable="handleSelectVariable"
        />

        <el-divider content-position="left">高级设置</el-divider>
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

    <el-dialog
      title="选择上游变量"
      v-model="varPickerOpen"
      width="600px"
      append-to-body
    >
      <div class="variable-picker-list">
        <div
          v-for="pNode in availablePrevNodes"
          :key="pNode.nodeOrder"
          class="p-node-group"
        >
          <div class="p-node-header">
            <el-tag size="small">节点 {{ pNode.nodeOrder }}</el-tag>
            <span class="ml-2 font-bold">{{ pNode.nodeName }}</span>
          </div>
          <div class="field-list">
            <el-button
              link
              type="primary"
              @click="doInsert(pNode.nodeOrder, 'data')"
            >
              全部输出 (data)
            </el-button>
            <template
              v-if="
                pNode.outputSchemaFields && pNode.outputSchemaFields.length > 0
              "
            >
              <el-button
                v-for="f in pNode.outputSchemaFields"
                :key="f.name"
                link
                type="success"
                @click="doInsert(pNode.nodeOrder, f.name)"
              >
                {{ f.label }} ({{ f.name }})
              </el-button>
            </template>
          </div>
        </div>
      </div>
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
import { listCapability, getCapability } from "@/api/product/capability";
import { useRoute, useRouter } from "vue-router";
import {
  ref,
  reactive,
  onMounted,
  getCurrentInstance,
  toRefs,
  computed,
} from "vue";
import { ArrowDown } from "@element-plus/icons-vue";
import EnumRadioGroup from "@/components/EnumRadioGroup/index.vue";
import ParameterConfig from "@/components/ParameterConfig";

const route = useRoute();
const router = useRouter();
const { proxy } = getCurrentInstance();

// 基础响应式数据
const definitionId = ref(route.query.definitionId);
const workflowName = ref(route.query.workflowName);
const nodeList = ref([]);
const loading = ref(false);
const capabilityList = ref([]);
const capSearchOpen = ref(false);
const capLoading = ref(false);
const nodeEditOpen = ref(false);
const nodeTitle = ref("");
const currentCapabilitySchema = ref({ fields: [] });

// 变量拾取控制
const varPickerOpen = ref(false);
const currentFieldPath = ref("");
const availablePrevNodes = computed(() => {
  return nodeList.value.filter(
    (n) => n.nodeOrder < (form.value.nodeOrder || 999)
  );
});

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

/** 1. 加载节点列表时，关联获取 output_schema */
function getList() {
  if (!definitionId.value) return;
  loading.value = true;
  listNode({ definitionId: definitionId.value }).then(async (res) => {
    const nodes = res.rows;
    // 并行获取每个节点的能力定义，以获取 output_schema 
    for (let node of nodes) {
      const capRes = await getCapability(node.capabilityId);
      node.outputSchemaFields = capRes.data.outputSchema?.fields || [];
    }
    nodeList.value = nodes;
    loading.value = false;
  });
}

/** 打开能力选择 */
function openCapabilitySelect() {
  capLoading.value = true;
  capSearchOpen.value = true;
  listCapability().then((res) => {
    capabilityList.value = res.rows;
    capLoading.value = false;
  });
}

/** 选中能力初始化 */
function onCapabilitySelected(cap) {
  reset();
  form.value.capabilityId = cap.capabilityId;
  form.value.nodeName = cap.name;
  currentCapabilitySchema.value = cap.configSchema || { fields: [] };
  form.value.defaultParams = {};
  form.value.inputMapping = {};
  form.value.nodeOrder = nodeList.value.length + 1;
  capSearchOpen.value = false;
  nodeTitle.value = "新增节点配置";
  nodeEditOpen.value = true;
}

/** 编辑详情回显 [cite: 38, 39] */
function handleUpdate(row) {
  reset();
  getNode(row.nodeDefId).then((response) => {
    const d = response.data;
    getCapability(d.capabilityId).then((capRes) => {
      currentCapabilitySchema.value = capRes.data.configSchema || {
        fields: [],
      };
      // 字段转换处理
      form.value = {
        ...d,
        handlerType: d.handlerType?.code || d.handlerType,
        manualStatus: d.manualStatus?.code || d.manualStatus,
        defaultParams: d.defaultParams || {},
        inputMapping: d.inputMapping || {},
      };
      nodeTitle.value = "修改节点配置";
      nodeEditOpen.value = true;
    });
  });
}

/** 核心提交逻辑：处理 definitionId 缺失与 inputMapping 自动生成 [cite: 41] */
/** 5. 提交表单 */
function submitForm() {
  proxy.$refs["nodeRef"].validate((valid) => {
    if (valid) {
      const postData = JSON.parse(JSON.stringify(form.value)); // 深拷贝
      postData.definitionId = definitionId.value;

      // 递归提取所有包含 #{} 的映射关系
      const mapping = {};
      const extractMapping = (obj, prefix = '') => {
        if (!obj || typeof obj !== 'object') return;
        
        Object.keys(obj).forEach(key => {
          const val = obj[key];
          const fullPath = prefix ? `${prefix}.${key}` : key;
          
          if (typeof val === 'string' && val.includes('#{')) {
            mapping[fullPath] = val; // 记录路径和表达式
          } else if (typeof val === 'object' && val !== null) {
            extractMapping(val, fullPath);
          }
        });
      };

      extractMapping(postData.defaultParams);
      postData.inputMapping = mapping; // 此时 mapping 将包含 {"aa.bb.b1": "#{#node6['price']}"}

      const action = postData.nodeDefId != null ? updateNode : addNode;
      action(postData).then(() => {
        proxy.$modal.msgSuccess("操作成功");
        nodeEditOpen.value = false;
        getList();
      });
    }
  });
}
/** 变量拾取处理 */
function handleSelectVariable(path) {
  currentFieldPath.value = path;
  varPickerOpen.value = true;
}

function insertVariable(order) {
  const expression = `#{#node${order}['data']}`;
  // 简易深层赋值逻辑
  const keys = currentFieldPath.value.split(".");
  let curr = form.value.defaultParams;
  keys.forEach((key, i) => {
    if (i === keys.length - 1) curr[key] = expression;
    else {
      if (!curr[key]) curr[key] = {};
      curr = curr[key];
    }
  });
  varPickerOpen.value = false;
}

function handleDelete(node) {
  proxy.$modal
    .confirm(`确认删除节点 "${node.nodeName}"？`)
    .then(() => {
      return delNodeAndResort(node.nodeDefId, definitionId.value);
    })
    .then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
    });
}

function handleAutoOrder() {
  getList();
}

/** 插入变量逻辑修改 */
function doInsert(order, fieldName) {
  // 生成格式：#{#node6['price']} 或 #{#node6['data']}
  const expression = `#{#node${order}['${fieldName}']}`;
  
  // 递归赋值给 defaultParams 中的深层对象
  const keys = currentFieldPath.value.split('.');
  let curr = form.value.defaultParams;
  keys.forEach((key, i) => {
    if (i === keys.length - 1) {
      curr[key] = expression;
    } else {
      if (!curr[key]) curr[key] = {};
      curr = curr[key];
    }
  });
  varPickerOpen.value = false;
}

function reset() {
  form.value = {
    nodeDefId: undefined,
    definitionId: definitionId.value, // [cite: 44]
    nodeName: undefined,
    nodeOrder: 1,
    capabilityId: undefined,
    handlerType: "python_agent",
    manualStatus: "no",
    defaultParams: {},
    inputMapping: {},
  };
}

function goBack() {
  router.push("/workflow/definition");
}
onMounted(() => getList());
</script>

<style scoped>
/* [cite: 45, 46, 47, 48, 49] */
.node-list-container {
  padding: 20px;
  background: #f8f9fa;
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
.var-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #eee;
}
.ml-2 {
  margin-left: 8px;
}
</style>
