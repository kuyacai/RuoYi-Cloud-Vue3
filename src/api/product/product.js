import request from '@/utils/request'

// 查询新用户礼包活动商品列表
export function listProduct(query) {
  return request({
    url: '/product/product/list',
    method: 'get',
    params: query
  })
}

// 查询新用户礼包活动商品详细
export function getProduct(id) {
  return request({
    url: '/product/product/' + id,
    method: 'get'
  })
}

// 新增新用户礼包活动商品
export function addProduct(data) {
  return request({
    url: '/product/product',
    method: 'post',
    data: data
  })
}

// 修改新用户礼包活动商品
export function updateProduct(data) {
  return request({
    url: '/product/product',
    method: 'put',
    data: data
  })
}

// 删除新用户礼包活动商品
export function delProduct(id) {
  return request({
    url: '/product/product/' + id,
    method: 'delete'
  })
}
