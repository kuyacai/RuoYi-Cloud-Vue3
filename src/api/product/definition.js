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
