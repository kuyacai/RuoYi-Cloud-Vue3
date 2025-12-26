<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="活动名称" prop="activityName">
        <el-input
          v-model="queryParams.activityName"
          placeholder="请输入活动名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="立减金额" prop="deductionAmount">
        <el-input
          v-model="queryParams.deductionAmount"
          placeholder="请输入立减金额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="折扣率" prop="discountRate">
        <el-input
          v-model="queryParams.discountRate"
          placeholder="请输入折扣率"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="店铺ID" prop="shopId">
        <el-input
          v-model="queryParams.shopId"
          placeholder="请输入店铺ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开始时间" prop="startTime">
        <el-date-picker clearable
          v-model="queryParams.startTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择开始时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <el-date-picker clearable
          v-model="queryParams.endTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择结束时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="平台活动ID" prop="platformActivityId">
        <el-input
          v-model="queryParams.platformActivityId"
          placeholder="请输入平台活动ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="最低购买次数门槛" prop="minOrderCount">
        <el-input
          v-model="queryParams.minOrderCount"
          placeholder="请输入最低购买次数门槛"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户限领次数" prop="userLimit">
        <el-input
          v-model="queryParams.userLimit"
          placeholder="请输入用户限领次数"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建时间" prop="gmtCreate">
        <el-date-picker clearable
          v-model="queryParams.gmtCreate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择创建时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="修改时间" prop="gmtModified">
        <el-date-picker clearable
          v-model="queryParams.gmtModified"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择修改时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['promotion:repurchaseActivity:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['promotion:repurchaseActivity:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['promotion:repurchaseActivity:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['promotion:repurchaseActivity:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="activityList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="活动ID" align="center" prop="activityId" />
      <el-table-column label="活动名称" align="center" prop="activityName" />
      <el-table-column label="折扣类型(direct_deduction/discount)" align="center" prop="discountType" />
      <el-table-column label="立减金额" align="center" prop="deductionAmount" />
      <el-table-column label="折扣率" align="center" prop="discountRate" />
      <el-table-column label="店铺ID" align="center" prop="shopId" />
      <el-table-column label="开始时间" align="center" prop="startTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" align="center" prop="endTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="活动状态(draft/active/ended)" align="center" prop="activityStatus" />
      <el-table-column label="平台活动ID" align="center" prop="platformActivityId" />
      <el-table-column label="备注" align="center" prop="notes" />
      <el-table-column label="最低购买次数门槛" align="center" prop="minOrderCount" />
      <el-table-column label="用户限领次数" align="center" prop="userLimit" />
      <el-table-column label="创建时间" align="center" prop="gmtCreate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.gmtCreate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" align="center" prop="gmtModified" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.gmtModified, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['promotion:repurchaseActivity:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['promotion:repurchaseActivity:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改复购券活动对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="活动名称" prop="activityName">
          <el-input v-model="form.activityName" placeholder="请输入活动名称" />
        </el-form-item>
        <el-form-item label="立减金额" prop="deductionAmount">
          <el-input v-model="form.deductionAmount" placeholder="请输入立减金额" />
        </el-form-item>
        <el-form-item label="折扣率" prop="discountRate">
          <el-input v-model="form.discountRate" placeholder="请输入折扣率" />
        </el-form-item>
        <el-form-item label="店铺ID" prop="shopId">
          <el-input v-model="form.shopId" placeholder="请输入店铺ID" />
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker clearable
            v-model="form.startTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker clearable
            v-model="form.endTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="平台活动ID" prop="platformActivityId">
          <el-input v-model="form.platformActivityId" placeholder="请输入平台活动ID" />
        </el-form-item>
        <el-form-item label="备注" prop="notes">
          <el-input v-model="form.notes" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="最低购买次数门槛" prop="minOrderCount">
          <el-input v-model="form.minOrderCount" placeholder="请输入最低购买次数门槛" />
        </el-form-item>
        <el-form-item label="用户限领次数" prop="userLimit">
          <el-input v-model="form.userLimit" placeholder="请输入用户限领次数" />
        </el-form-item>
        <el-form-item label="创建时间" prop="gmtCreate">
          <el-date-picker clearable
            v-model="form.gmtCreate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择创建时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="修改时间" prop="gmtModified">
          <el-date-picker clearable
            v-model="form.gmtModified"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择修改时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listActivity, getActivity, delActivity, addActivity, updateActivity } from "@/api/promotion/repurchaseActivity"

export default {
  name: "Activity",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 复购券活动表格数据
      activityList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        activityName: null,
        discountType: null,
        deductionAmount: null,
        discountRate: null,
        shopId: null,
        startTime: null,
        endTime: null,
        activityStatus: null,
        platformActivityId: null,
        notes: null,
        minOrderCount: null,
        userLimit: null,
        gmtCreate: null,
        gmtModified: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        activityName: [
          { required: true, message: "活动名称不能为空", trigger: "blur" }
        ],
        discountType: [
          { required: true, message: "折扣类型(direct_deduction/discount)不能为空", trigger: "change" }
        ],
        shopId: [
          { required: true, message: "店铺ID不能为空", trigger: "blur" }
        ],
        gmtCreate: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
        ],
        gmtModified: [
          { required: true, message: "修改时间不能为空", trigger: "blur" }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询复购券活动列表 */
    getList() {
      this.loading = true
      listActivity(this.queryParams).then(response => {
        this.activityList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        activityId: null,
        activityName: null,
        discountType: null,
        deductionAmount: null,
        discountRate: null,
        shopId: null,
        startTime: null,
        endTime: null,
        activityStatus: null,
        platformActivityId: null,
        notes: null,
        minOrderCount: null,
        userLimit: null,
        gmtCreate: null,
        gmtModified: null
      }
      this.resetForm("form")
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm")
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.activityId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = "添加复购券活动"
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const activityId = row.activityId || this.ids
      getActivity(activityId).then(response => {
        this.form = response.data
        this.open = true
        this.title = "修改复购券活动"
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.activityId != null) {
            updateActivity(this.form).then(response => {
              this.$modal.msgSuccess("修改成功")
              this.open = false
              this.getList()
            })
          } else {
            addActivity(this.form).then(response => {
              this.$modal.msgSuccess("新增成功")
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const activityIds = row.activityId || this.ids
      this.$modal.confirm('是否确认删除复购券活动编号为"' + activityIds + '"的数据项？').then(function() {
        return delActivity(activityIds)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess("删除成功")
      }).catch(() => {})
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('product/activity/export', {
        ...this.queryParams
      }, `activity_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
