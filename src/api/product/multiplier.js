import request from '@/utils/request'

// 查询定价倍数列表
export function listMultiplier(query) {
  return request({
    url: '/product/multiplier/list',
    method: 'get',
    params: query
  })
}

// 查询定价倍数详细
export function getMultiplier(id) {
  return request({
    url: '/product/multiplier/' + id,
    method: 'get'
  })
}

// 新增定价倍数
export function addMultiplier(data) {
  return request({
    url: '/product/multiplier',
    method: 'post',
    data: data
  })
}

// 修改定价倍数
export function updateMultiplier(data) {
  return request({
    url: '/product/multiplier',
    method: 'put',
    data: data
  })
}

// 删除定价倍数
export function delMultiplier(id) {
  return request({
    url: '/product/multiplier/' + id,
    method: 'delete'
  })
}
