import request from '@/utils/request'

// 查询商品优惠活动商品列表
export function listProduct(query) {
  return request({
    url: '/product/promotion/productdiscountproduct/list',
    method: 'get',
    params: query
  })
}

// 查询商品优惠活动商品详细
export function getProduct(id) {
  return request({
    url: '/product/promotion/productdiscountproduct/' + id,
    method: 'get'
  })
}

// 新增商品优惠活动商品
export function addProduct(data) {
  return request({
    url: '/product/promotion/productdiscountproduct',
    method: 'post',
    data: data
  })
}

// 修改商品优惠活动商品
export function updateProduct(data) {
  return request({
    url: '/product/promotion/productdiscountproduct',
    method: 'put',
    data: data
  })
}

// 删除商品优惠活动商品
export function delProduct(id) {
  return request({
    url: '/product/promotion/productdiscountproduct/' + id,
    method: 'delete'
  })
}
