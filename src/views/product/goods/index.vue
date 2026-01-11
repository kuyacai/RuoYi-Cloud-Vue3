<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryRef"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="来源ID" prop="sourceId">
        <el-input
          v-model="queryParams.sourceId"
          placeholder="请输入来源商品ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="来源标题" prop="sourceTitle">
        <el-input
          v-model="queryParams.sourceTitle"
          placeholder="请输入来源商品标题"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>

      <el-form-item label="本店ID" prop="shopProductId">
        <el-input
          v-model="queryParams.shopProductId"
          placeholder="请输入本店商品ID"
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

    <el-table v-loading="loading" :data="goodsList" border>
      <!-- 1. 去掉选择框：已删除 type="selection" 列 -->
      <!-- 1. 序号列 -->
      <el-table-column label="序号" align="center" width="70">
        <template #default="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <!-- 来源ID
      <el-table-column label="来源ID" align="center" prop="sourceId" />  -->

      <!-- 2. 来源标题：加宽 -->
      <el-table-column
        label="来源标题"
        align="center"
        prop="sourceTitle"
        min-width="300"
      >
        <template #default="scope">
          <div
            style="
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 1px;
            "
          >
            <el-link
              type="primary"
              @click="openInNewWindow(scope.row, 'frozen')"
              style="
                max-width: 300px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              "
            >
              {{ scope.row.sourceTitle }}
            </el-link>

            <div style="display: flex; gap: 1px; flex-shrink: 0">
              <el-tag
                size="small"
                effect="plain"
                style="cursor: pointer"
                @click.stop="openInNewWindow(scope.row, 'frozen')"
                >原</el-tag
              >

              <el-tag
                size="small"
                type="warning"
                effect="plain"
                style="cursor: pointer"
                @click.stop="openInNewWindow(scope.row, 'editing')"
                >编</el-tag
              >

              <el-tag
                size="small"
                type="danger"
                effect="plain"
                style="cursor: pointer"
                @click.stop="openInNewWindow(scope.row, 'auditing')"
                >审核</el-tag
              >

              <el-tag
                size="small"
                type="success"
                effect="plain"
                style="cursor: pointer"
                @click.stop="openInNewWindow(scope.row, 'approved')"
                >已审</el-tag
              >
            </div>
          </div>
        </template>
      </el-table-column>

      <!-- 3. 来源：显示“来源”文字，点击新开窗口 -->
      <el-table-column label="来源" align="center" min-width="30">
        <template #default="scope">
          <a
            :href="scope.row.sourceUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            来源
          </a>
        </template>
      </el-table-column>

      <!-- 其余列保持原样 -->
      <el-table-column
        label="本店ID"
        align="center"
        prop="shopProductId"
        min-width="100"
      />
      <el-table-column label="店铺ID" align="center" prop="shopId" />
      <el-table-column
        label="添加时间"
        align="center"
        prop="createdAtUtc"
        width="180"
      >
        <template #default="scope">
          <span>{{ parseTime(scope.row.createdAtUtc) }}</span>
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

    <!-- 添加或修改云商品根对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="goodsRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="迁移来源" prop="migrateSource">
          <el-input v-model="form.migrateSource" placeholder="请输入迁移来源" />
        </el-form-item>
        <el-form-item label="来源店铺名称" prop="sourceShopName">
          <el-input
            v-model="form.sourceShopName"
            placeholder="请输入来源店铺名称"
          />
        </el-form-item>
        <el-form-item label="来源商品ID" prop="sourceId">
          <el-input v-model="form.sourceId" placeholder="请输入来源商品ID" />
        </el-form-item>
        <el-form-item label="来源商品标题" prop="sourceTitle">
          <el-input
            v-model="form.sourceTitle"
            placeholder="请输入来源商品标题"
          />
        </el-form-item>
        <el-form-item label="来源商品链接" prop="sourceUrl">
          <el-input
            v-model="form.sourceUrl"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="来源商品类目" prop="sourceCategory">
          <el-input
            v-model="form.sourceCategory"
            placeholder="请输入来源商品类目"
          />
        </el-form-item>
        <el-form-item label="客户手机号" prop="customerPhone">
          <el-input
            v-model="form.customerPhone"
            placeholder="请输入客户手机号"
          />
        </el-form-item>
        <el-form-item label="来源商品货号" prop="sourceItemNo">
          <el-input
            v-model="form.sourceItemNo"
            placeholder="请输入来源商品货号"
          />
        </el-form-item>
        <el-form-item label="品牌" prop="brand">
          <el-input v-model="form.brand" placeholder="请输入品牌" />
        </el-form-item>
        <el-form-item label="本店商品ID" prop="shopProductId">
          <el-input
            v-model="form.shopProductId"
            placeholder="请输入本店商品ID"
          />
        </el-form-item>
        <el-form-item label="店铺ID" prop="shopId">
          <el-input v-model="form.shopId" placeholder="请输入店铺ID" />
        </el-form-item>
        <el-form-item label="创建时间" prop="gmtCreate">
          <el-date-picker
            clearable
            v-model="form.gmtCreate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择创建时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="修改时间" prop="gmtModified">
          <el-date-picker
            clearable
            v-model="form.gmtModified"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择修改时间"
          >
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

<script setup name="Goods">
import { useRouter } from "vue-router";
import { listGoods } from "@/api/product/goods";

const { proxy } = getCurrentInstance();
const router = useRouter();
const goodsList = ref([]);
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
    migrateSource: null,
    sourceShopName: null,
    sourceId: null,
    sourceTitle: null,
    sourceUrl: null,
    sourceCategory: null,
    customerPhone: null,
    sourceItemNo: null,
    brand: null,
    shopProductId: null,
    shopId: null,
    goodsStatus: null,
    gmtCreate: null,
    gmtModified: null,
  },
  rules: {
    gmtCreate: [
      { required: true, message: "创建时间不能为空", trigger: "blur" },
    ],
    gmtModified: [
      { required: true, message: "修改时间不能为空", trigger: "blur" },
    ],
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 核心跳转逻辑 */
const openInNewWindow = (row, status) => {
  const routeData = router.resolve({
    path: "/goods-detail-standalone",
    query: {
      id: row.goodsId, // 对应 URL 中的 id=abc
      status: status, // 对应 URL 中的 status
    },
  });

  // 利用原生新窗口打开，不会被 RuoYi 的 Tags-View 拦截
  window.open(routeData.href, "_blank");
};
/** 查询云商品根列表 */
function getList() {
  loading.value = true;
  listGoods(queryParams.value).then((response) => {
    goodsList.value = response.rows;
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
    goodsId: null,
    migrateSource: null,
    sourceShopName: null,
    sourceId: null,
    sourceTitle: null,
    sourceUrl: null,
    sourceCategory: null,
    customerPhone: null,
    sourceItemNo: null,
    brand: null,
    shopProductId: null,
    shopId: null,
    goodsStatus: null,
    gmtCreate: null,
    gmtModified: null,
  };
  proxy.resetForm("goodsRef");
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



getList();
</script>
