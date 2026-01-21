import request from '@/utils/request'

// 查询节点能力元数据列表
export function listCapability(query) {
  return request({
    url: '/product/capability/list',
    method: 'get',
    params: query
  })
}

// 查询节点能力元数据详细
export function getCapability(capabilityId) {
  return request({
    url: '/product/capability/' + capabilityId,
    method: 'get'
  })
}

// 新增节点能力元数据
export function addCapability(data) {
  return request({
    url: '/product/capability',
    method: 'post',
    data: data
  })
}

// 修改节点能力元数据
export function updateCapability(data) {
  return request({
    url: '/product/capability',
    method: 'put',
    data: data
  })
}

// 删除节点能力元数据
export function delCapability(capabilityId) {
  return request({
    url: '/product/capability/' + capabilityId,
    method: 'delete'
  })
}
