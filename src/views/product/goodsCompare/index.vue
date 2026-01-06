<template>
  <div class="compare-container">
    <div class="header-sticky">
      <div class="title">版本比对：[左] 历史发布版 vs [右] 正在编辑版</div>
      <el-button type="primary" plain @click="handleClose">返回列表</el-button>
    </div>

    <div class="compare-body">
      <div class="compare-column left-pane">
        <div class="pane-header old">旧版本 (Revision: {{ oldDetail.revision?.versionNumber }})</div>
        <div class="pane-content">
          <VersionDetailPane :data="oldDetail" />
        </div>
      </div>

      <div class="compare-column right-pane">
        <div class="pane-header new">新版本 (Revision: {{ newDetail.revision?.versionNumber }})</div>
        <div class="pane-content">
          <VersionDetailPane :data="newDetail" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// VersionDetailPane 可以是你在同目录下建立的一个子组件，用来复用渲染逻辑
import VersionDetailPane from './components/VersionDetailPane.vue';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const oldDetail = ref({});
const newDetail = ref({});

onMounted(() => {
  const { oldId, newId } = route.query;
  // 并发请求两个版本的数据
  // Promise.all([getDetail(oldId), getDetail(newId)]).then(...)
});
</script>

<style lang="scss" scoped>
.compare-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #eef1f6;
}
.compare-body {
  display: flex;
  flex: 1;
  overflow: hidden; // 整体不滚动，交给子列滚动
  gap: 2px; // 分割线
  background: #dcdfe6;
}
.compare-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
  overflow: hidden;
}
.pane-header {
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-weight: bold;
  &.old { background: #f5f7fa; color: #909399; }
  &.new { background: #f0f9eb; color: #67c23a; }
}
.pane-content {
  flex: 1;
  overflow-y: auto; // 左右列各自独立滚动
  padding: 15px;
}
</style>