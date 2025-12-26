import request from '@/utils/request'

// 查询复购券活动商品列表
export function listProduct(query) {
  return request({
    url: '/product/promotion/repurchaseproduct/list',
    method: 'get',
    params: query
  })
}

// 查询复购券活动商品详细
export function getProduct(id) {
  return request({
    url: '/product/promotion/repurchaseproduct/' + id,
    method: 'get'
  })
}

// 新增复购券活动商品
export function addProduct(data) {
  return request({
    url: '/product/promotion/repurchaseproduct',
    method: 'post',
    data: data
  })
}

// 修改复购券活动商品
export function updateProduct(data) {
  return request({
    url: '/product/promotion/repurchaseproduct',
    method: 'put',
    data: data
  })
}

// 删除复购券活动商品
export function delProduct(id) {
  return request({
    url: '/product/promotion/repurchaseproduct/' + id,
    method: 'delete'
  })
}
