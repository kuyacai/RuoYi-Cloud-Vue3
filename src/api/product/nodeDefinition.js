import request from '@/utils/request'

// 查询某个工作流下的节点列表 - 必须传入 definitionId
export function listNode(query) {
  return request({
    url: '/product/node-definition/list',
    method: 'get',
    params: query // query 应该包含 { definitionId: 'xxx' }
  })
}

// 获取节点详细信息
export function getNode(nodeDefId) {
  return request({
    url: '/product/node-definition/' + nodeDefId,
    method: 'get'
  })
}

// 新增节点
export function addNode(data) {
  return request({
    url: '/product/node-definition',
    method: 'post',
    data: data
  })
}

// 修改节点
export function updateNode(data) {
  return request({
    url: '/product/node-definition',
    method: 'put',
    data: data
  })
}

// 删除节点并触发后端重排逻辑
// 注意：根据后端 Controller 修改，需要传入 nodeDefId 和 definitionId
export function delNodeAndResort(nodeDefId, definitionId) {
  return request({
    url: `/product/node-definition/${nodeDefId}/${definitionId}`,
    method: 'delete'
  })
}