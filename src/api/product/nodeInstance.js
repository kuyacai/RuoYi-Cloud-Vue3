import request from '@/utils/request'

// 查询工作流任务节点明细列表
export function listNodeInstance(query) {
  return request({
    url: '/product/node-instance/list',
    method: 'get',
    params: query
  })
}

// 查询工作流任务节点明细详细
export function getNodeInstance(nodeInstanceId) {
  return request({
    url: '/product/node-instance/' + nodeInstanceId,
    method: 'get'
  })
}

// 新增工作流任务节点明细
export function addNodeInstance(data) {
  return request({
    url: '/product/node-instance',
    method: 'post',
    data: data
  })
}

// 修改工作流任务节点明细
export function updateNodeInstance(data) {
  return request({
    url: '/product/node-instance',
    method: 'put',
    data: data
  })
}

// 删除工作流任务节点明细
export function delNodeInstance(nodeInstanceId) {
  return request({
    url: '/product/node-instance/' + nodeInstanceId,
    method: 'delete'
  })
}

// 场景 A: 全人工节点完成（直接跳转下一节点）
export function completeManualNode(nodeInstanceId, data) {
  return request({
    url: `/product/node-instance/complete-manual/${nodeInstanceId}`,
    method: 'put',
    data: data
  })
}

// 场景 B: 人机协同（提交数据并恢复 Python 执行）
export function resumeCooperation(nodeInstanceId, data) {
  return request({
    url: `/product/node-instance/resume-cooperation/${nodeInstanceId}`,
    method: 'put',
    data: data
  })
}

// 场景 C: 失败重试（回滚重跑，重置后续节点）
export function retryNode(nodeInstanceId) {
  return request({
    url: `/product/node-instance/retry/${nodeInstanceId}`,
    method: 'post'
  })
}