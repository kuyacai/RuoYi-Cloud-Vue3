import request from '@/utils/request'

// 查询单品直降配置列表
export function listDiscount(query) {
  return request({
    url: '/product/discount/list',
    method: 'get',
    params: query
  })
}

// 查询单品直降配置详细
export function getDiscount(id) {
  return request({
    url: '/product/discount/' + id,
    method: 'get'
  })
}

// 新增单品直降配置
export function addDiscount(data) {
  return request({
    url: '/product/discount',
    method: 'post',
    data: data
  })
}

// 修改单品直降配置
export function updateDiscount(data) {
  return request({
    url: '/product/discount',
    method: 'put',
    data: data
  })
}

// 删除单品直降配置
export function delDiscount(id) {
  return request({
    url: '/product/discount/' + id,
    method: 'delete'
  })
}
