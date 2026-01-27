import request from '@/utils/request'

// 查询工作流定义主列表
export function listDefinition(query) {
  return request({
    url: '/product/definition/list',
    method: 'get',
    params: query
  })
}

// 查询工作流定义主详细
export function getDefinition(definitionId) {
  return request({
    url: '/product/definition/' + definitionId,
    method: 'get'
  })
}

// 新增工作流定义主
export function addDefinition(data) {
  return request({
    url: '/product/definition',
    method: 'post',
    data: data
  })
}

// 修改工作流定义主
export function updateDefinition(data) {
  return request({
    url: '/product/definition',
    method: 'put',
    data: data
  })
}

// 删除工作流定义主
export function delDefinition(definitionId) {
  return request({
    url: '/product/definition/' + definitionId,
    method: 'delete'
  })
}

// 启动流程实例
export function startWorkflow(definitionId, variables) {
  return request({
    url: '/product/instance/start/' + definitionId,
    method: 'post',
    data: variables // 这里的 variables 就是用户输入的 JSON 对象
  })
}