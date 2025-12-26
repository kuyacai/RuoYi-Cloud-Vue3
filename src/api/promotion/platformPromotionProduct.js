import request from '@/utils/request'

// 查询平台促销活动商品列表
export function listProduct(query) {
  return request({
    url: '/product/promotion/platformpromotionproduct/list',
    method: 'get',
    params: query
  })
}

// 查询平台促销活动商品详细
export function getProduct(id) {
  return request({
    url: '/product/promotion/platformpromotionproduct/' + id,
    method: 'get'
  })
}

// 新增平台促销活动商品
export function addProduct(data) {
  return request({
    url: '/product/promotion/platformpromotionproduct',
    method: 'post',
    data: data
  })
}

// 修改平台促销活动商品
export function updateProduct(data) {
  return request({
    url: '/product/promotion/platformpromotionproduct',
    method: 'put',
    data: data
  })
}

// 删除平台促销活动商品
export function delProduct(id) {
  return request({
    url: '/product/promotion/platformpromotionproduct/' + id,
    method: 'delete'
  })
}
