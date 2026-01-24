<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryRef"
      :inline="true"
      v-show="showSearch"
      label-width="80px"
    >
      <el-form-item label="能力名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="如: Python数据采集"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="执行方式" prop="handlerType">
        <EnumSelect v-model="queryParams.handlerType" enum-name="HandlerType" />
      </el-form-item>

      <el-form-item label="状态" prop="activeStatus">
        <EnumSelect
          v-model="queryParams.activeStatus"
          enum-name="ActiveStatus"
          placeholder="能力状态"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery"
          >搜索</el-button
        >
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
          v-hasPermi="['product:capability:add']"
          >新增算子</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['product:capability:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['product:capability:remove']"
          >删除</el-button
        >
      </el-col>
      <right-toolbar
        v-model:showSearch="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="capabilityList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="能力标识(ID)"
        align="center"
        prop="capabilityId"
      />
      <el-table-column label="能力名称" align="center" prop="name" />
      <el-table-column label="执行方式" align="center" prop="handlerType">
        <template #default="scope">
          <el-tag
            :type="
              scope.row.handlerType?.code === 'python_agent'
                ? 'success'
                : 'warning'
            "
          >
            {{ scope.row.handlerType?.label }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="activeStatus">
        <template #default="scope">
          <el-tag
            :type="
              scope.row.activeStatus?.code === 'active' ? 'primary' : 'danger'
            "
          >
            {{ scope.row.activeStatus?.label }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="默认参数 (JSON)"
        align="center"
        prop="defaultParams"
        :show-overflow-tooltip="true"
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
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['product:capability:edit']"
            >修改</el-button
          >
          <el-button
            link
            type="primary"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['product:capability:remove']"
            >删除</el-button
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

    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form
        ref="capabilityRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="能力标识" prop="capabilityId">
          <el-input
            v-model="form.capabilityId"
            placeholder="如: keyword_import"
            :disabled="!!originCapabilityId"
            @input="handleIdInput"
          />
          <div class="help-block" style="color: #999; font-size: 12px">
            * 重要：此标识需与 Python 端的映射 Key 保持一致
          </div>
        </el-form-item>
        <el-form-item label="能力名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入能力显示名称" />
        </el-form-item>
        <el-form-item label="执行方式" prop="handlerType">
          <EnumRadioGroup
            v-model="form.handlerType"
            enum-name="HandlerType"
            button
          />
        </el-form-item>
        <el-form-item label="执行模式">
          <EnumRadioGroup
            v-model="form.manualStatus"
            enum-name="ManualStatus"
          />
        </el-form-item>
        <el-form-item label="默认参数" prop="defaultParams">
          <el-input
            v-model="form.defaultParams"
            type="textarea"
            placeholder='请输入 JSON 格式参数, 例如: {"limit": 100}'
            :rows="5"
          />
        </el-form-item>
        <el-form-item label="激活状态" prop="activeStatus">
          <EnumSwitch
            v-model="form.activeStatus"
            enum-name="ActiveStatus"
          />
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

<script setup name="Capability">
import {
  listCapability,
  getCapability,
  delCapability,
  addCapability,
  updateCapability,
  checkCapabilityIdUnique,
} from "@/api/product/capability";
import EnumSelect from "@/components/EnumSelect/index.vue";
import EnumRadioGroup from "@/components/EnumRadioGroup/index.vue";
import EnumSwitch from "@/components/EnumSwitch/index.vue";

const { proxy } = getCurrentInstance();

const capabilityList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const capabilityIds = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");


/** 自定义校验规则：校验标识格式和唯一性 */
const validateCapabilityId = (rule, value, callback) => {
  const reg = /^[a-zA-Z0-9_]+$/;
  if (!value) {
    callback(new Error("能力标识不能为空"));
  } else if (!reg.test(value)) {
    callback(new Error("标识仅允许英文、数字和下划线"));
  } else {
    // 【核心逻辑修改】
    // 1. 如果当前输入的值 等于 刚才 handleUpdate 时记录的原始值，说明是修改本人，直接通过
    if (originCapabilityId.value && value === originCapabilityId.value) {
      callback();
      return;
    }

    // 2. 否则（说明是新增，或者是改成了别的名字），去数据库查重
    checkCapabilityIdUnique(value).then((response) => {
      // 假设后端返回 false 表示数据库已存在此 ID
      if (response.data === false) {
        callback(new Error("该标识已存在，请更换"));
      } else {
        callback();
      }
    });
  }
};


const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    name: null,
    handlerType: null,
    activeStatus: null,
  },
  rules: {
    capabilityId: [
      { required: true, validator: validateCapabilityId, trigger: "blur" },
    ],
    name: [{ required: true, message: "名称不能为空", trigger: "blur" }],
    handlerType: [
      { required: true, message: "执行方式不能为空", trigger: "change" },
    ],
  },
});

const { queryParams, form, rules } = toRefs(data);
const originCapabilityId = ref("");

/** 查询列表 */
function getList() {
  loading.value = true;
  listCapability(queryParams.value).then((response) => {
    capabilityList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

const handleIdInput = (val) => {
  // 仅在新增模式下处理，强制转小写并过滤非法字符
  if (!originCapabilityId.value) {
    form.value.capabilityId = val.toLowerCase().replace(/[^a-z0-9_]/g, '');
  }
};

function cancel() {
  open.value = false;
  reset();
}

function reset() {
  form.value = {
    capabilityId: undefined,
    name: undefined,
    handlerType: "python_agent",
    manualStatus: "no",
    defaultParams: "{}",
    activeStatus: "enable",
  };
  // 重置校验残余
  if (proxy.$refs["capabilityRef"]) {
    proxy.$refs["capabilityRef"].resetFields();
  }
  // 【关键】重置原始标识，让输入框恢复为可编辑状态
  originCapabilityId.value = "";
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

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  capabilityIds.value = selection.map((item) => item.capabilityId); // 注意这里用数据库主键id
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
/** 新增按钮操作 */
function handleAdd() {
  reset();
  originCapabilityId.value = ""; // 清空，确保新增模式走查重逻辑
  open.value = true;
  title.value = "添加节点能力元数据";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  // 此时 row.capabilityId 是肯定有值的
  const _capabilityId = row.capabilityId || capabilityIds.value;
  getCapability(_capabilityId).then(response => {
    const data = response.data;
    
    // 转换枚举对象为 code 字符串（你之前已处理）
    if (data.handlerType && typeof data.handlerType === 'object') {
      data.handlerType = data.handlerType.code;
    }
    if (data.activeStatus && typeof data.activeStatus === 'object') {
      data.activeStatus = data.activeStatus.code;
    }
    if (data.manualStatus && typeof data.manualStatus === 'object') {
      data.manualStatus = data.manualStatus.code;
    }

    form.value = data;
    // 【新增】：记录原始标识，用于校验函数对比
    originCapabilityId.value = data.capabilityId; 
    
    open.value = true;
    title.value = "修改节点能力元数据";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["capabilityRef"].validate((valid) => {
    if (valid) {
      // 浅拷贝一份数据，避免影响页面显示
      const submitData = { ...form.value };
      
      // 剔除时间戳字段，由后端 FieldFill 自动填充
      delete submitData.createdAtUtc;
      delete submitData.updatedAtUtc;

      if (originCapabilityId.value) {
        updateCapability(submitData).then((response) => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addCapability(submitData).then((response) => {
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
  const _capabilityIds = row.capabilityId || capabilityIds.value;
  proxy.$modal
    .confirm('是否确认删除序号为"' + _capabilityIds + '"的数据项？')
    .then(function () {
      return delCapability(_capabilityIds);
    })
    .then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
    })
    .catch(() => {});
}

getList();
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>
