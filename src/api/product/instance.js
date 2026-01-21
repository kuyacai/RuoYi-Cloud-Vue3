import request from '@/utils/request'

// 查询工作流任务节点明细列表
export function listInstance(query) {
  return request({
    url: '/product/instance/list',
    method: 'get',
    params: query
  })
}

// 查询工作流任务节点明细详细
export function getInstance(taskNodeId) {
  return request({
    url: '/product/instance/' + taskNodeId,
    method: 'get'
  })
}

// 新增工作流任务节点明细
export function addInstance(data) {
  return request({
    url: '/product/instance',
    method: 'post',
    data: data
  })
}

// 修改工作流任务节点明细
export function updateInstance(data) {
  return request({
    url: '/product/instance',
    method: 'put',
    data: data
  })
}

// 删除工作流任务节点明细
export function delInstance(taskNodeId) {
  return request({
    url: '/product/instance/' + taskNodeId,
    method: 'delete'
  })
}


export function retryNode(taskNodeId) {
  return request({
    url: '/product/instance/retry/' + taskNodeId,
    method: 'post'
  })
}