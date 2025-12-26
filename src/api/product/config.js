import request from '@/utils/request'

// 查询平台促销配置列表
export function listConfig(query) {
  return request({
    url: '/product/config/list',
    method: 'get',
    params: query
  })
}

// 查询平台促销配置详细
export function getConfig(id) {
  return request({
    url: '/product/config/' + id,
    method: 'get'
  })
}

// 新增平台促销配置
export function addConfig(data) {
  return request({
    url: '/product/config',
    method: 'post',
    data: data
  })
}

// 修改平台促销配置
export function updateConfig(data) {
  return request({
    url: '/product/config',
    method: 'put',
    data: data
  })
}

// 删除平台促销配置
export function delConfig(id) {
  return request({
    url: '/product/config/' + id,
    method: 'delete'
  })
}
