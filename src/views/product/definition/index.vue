<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="流程名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入流程名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="分类标签" prop="businessTag">
        <el-input
          v-model="queryParams.businessTag"
          placeholder="如: AI选品"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd">新增流程</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="definitionList">
      <el-table-column label="流程名称" align="left" prop="name" :show-overflow-tooltip="true" />
      <el-table-column label="业务分类" align="center" prop="businessTag">
        <template #default="scope">
          <el-tag v-if="scope.row.businessTag" effect="plain">{{ scope.row.businessTag }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="版本" align="center" prop="version" width="100">
        <template #default="scope">
          <el-tag type="info">v{{ scope.row.version }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="activeStatus">
        <template #default="scope">
          <el-tag :type="scope.row.activeStatus?.code === 'active' || scope.row.activeStatus?.code === 'enable' ? 'success' : 'info'">
            {{ scope.row.activeStatus?.label }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createdAtUtc" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createdAtUtc) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="240">
        <template #default="scope">
          <el-button link type="primary" icon="Operation" @click="handleNodeConfig(scope.row)">节点配置</el-button>
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button link type="danger" icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
          <el-button link type="primary" icon="VideoPlay" @click="handleStartWorkflow(scope.row)" v-hasPermi="['workflow:instance:add']">启动流程</el-button>
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

    <el-dialog :title="title" v-model="open" width="550px" append-to-body>
      <el-form ref="definitionRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="流程名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入工作流名称" />
        </el-form-item>
        <el-form-item label="业务分类" prop="businessTag">
          <el-input v-model="form.businessTag" placeholder="如: AI选品, 竞品监控" />
        </el-form-item>
        <el-form-item label="启用状态" prop="activeStatus">
          <EnumSwitch v-model="form.activeStatus" enum-name="ActiveStatus" />
        </el-form-item>
        <el-form-item label="工作流描述" prop="description">
          <el-input v-model="form.description" type="textarea" placeholder="请输入内容" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog :title="startDialog.title" v-model="startDialog.open" width="600px" append-to-body>
  <el-form :model="startDialog.form" label-width="80px">
    <el-alert
      v-if="startDialog.hint"
      title="首节点参数参考"
      type="info"
      :description="startDialog.hint"
      show-icon
      :closable="false"
      style="margin-bottom: 15px"
    />
    <el-form-item label="启动参数">
      <el-input
        v-model="startDialog.form.variables"
        type="textarea"
        :rows="10"
        placeholder='请输入 JSON 格式参数，例如: { "key": "value" }'
      />
    </el-form-item>
  </el-form>
  <template #footer>
    <div class="dialog-footer">
      <el-button type="primary" @click="submitStartWorkflow" :loading="startDialog.loading">立即启动</el-button>
      <el-button @click="startDialog.open = false">取 消</el-button>
    </div>
  </template>
</el-dialog>

  </div>
</template>

<script setup name="WorkflowDefinition">
import { listDefinition, getDefinition, delDefinition, addDefinition, updateDefinition,startWorkflow } from "@/api/product/definition";
import { listNode} from "@/api/product/nodeDefinition";
import { useRouter } from "vue-router";
import EnumSwitch from "@/components/EnumSwitch/index.vue";

const router = useRouter();
const { proxy } = getCurrentInstance();

const definitionList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    name: null,
    businessTag: null,
  },
  rules: {
    name: [{ required: true, message: "工作流名称不能为空", trigger: "blur" }],
  }
});

const { queryParams, form, rules } = toRefs(data);

// 1. 增加弹窗状态控制
const startDialog = reactive({
  open: false,
  title: "",
  loading: false,
  hint: "", // 存放第一个节点的参数提示
  row: null, // 存放当前操作的行数据
  form: {
    variables: "{}"
  }
});

/** 启动流程按钮操作 - 现在的逻辑是打开对话框 */
async function handleStartWorkflow(row) {
  startDialog.row = row;
  startDialog.title = `启动流程：${row.name}`;
  startDialog.form.variables = "{\n  \n}";
  startDialog.hint = "";
  
  // 智能提示逻辑：获取该流程的第一个节点定义
  try {
    // 我们通过 definitionId 查询节点，取 order 最小的一个
    const response = await listNode({ 
      definitionId: row.definitionId,
      pageNum: 1, 
      pageSize: 1 
    });
    
    if (response.rows && response.rows.length > 0) {
      const firstNode = response.rows[0];
      // 优先从 config_schema 获取提示，没有则用 defaultParams
      const schema = firstNode.configSchema || firstNode.defaultParams;
      if (schema) {
        startDialog.hint = `该流程首节点 [${firstNode.nodeName}] 接收以下参数结构：\n${JSON.stringify(schema, null, 2)}`;
      } else {
        startDialog.hint = `首节点 [${firstNode.nodeName}] 未配置特定的输入参数建议。`;
      }
    }
  } catch (e) {
    console.error("获取首节点定义失败", e);
  }

  startDialog.open = true;
}

/** 真正的提交启动逻辑 */
function submitStartWorkflow() {
  let params = {};
  try {
    params = JSON.parse(startDialog.form.variables);
  } catch (e) {
    proxy.$modal.msgError("JSON 格式错误，请检查后再启动");
    return;
  }

  startDialog.loading = true;
  startWorkflow(startDialog.row.definitionId, params).then(response => {
    startDialog.loading = false;
    startDialog.open = false;
    proxy.$modal.msgSuccess("流程启动成功");
    
    proxy.$confirm('流程已异步启动，是否立即前往“执行实例”页面查看进度？', '启动成功', {
      confirmButtonText: '前往查看',
      cancelButtonText: '留在原地',
      type: 'success'
    }).then(() => {
      router.push("/workflow/instance");
    });
  }).catch(() => {
    startDialog.loading = false;
  });
}

/** 查询列表 */
function getList() {
  loading.value = true;
  listDefinition(queryParams.value).then(response => {
    definitionList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
}

/** 表单重置 */
function reset() {
  form.value = {
    definitionId: null,
    name: null,
    description: null,
    businessTag: null,
    activeStatus: 'enable'
  };
  proxy.resetForm("definitionRef");
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

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加工作流定义";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _definitionId = row.definitionId;
  getDefinition(_definitionId).then(response => {
    const data = response.data;
    // 枚举拆箱处理
    if (data.activeStatus && typeof data.activeStatus === 'object') {
        data.activeStatus = data.activeStatus.code;
    }
    form.value = data;
    open.value = true;
    title.value = "修改工作流定义";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["definitionRef"].validate(valid => {
    if (valid) {
      const submitData = { ...form.value };
      // 提交前再次确保枚举值是 code 字符串
      if (typeof submitData.activeStatus === 'object') {
          submitData.activeStatus = submitData.activeStatus.code;
      }

      if (submitData.definitionId != null) {
        updateDefinition(submitData).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addDefinition(submitData).then(response => {
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
  const _definitionIds = row.definitionId;
  const _name = row.name;
  proxy.$modal.confirm('是否确认删除名称为 "' + _name + '" 的工作流定义？').then(function() {
    return delDefinition(_definitionIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 节点配置跳转 */
function handleNodeConfig(row) {
  router.push({
    path: "/workflow/node-definition", 
    query: { 
      definitionId: row.definitionId,
      workflowName: row.name 
    }
  });
}

getList();

</script>