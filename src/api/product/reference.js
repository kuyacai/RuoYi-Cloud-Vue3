import request from '@/utils/request'

// 查询价格参考列表
export function listReference(query) {
  return request({
    url: '/product/reference/list',
    method: 'get',
    params: query
  })
}

// 查询价格参考详细
export function getReference(id) {
  return request({
    url: '/product/reference/' + id,
    method: 'get'
  })
}

// 新增价格参考
export function addReference(data) {
  return request({
    url: '/product/reference',
    method: 'post',
    data: data
  })
}

// 修改价格参考
export function updateReference(data) {
  return request({
    url: '/product/reference',
    method: 'put',
    data: data
  })
}

// 删除价格参考
export function delReference(id) {
  return request({
    url: '/product/reference/' + id,
    method: 'delete'
  })
}
